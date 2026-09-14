import { WasteType } from "@/lib/types";

// Fontes gerais confirmadas via pesquisa pública (busca web em set/2026):
// - Portal oficial da Prefeitura de Vila Velha (vilavelha.es.gov.br) mantém
//   página "Coleta na hora certa" com consulta de dias/horários por bairro.
// - Serviço "Cata-Móveis" (recolhimento gratuito de móveis/eletros) e
//   "Cata-Galho" (poda) são agendados pelo telefone/WhatsApp (27) 3149-7326
//   ou pela Central de Serviços / Ouvidoria Municipal.
// - Existem Ecopontos municipais para pequenos volumes de entulho (até 2m³),
//   grandes objetos e poda.
// - A limpeza urbana é responsabilidade da Secretaria Municipal de Serviços
//   Urbanos (Semsu); a operação de coleta é executada por empresa contratada.
// Os textos abaixo sobre COMO separar cada material seguem orientação geral
// de gestão de resíduos e precisam ser validados/ajustados com a redação
// oficial da Semsu antes de qualquer publicação institucional.

export const wasteTypes: WasteType[] = [
  {
    id: "plastico",
    label: "Plástico",
    category: "seletiva",
    icon: "Recycle",
    description: "Embalagens, potes, sacolas e garrafas plásticas limpas.",
    howToDispose:
      "Enxágue a embalagem, retire restos de alimento e descarte seco. Separe do lixo comum e destine à coleta seletiva, quando disponível no seu bairro, ou a um Ecoponto.",
    source: {
      trust: "official-needs-validation",
      note: "Orientação geral de separação; redação final deve ser validada com a Semsu.",
    },
  },
  {
    id: "papel",
    label: "Papel e papelão",
    category: "seletiva",
    icon: "Newspaper",
    description: "Jornais, revistas, caixas e embalagens de papelão.",
    howToDispose:
      "Mantenha seco e sem contaminação por gordura ou alimentos. Desmonte caixas grandes para facilitar o transporte e destine à coleta seletiva ou a um Ecoponto.",
    source: {
      trust: "official-needs-validation",
      note: "Orientação geral de separação; redação final deve ser validada com a Semsu.",
    },
  },
  {
    id: "vidro",
    label: "Vidro",
    category: "seletiva",
    icon: "Wine",
    description: "Garrafas, potes e frascos de vidro.",
    howToDispose:
      "Embale em caixa ou saco resistente para evitar acidentes com o coletor. Não descarte junto com o lixo comum.",
    source: {
      trust: "official-needs-validation",
      note: "Orientação geral de separação; redação final deve ser validada com a Semsu.",
    },
  },
  {
    id: "metal",
    label: "Metal",
    category: "seletiva",
    icon: "Cog",
    description: "Latas de alumínio e aço, tampas e pequenas peças metálicas.",
    howToDispose:
      "Lave para remover resíduos de alimentos e amasse latas para ocupar menos espaço. Destine à coleta seletiva ou a um Ecoponto.",
    source: {
      trust: "official-needs-validation",
      note: "Orientação geral de separação; redação final deve ser validada com a Semsu.",
    },
  },
  {
    id: "oleo",
    label: "Óleo de cozinha",
    category: "outros",
    icon: "Droplet",
    description: "Óleo vegetal usado no preparo de alimentos.",
    howToDispose:
      "Nunca descarte na pia. Armazene em garrafa PET fechada e leve a um ponto de coleta de óleo ou Ecoponto.",
    source: {
      trust: "official-needs-validation",
      note: "Recomendação geral; confirmar pontos de coleta de óleo específicos de Vila Velha com a Semsu.",
    },
  },
  {
    id: "eletronicos",
    label: "Eletrônicos",
    category: "outros",
    icon: "Cpu",
    description: "Celulares, pilhas, baterias, computadores e eletrodomésticos pequenos.",
    howToDispose:
      "Não descarte no lixo comum nem na coleta seletiva. Leve a um Ecoponto ou ponto de coleta de eletrônicos.",
    source: {
      trust: "official-needs-validation",
      note: "Orientação geral; confirmar pontos oficiais de descarte de eletrônicos em Vila Velha.",
    },
  },
  {
    id: "moveis",
    label: "Móveis e eletrodomésticos grandes",
    category: "moveis",
    icon: "Armchair",
    description: "Armários, sofás, geladeiras, fogões e demais utensílios domésticos grandes.",
    howToDispose:
      "Serviço gratuito Cata-Móveis: agende pelo telefone/WhatsApp (27) 3149-7326 ou pela Central de Serviços da Prefeitura. Não descarte na calçada sem agendamento.",
    source: {
      trust: "official-confirmed",
      note: "Serviço Cata-Móveis confirmado em notícias oficiais da Prefeitura de Vila Velha.",
      sourceUrl: "https://www.vilavelha.es.gov.br/noticias/2022/07/moveis-usados-ou-danificados-devem-ser-descartados-com-agendamento-39066",
    },
  },
  {
    id: "madeira",
    label: "Madeira",
    category: "outros",
    icon: "Trees",
    description: "Restos de madeira de móveis, reformas ou construção.",
    howToDispose:
      "Pequenos volumes podem ser levados a um Ecoponto. Grandes volumes seguem as regras de coleta de entulho/resíduos de construção.",
    source: {
      trust: "official-needs-validation",
      note: "Inferido a partir da existência de Ecopontos para resíduos de construção; validar limite de volume.",
    },
  },
  {
    id: "poda",
    label: "Restos de poda e galhos",
    category: "poda",
    icon: "Leaf",
    description: "Galhos, folhas e restos de poda de árvores e jardins residenciais.",
    howToDispose:
      "Serviço gratuito Cata-Galho: agende pelo telefone/WhatsApp (27) 3149-7326 ou pela Central de Serviços da Prefeitura. Também aceito em Ecopontos.",
    source: {
      trust: "official-confirmed",
      note: "Serviço Cata-Galho confirmado em fontes públicas da Prefeitura de Vila Velha.",
    },
  },
  {
    id: "entulho",
    label: "Entulho / resíduos de construção",
    category: "entulho",
    icon: "HardHat",
    description: "Restos de reforma, demolição e construção civil.",
    howToDispose:
      "Pequenos volumes (até 2 m³) podem ser levados a um Ecoponto. Grandes volumes são de responsabilidade do gerador (caçamba particular), conforme normas municipais.",
    source: {
      trust: "official-needs-validation",
      note: "Limite de 2 m³ por entrega em Ecoponto identificado em fonte pública; validar regras completas com a Semsu.",
    },
  },
];
