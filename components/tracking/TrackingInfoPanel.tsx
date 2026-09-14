"use client";

import { Star, MapPin } from "lucide-react";
import { CollectionPoint } from "@/lib/types";
import { TruckSimState } from "@/lib/simulation/types";
import { PointEta } from "@/lib/simulation/selectors";
import { formatDistance, formatEta } from "@/lib/format";

export function TrackingInfoPanel({
  point,
  truckState,
  eta,
  isFavorite,
  onToggleFavorite,
}: {
  point: CollectionPoint | undefined;
  truckState: TruckSimState | null;
  eta: PointEta | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const arrivedHere =
    truckState?.status === "no_ponto" && truckState.nextPointId === null
      ? false
      : truckState?.status === "no_ponto" && point && truckState.nextPointId === point.id;

  let headline: string;
  let sub: string | null = null;
  let tone: "default" | "brand" | "muted" = "default";

  if (!eta) {
    headline = "Calculando previsão…";
    tone = "muted";
  } else if (arrivedHere) {
    headline = "Coleta neste ponto agora";
    tone = "brand";
  } else if (eta.alreadyPassed) {
    headline = "O caminhão já passou por aqui nesta volta";
    sub = `Próxima passagem em ${formatEta(eta.etaSeconds)}`;
    tone = "muted";
  } else if (eta.distanceM <= 200) {
    headline = "Chegando ao ponto";
    sub = `${formatDistance(eta.distanceM)} · ${formatEta(eta.etaSeconds)}`;
    tone = "brand";
  } else {
    headline = formatEta(eta.etaSeconds);
    sub = formatDistance(eta.distanceM) + " restantes";
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 rounded-t-3xl bg-[var(--color-surface)] p-5 shadow-[0_-8px_24px_-8px_rgba(16,32,27,0.25)] vv-safe-bottom">
      {point && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1 truncate text-sm font-semibold text-[var(--color-text)]">
              <MapPin size={14} className="shrink-0 text-[var(--color-brand)]" /> {point.name}
            </p>
            <p className="truncate text-xs text-[var(--color-text-muted)]">{point.address}</p>
          </div>
          <button
            onClick={onToggleFavorite}
            aria-label="Favoritar"
            className="shrink-0 rounded-full p-2 hover:bg-[var(--color-surface-muted)]"
          >
            <Star
              size={18}
              className={isFavorite ? "fill-[var(--color-amber)] text-[var(--color-amber)]" : "text-[var(--color-text-muted)]"}
            />
          </button>
        </div>
      )}

      <div
        className={
          tone === "brand"
            ? "rounded-2xl bg-[var(--color-brand-soft)] px-4 py-3.5"
            : tone === "muted"
              ? "rounded-2xl bg-[var(--color-surface-muted)] px-4 py-3.5"
              : "px-1 py-1"
        }
      >
        <p
          className={
            tone === "brand"
              ? "text-xl font-bold text-[var(--color-brand-dark)]"
              : "text-xl font-bold text-[var(--color-text)]"
          }
        >
          {headline}
        </p>
        {sub && <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{sub}</p>}
      </div>

      <p className="mt-3 text-center text-[10.5px] text-[var(--color-text-muted)]">
        Posição do caminhão simulada para esta demonstração — arquitetura pronta para GPS real.
      </p>
    </div>
  );
}
