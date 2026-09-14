"use client";

import { create } from "zustand";
import { routes, trucks, collectionPoints, getRouteById } from "@/lib/mock";
import { getRouteGeometry, GeometrySource } from "@/lib/geo/getRouteGeometry";
import { RouteGeometry } from "@/lib/geo/measure";
import { advanceTruck, computeRouteStops, RouteStop } from "./engine";
import { BASE_SPEED_KMH, TruckSimState } from "./types";

/**
 * ----------------------------------------------------------------------
 * MockTruckLocationProvider
 * ----------------------------------------------------------------------
 * Esta store (Zustand) é a implementação MOCK do provedor de localização
 * dos caminhões. Ela simula um fluxo contínuo de posições GPS: carrega a
 * geometria real da rota (lib/geo/getRouteGeometry) e avança cada caminhão
 * ao longo dela a cada quadro, calculando posição, direção, distância e
 * ETA dinamicamente (lib/simulation/engine.ts).
 *
 * TROCA FUTURA POR GPS REAL:
 * Uma futura `RealTruckLocationProvider` deve expor a MESMA interface
 * pública usada pelos componentes (campo `trucks: Record<truckId,
 * TruckSimState>` + `ready`) e escrever nela a partir de um stream real
 * (WebSocket/MQTT/polling da telemetria do caminhão), chamando
 * `useSimulationStore.setState({ trucks: { ...novosDados } })` a cada
 * atualização recebida. Como os componentes de mapa/rastreamento só leem
 * este shape (nunca calculam posição sozinhos), a troca não exige
 * alterar nenhuma tela — apenas remover o `tick()` simulado e os
 * controles de demonstração (Seção 14 do briefing).
 * ----------------------------------------------------------------------
 */

interface SimulationState {
  ready: boolean;
  geometries: Record<string, RouteGeometry>;
  geometrySources: Record<string, GeometrySource>;
  stopsByRoute: Record<string, RouteStop[]>;
  truckStates: Record<string, TruckSimState>;
  playing: boolean;
  speedMultiplier: number;

  init: () => Promise<void>;
  tick: (dtRealSeconds: number, now: number) => void;
  setPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
  setSpeedMultiplier: (m: number) => void;
  resetTruck: (truckId: string) => void;
  resetAll: () => void;
  setTruckDisabled: (truckId: string, disabled: boolean) => void;
  setTruckRoute: (truckId: string, routeId: string) => void;
}

function buildInitialTruckState(truckId: string, routeId: string, disabled: boolean): TruckSimState {
  return {
    truckId,
    routeId,
    distanceTraveledM: 0,
    speedKmh: BASE_SPEED_KMH,
    holdUntil: null,
    lapCount: 0,
    status: disabled ? "garagem" : "em_rota",
    position: { lat: 0, lng: 0 },
    headingDeg: 0,
    nextPointId: null,
    distanceToNextPointM: 0,
    etaToNextPointSeconds: 0,
    disabled,
  };
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  ready: false,
  geometries: {},
  geometrySources: {},
  stopsByRoute: {},
  truckStates: {},
  playing: true,
  speedMultiplier: 1,

  init: async () => {
    if (get().ready) return;

    const uniqueRouteIds = Array.from(new Set(trucks.map((t) => t.routeId)));
    const geometries: Record<string, RouteGeometry> = {};
    const geometrySources: Record<string, GeometrySource> = {};
    const stopsByRoute: Record<string, RouteStop[]> = {};

    await Promise.all(
      uniqueRouteIds.map(async (routeId) => {
        const route = getRouteById(routeId);
        if (!route) return;
        const { geometry, source } = await getRouteGeometry(route);
        geometries[routeId] = geometry;
        geometrySources[routeId] = source;
        stopsByRoute[routeId] = computeRouteStops(route, geometry, collectionPoints);
      }),
    );

    const truckStates: Record<string, TruckSimState> = {};
    trucks.forEach((truck) => {
      const disabled = truck.status === "garagem";
      let state = buildInitialTruckState(truck.id, truck.routeId, disabled);
      const geometry = geometries[truck.routeId];
      if (geometry && geometry.points.length > 0) {
        state = { ...state, position: geometry.points[0] };
      }
      truckStates[truck.id] = state;
    });

    set({ geometries, geometrySources, stopsByRoute, truckStates, ready: true });
  },

  tick: (dtRealSeconds, now) => {
    const { playing, speedMultiplier, geometries, stopsByRoute, truckStates } = get();
    if (!playing) return;

    const dt = dtRealSeconds * speedMultiplier;
    const next: Record<string, TruckSimState> = { ...truckStates };
    let changed = false;

    for (const truckId of Object.keys(truckStates)) {
      const state = truckStates[truckId];
      const geometry = geometries[state.routeId];
      const stops = stopsByRoute[state.routeId];
      if (!geometry || !stops || state.disabled) continue;
      const updated = advanceTruck(state, dt, geometry, stops, now);
      if (updated !== state) {
        next[truckId] = updated;
        changed = true;
      }
    }

    if (changed) set({ truckStates: next });
  },

  setPlaying: (playing) => set({ playing }),
  togglePlaying: () => set((s) => ({ playing: !s.playing })),
  setSpeedMultiplier: (m) => set({ speedMultiplier: m }),

  resetTruck: (truckId) => {
    const { truckStates, geometries } = get();
    const state = truckStates[truckId];
    if (!state) return;
    const geometry = geometries[state.routeId];
    const reset = buildInitialTruckState(truckId, state.routeId, state.disabled);
    if (geometry) reset.position = geometry.points[0];
    set({ truckStates: { ...truckStates, [truckId]: reset } });
  },

  resetAll: () => {
    const { truckStates } = get();
    Object.keys(truckStates).forEach((id) => get().resetTruck(id));
  },

  setTruckDisabled: (truckId, disabled) => {
    const { truckStates } = get();
    const state = truckStates[truckId];
    if (!state) return;
    set({
      truckStates: {
        ...truckStates,
        [truckId]: { ...state, disabled, status: disabled ? "garagem" : "em_rota" },
      },
    });
  },

  setTruckRoute: (truckId, routeId) => {
    const { truckStates } = get();
    const state = truckStates[truckId];
    if (!state) return;
    const reset = buildInitialTruckState(truckId, routeId, state.disabled);
    const geometry = get().geometries[routeId];
    if (geometry) reset.position = geometry.points[0];
    set({ truckStates: { ...truckStates, [truckId]: reset } });
  },
}));

export const allRouteIds = routes.map((r) => r.id);
