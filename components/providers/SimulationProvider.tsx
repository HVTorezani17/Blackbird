"use client";

import { useEffect, useRef } from "react";
import { useSimulationStore } from "@/lib/simulation/store";

/**
 * Mantém o "GPS simulado" dos caminhões rodando em segundo plano,
 * independente de qual tela está sendo exibida — assim, ao navegar para a
 * tela de rastreamento, o caminhão já está em movimento (como um GPS real
 * continuaria emitindo posições mesmo sem ninguém olhando o mapa).
 */
export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const init = useSimulationStore((s) => s.init);
  const tick = useSimulationStore((s) => s.tick);
  const frameRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    function loop(t: number) {
      if (lastRef.current !== null) {
        const dt = Math.min(0.25, (t - lastRef.current) / 1000);
        tick(dt, Date.now());
      }
      lastRef.current = t;
      frameRef.current = requestAnimationFrame(loop);
    }
    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [tick]);

  return <>{children}</>;
}
