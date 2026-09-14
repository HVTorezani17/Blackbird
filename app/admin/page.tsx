"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw, Gauge, Truck as TruckIcon, MapPin } from "lucide-react";
import { trucks, routes, getRouteById, getPointsByRouteId } from "@/lib/mock";
import { useSimulationStore } from "@/lib/simulation/store";
import { useTruckState } from "@/lib/simulation/selectors";
import { formatDistance, formatEta, truckStatusLabel } from "@/lib/format";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const SPEED_OPTIONS = [0.5, 1, 2, 4, 8];

function TruckControlCard({ truckId }: { truckId: string }) {
  const truck = trucks.find((t) => t.id === truckId)!;
  const route = getRouteById(truck.routeId);
  const state = useTruckState(truckId);
  const resetTruck = useSimulationStore((s) => s.resetTruck);
  const setTruckDisabled = useSimulationStore((s) => s.setTruckDisabled);
  const setTruckRoute = useSimulationStore((s) => s.setTruckRoute);
  const points = route ? getPointsByRouteId(route.id) : [];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)]">
          <TruckIcon size={15} /> {truck.name}
        </p>
        <Badge tone={state?.disabled ? "neutral" : "brand"}>
          {state ? truckStatusLabel(state.status) : "…"}
        </Badge>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-[var(--color-text-muted)]">Rota</p>
          <select
            value={truck.routeId}
            onChange={(e) => setTruckRoute(truck.id, e.target.value)}
            className="mt-0.5 w-full rounded-lg border border-[var(--color-border)] bg-white p-1.5 text-xs"
          >
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)]">Próximo ponto</p>
          <p className="mt-1 font-medium text-[var(--color-text)]">
            {points.find((p) => p.id === state?.nextPointId)?.name ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)]">Distância</p>
          <p className="mt-1 font-medium text-[var(--color-text)]">
            {state ? formatDistance(state.distanceToNextPointM) : "—"}
          </p>
        </div>
        <div>
          <p className="text-[var(--color-text-muted)]">ETA</p>
          <p className="mt-1 font-medium text-[var(--color-text)]">
            {state ? formatEta(state.etaToNextPointSeconds) : "—"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => resetTruck(truck.id)}>
          <RotateCcw size={13} /> Reiniciar
        </Button>
        <Button size="sm" variant={state?.disabled ? "primary" : "outline"} onClick={() => setTruckDisabled(truck.id, !state?.disabled)}>
          {state?.disabled ? "Colocar em operação" : "Enviar para garagem"}
        </Button>
        {route && (
          <Link
            href={`/rastreamento?truckId=${truck.id}&pointId=${points[0]?.id ?? ""}`}
            className="ml-auto inline-flex items-center gap-1 rounded-xl border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]"
          >
            <MapPin size={13} /> Ver no mapa
          </Link>
        )}
      </div>
    </Card>
  );
}

export default function AdminPage() {
  const playing = useSimulationStore((s) => s.playing);
  const setPlaying = useSimulationStore((s) => s.setPlaying);
  const speedMultiplier = useSimulationStore((s) => s.speedMultiplier);
  const setSpeedMultiplier = useSimulationStore((s) => s.setSpeedMultiplier);
  const resetAll = useSimulationStore((s) => s.resetAll);
  const geometrySources = useSimulationStore((s) => s.geometrySources);
  const [showSources, setShowSources] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Painel de demonstração" subtitle="Controles de simulação (uso interno)" />
      <div className="flex-1 overflow-y-auto vv-scrollbar-none px-4 py-4">
        <Card className="p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            Reprodução
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={() => setPlaying(!playing)}>
              {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "Pausar" : "Reproduzir"}
            </Button>
            <Button size="sm" variant="outline" onClick={resetAll}>
              <RotateCcw size={14} /> Reiniciar todos
            </Button>
            <div className="ml-auto flex items-center gap-1.5">
              <Gauge size={14} className="text-[var(--color-text-muted)]" />
              {SPEED_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeedMultiplier(s)}
                  className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                    speedMultiplier === s
                      ? "bg-[var(--color-brand)] text-white"
                      : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="mt-4 flex flex-col gap-3">
          {trucks.map((t) => (
            <TruckControlCard key={t.id} truckId={t.id} />
          ))}
        </div>

        <button
          onClick={() => setShowSources((v) => !v)}
          className="mt-4 text-xs font-medium text-[var(--color-text-muted)] underline"
        >
          {showSources ? "Ocultar" : "Ver"} origem da geometria das rotas
        </button>
        {showSources && (
          <Card className="mt-2 p-3 text-xs">
            {Object.entries(geometrySources).map(([routeId, source]) => (
              <p key={routeId} className="text-[var(--color-text-muted)]">
                <strong className="text-[var(--color-text)]">{routeId}</strong>: {source}
              </p>
            ))}
            <p className="mt-2 text-[10.5px] text-[var(--color-text-muted)]">
              &quot;baked&quot; = geometria pré-calculada commitada (npm run bake-routes). &quot;live-osrm&quot; =
              calculada em tempo real via OSRM. &quot;fallback-offline&quot; = aproximação de emergência,
              sem internet/roteador disponível.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
