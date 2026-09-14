"use client";

import Link from "next/link";
import { Bell, Truck } from "lucide-react";
import { useNotificationsStore } from "@/lib/store/useNotificationsStore";

export function HomeHeader() {
  const unread = useNotificationsStore((s) => s.unreadCount);

  return (
    <header className="flex items-center justify-between px-4 pb-1 pt-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-brand)] text-white">
          <Truck size={18} />
        </span>
        <div className="leading-tight">
          <p className="text-[15px] font-bold text-[var(--color-text)]">Coleta VV</p>
          <p className="text-[11px] text-[var(--color-text-muted)]">Vila Velha · Serviço público</p>
        </div>
      </div>
      <Link
        href="/avisos"
        aria-label="Avisos"
        className="relative rounded-full p-2 text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--color-amber)]" />
        )}
      </Link>
    </header>
  );
}
