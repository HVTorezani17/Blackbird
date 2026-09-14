import { CollectionRoute, GeoPoint } from "@/lib/types";
import { fetchOsrmRoute } from "./osrm";
import { densify, generateFallbackRoute } from "./fallback";
import { buildRouteGeometry, RouteGeometry } from "./measure";
import bakedGeometry from "@/lib/mock/geometry/baked.json";

export type GeometrySource = "baked" | "live-osrm" | "fallback-offline";

export interface RouteGeometryResult {
  geometry: RouteGeometry;
  source: GeometrySource;
}

const memoryCache = new Map<string, RouteGeometryResult>();
const OSRM_TIMEOUT_MS = 7000;
const CACHE_PREFIX = "vv-route-geom-v1:";

function readLocalCache(routeId: string): GeoPoint[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + routeId);
    if (!raw) return null;
    return JSON.parse(raw) as GeoPoint[];
  } catch {
    return null;
  }
}

function writeLocalCache(routeId: string, points: GeoPoint[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CACHE_PREFIX + routeId, JSON.stringify(points));
  } catch {
    // localStorage indisponível (modo privado, cota excedida) — sem problema, seguimos sem cache local.
  }
}

/**
 * Resolve a geometria (seguindo ruas reais) de uma rota de coleta, na
 * seguinte ordem de prioridade:
 *  1. Geometria pré-calculada ("baked") commitada no repositório — gerada
 *     rodando `npm run bake-routes` com internet disponível. É a opção
 *     recomendada para o dia da apresentação (não depende de rede).
 *  2. Cache local do navegador de uma consulta anterior ao motor de rotas.
 *  3. Consulta em tempo real ao motor de roteamento OSRM (segue ruas reais).
 *  4. Fallback offline (aproximação em "degraus", nunca linha reta) caso as
 *     opções acima falhem — garante que o app nunca mostra teleporte.
 */
export async function getRouteGeometry(route: CollectionRoute): Promise<RouteGeometryResult> {
  const cached = memoryCache.get(route.id);
  if (cached) return cached;

  const baked = (bakedGeometry as Record<string, GeoPoint[]>)[route.id];
  if (baked && baked.length > 1) {
    const result: RouteGeometryResult = { geometry: buildRouteGeometry(baked), source: "baked" };
    memoryCache.set(route.id, result);
    return result;
  }

  const local = readLocalCache(route.id);
  if (local && local.length > 1) {
    const result: RouteGeometryResult = { geometry: buildRouteGeometry(local), source: "live-osrm" };
    memoryCache.set(route.id, result);
    return result;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OSRM_TIMEOUT_MS);
    const rawPoints = await fetchOsrmRoute(route.waypoints, controller.signal);
    clearTimeout(timeout);

    const points = densify(rawPoints, 15);
    writeLocalCache(route.id, points);
    const result: RouteGeometryResult = { geometry: buildRouteGeometry(points), source: "live-osrm" };
    memoryCache.set(route.id, result);
    return result;
  } catch (err) {
    console.warn(
      `[getRouteGeometry] Falha ao consultar OSRM para a rota "${route.id}", usando fallback offline.`,
      err,
    );
    const points = generateFallbackRoute(route.waypoints);
    const result: RouteGeometryResult = { geometry: buildRouteGeometry(points), source: "fallback-offline" };
    memoryCache.set(route.id, result);
    return result;
  }
}

export function clearRouteGeometryCache() {
  memoryCache.clear();
}
