// Entidades centrais do domínio, alinhadas ao modelo de dados descrito no
// briefing do produto (Seção 30). Estruturado para permitir a troca futura
// de fontes MOCK por integrações reais (API municipal / GPS real dos
// caminhões) sem alterar os componentes de UI.

export type DataTrustLevel =
  | "official-confirmed" // confirmado em fonte oficial da Prefeitura de Vila Velha
  | "official-needs-validation" // encontrado em fonte pública oficial, mas requer validação/atualização
  | "proposed-feature" // funcionalidade proposta pelo produto, ainda não existe oficialmente
  | "mock"; // dado fictício, exclusivo para demonstração do protótipo

export interface SourceNote {
  trust: DataTrustLevel;
  note: string;
  sourceUrl?: string;
}

export type WasteCategory =
  | "comum"
  | "seletiva"
  | "entulho"
  | "poda"
  | "moveis"
  | "outros";

export interface WasteType {
  id: string;
  label: string;
  category: WasteCategory;
  description: string;
  howToDispose: string;
  icon: string; // lucide-react icon name
  source: SourceNote;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export type CollectionPointStatus = "ativo" | "inativo";

export interface CollectionPoint {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  location: GeoPoint;
  collectionType: WasteCategory;
  routeId: string;
  scheduleId: string;
  status: CollectionPointStatus;
  source: SourceNote;
}

export interface CollectionRouteWaypoint extends GeoPoint {
  label?: string;
}

export interface CollectionRoute {
  id: string;
  name: string;
  neighborhood: string;
  collectionType: WasteCategory;
  active: boolean;
  /** Pontos de referência usados para calcular a geometria real (ruas). */
  waypoints: CollectionRouteWaypoint[];
  /** IDs de CollectionPoint atendidos por esta rota, em ordem de passagem. */
  pointIds: string[];
  source: SourceNote;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface CollectionSchedule {
  id: string;
  routeId: string;
  dayOfWeek: DayOfWeek[];
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  estimated: boolean;
  source: SourceNote;
}

export type TruckStatus =
  | "garagem"
  | "em_rota"
  | "aproximando"
  | "no_ponto"
  | "coleta_realizada";

export interface Truck {
  id: string;
  name: string;
  plate: string;
  type: WasteCategory;
  routeId: string;
  status: TruckStatus;
  source: SourceNote;
}

export interface TruckLocation {
  truckId: string;
  position: GeoPoint;
  speedKmh: number;
  headingDeg: number; // 0-360, 0 = norte
  timestamp: number;
  nextPointId: string | null;
  distanceRemainingM: number;
  etaSeconds: number;
  status: TruckStatus;
  /** fração (0-1) percorrida da rota completa, usada para desenhar trecho percorrido x restante */
  progressFraction: number;
}

export interface CollectionRequest {
  id: string;
  protocol: string;
  wasteTypeId: string;
  quantityDescription: string;
  photoDataUrl?: string;
  address: string;
  location: GeoPoint | null;
  status: "recebida" | "agendada" | "a_caminho" | "concluida";
  createdAt: number;
  updatedAt: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  kind: "aproximando" | "chegando" | "concluida" | "aviso" | "info";
}

export interface Favorite {
  id: string;
  type: "ponto" | "endereco" | "rota";
  refId: string;
  label: string;
  createdAt: number;
}

export interface EcoPonto {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  location: GeoPoint;
  accepts: string[];
  hours: string;
  source: SourceNote;
}
