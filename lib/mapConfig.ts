// Configuração do provedor de mapas. Por padrão usamos o estilo vetorial
// gratuito da OpenFreeMap (dados OpenStreetMap, sem necessidade de chave de
// API), o que deixa o protótipo pronto para rodar imediatamente após
// `npm install && npm run dev`.
//
// Para trocar de provedor (ex.: Mapbox, MapTiler, Google Maps Platform),
// defina a variável de ambiente NEXT_PUBLIC_MAP_STYLE_URL em um arquivo
// `.env.local` (nunca commitado) apontando para a URL de estilo do seu
// provedor, já incluindo a chave. Veja README.md → "Configurar provedor de
// mapas" para exemplos.

export const DEFAULT_MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

export function getMapStyleUrl(): string {
  return process.env.NEXT_PUBLIC_MAP_STYLE_URL || DEFAULT_MAP_STYLE_URL;
}

// Centro padrão do mapa: Vila Velha, ES (dado geográfico real).
export const VILA_VELHA_CENTER: [number, number] = [-40.2925, -20.3345];
export const VILA_VELHA_DEFAULT_ZOOM = 13.5;
