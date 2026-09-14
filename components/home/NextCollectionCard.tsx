"use client";

import { useRouter } from "next/navigation";
import { Truck as TruckIcon, ChevronRight } from "lucide-react";
import { CollectionPoint } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getRouteById, getScheduleByRouteId, getTrucksByRouteId, nextCollectionOffsetDays } from "@/lib/mock";
import { useEtaToPoint, useTruckState } from "@/lib/simulation/selectors";
import { formatDistance, formatEta } from "@/lib/format";

function offsetLabel(offset: number): string {
  if (offset === 0) return "Hoje";
  if (offset === 1) return "Amanhã";
  const days = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${days[d.getDay()]}-feira`;
}

export function NextCollectionCard({ point }: { point: CollectionPoint }) {
  const router = useRouter();
  const route = getRouteById(point.routeId);
  const schedule = getScheduleByRouteId(point.routeId);
  const trucksOnRoute = getTrucksByRouteId(point.routeId);
  const activeTruck = trucksOnRoute.find((t) => t.status !== "garagem") ?? trucksOnRoute[0];

  const truckState = useTruckState(activeTruck?.id);
  const eta = useEtaToPoint(activeTruck?.id, point.id);

  if (!route || !schedule) return null;

  const offset = nextCollectionOffsetDays(schedule);
  const operating = truckState && truckState.status !== "garagem";

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
          Minha coleta
        </p>
        <span className="text-[11px] text-[var(--color-text-muted)]">{point.neighborhood}</span>
      </div>

      <div className="px-5 pb-5 pt-2">
        <p className="text-xs text-[var(--color-text-muted)]">Próxima coleta</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[var(--color-text)]">{offsetLabel(offset)}</span>
          <span className="text-sm font-medium text-[var(--color-text-muted)]">
            {schedule.startTime} – {schedule.endTime}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              operating ? "bg-[var(--color-brand)]" : "bg-[var(--color-surface-muted)]"
            }`}
          >
            <TruckIcon size={17} className={operating ? "text-white" : "text-[var(--color-text-muted)]"} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--color-text)]">
              {operating ? `${activeTruck?.name} em operação` : "Nenhum caminhão em operação agora"}
            </p>
            {operating && eta && (
              <p className="text-sm text-[var(--color-brand-dark)]">
                Aproximadamente <strong>{formatEta(eta.etaSeconds)}</strong> · {formatDistance(eta.distanceM)}
              </p>
            )}
          </div>
        </div>

        <Button
          fullWidth
          size="lg"
          className="mt-4"
          disabled={!operating}
          onClick={() => router.push(`/rastreamento?truckId=${activeTruck?.id}&pointId=${point.id}`)}
        >
          Acompanhar caminhão
          <ChevronRight size={18} />
        </Button>
      </div>
    </Card>
  );
}
