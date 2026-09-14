export { wasteTypes } from "./wasteTypes";
export { routes } from "./routes";
export { collectionPoints } from "./points";
export { schedules } from "./schedules";
export { trucks } from "./trucks";
export { ecopontos } from "./ecopontos";
export { officialChannels, responsibleAuthority } from "./officialChannels";

import { routes } from "./routes";
import { collectionPoints } from "./points";
import { schedules } from "./schedules";
import { trucks } from "./trucks";
import type { CollectionPoint, CollectionRoute, CollectionSchedule, Truck } from "@/lib/types";

export function getRouteById(id: string): CollectionRoute | undefined {
  return routes.find((r) => r.id === id);
}

export function getPointById(id: string): CollectionPoint | undefined {
  return collectionPoints.find((p) => p.id === id);
}

export function getScheduleById(id: string): CollectionSchedule | undefined {
  return schedules.find((s) => s.id === id);
}

export function getScheduleByRouteId(routeId: string): CollectionSchedule | undefined {
  return schedules.find((s) => s.routeId === routeId);
}

export function getTruckById(id: string): Truck | undefined {
  return trucks.find((t) => t.id === id);
}

export function getTrucksByRouteId(routeId: string): Truck[] {
  return trucks.filter((t) => t.routeId === routeId);
}

export function getPointsByRouteId(routeId: string): CollectionPoint[] {
  return collectionPoints.filter((p) => p.routeId === routeId);
}

const weekdayNames = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

const weekdayShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function dayOfWeekLabel(day: number, short = false): string {
  return short ? weekdayShort[day] : weekdayNames[day];
}

export function scheduleDaysLabel(schedule: CollectionSchedule, short = true): string {
  return schedule.dayOfWeek.map((d) => dayOfWeekLabel(d, short)).join(" • ");
}

export function isCollectionDay(schedule: CollectionSchedule, date = new Date()): boolean {
  return schedule.dayOfWeek.includes(date.getDay() as CollectionSchedule["dayOfWeek"][number]);
}

/** Retorna o próximo dia (0 = hoje) em que a rota tem coleta programada. */
export function nextCollectionOffsetDays(schedule: CollectionSchedule, from = new Date()): number {
  const today = from.getDay();
  for (let offset = 0; offset < 7; offset++) {
    const day = (today + offset) % 7;
    if (schedule.dayOfWeek.includes(day as CollectionSchedule["dayOfWeek"][number])) {
      return offset;
    }
  }
  return 0;
}
