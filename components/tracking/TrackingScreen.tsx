"use client";

import { useEffect, useRef, useState } from "react";
import { LngLatBounds } from "maplibre-gl";
import type { MapLibreEvent } from "maplibre-gl";
import {
  getRouteById,
  getPointById,
  getPointsByRouteId,
  getTruckById,
} from "@/lib/mock";
import {
  useTruckState,
  useTraveledRemaining,
  useEtaToPoint,
  useSimulationReady,
} from "@/lib/simulation/selectors";
import { useUserLocation } from "@/lib/geolocation/useUserLocation";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { useNotificationsStore } from "@/lib/store/useNotificationsStore";
import { formatDistance } from "@/lib/format";
import { MapProvider, useMap } from "@/components/map/MapProvider";
import { UserLocationMarker } from "@/components/map/UserLocationMarker";
import { CollectionPointMarkers } from "@/components/map/CollectionPointMarkers";
import { TruckMarker } from "@/components/map/TruckMarker";
import { RouteLayer } from "@/components/map/RouteLayer";
import { usePointSheet } from "@/lib/navigation/usePointSheet";
import { TrackingHeader } from "./TrackingHeader";
import { TrackingInfoPanel } from "./TrackingInfoPanel";
import { TrackingMapControls } from "./TrackingMapControls";

function InitialFit({
  truckPosition,
  pointPosition,
  userPosition,
}: {
  truckPosition: { lat: number; lng: number } | null;
  pointPosition: { lat: number; lng: number } | null;
  userPosition: { lat: number; lng: number } | null;
}) {
  const { map } = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (!map || done.current) return;
    const coords: [number, number][] = [];
    if (truckPosition) coords.push([truckPosition.lng, truckPosition.lat]);
    if (pointPosition) coords.push([pointPosition.lng, pointPosition.lat]);
    if (userPosition) coords.push([userPosition.lng, userPosition.lat]);
    if (coords.length === 0) return;

    if (coords.length === 1) {
      map.jumpTo({ center: coords[0], zoom: 15.5 });
    } else {
      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new LngLatBounds(coords[0], coords[0]),
      );
      map.fitBounds(bounds, {
        padding: { top: 120, bottom: 240, left: 56, right: 56 },
        maxZoom: 16,
        duration: 0,
      });
    }
    done.current = true;
  }, [map, truckPosition, pointPosition, userPosition]);

  return null;
}

function CameraFollow({
  truckPosition,
  following,
}: {
  truckPosition: { lat: number; lng: number } | null;
  following: boolean;
}) {
  const { map } = useMap();
  useEffect(() => {
    if (!map || !following || !truckPosition) return;
    map.easeTo({ center: [truckPosition.lng, truckPosition.lat], duration: 450 });
  }, [map, following, truckPosition]);
  return null;
}

function UserInteractionWatcher({ onUserInteract }: { onUserInteract: () => void }) {
  const { map } = useMap();
  useEffect(() => {
    if (!map) return;
    const handler = (e: MapLibreEvent) => {
      if ((e as MapLibreEvent & { originalEvent?: unknown }).originalEvent) onUserInteract();
    };
    map.on("dragstart", handler);
    map.on("zoomstart", handler);
    return () => {
      map.off("dragstart", handler);
      map.off("zoomstart", handler);
    };
  }, [map, onUserInteract]);
  return null;
}

function ControlsBridge({
  truckPosition,
  userPosition,
  following,
  setFollowing,
}: {
  truckPosition: { lat: number; lng: number } | null;
  userPosition: { lat: number; lng: number } | null;
  following: boolean;
  setFollowing: (v: boolean) => void;
}) {
  const { map } = useMap();
  return (
    <TrackingMapControls
      following={following}
      hasUserLocation={Boolean(userPosition)}
      onCenterTruck={() => {
        setFollowing(true);
        if (map && truckPosition) {
          map.flyTo({
            center: [truckPosition.lng, truckPosition.lat],
            zoom: Math.max(map.getZoom(), 15.5),
            duration: 600,
          });
        }
      }}
      onCenterMe={() => {
        if (map && userPosition) {
          map.flyTo({
            center: [userPosition.lng, userPosition.lat],
            zoom: Math.max(map.getZoom(), 15.5),
            duration: 600,
          });
        }
      }}
    />
  );
}

export function TrackingScreen({ truckId, pointId }: { truckId: string | null; pointId: string | null }) {
  const { openPoint } = usePointSheet();
  const { position: userPosition, requestLocation } = useUserLocation();
  const ready = useSimulationReady();

  const truck = truckId ? getTruckById(truckId) : undefined;
  const route = truck ? getRouteById(truck.routeId) : undefined;
  const point = pointId ? getPointById(pointId) : undefined;
  const routePoints = route ? getPointsByRouteId(route.id) : [];

  const truckState = useTruckState(truckId);
  const split = useTraveledRemaining(truckId);
  const eta = useEtaToPoint(truckId, pointId);

  const isFavorite = useFavoritesStore((s) => (point ? s.isFavorite("ponto", point.id) : false));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const pushNotification = useNotificationsStore((s) => s.push);

  const [following, setFollowing] = useState(true);

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastNotifKind = useRef<string | null>(null);
  useEffect(() => {
    if (!eta || !point) return;
    let kind: string | null = null;
    if (!eta.alreadyPassed && eta.distanceM <= 300 && eta.distanceM > 35) kind = "aproximando";
    else if (!eta.alreadyPassed && truckState?.status === "no_ponto" && truckState.nextPointId === point.id)
      kind = "chegando";

    if (kind && kind !== lastNotifKind.current) {
      lastNotifKind.current = kind;
      if (kind === "aproximando") {
        pushNotification({
          title: "Caminhão se aproximando",
          body: `O caminhão está a ${formatDistance(eta.distanceM)} do ponto ${point.name}.`,
          kind: "aproximando",
        });
      } else {
        pushNotification({
          title: "Coleta no seu ponto",
          body: `O caminhão chegou ao ${point.name}. A coleta está sendo realizada agora.`,
          kind: "chegando",
        });
      }
    }
    if (eta.alreadyPassed) lastNotifKind.current = null;
  }, [eta, truckState, point, pushNotification]);

  if (!truck || !route) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm font-medium text-[var(--color-text)]">Caminhão não encontrado</p>
        <p className="text-xs text-[var(--color-text-muted)]">
          Volte para a tela inicial e selecione um ponto de coleta para acompanhar o caminhão.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapProvider className="absolute inset-0 h-full w-full" hideNativeControls>
        <InitialFit
          truckPosition={truckState?.position ?? null}
          pointPosition={point?.location ?? null}
          userPosition={userPosition}
        />
        <CameraFollow truckPosition={truckState?.position ?? null} following={following} />
        <UserInteractionWatcher onUserInteract={() => setFollowing(false)} />

        <RouteLayer traveled={split?.traveled} remaining={split?.remaining} />
        <CollectionPointMarkers points={routePoints} selectedPointId={pointId ?? undefined} onSelect={openPoint} />
        <UserLocationMarker position={userPosition} />
        <TruckMarker
          position={truckState?.position ?? null}
          headingDeg={truckState?.headingDeg}
          label={truck.name}
        />

        <TrackingHeader truck={truck} route={route} truckState={truckState} />
        <ControlsBridge
          truckPosition={truckState?.position ?? null}
          userPosition={userPosition}
          following={following}
          setFollowing={setFollowing}
        />
      </MapProvider>

      {!ready && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-[var(--color-bg)]">
          <p className="text-sm text-[var(--color-text-muted)]">Carregando rota e posição do caminhão…</p>
        </div>
      )}

      <TrackingInfoPanel
        point={point}
        truckState={truckState}
        eta={eta}
        isFavorite={isFavorite}
        onToggleFavorite={() => point && toggleFavorite({ type: "ponto", refId: point.id, label: point.name })}
      />
    </div>
  );
}
