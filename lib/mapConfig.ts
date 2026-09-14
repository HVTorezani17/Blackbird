import type { StyleSpecification } from "maplibre-gl";

// Configuração do provedor de mapas.
//
// IMPORTANTE sobre tiles raster e MapLibre GL: MapLibre renderiza tiles
// como texturas WebGL, o que exige que o servidor de tiles responda com
// cabeçalhos CORS (Access-Control-Allow-Origin). Os tiles "clássicos" do
// OpenStreetMap (tile.openstreetmap.org), pensados para uso com <img> em
// bibliotecas como Leaflet, NÃO enviam esses cabeçalhos de forma
// confiável — usá-los aqui resulta em mapa em branco mesmo com internet
// funcionando, silenciosamente (é um erro de CORS/WebGL, não de rede).
//
// Por isso o padrão usa os tiles raster gratuitos da CARTO (basemaps.
// cartocdn.com), que são explicitamente publicados para uso embarcado em
// bibliotecas como esta (CORS habilitado), não exigem chave de API, e são
// servidos por uma CDN de grande porte. Continuam sendo apenas
// requisições de imagem simples (sem style.json/sprites/glyphs
// encadeados como um estilo vetorial completo exigiria).
//
// Para usar outro provedor (Mapbox, MapTiler, Google Maps Platform via um
// estilo compatível, um estilo vetorial próprio), defina a variável de
// ambiente NEXT_PUBLIC_MAP_STYLE_URL em um arquivo `.env.local` (nunca
// commitado) apontando para a URL do estilo, já incluindo a chave. Veja
// README.md → "Configurar provedor de mapas".

export const CARTO_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "carto-raster": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
      maxzoom: 20,
    },
  },
  layers: [
    {
      id: "carto-raster-layer",
      type: "raster",
      source: "carto-raster",
    },
  ],
};

export function getMapStyle(): string | StyleSpecification {
  return process.env.NEXT_PUBLIC_MAP_STYLE_URL || CARTO_RASTER_STYLE;
}

// Centro padrão do mapa: Vila Velha, ES (dado geográfico real).
export const VILA_VELHA_CENTER: [number, number] = [-40.2925, -20.3345];
export const VILA_VELHA_DEFAULT_ZOOM = 13.5;
