"use client";

import Link from "next/link";
import { CalendarClock, Recycle, PackagePlus, MapPinned, Bell, Star, type LucideIcon } from "lucide-react";

interface Action {
  href: string;
  label: string;
  icon: LucideIcon;
}

const actions: Action[] = [
  { href: "/horarios", label: "Horários", icon: CalendarClock },
  { href: "/descarte", label: "Como descartar", icon: Recycle },
  { href: "/coleta-especial", label: "Coleta especial", icon: PackagePlus },
  { href: "/ecopontos", label: "Pontos de descarte", icon: MapPinned },
  { href: "/avisos", label: "Avisos", icon: Bell },
  { href: "/favoritos", label: "Favoritos", icon: Star },
];

export function QuickActionsGrid() {
  return (
    <div>
      <p className="mb-2.5 px-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        Mais serviços
      </p>
      <div className="grid grid-cols-3 gap-3">
        {actions.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-4 text-center transition-colors hover:bg-[var(--color-surface-muted)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]">
              <Icon size={19} />
            </span>
            <span className="text-[11.5px] font-medium leading-tight text-[var(--color-text)]">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
