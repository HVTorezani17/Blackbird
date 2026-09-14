"use client";

import { Suspense, useEffect, useRef } from "react";
import { LngLatBounds } from "maplibre-gl";
import { collectionPoints } from "@/lib/mock";
import { useUserLocation } from "@/lib/geolocation/useUserLocation";
import { usePointSheet } from "@/lib/navigation/usePointSheet";
import { MapProvider, useMap } from "@/components/map/MapProvider";
import { UserLocationMarker } from "@/components/map/UserLocationMarker";
import { CollectionPointMarkers } from "@/components/map/CollectionPointMarkers";
import { PageHeader } from "@/components/layout/PageHeader";

function FitAll() {
  const { map } = useMap();
  const done = useRef(false);
  useEffect(() => {
    if (!map || done.current) return;
    const coords: [number, number][] = collectionPoints.map((p) => [p.location.lng, p.location.lat]);
    const bounds = coords.reduce((b, c) => b.extend(c), new LngLatBounds(coords[0], coords[0]));
    map.fitBounds(bounds, { padding: 60, maxZoom: 14.5, duration: 0 });
    done.current = true;
  }, [map]);
  return null;
}

function MapaContent() {
  const { position, requestLocation } = useUserLocation();
  const { openPoint, selectedPointId } = usePointSheet();

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Mapa de coleta" subtitle={`${collectionPoints.length} pontos em Vila Velha`} />
      <div className="relative flex-1">
        <MapProvider className="absolute inset-0 h-full w-full">
          <FitAll />
          <UserLocationMarker position={position} />
          <CollectionPointMarkers
            points={collectionPoints}
            selectedPointId={selectedPointId ?? undefined}
            onSelect={openPoint}
          />
        </MapProvider>
      </div>
    </div>
  );
}

export default function MapaPage() {
  return (
    <Suspense fallback={null}>
      <MapaContent />
    </Suspense>
  );
}
