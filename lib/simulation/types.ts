import { GeoPoint, TruckStatus } from "@/lib/types";

export interface TruckSimState {
  truckId: string;
  routeId: string;
  /** Distância percorrida (m) na volta atual da rota. */
  distanceTraveledM: number;
  speedKmh: number;
  /** Timestamp (ms, Date.now()) até quando o caminhão permanece parado (em um ponto, na garagem ou ao concluir a rota). */
  holdUntil: number | null;
  lapCount: number;
  status: TruckStatus;
  position: GeoPoint;
  headingDeg: number;
  nextPointId: string | null;
  distanceToNextPointM: number;
  etaToNextPointSeconds: number;
  /** true enquanto o caminhão não está operando (parado na garagem, fora do ciclo). */
  disabled: boolean;
}

export const HOLD_AT_POINT_MS = 6000;
export const HOLD_AT_END_MS = 9000;
export const APPROACHING_THRESHOLD_M = 400;
export const AT_POINT_THRESHOLD_M = 35;
export const BASE_SPEED_KMH = 20;
