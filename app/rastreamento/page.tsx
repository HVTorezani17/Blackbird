"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TrackingScreen } from "@/components/tracking/TrackingScreen";

function TrackingPageInner() {
  const searchParams = useSearchParams();
  return (
    <TrackingScreen
      truckId={searchParams.get("truckId")}
      pointId={searchParams.get("pointId")}
    />
  );
}

export default function RastreamentoPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center text-sm text-[var(--color-text-muted)]">Carregando…</div>}>
      <TrackingPageInner />
    </Suspense>
  );
}
