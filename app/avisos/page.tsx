"use client";

import { useEffect } from "react";
import { Bell, Truck, CheckCircle2, Info } from "lucide-react";
import { useNotificationsStore } from "@/lib/store/useNotificationsStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";

const iconByKind = {
  aproximando: Truck,
  chegando: Truck,
  concluida: CheckCircle2,
  aviso: Bell,
  info: Info,
};

function timeAgo(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  return `há ${hours} h`;
}

export default function AvisosPage() {
  const notifications = useNotificationsStore((s) => s.notifications);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);

  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Avisos" subtitle="Notificações da coleta" />
      <div className="flex-1 overflow-y-auto vv-scrollbar-none px-4 py-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Bell size={28} className="text-[var(--color-text-muted)]" />
            <p className="text-sm font-medium text-[var(--color-text)]">Nenhum aviso ainda</p>
            <p className="max-w-[260px] text-xs text-[var(--color-text-muted)]">
              Você será avisado quando o caminhão estiver se aproximando do ponto que você está
              acompanhando.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {notifications.map((n) => {
              const Icon = iconByKind[n.kind] ?? Info;
              return (
                <Card key={n.id} className="flex items-start gap-3 p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{n.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{n.body}</p>
                    <p className="mt-1 text-[10.5px] text-[var(--color-text-muted)]">{timeAgo(n.createdAt)}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
