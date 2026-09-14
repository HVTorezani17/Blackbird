"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-3.5 backdrop-blur">
      <button
        onClick={() => router.back()}
        aria-label="Voltar"
        className="rounded-full p-1.5 text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]"
      >
        <ChevronLeft size={22} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-[var(--color-text)]">{title}</h1>
        {subtitle && <p className="truncate text-xs text-[var(--color-text-muted)]">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}
