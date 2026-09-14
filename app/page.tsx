"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { collectionPoints } from "@/lib/mock";
import { distanceMeters } from "@/lib/geo/measure";
import { useUserLocation } from "@/lib/geolocation/useUserLocation";
import { HomeHeader } from "@/components/home/HomeHeader";
import { NextCollectionCard } from "@/components/home/NextCollectionCard";
import { HomeMapPreview } from "@/components/home/HomeMapPreview";
import { QuickActionsGrid } from "@/components/home/QuickActionsGrid";
import { OnboardingOverlay } from "@/components/onboarding/OnboardingOverlay";

const ONBOARDING_KEY = "vv-onboarded-v1";

function hasSeenOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  return Boolean(window.localStorage.getItem(ONBOARDING_KEY));
}

export default function HomePage() {
  const { position, requestLocation } = useUserLocation();
  const [onboarded, setOnboarded] = useState(hasSeenOnboarding);

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
    <div className="relative flex h-full flex-col">
      <div className="h-full overflow-y-auto vv-scrollbar-none">
        <HomeHeader />
        <div className="flex flex-col gap-5 px-4 pb-8 pt-3">
          <NextCollectionCard point={nearestPoint} />
          <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-[var(--color-surface-muted)]" />}>
            <HomeMapPreview
              userPosition={position}
              points={collectionPoints}
              highlightedPointId={nearestPoint.id}
            />
          </Suspense>
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
      </div>

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
