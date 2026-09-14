import { GeoPoint } from "@/lib/types";

// Cliente para o motor de roteamento OSRM (Open Source Routing Machine).
// Por padrão usamos o servidor de demonstração público do projeto OSRM
// (router.project-osrm.org), que não exige chave de API — ideal para um
// protótipo. Para produção, aponte OSRM_BASE_URL (ver lib/geo/config.ts)
// para uma instância própria/dedicada (ou troque por Mapbox Directions /
// Google Directions / GraphHopper mantendo a mesma interface).

const DEFAULT_OSRM_BASE_URL = "https://router.project-osrm.org";

export function getOsrmBaseUrl(): string {
  return (
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_OSRM_BASE_URL) ||
    DEFAULT_OSRM_BASE_URL
  );
}

interface OsrmRouteResponse {
  code: string;
  routes?: Array<{
    geometry: { coordinates: [number, number][]; type: "LineString" };
    distance: number;
    duration: number;
  }>;
}

/**
 * Busca a geometria de uma rota seguindo as ruas reais, passando pelos
 * waypoints informados nesta ordem. Lança erro em caso de falha de rede ou
 * resposta inválida — quem chama deve tratar o fallback.
 */
export async function fetchOsrmRoute(
  waypoints: GeoPoint[],
  signal?: AbortSignal,
): Promise<GeoPoint[]> {
  if (waypoints.length < 2) {
    throw new Error("São necessários ao menos 2 waypoints para calcular uma rota.");
  }

  const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(";");
  const url = `${getOsrmBaseUrl()}/route/v1/driving/${coords}?overview=full&geometries=geojson&continue_straight=false`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`OSRM respondeu com status ${res.status}`);
  }

  const data = (await res.json()) as OsrmRouteResponse;
  if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
    throw new Error(`OSRM não retornou uma rota válida (code=${data.code}).`);
  }

  return data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
}
