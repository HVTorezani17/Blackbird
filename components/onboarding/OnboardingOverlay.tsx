"use client";

import { MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function OnboardingOverlay({
  onAllow,
  onSkip,
}: {
  onAllow: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="absolute inset-0 z-[60] flex flex-col justify-end bg-gradient-to-b from-black/10 via-black/30 to-black/60 p-5">
      <div className="rounded-3xl bg-[var(--color-surface)] p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand)] text-white">
          <Truck size={26} />
        </div>
        <h1 className="mt-4 text-lg font-bold text-[var(--color-text)]">Bem-vindo(a) ao Coleta VV</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
          Permita sua localização para encontrar os pontos de coleta e acompanhar o caminhão mais
          próximo de você, em Vila Velha.
        </p>
        <Button fullWidth size="lg" className="mt-5" onClick={onAllow}>
          <MapPin size={18} /> Permitir localização
        </Button>
        <button
          onClick={onSkip}
          className="mt-3 text-xs font-medium text-[var(--color-text-muted)] underline underline-offset-2"
        >
          Continuar sem permitir agora
        </button>
        <p className="mt-4 text-[10.5px] leading-relaxed text-[var(--color-text-muted)]">
          Sua localização é usada apenas para centralizar o mapa e calcular distâncias. Este é um
          protótipo com dados simulados para demonstração.
        </p>
      </div>
    </div>
  );
}
