"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Truck, CollectionRoute } from "@/lib/types";
import { TruckSimState } from "@/lib/simulation/types";
import { truckStatusLabel } from "@/lib/format";

const statusDotClass: Record<string, string> = {
  em_rota: "bg-[var(--color-brand)]",
  aproximando: "bg-[var(--color-amber)]",
  no_ponto: "bg-[var(--color-navy)]",
  coleta_realizada: "bg-[var(--color-text-muted)]",
  garagem: "bg-[var(--color-text-muted)]",
};

export function TrackingHeader({
  truck,
  route,
  truckState,
}: {
  truck: Truck | undefined;
  route: CollectionRoute | undefined;
  truckState: TruckSimState | null;
}) {
  const router = useRouter();

  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4">
      <button
        onClick={() => router.push("/")}
        aria-label="Fechar"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[var(--color-text)] shadow-md backdrop-blur"
      >
        <X size={19} />
      </button>

      <div className="flex-1 rounded-2xl bg-white/95 px-4 py-2.5 shadow-md backdrop-blur">
        <p className="text-sm font-semibold text-[var(--color-text)]">{truck?.name ?? "Caminhão"}</p>
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <span
            className={`h-1.5 w-1.5 rounded-full ${statusDotClass[truckState?.status ?? "em_rota"]}`}
          />
          {truckState ? truckStatusLabel(truckState.status) : "Carregando…"} · {route?.name}
        </p>
      </div>
    </header>
  );
}
