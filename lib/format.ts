import { TruckStatus } from "@/lib/types";

export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) return "--";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
}

export function formatEta(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "--";
  if (seconds <= 25) return "Chegando agora";
  const mins = Math.round(seconds / 60);
  if (mins < 1) return "menos de 1 min";
  if (mins === 1) return "1 min";
  return `${mins} min`;
}

export function truckStatusLabel(status: TruckStatus): string {
  switch (status) {
    case "garagem":
      return "Na garagem";
    case "em_rota":
      return "Em rota";
    case "aproximando":
      return "Aproximando-se";
    case "no_ponto":
      return "No ponto de coleta";
    case "coleta_realizada":
      return "Coleta realizada";
    default:
      return status;
  }
}

export function formatClockTime(date = new Date()): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
