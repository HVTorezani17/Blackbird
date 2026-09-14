"use client";

import { Locate, Truck as TruckIcon } from "lucide-react";

export function TrackingMapControls({
  onCenterTruck,
  onCenterMe,
  hasUserLocation,
}: {
  onCenterTruck: () => void;
  onCenterMe: () => void;
  hasUserLocation: boolean;
}) {
  return (
    <div className="absolute bottom-[172px] right-4 z-30 flex flex-col gap-2.5">
      <button
        onClick={onCenterMe}
        disabled={!hasUserLocation}
        aria-label="Minha localização"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--color-text)] shadow-md transition-transform active:scale-95 disabled:opacity-40"
      >
        <Locate size={19} />
      </button>
      <button
        onClick={onCenterTruck}
        aria-label="Centralizar no caminhão"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--color-text)] shadow-md transition-transform active:scale-95"
      >
        <TruckIcon size={19} />
      </button>
    </div>
  );
}
