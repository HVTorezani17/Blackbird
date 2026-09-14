# Coleta VV — Protótipo de acompanhamento da coleta de lixo em Vila Velha/ES

> "Saiba quando o caminhão passa. Veja onde ele está."

Protótipo funcional e navegável de um aplicativo de acompanhamento da coleta
de resíduos domésticos para o município de Vila Velha (ES), inspirado na
lógica de acompanhamento de veículos do aplicativo Ônibus GV, aplicada à
coleta de lixo. Construído com Next.js (App Router) + TypeScript + Tailwind
CSS + MapLibre GL JS.

O coração do protótipo é a **tela de acompanhamento do caminhão**: mapa com
a rota seguindo ruas reais, caminhão em movimento contínuo, distância e ETA
que diminuem em tempo real, e trecho percorrido x restante desenhados de
forma distinta.

---

## 1. Como rodar

Pré-requisitos: Node.js 20+.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Não é necessária
nenhuma chave de API para rodar o protótipo — o mapa e o roteamento usam
provedores gratuitos por padrão (veja seção 3).

Outros comandos:

```bash
npm run build   # build de produção
npm run start   # roda o build de produção
npm run lint    # eslint
```

## 2. Painel de demonstração

Para facilitar apresentações presenciais, existe um painel de controle da
simulação em **`/admin`** (também linkado discretamente no rodapé da tela
inicial). Nele é possível, por caminhão:

- pausar/retomar e acelerar a simulação (0.5x a 8x);
- reiniciar um caminhão ou todos;
- trocar a rota de um caminhão;
- enviar um caminhão para a garagem (fora de operação) ou colocá-lo em
  operação;
- ver a origem da geometria da rota que está sendo usada (baked / live-osrm
  / fallback-offline — veja seção 4).

Esses controles não aparecem na navegação principal (não são destinados ao
cidadão).

## 3. Configurar o provedor de mapas (opcional)

Por padrão o mapa tenta, nesta ordem, sem exigir nenhuma chave de API:

1. **Estilo vetorial OpenFreeMap** (`tiles.openfreemap.org`) — feito
   especificamente para uso com MapLibre GL (cabeçalhos CORS corretos),
   visual mais completo.
2. Se os tiles não terminarem de carregar em alguns segundos (rede
   restrita, provedor fora do ar), o app troca **automaticamente**, sem
   nenhuma ação do usuário, para um estilo raster de **fallback (Esri
   World Street Map)**, mais simples e com menos pontos de falha.
3. Se mesmo o fallback falhar, a interface mostra um aviso com botão
   "Tentar novamente" em vez de ficar em branco silenciosamente —
   controles, marcadores e rota continuam funcionando por cima do mapa
   mesmo sem os tiles visuais.

Essa cadeia existe porque, na prática, provedores gratuitos de tiles têm
comportamentos diferentes e às vezes mudam de política sem aviso (ex.:
tiles "clássicos" do OpenStreetMap não têm CORS habilitado para uso com
WebGL, e alguns provedores raster legados passaram a exigir chave). Ver
`lib/mapConfig.ts` para o racional completo de cada opção testada.

Para usar um estilo vetorial mais bonito (Mapbox, MapTiler, Google Maps
Platform via um estilo compatível, um estilo próprio), crie um arquivo
`.env.local` (nunca commitado) na raiz do projeto:

```bash
# .env.local
NEXT_PUBLIC_MAP_STYLE_URL="https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=SEU_TOKEN_AQUI"
```

A configuração está centralizada em `lib/mapConfig.ts`. Nenhuma chave é
lida de nenhum outro lugar do código nem commitada no repositório.

## 4. Roteamento (rota seguindo ruas reais)

O traçado das rotas de coleta **segue as ruas reais** — nunca uma linha
reta entre pontos. Isso é feito com o motor de roteamento
[OSRM](http://project-osrm.org/) (Open Source Routing Machine), consultado
em tempo real pelo navegador do usuário (`lib/geo/osrm.ts`), sem exigir
chave de API.

Como a geometria calculada ao vivo depende de internet no momento da
demonstração, o protótipo tem **três camadas de resiliência**, nesta ordem
de prioridade (`lib/geo/getRouteGeometry.ts`):

1. **Geometria pré-calculada ("baked")** — commitada em
   `lib/mock/geometry/baked.json`. É a opção recomendada para o dia da
   apresentação: **antes de apresentar**, rode, com internet disponível:

   ```bash
   npm run bake-routes
   ```

   Isso consulta o OSRM uma vez e grava o resultado no repositório. A
   partir daí o app não depende mais de rede para desenhar as rotas.

2. **Cache local do navegador** de uma consulta anterior ao OSRM.

3. **Consulta ao vivo ao OSRM** (`router.project-osrm.org`, servidor de
   demonstração público, sem chave).

4. **Fallback offline** (`lib/geo/fallback.ts`) — usado apenas se as opções
   acima falharem (ex.: sala de apresentação sem Wi-Fi e sem bake). Gera um
   traçado em "degraus" entre os waypoints em vez de uma linha reta, para
   nunca atravessar visualmente quarteirões/prédios mesmo no pior cenário.

Para trocar de motor de roteamento (Mapbox Directions, Google Directions,
GraphHopper, uma instância própria de OSRM), edite apenas
`lib/geo/osrm.ts` — o restante da aplicação consome somente
`getRouteGeometry()` e não conhece o provedor por trás.

## 5. O que é real e o que é simulado

Este protótipo pesquisou informações públicas sobre a coleta de resíduos em
Vila Velha (setembro/2026) e distingue claramente, em todo o código e
conteúdo:

| Categoria | Significado |
|---|---|
| `official-confirmed` | Confirmado em fonte pública oficial da Prefeitura de Vila Velha |
| `official-needs-validation` | Encontrado em fonte pública, mas precisa validação/atualização oficial |
| `proposed-feature` | Funcionalidade proposta pelo produto, ainda não existe oficialmente |
| `mock` | Dado fictício, exclusivo para esta demonstração |

Essa classificação está em `source: { trust, note, sourceUrl? }` em cada
entidade de `lib/mock/*.ts` e é usada na UI (ex.: selos "Confirmado" / "A
validar" na tela **Como descartar**).

**Confirmado oficialmente:**
- A Secretaria Municipal de Serviços Urbanos (Semsu) é responsável pela
  limpeza urbana em Vila Velha.
- A Prefeitura mantém um portal de consulta de dias/horários de coleta por
  bairro: [vilavelha.es.gov.br/coleta](https://www.vilavelha.es.gov.br/coleta/).
- Central de atendimento: 0800 283 9059.
- Serviços gratuitos **Cata-Móveis** (móveis/eletros) e **Cata-Galho**
  (poda), agendados pelo telefone/WhatsApp (27) 3149-7326.
- Existem **Ecopontos** municipais para descarte voluntário de pequenos
  volumes de entulho (até 2 m³), grandes objetos e poda.

**Simulado (mock) para esta demonstração:** todos os pontos de coleta,
rotas, caminhões, horários específicos por bairro, endereços de Ecopontos e
o fluxo de acompanhamento de solicitações de coleta especial. Nada disso é
apresentado na interface como dado oficial — a tela de horários, por
exemplo, indica explicitamente "estimado" e linka o portal oficial da
Prefeitura.

## 6. Arquitetura

```
app/                     Rotas (App Router) — uma por tela principal
components/
  map/                   Mapa (MapLibre): provider, marcadores, camada de rota
  home, point, tracking,  Componentes de UI por domínio de tela
  schedule*, favorites*,
  disposal*, special,
  notifications, admin
lib/
  types.ts               Entidades do domínio (User, CollectionPoint,
                          CollectionRoute, Truck, TruckLocation,
                          CollectionSchedule, CollectionRequest, WasteType,
                          Notification, Favorite, EcoPonto)
  mock/                   Dados MOCK (pontos, rotas, horários, caminhões,
                          tipos de resíduo, ecopontos, canais oficiais)
  geo/                    Roteamento (OSRM), geometria, cálculos de
                          distância/posição/rumo (turf.js)
  simulation/             Motor de simulação de GPS dos caminhões
                          ("MockTruckLocationProvider" — ver seção 7)
  store/                  Estado do app (favoritos, notificações,
                          solicitações) com Zustand
  geolocation/            Hook de geolocalização do navegador
  navigation/             Controle do bottom sheet de ponto via query string
scripts/bake-routes.ts    Pré-cálculo de geometria de rota (ver seção 4)
```

## 7. Simulação de GPS dos caminhões (arquitetura pronta para GPS real)

`lib/simulation/store.ts` é o `MockTruckLocationProvider`: uma store
Zustand que, a cada quadro (`requestAnimationFrame`, ver
`components/providers/SimulationProvider.tsx`), avança a posição de cada
caminhão ao longo da geometria real da rota (`lib/simulation/engine.ts`),
calculando posição, direção (heading), velocidade, distância restante e ETA
dinamicamente — nunca por saltos entre pontos fixos.

Para integrar **GPS real** dos caminhões no futuro, uma
`RealTruckLocationProvider` só precisa escrever no mesmo formato de estado
(`truckStates: Record<truckId, TruckSimState>`) a partir de um stream real
(WebSocket/MQTT/polling), chamando
`useSimulationStore.setState({ truckStates: {...} })`. Como todas as telas
de mapa e rastreamento só leem esse shape (nunca calculam posição sozinhas),
a troca não exige alterar nenhuma tela — apenas remover o `tick()` simulado
e os controles de demonstração do `/admin`.

## 8. Onde substituir os dados mockados por dados reais

Todos os dados fictícios ficam isolados em `lib/mock/*.ts`, com a mesma
forma dos tipos em `lib/types.ts`. Para conectar a uma API real:

1. Substitua as funções de `lib/mock/index.ts` (`getRouteById`,
   `getPointsByRouteId`, etc.) por chamadas a uma API/backend real,
   mantendo as assinaturas.
2. Substitua `lib/mock/routes.ts`/`points.ts`/`schedules.ts`/`trucks.ts`
   pelos dados oficiais da Prefeitura (calendário oficial, rotas
   georreferenciadas reais, cadastro de caminhões).
3. Implemente a `RealTruckLocationProvider` descrita na seção 7.
4. `lib/store/useRequestsStore.ts` simula a progressão de status de uma
   solicitação de coleta especial com `setTimeout`; substitua por
   atualizações vindas do sistema real de gestão de solicitações da
   Prefeitura (ou de um backend próprio).

## 9. Segurança

Nenhuma chave de API é commitada no repositório. Chaves de provedores de
mapa (quando usadas) devem ser configuradas via `.env.local`
(`NEXT_PUBLIC_MAP_STYLE_URL`), que está no `.gitignore`. A localização do
usuário é usada apenas em memória (não é persistida) para centralizar o
mapa e calcular distâncias.

## 10. Limitações conhecidas do protótipo

- Pontos de coleta, rotas, horários por bairro e caminhões são fictícios
  (ver seção 5) — a arquitetura está pronta para dados oficiais.
- A geometria de rota depende de uma consulta ao OSRM (ou do arquivo
  `baked.json`); rode `npm run bake-routes` antes de uma apresentação em
  local sem internet confiável.
- O fluxo de solicitação de coleta especial (protocolo, status) é
  simulado localmente no navegador (`localStorage`), sem backend.
