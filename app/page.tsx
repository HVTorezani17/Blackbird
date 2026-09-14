"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collectionPoints } from "@/lib/mock";
import { distanceMeters } from "@/lib/geo/measure";
import { useUserLocation } from "@/lib/geolocation/useUserLocation";
import { usePointSheet } from "@/lib/navigation/usePointSheet";
import { MapProvider } from "@/components/map/MapProvider";
import { UserLocationMarker } from "@/components/map/UserLocationMarker";
import { CollectionPointMarkers } from "@/components/map/CollectionPointMarkers";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeSummaryBar } from "@/components/home/HomeSummaryBar";
import { FitHome } from "@/components/home/FitHome";
import { NextCollectionCard } from "@/components/home/NextCollectionCard";
import { QuickActionsGrid } from "@/components/home/QuickActionsGrid";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";
import { Sheet } from "@/components/ui/Sheet";

const ONBOARDING_KEY = "vv-onboarded-v1";

function HomeContent() {
  const { position, requestLocation } = useUserLocation();
  const { openPoint, selectedPointId } = usePointSheet();
  // Começa como "true" (sem overlay) para bater com a renderização do
  // servidor, que não tem acesso ao localStorage — corrigido logo após a
  // montagem no client, evitando erro de hydration mismatch.
  const [onboarded, setOnboarded] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura de localStorage só existe no client; precisa rodar após a montagem para não divergir da renderização do servidor.
    setOnboarded(Boolean(window.localStorage.getItem(ONBOARDING_KEY)));
  }, []);

  function finishOnboarding() {
    window.localStorage.setItem(ONBOARDING_KEY, "1");
    setOnboarded(true);
  }

  const nearestPoint = useMemo(() => {
    if (!position) return collectionPoints[0];
    return collectionPoints.reduce((best, p) =>
      distanceMeters(position, p.location) < distanceMeters(position, best.location) ? p : best,
    );
  }, [position]);

  return (
    <div className="relative h-full w-full">
      {/* A tela inicial é o mapa em tela cheia, focado na localização do
          usuário assim que disponível — os pontos de coleta próximos
          aparecem imediatamente, sem precisar navegar para outra tela. */}
      <MapProvider className="absolute inset-0 h-full w-full">
        <FitHome userPosition={position} points={collectionPoints} />
        <UserLocationMarker position={position} />
        <CollectionPointMarkers
          points={collectionPoints}
          selectedPointId={selectedPointId ?? undefined}
          onSelect={openPoint}
        />
      </MapProvider>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-bg)]/90 to-transparent pb-6">
        <div className="pointer-events-auto">
          <HomeHeader />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4">
        <HomeSummaryBar point={nearestPoint} onExpand={() => setDetailsOpen(true)} />
      </div>

      <Sheet open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Minha coleta">
        <div className="flex flex-col gap-5">
          <NextCollectionCard point={nearestPoint} />
          <QuickActionsGrid />
          <p className="px-1 text-center text-[10.5px] leading-relaxed text-[var(--color-text-muted)]">
            Protótipo para demonstração — pontos, rotas e caminhões são dados simulados. Horários e
            canais oficiais reais são indicados nas telas de horários e coleta especial.{" "}
            <Link href="/admin" className="underline">
              Painel de demonstração
            </Link>
            .
          </p>
        </div>
      </Sheet>

      {!onboarded && (
        <OnboardingOverlay
          onAllow={() => {
            requestLocation();
            finishOnboarding();
          }}
          onSkip={finishOnboarding}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
