"use client";

import { Locate, Truck as TruckIcon } from "lucide-react";
import clsx from "clsx";

export function TrackingMapControls({
  following,
  onCenterTruck,
  onCenterMe,
  hasUserLocation,
}: {
  following: boolean;
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
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[var(--color-text)] shadow-md disabled:opacity-40"
      >
        <Locate size={19} />
      </button>
      <button
        onClick={onCenterTruck}
        aria-label="Centralizar no caminhão"
        className={clsx(
          "flex h-11 w-11 items-center justify-center rounded-full shadow-md transition-colors",
          following ? "bg-[var(--color-brand)] text-white" : "bg-white text-[var(--color-text)]",
        )}
      >
        <TruckIcon size={19} />
      </button>
    </div>
  );
}
