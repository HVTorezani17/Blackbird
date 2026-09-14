"use client";

import { useMemo } from "react";
import { useSimulationStore } from "./store";
import { etaToPoint, RouteStop } from "./engine";
import { TruckSimState } from "./types";
import { RouteGeometry, splitAtDistance } from "@/lib/geo/measure";

export function useTruckState(truckId: string | null | undefined): TruckSimState | null {
  return useSimulationStore((s) => (truckId ? s.truckStates[truckId] ?? null : null));
}

export function useRouteGeometryFor(routeId: string | null | undefined): RouteGeometry | null {
  return useSimulationStore((s) => (routeId ? s.geometries[routeId] ?? null : null));
}

function useRouteStopsFor(routeId: string | null | undefined): RouteStop[] | null {
  return useSimulationStore((s) => (routeId ? s.stopsByRoute[routeId] ?? null : null));
}

export function useSimulationReady(): boolean {
  return useSimulationStore((s) => s.ready);
}

export interface PointEta {
  distanceM: number;
  etaSeconds: number;
  alreadyPassed: boolean;
}

/**
 * IMPORTANTE: os valores derivados (ETA, trecho percorrido/restante) são
 * calculados aqui com useMemo, e NÃO dentro do seletor do Zustand. Um
 * seletor que retorna um objeto recém-criado a cada chamada quebra o
 * contrato de `getSnapshot` do React (useSyncExternalStore) e pode causar
 * loop de renderização infinito. O seletor do Zustand só deve devolver
 * referências estáveis do estado (o objeto do caminhão, a geometria, os
 * stops) — a composição desses dados acontece aqui, em render normal.
 */
export function useEtaToPoint(truckId: string | null | undefined, pointId: string | null | undefined): PointEta | null {
  const truck = useTruckState(truckId);
  const geometry = useRouteGeometryFor(truck?.routeId);
  const stops = useRouteStopsFor(truck?.routeId);

  return useMemo(() => {
    if (!truck || !pointId || !geometry || !stops) return null;
    const stop = stops.find((s) => s.pointId === pointId);
    if (!stop) return null;
    return etaToPoint(truck.distanceTraveledM, truck.speedKmh, stop.meters, geometry.totalMeters);
  }, [truck, pointId, geometry, stops]);
}

export function useTraveledRemaining(truckId: string | null | undefined) {
  const truck = useTruckState(truckId);
  const geometry = useRouteGeometryFor(truck?.routeId);

  return useMemo(() => {
    if (!truck || !geometry) return null;
    return splitAtDistance(geometry, truck.distanceTraveledM);
  }, [truck, geometry]);
}
