import { SourceNote } from "@/lib/types";

export interface OfficialChannel {
  label: string;
  value: string;
  href?: string;
  source: SourceNote;
}

// Canais confirmados publicamente (pesquisa web, set/2026) que o cidadão já
// pode usar HOJE, fora deste protótipo, para solicitar os serviços reais.
export const officialChannels: OfficialChannel[] = [
  {
    label: "Central 0800 (Prefeitura de Vila Velha)",
    value: "0800 283 9059",
    href: "tel:08002839059",
    source: {
      trust: "official-confirmed",
      note: "Telefone de atendimento geral divulgado pela Prefeitura de Vila Velha.",
    },
  },
  {
    label: "Cata-Móveis / Cata-Galho (telefone/WhatsApp)",
    value: "(27) 3149-7326",
    href: "tel:+552731497326",
    source: {
      trust: "official-confirmed",
      note: "Canal de agendamento do recolhimento gratuito de móveis e restos de poda, divulgado pela Prefeitura de Vila Velha.",
    },
  },
  {
    label: "Portal — Coleta na hora certa",
    value: "vilavelha.es.gov.br/coleta",
    href: "https://www.vilavelha.es.gov.br/coleta/",
    source: {
      trust: "official-confirmed",
      note: "Consulta oficial de dias e horários de coleta por bairro.",
    },
  },
];

export const responsibleAuthority = {
  name: "Secretaria Municipal de Serviços Urbanos (Semsu)",
  operatorNote:
    "A operação de coleta e limpeza urbana em Vila Velha é executada por empresa contratada pelo município.",
  source: {
    trust: "official-confirmed",
    note: "Semsu identificada como responsável pela limpeza urbana em fontes públicas oficiais.",
  } satisfies SourceNote,
};
