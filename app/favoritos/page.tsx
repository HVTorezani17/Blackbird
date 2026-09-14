"use client";

import { Suspense } from "react";
import { Star, MapPin, Trash2 } from "lucide-react";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { usePointSheet } from "@/lib/navigation/usePointSheet";

function FavoritosContent() {
  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const { openPoint } = usePointSheet();

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Favoritos" subtitle={`${favorites.length} salvos`} />
      <div className="flex-1 overflow-y-auto vv-scrollbar-none px-4 py-4">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Star size={28} className="text-[var(--color-text-muted)]" />
            <p className="text-sm font-medium text-[var(--color-text)]">Nenhum favorito ainda</p>
            <p className="max-w-[240px] text-xs text-[var(--color-text-muted)]">
              Toque na estrela em um ponto de coleta para salvá-lo aqui, como sua casa ou trabalho.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {favorites.map((fav) => (
              <Card key={fav.id} className="flex items-center gap-3 p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-dark)]">
                  <MapPin size={16} />
                </span>
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => fav.type === "ponto" && openPoint(fav.refId)}
                >
                  <p className="truncate text-sm font-medium text-[var(--color-text)]">{fav.label}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">Ponto de coleta</p>
                </button>
                <button
                  onClick={() => toggleFavorite({ type: fav.type, refId: fav.refId, label: fav.label })}
                  aria-label="Remover favorito"
                  className="rounded-full p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
                >
                  <Trash2 size={16} />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FavoritosPage() {
  return (
    <Suspense fallback={null}>
      <FavoritosContent />
    </Suspense>
  );
}
