"use client";

import { ChevronUp, Truck as TruckIcon } from "lucide-react";
import { CollectionPoint } from "@/lib/types";
import { getRouteById, getScheduleByRouteId, getTrucksByRouteId } from "@/lib/mock";
import { useEtaToPoint, useTruckState } from "@/lib/simulation/selectors";
import { formatEta } from "@/lib/format";

/**
 * Faixa compacta sobreposta ao mapa (a tela inicial é o mapa em tela
 * cheia). Toque para abrir os detalhes completos da próxima coleta e o
 * grid de outros serviços num bottom sheet.
 */
export function HomeSummaryBar({ point, onExpand }: { point: CollectionPoint; onExpand: () => void }) {
  const route = getRouteById(point.routeId);
  const schedule = route ? getScheduleByRouteId(route.id) : undefined;
  const trucksOnRoute = route ? getTrucksByRouteId(route.id) : [];
  const activeTruck = trucksOnRoute.find((t) => t.status !== "garagem") ?? trucksOnRoute[0];
  const truckState = useTruckState(activeTruck?.id);
  const eta = useEtaToPoint(activeTruck?.id, point.id);
  const operating = truckState && truckState.status !== "garagem";

  return (
    <button
      onClick={onExpand}
      className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-left shadow-[0_-4px_20px_-6px_rgba(16,32,27,0.25)]"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          operating ? "bg-[var(--color-brand)]" : "bg-[var(--color-surface-muted)]"
        }`}
      >
        <TruckIcon size={17} className={operating ? "text-white" : "text-[var(--color-text-muted)]"} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Minha coleta · {point.neighborhood}
        </p>
        <p className="truncate text-sm font-semibold text-[var(--color-text)]">
          {operating && eta
            ? `${activeTruck?.name} · ${formatEta(eta.etaSeconds)}`
            : schedule
              ? `Próxima coleta: ${schedule.startTime} – ${schedule.endTime}`
              : "Toque para ver detalhes"}
        </p>
      </div>
      <ChevronUp size={18} className="shrink-0 text-[var(--color-text-muted)]" />
    </button>
  );
}
