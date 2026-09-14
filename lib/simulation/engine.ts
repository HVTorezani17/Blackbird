import { CollectionPoint, CollectionRoute, TruckStatus } from "@/lib/types";
import { RouteGeometry, positionAtDistance, nearestIndexTo, metersAtIndex } from "@/lib/geo/measure";
import {
  AT_POINT_THRESHOLD_M,
  APPROACHING_THRESHOLD_M,
  HOLD_AT_END_MS,
  HOLD_AT_POINT_MS,
  TruckSimState,
} from "./types";

export interface RouteStop {
  pointId: string;
  meters: number;
}

export function computeRouteStops(
  route: CollectionRoute,
  geometry: RouteGeometry,
  points: CollectionPoint[],
): RouteStop[] {
  return route.pointIds
    .map((pointId) => {
      const point = points.find((p) => p.id === pointId);
      if (!point) return null;
      const idx = nearestIndexTo(geometry, point.location);
      return { pointId, meters: metersAtIndex(geometry, idx) };
    })
    .filter((s): s is RouteStop => s !== null)
    .sort((a, b) => a.meters - b.meters);
}

/**
 * Avança o estado simulado de um caminhão em dtSeconds (tempo simulado,
 * já multiplicado pelo fator de velocidade da demonstração).
 *
 * Comportamento: o caminhão percorre a geometria real da rota a uma
 * velocidade constante (com pequenas variações), para em cada ponto de
 * coleta por alguns segundos (simulando a coleta), e ao concluir a rota
 * aguarda um instante antes de reiniciar um novo ciclo — permitindo uma
 * demonstração contínua e repetível.
 */
export function advanceTruck(
  state: TruckSimState,
  dtSeconds: number,
  geometry: RouteGeometry,
  stops: RouteStop[],
  now: number,
): TruckSimState {
  if (state.disabled || dtSeconds <= 0) return state;

  if (state.holdUntil !== null && now < state.holdUntil) {
    return state;
  }

  let distanceTraveledM = state.distanceTraveledM;
  let lapCount = state.lapCount;

  if (state.holdUntil !== null && state.status === "coleta_realizada") {
    distanceTraveledM = 0;
    lapCount += 1;
  }

  const speed = state.speedKmh;
  const deltaM = ((speed * 1000) / 3600) * dtSeconds;
  distanceTraveledM = Math.min(geometry.totalMeters, distanceTraveledM + deltaM);

  const { position, headingDeg } = positionAtDistance(geometry, distanceTraveledM);

  const nextStop = stops.find((s) => s.meters > distanceTraveledM + 0.5);
  const distanceToNextPointM = nextStop
    ? nextStop.meters - distanceTraveledM
    : Math.max(0, geometry.totalMeters - distanceTraveledM);
  const etaToNextPointSeconds = speed > 0 ? distanceToNextPointM / ((speed * 1000) / 3600) : 0;

  let status: TruckStatus;
  let holdUntil: number | null = null;

  if (nextStop && distanceToNextPointM <= AT_POINT_THRESHOLD_M) {
    status = "no_ponto";
    holdUntil = now + HOLD_AT_POINT_MS;
    distanceTraveledM = nextStop.meters;
  } else if (distanceTraveledM >= geometry.totalMeters - 0.5) {
    status = "coleta_realizada";
    holdUntil = now + HOLD_AT_END_MS;
  } else if (distanceToNextPointM <= APPROACHING_THRESHOLD_M) {
    status = "aproximando";
  } else {
    status = "em_rota";
  }

  return {
    ...state,
    distanceTraveledM,
    position,
    headingDeg,
    status,
    holdUntil,
    lapCount,
    nextPointId: nextStop ? nextStop.pointId : null,
    distanceToNextPointM,
    etaToNextPointSeconds,
  };
}

/**
 * ETA/distância até um ponto ESPECÍFICO (ex.: escolhido pelo cidadão),
 * independente de ser o "próximo ponto" operacional do caminhão. Trata o
 * caso do ponto já ter sido visitado nesta volta (aguarda a próxima volta).
 */
export function etaToPoint(
  truckDistanceTraveledM: number,
  speedKmh: number,
  pointMeters: number,
  totalMeters: number,
): { distanceM: number; etaSeconds: number; alreadyPassed: boolean } {
  const speedMs = (speedKmh * 1000) / 3600;
  if (pointMeters >= truckDistanceTraveledM) {
    const distanceM = pointMeters - truckDistanceTraveledM;
    return { distanceM, etaSeconds: speedMs > 0 ? distanceM / speedMs : 0, alreadyPassed: false };
  }
  const distanceM = totalMeters - truckDistanceTraveledM + pointMeters;
  return { distanceM, etaSeconds: speedMs > 0 ? distanceM / speedMs : 0, alreadyPassed: true };
}
