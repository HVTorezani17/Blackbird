"use client";

import { useEffect, useRef } from "react";
import { LngLatBounds } from "maplibre-gl";
import { Maximize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { MapProvider, useMap } from "@/components/map/MapProvider";
import { UserLocationMarker } from "@/components/map/UserLocationMarker";
import { CollectionPointMarkers } from "@/components/map/CollectionPointMarkers";
import { CollectionPoint, GeoPoint } from "@/lib/types";
import { usePointSheet } from "@/lib/navigation/usePointSheet";

function FitBounds({ userPosition, points }: { userPosition: GeoPoint | null; points: CollectionPoint[] }) {
  const { map } = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (!map || fitted.current) return;
    const coords: [number, number][] = points.map((p) => [p.location.lng, p.location.lat]);
    if (userPosition) coords.push([userPosition.lng, userPosition.lat]);
    if (coords.length === 0) return;

    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new LngLatBounds(coords[0], coords[0]),
    );
    map.fitBounds(bounds, { padding: 48, maxZoom: 15, duration: 0 });
    fitted.current = true;
  }, [map, userPosition, points]);

  return null;
}

export function HomeMapPreview({
  userPosition,
  points,
  highlightedPointId,
}: {
  userPosition: GeoPoint | null;
  points: CollectionPoint[];
  highlightedPointId?: string;
}) {
  const router = useRouter();
  const { openPoint } = usePointSheet();

  return (
    <div className="relative h-48 overflow-hidden rounded-2xl border border-[var(--color-border)]">
      <MapProvider className="h-full w-full" hideNativeControls>
        <FitBounds userPosition={userPosition} points={points} />
        <UserLocationMarker position={userPosition} />
        <CollectionPointMarkers points={points} selectedPointId={highlightedPointId} onSelect={openPoint} />
      </MapProvider>
      <button
        onClick={() => router.push("/mapa")}
        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-[var(--color-text)] shadow-md backdrop-blur"
      >
        <Maximize2 size={13} /> Ver mapa
      </button>
    </div>
  );
}
