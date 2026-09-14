import * as turf from "@turf/turf";
import { GeoPoint } from "@/lib/types";

/**
 * Gerador de geometria de EMERGÊNCIA, usado apenas se o motor de
 * roteamento (OSRM) estiver indisponível (ex.: sem internet no local da
 * apresentação) E nenhuma geometria pré-calculada (bake) tiver sido
 * encontrada. Nunca deve ser a via principal.
 *
 * Em vez de ligar os waypoints por uma linha reta (proibido pelo
 * requisito de realismo — uma diagonal atravessaria quarteirões), o
 * traçado é construído em "degraus" (padrão Manhattan: desloca primeiro
 * num eixo, depois no outro), aproximando visualmente uma malha viária
 * até que uma rota real possa ser calculada.
 */
export function generateFallbackRoute(waypoints: GeoPoint[]): GeoPoint[] {
  if (waypoints.length < 2) return waypoints;

  const stepped: GeoPoint[] = [waypoints[0]];

  for (let i = 1; i < waypoints.length; i++) {
    const prev = stepped[stepped.length - 1];
    const next = waypoints[i];
    const midLat = prev.lat + (next.lat - prev.lat) * 0.5;

    stepped.push({ lat: midLat, lng: prev.lng });
    stepped.push({ lat: midLat, lng: next.lng });
    stepped.push(next);
  }

  return densify(stepped, 20);
}

/** Reamostra uma polyline em pontos com espaçamento aproximadamente uniforme (em metros). */
export function densify(points: GeoPoint[], stepMeters = 15): GeoPoint[] {
  if (points.length < 2) return points;
  const line = turf.lineString(points.map((p) => [p.lng, p.lat]));
  const totalKm = turf.length(line, { units: "kilometers" });
  const stepKm = stepMeters / 1000;
  const result: GeoPoint[] = [];

  for (let d = 0; d <= totalKm; d += stepKm) {
    const pt = turf.along(line, d, { units: "kilometers" });
    const [lng, lat] = pt.geometry.coordinates;
    result.push({ lat, lng });
  }

  const last = points[points.length - 1];
  const lastResult = result[result.length - 1];
  if (!lastResult || lastResult.lat !== last.lat || lastResult.lng !== last.lng) {
    result.push(last);
  }

  return result;
}
