"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Controla a exibição do bottom sheet de detalhes de um ponto de coleta via
 * query string (?ponto=<id>), para que o sheet possa ser aberto a partir de
 * qualquer tela (mapa da Home, lista de favoritos, etc.) mantendo a URL
 * navegável/compartilhável.
 */
export function usePointSheet() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openPoint = useCallback(
    (pointId: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("ponto", pointId);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const closePoint = useCallback(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete("ponto");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  const selectedPointId = searchParams.get("ponto");

  return { openPoint, closePoint, selectedPointId };
}
