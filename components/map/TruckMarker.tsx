"use client";

import { Marker } from "maplibre-gl";
import { useEffect, useRef } from "react";
import { useMap } from "./MapProvider";
import { GeoPoint } from "@/lib/types";

const TRUCK_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
    <circle cx="7.5" cy="17.5" r="1.8" />
    <circle cx="17.5" cy="17.5" r="1.8" />
  </svg>
`;

function buildElement(): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "vv-truck-marker";
  el.innerHTML = `<span class="vv-truck-marker__badge">${TRUCK_ICON_SVG}</span>`;
  return el;
}

interface Props {
  position: GeoPoint | null;
  headingDeg?: number;
  label?: string;
}

export function TruckMarker({ position, headingDeg = 0, label }: Props) {
  const { map } = useMap();
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!map || !position) return;

    if (!markerRef.current) {
      markerRef.current = new Marker({ element: buildElement(), anchor: "center" })
        .setLngLat([position.lng, position.lat])
        .addTo(map);
    } else {
      markerRef.current.setLngLat([position.lng, position.lat]);
    }

    const badge = markerRef.current.getElement().querySelector<HTMLElement>(".vv-truck-marker__badge");
    if (badge) {
      badge.style.transform = `rotate(${headingDeg}deg)`;
    }
    if (label) {
      markerRef.current.getElement().setAttribute("aria-label", label);
    }
  }, [map, position, headingDeg, label]);

  useEffect(() => {
    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
    };
  }, []);

  return null;
}
