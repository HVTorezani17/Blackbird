"use client";

import { MapPinned, Clock, AlertTriangle } from "lucide-react";
import { ecopontos } from "@/lib/mock";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function EcopontosPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Pontos de descarte" subtitle="Ecopontos em Vila Velha" />
      <div className="flex-1 overflow-y-auto vv-scrollbar-none px-4 py-4">
        <div className="mb-4 flex items-start gap-2 rounded-2xl bg-[var(--color-amber-soft)] p-3.5 text-xs text-[var(--color-amber)]">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <p>
            A existência de Ecopontos em Vila Velha é confirmada publicamente, mas os endereços e
            horários abaixo são <strong>ilustrativos</strong> até validação junto à Semsu.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {ecopontos.map((eco) => (
            <Card key={eco.id} className="p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-navy-soft)] text-[var(--color-navy)]">
                  <MapPinned size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{eco.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{eco.neighborhood}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                    <Clock size={12} /> {eco.hours}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {eco.accepts.map((a) => (
                      <Badge key={a} tone="neutral">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
