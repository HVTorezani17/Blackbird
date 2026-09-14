"use client";

import { Suspense } from "react";
import { CalendarClock, MapPin } from "lucide-react";
import { routes, schedules, getPointsByRouteId, scheduleDaysLabel } from "@/lib/mock";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { usePointSheet } from "@/lib/navigation/usePointSheet";

function HorariosContent() {
  const { openPoint } = usePointSheet();

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Horários de coleta" subtitle="Lixo comum · Vila Velha" />
      <div className="flex-1 overflow-y-auto vv-scrollbar-none px-4 py-4">
        <div className="mb-4 flex items-start gap-2 rounded-2xl bg-[var(--color-navy-soft)] p-3.5 text-xs text-[var(--color-navy)]">
          <CalendarClock size={16} className="mt-0.5 shrink-0" />
          <p>
            Horários <strong>estimados</strong>. Confira sempre o horário oficial do seu bairro no
            portal{" "}
            <a
              href="https://www.vilavelha.es.gov.br/coleta/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              vilavelha.es.gov.br/coleta
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {routes.map((route) => {
            const schedule = schedules.find((s) => s.routeId === route.id);
            const points = getPointsByRouteId(route.id);
            if (!schedule) return null;
            return (
              <Card key={route.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{route.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{route.neighborhood}</p>
                  </div>
                  <Badge tone="brand">Lixo comum</Badge>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Dias</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {scheduleDaysLabel(schedule)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">Horário estimado</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {schedule.startTime} – {schedule.endTime}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {points.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => openPoint(p.id)}
                      className="flex items-center gap-1 rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]"
                    >
                      <MapPin size={11} /> {p.name}
                    </button>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HorariosPage() {
  return (
    <Suspense fallback={null}>
      <HorariosContent />
    </Suspense>
  );
}
