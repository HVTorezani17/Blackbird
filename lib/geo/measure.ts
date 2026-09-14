import * as turf from "@turf/turf";
import { GeoPoint } from "@/lib/types";

export interface RouteGeometry {
  points: GeoPoint[];
  /** Distância cumulativa (em metros) do início da rota até cada ponto de `points`. */
  cumulativeMeters: number[];
  totalMeters: number;
}

export function buildRouteGeometry(points: GeoPoint[]): RouteGeometry {
  const cumulativeMeters: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const d = turf.distance(
      [points[i - 1].lng, points[i - 1].lat],
      [points[i].lng, points[i].lat],
      { units: "kilometers" },
    );
    cumulativeMeters.push(cumulativeMeters[i - 1] + d * 1000);
  }
  return {
    points,
    cumulativeMeters,
    totalMeters: cumulativeMeters[cumulativeMeters.length - 1] ?? 0,
  };
}

/** Retorna posição e direção (heading, graus) na distância `meters` percorrida ao longo da rota. */
export function positionAtDistance(
  geometry: RouteGeometry,
  meters: number,
): { position: GeoPoint; headingDeg: number; segmentIndex: number } {
  const { points, cumulativeMeters, totalMeters } = geometry;
  const clamped = Math.max(0, Math.min(meters, totalMeters));

  let idx = 0;
  while (idx < cumulativeMeters.length - 1 && cumulativeMeters[idx + 1] < clamped) {
    idx++;
  }

  const segStart = points[idx];
  const segEnd = points[Math.min(idx + 1, points.length - 1)];
  const segStartDist = cumulativeMeters[idx];
  const segEndDist = cumulativeMeters[Math.min(idx + 1, cumulativeMeters.length - 1)];
  const segLen = segEndDist - segStartDist;
  const t = segLen > 0 ? (clamped - segStartDist) / segLen : 0;

  const lat = segStart.lat + (segEnd.lat - segStart.lat) * t;
  const lng = segStart.lng + (segEnd.lng - segStart.lng) * t;

  const heading = turf.bearing([segStart.lng, segStart.lat], [segEnd.lng, segEnd.lat]);

  return {
    position: { lat, lng },
    headingDeg: (heading + 360) % 360,
    segmentIndex: idx,
  };
}

/** Divide a geometria em trecho percorrido e trecho restante, para desenho em cores distintas. */
export function splitAtDistance(
  geometry: RouteGeometry,
  meters: number,
): { traveled: GeoPoint[]; remaining: GeoPoint[] } {
  const { position } = positionAtDistance(geometry, meters);
  const { points, cumulativeMeters } = geometry;
  const clamped = Math.max(0, Math.min(meters, geometry.totalMeters));

  let idx = 0;
  while (idx < cumulativeMeters.length - 1 && cumulativeMeters[idx + 1] < clamped) {
    idx++;
  }

  const traveled = [...points.slice(0, idx + 1), position];
  const remaining = [position, ...points.slice(idx + 1)];

  return { traveled, remaining };
}

/** Índice do ponto da geometria mais próximo de um alvo (usado para localizar pontos de coleta sobre a rota). */
export function nearestIndexTo(geometry: RouteGeometry, target: GeoPoint): number {
  let best = 0;
  let bestDist = Infinity;
  geometry.points.forEach((p, i) => {
    const d = turf.distance([p.lng, p.lat], [target.lng, target.lat]);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return best;
}

export function metersAtIndex(geometry: RouteGeometry, index: number): number {
  return geometry.cumulativeMeters[Math.max(0, Math.min(index, geometry.cumulativeMeters.length - 1))];
}

export function distanceMeters(a: GeoPoint, b: GeoPoint): number {
  return turf.distance([a.lng, a.lat], [b.lng, b.lat], { units: "kilometers" }) * 1000;
}
