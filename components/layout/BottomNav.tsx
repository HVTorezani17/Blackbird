"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Home, CalendarClock, Star, Bell } from "lucide-react";
import { useNotificationsStore } from "@/lib/store/useNotificationsStore";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/horarios", label: "Horários", icon: CalendarClock },
  { href: "/favoritos", label: "Favoritos", icon: Star },
  { href: "/avisos", label: "Avisos", icon: Bell },
];

export function BottomNav() {
  const pathname = usePathname();
  const unread = useNotificationsStore((s) => s.unreadCount);

  if (pathname?.startsWith("/rastreamento")) return null;

  return (
    <nav className="sticky bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur vv-safe-bottom">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-[var(--color-brand)]" : "text-[var(--color-text-muted)]",
              )}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                {label === "Avisos" && unread > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-amber)] px-1 text-[9px] font-semibold text-white">
                    {unread}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
