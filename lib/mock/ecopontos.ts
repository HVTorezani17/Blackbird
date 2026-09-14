import { EcoPonto } from "@/lib/types";

// A existência de Ecopontos em Vila Velha é confirmada publicamente
// (descarte de pequenos volumes de entulho, poda e grandes objetos), mas a
// lista completa de endereços/horários não pôde ser validada nesta
// pesquisa. Os registros abaixo são ILUSTRATIVOS (mock) até confirmação
// junto à Semsu.
export const ecopontos: EcoPonto[] = [
  {
    id: "eco-01",
    name: "Ecoponto Centro (ilustrativo)",
    address: "A confirmar com a Semsu",
    neighborhood: "Centro",
    location: { lat: -20.3295, lng: -40.291 },
    accepts: ["Entulho (até 2 m³)", "Poda", "Móveis", "Recicláveis"],
    hours: "Seg a Sex, 8h–17h (estimado)",
    source: {
      trust: "official-needs-validation",
      note: "Existência de Ecopontos confirmada publicamente; endereço e horário exatos precisam de confirmação oficial.",
    },
  },
  {
    id: "eco-02",
    name: "Ecoponto Praia da Costa (ilustrativo)",
    address: "A confirmar com a Semsu",
    neighborhood: "Praia da Costa",
    location: { lat: -20.355, lng: -40.288 },
    accepts: ["Entulho (até 2 m³)", "Poda", "Móveis", "Recicláveis"],
    hours: "Seg a Sex, 8h–17h (estimado)",
    source: {
      trust: "official-needs-validation",
      note: "Existência de Ecopontos confirmada publicamente; endereço e horário exatos precisam de confirmação oficial.",
    },
  },
];
