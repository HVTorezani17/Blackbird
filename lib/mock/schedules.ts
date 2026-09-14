import { CollectionSchedule } from "@/lib/types";

export const schedules: CollectionSchedule[] = [
  {
    id: "sch-centro",
    routeId: "rota-centro",
    dayOfWeek: [1, 3, 5], // segunda, quarta, sexta
    startTime: "18:30",
    endTime: "19:00",
    estimated: true,
    source: {
      trust: "mock",
      note: "Horário fictício inspirado no padrão vespertino divulgado publicamente pela Prefeitura; validar por bairro no portal oficial (vilavelha.es.gov.br/coleta).",
    },
  },
  {
    id: "sch-praia-costa",
    routeId: "rota-praia-da-costa",
    dayOfWeek: [2, 4, 6], // terça, quinta, sábado
    startTime: "19:00",
    endTime: "19:30",
    estimated: true,
    source: {
      trust: "mock",
      note: "Horário fictício inspirado no padrão vespertino divulgado publicamente pela Prefeitura; validar por bairro no portal oficial (vilavelha.es.gov.br/coleta).",
    },
  },
];
