import type { StyleSpecification } from "maplibre-gl";

// Configuração do provedor de mapas.
//
// Por padrão usamos tiles RASTER do OpenStreetMap (sem necessidade de chave
// de API), construindo o "estilo" localmente (OSM_RASTER_STYLE) em vez de
// buscar um style.json de terceiros. Isso é proposital: um estilo vetorial
// (ex.: OpenFreeMap) depende de várias requisições encadeadas (style.json +
// sprites + glyphs + dezenas de tiles vetoriais .pbf) e, se qualquer uma
// falhar — rede restrita, proxy corporativo, CDN fora do ar — o mapa inteiro
// não aparece. Tiles raster são apenas requisições de imagem simples,
// servidas por um dos hosts mais universalmente acessíveis que existem, o
// que torna o protótipo muito mais resistente em redes desconhecidas (como
// a do local da apresentação).
//
// Para usar um estilo vetorial mais bonito (Mapbox, MapTiler, um estilo
// próprio), defina a variável de ambiente NEXT_PUBLIC_MAP_STYLE_URL em um
// arquivo `.env.local` (nunca commitado) apontando para a URL do estilo,
// já incluindo a chave. Veja README.md → "Configurar provedor de mapas".

export const OSM_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "osm-raster": {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm-raster-layer",
      type: "raster",
      source: "osm-raster",
    },
  ],
};

export function getMapStyle(): string | StyleSpecification {
  return process.env.NEXT_PUBLIC_MAP_STYLE_URL || OSM_RASTER_STYLE;
}

// Centro padrão do mapa: Vila Velha, ES (dado geográfico real).
export const VILA_VELHA_CENTER: [number, number] = [-40.2925, -20.3345];
export const VILA_VELHA_DEFAULT_ZOOM = 13.5;
