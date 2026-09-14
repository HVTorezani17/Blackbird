"use client";

import { useRouter } from "next/navigation";
import { Star, Truck as TruckIcon, MapPin } from "lucide-react";
import { CollectionPoint } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getRouteById, getScheduleByRouteId, getTrucksByRouteId, nextCollectionOffsetDays, scheduleDaysLabel } from "@/lib/mock";
import { useEtaToPoint, useTruckState } from "@/lib/simulation/selectors";
import { formatDistance, formatEta, truckStatusLabel } from "@/lib/format";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";

function offsetLabel(offset: number): string {
  if (offset === 0) return "Hoje";
  if (offset === 1) return "Amanhã";
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return days[d.getDay()];
}

export function PointDetailSheet({
  point,
  open,
  onClose,
}: {
  point: CollectionPoint | null;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const route = point ? getRouteById(point.routeId) : undefined;
  const schedule = point ? getScheduleByRouteId(point.routeId) : undefined;
  const trucksOnRoute = point ? getTrucksByRouteId(point.routeId) : [];
  const activeTruck = trucksOnRoute.find((t) => t.status !== "garagem") ?? trucksOnRoute[0];

  const truckState = useTruckState(activeTruck?.id);
  const eta = useEtaToPoint(activeTruck?.id, point?.id);

  const isFavorite = useFavoritesStore((s) => (point ? s.isFavorite("ponto", point.id) : false));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  if (!point || !route || !schedule) {
    return (
      <Sheet open={open} onClose={onClose} title="Ponto de coleta">
        <div />
      </Sheet>
    );
  }

  const offset = nextCollectionOffsetDays(schedule);

  return (
    <Sheet open={open} onClose={onClose} title="Ponto de coleta">
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">{point.name}</h2>
              <p className="mt-0.5 flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                <MapPin size={14} /> {point.address}
              </p>
            </div>
            <Badge tone="brand">Lixo comum</Badge>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-[var(--color-surface-muted)] p-4">
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Próxima coleta</dt>
            <dd className="mt-0.5 text-sm font-semibold text-[var(--color-text)]">{offsetLabel(offset)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Horário estimado</dt>
            <dd className="mt-0.5 text-sm font-semibold text-[var(--color-text)]">
              {schedule.startTime} — {schedule.endTime}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Próximo caminhão</dt>
            <dd className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-[var(--color-text)]">
              <TruckIcon size={14} className="text-[var(--color-brand)]" /> {activeTruck?.name ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-text-muted)]">Previsão</dt>
            <dd className="mt-0.5 text-sm font-semibold text-[var(--color-brand-dark)]">
              {eta ? `${formatEta(eta.etaSeconds)} · ${formatDistance(eta.distanceM)}` : "—"}
            </dd>
          </div>
        </dl>

        <div>
          <p className="text-xs text-[var(--color-text-muted)]">Dias de coleta</p>
          <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{scheduleDaysLabel(schedule)}</p>
        </div>

        {truckState && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" />
            Status do caminhão: {truckStatusLabel(truckState.status)}
            <Badge tone="neutral" className="ml-auto">Simulado</Badge>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => toggleFavorite({ type: "ponto", refId: point.id, label: point.name })}
          >
            <Star size={16} className={isFavorite ? "fill-[var(--color-amber)] text-[var(--color-amber)]" : ""} />
            {isFavorite ? "Favoritado" : "Favoritar"}
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => {
              onClose();
              router.push(`/rastreamento?truckId=${activeTruck?.id}&pointId=${point.id}`);
            }}
          >
            <TruckIcon size={16} /> Acompanhar caminhão
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
