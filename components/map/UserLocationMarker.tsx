"use client";

import { Marker } from "maplibre-gl";
import { useEffect, useRef } from "react";
import { useMap } from "./MapProvider";
import { GeoPoint } from "@/lib/types";

function buildElement(): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "vv-user-marker";
  el.innerHTML = `
    <span class="vv-user-marker__pulse"></span>
    <span class="vv-user-marker__dot"></span>
  `;
  return el;
}

export function UserLocationMarker({ position }: { position: GeoPoint | null }) {
  const { map } = useMap();
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!map || !position) return;

    if (!markerRef.current) {
      markerRef.current = new Marker({ element: buildElement() })
        .setLngLat([position.lng, position.lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([position.lng, position.lat]);
    }

    return () => {
      // mantido entre re-renders; removido apenas no unmount do componente
    };
  }, [map, position]);

  useEffect(() => {
    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
    };
  }, []);

  return null;
}
