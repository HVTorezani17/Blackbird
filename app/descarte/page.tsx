"use client";

import { useMemo, useState } from "react";
import { Search, ShieldCheck, AlertTriangle } from "lucide-react";
import * as Icons from "lucide-react";
import { wasteTypes } from "@/lib/mock";
import { WasteType } from "@/lib/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function WasteIcon({ name, ...props }: { name: string; size?: number; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[
    name
  ];
  const Fallback = Icons.Trash2;
  const IconCmp = Cmp ?? Fallback;
  return <IconCmp {...props} />;
}

function SourceBadge({ trust }: { trust: WasteType["source"]["trust"] }) {
  if (trust === "official-confirmed") {
    return (
      <Badge tone="brand">
        <ShieldCheck size={12} /> Confirmado
      </Badge>
    );
  }
  return (
    <Badge tone="amber">
      <AlertTriangle size={12} /> A validar
    </Badge>
  );
}

export default function DescartePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return wasteTypes;
    return wasteTypes.filter(
      (w) => w.label.toLowerCase().includes(q) || w.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Como descartar" subtitle="Orientações por tipo de material" />
      <div className="flex-1 overflow-y-auto vv-scrollbar-none px-4 py-4">
        <div className="relative mb-4">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar material (ex.: plástico, óleo, móveis)"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-10 pr-3.5 text-sm outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand)]"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          {filtered.map((w) => (
            <Card key={w.id} className="p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]">
                  <WasteIcon name={w.icon} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{w.label}</p>
                    <SourceBadge trust={w.source.trust} />
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">{w.description}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)]">{w.howToDispose}</p>
                </div>
              </div>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-[var(--color-text-muted)]">
              Nenhum material encontrado para &quot;{query}&quot;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
