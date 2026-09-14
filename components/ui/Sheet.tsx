"use client";

import { useEffect, ReactNode } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={clsx(
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative w-full sm:max-w-md bg-[var(--color-surface)] rounded-t-3xl sm:rounded-3xl shadow-2xl transition-transform duration-300 vv-safe-bottom max-h-[85vh] overflow-y-auto vv-scrollbar-none",
          open ? "translate-y-0" : "translate-y-full sm:translate-y-8 sm:opacity-0",
        )}
      >
        <div className="sticky top-0 z-10 bg-[var(--color-surface)] rounded-t-3xl pt-3 pb-2 px-5 flex items-center justify-between border-b border-[var(--color-border)]">
          <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-10 h-1.5 rounded-full bg-[var(--color-border)] sm:hidden" />
          <span className="text-sm font-semibold text-[var(--color-text)] mt-2">{title}</span>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="mt-1 p-1.5 rounded-full hover:bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
