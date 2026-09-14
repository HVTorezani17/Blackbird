import type { StyleSpecification } from "maplibre-gl";

// Configuração do provedor de mapas.
//
// Histórico de tentativas (documentado aqui porque já causou retrabalho):
// 1. Estilo vetorial OpenFreeMap — feito especificamente para MapLibre GL
//    (CORS correto), mas depende de várias requisições encadeadas
//    (style.json + sprites + glyphs + tiles .pbf).
// 2. Tiles raster "clássicos" do OpenStreetMap (tile.openstreetmap.org) —
//    NÃO funcionam com MapLibre: a biblioteca sobe tiles como textura
//    WebGL, o que exige cabeçalhos CORS, e esses tiles (pensados para
//    `<img>` em bibliotecas como Leaflet) não os enviam de forma
//    confiável. Resultado: mapa em branco mesmo com internet OK.
// 3. Tiles raster legados da CARTO (basemaps.cartocdn.com/rastertiles) —
//    carregam (CORS ok), mas hoje retornam uma imagem de "API KEY
//    REQUIRED" para uso sem autenticação — inútil sem chave.
//
// Por isso o app agora tenta o estilo PRIMÁRIO (vetorial, OpenFreeMap) e,
// se ele não terminar de carregar dentro de alguns segundos, troca
// automaticamente para um estilo de FALLBACK raster (Esri World Street
// Map, tiles REST gratuitos sem chave para uso leve/avaliação) — sem
// exigir nenhuma ação do usuário. Veja components/map/MapProvider.tsx.
//
// Para usar seu próprio provedor (Mapbox, MapTiler, Google Maps Platform
// via um estilo compatível), defina NEXT_PUBLIC_MAP_STYLE_URL em um
// arquivo `.env.local` (nunca commitado) apontando para a URL do estilo,
// já incluindo a chave. Veja README.md → "Configurar provedor de mapas".

export const PRIMARY_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

export const FALLBACK_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "esri-raster": {
      type: "raster",
      // Esquema REST do Esri: {z}/{y}/{x} (linha antes de coluna).
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "© Esri, © OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "esri-raster-layer",
      type: "raster",
      source: "esri-raster",
    },
  ],
};

export function getPrimaryMapStyle(): string | StyleSpecification {
  return process.env.NEXT_PUBLIC_MAP_STYLE_URL || PRIMARY_STYLE_URL;
}

export function getFallbackMapStyle(): string | StyleSpecification {
  return FALLBACK_RASTER_STYLE;
}

// Centro padrão do mapa: Vila Velha, ES (dado geográfico real).
export const VILA_VELHA_CENTER: [number, number] = [-40.2925, -20.3345];
export const VILA_VELHA_DEFAULT_ZOOM = 13.5;
