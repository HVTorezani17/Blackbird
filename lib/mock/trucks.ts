import { Truck } from "@/lib/types";

export const trucks: Truck[] = [
  {
    id: "caminhao-03",
    name: "Caminhão 03",
    plate: "VVA1D23",
    type: "comum",
    routeId: "rota-centro",
    status: "em_rota",
    source: { trust: "mock", note: "Identificação fictícia para a demonstração." },
  },
  {
    id: "caminhao-07",
    name: "Caminhão 07",
    plate: "VVA2F45",
    type: "comum",
    routeId: "rota-praia-da-costa",
    status: "em_rota",
    source: { trust: "mock", note: "Identificação fictícia para a demonstração." },
  },
  {
    id: "caminhao-12",
    name: "Caminhão 12",
    plate: "VVA3H67",
    type: "comum",
    routeId: "rota-centro",
    status: "garagem",
    source: { trust: "mock", note: "Identificação fictícia para a demonstração." },
  },
];
