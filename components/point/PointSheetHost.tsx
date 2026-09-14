"use client";

import { Suspense } from "react";
import { getPointById } from "@/lib/mock";
import { usePointSheet } from "@/lib/navigation/usePointSheet";
import { PointDetailSheet } from "./PointDetailSheet";

function PointSheetHostInner() {
  const { selectedPointId, closePoint } = usePointSheet();
  const point = selectedPointId ? getPointById(selectedPointId) : undefined;

  return <PointDetailSheet point={point ?? null} open={Boolean(point)} onClose={closePoint} />;
}

export function PointSheetHost() {
  return (
    <Suspense fallback={null}>
      <PointSheetHostInner />
    </Suspense>
  );
}
