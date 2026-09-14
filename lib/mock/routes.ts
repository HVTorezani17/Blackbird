import { CollectionRoute } from "@/lib/types";

// AVISO: as coordenadas abaixo situam as rotas em bairros reais de Vila
// Velha/ES (Centro/Prainha/Glória e Praia da Costa), mas os waypoints,
// nomes de rua e traçados exatos são DADOS MOCK criados exclusivamente para
// esta demonstração. A geometria real (seguindo as ruas) é calculada em
// tempo real por um motor de roteamento (ver lib/geo/routing.ts) a partir
// destes waypoints — nunca uma linha reta entre pontos.

export const routes: CollectionRoute[] = [
  {
    id: "rota-centro",
    name: "Rota Centro / Prainha / Glória",
    neighborhood: "Centro de Vila Velha",
    collectionType: "comum",
    active: true,
    waypoints: [
      { lat: -20.324, lng: -40.297, label: "Início — Garagem Prainha" },
      { lat: -20.3268, lng: -40.2955 },
      { lat: -20.3285, lng: -40.2938 },
      { lat: -20.3268, lng: -40.2921 },
      { lat: -20.3275, lng: -40.2895 },
      { lat: -20.33, lng: -40.2882 },
      { lat: -20.3325, lng: -40.29 },
      { lat: -20.3318, lng: -40.293, label: "Fim — Glória" },
    ],
    pointIds: ["p-prainha", "p-centro-mercado", "p-gloria"],
    source: {
      trust: "mock",
      note: "Traçado fictício para demonstração; bairros reais, ruas e sequência ilustrativas.",
    },
  },
  {
    id: "rota-praia-da-costa",
    name: "Rota Praia da Costa",
    neighborhood: "Praia da Costa",
    collectionType: "comum",
    active: true,
    waypoints: [
      { lat: -20.348, lng: -40.293, label: "Início — Garagem Praia da Costa" },
      { lat: -20.35, lng: -40.2915 },
      { lat: -20.352, lng: -40.2895 },
      { lat: -20.354, lng: -40.2875 },
      { lat: -20.356, lng: -40.2855 },
      { lat: -20.358, lng: -40.2865 },
      { lat: -20.3565, lng: -40.289 },
      { lat: -20.3545, lng: -40.2905, label: "Fim — Praia da Costa Sul" },
    ],
    pointIds: ["p-praia-costa-norte", "p-praia-costa-central", "p-praia-costa-sul"],
    source: {
      trust: "mock",
      note: "Traçado fictício para demonstração; bairro real, ruas e sequência ilustrativas.",
    },
  },
];
