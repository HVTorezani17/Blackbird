"use client";

import { Marker } from "maplibre-gl";
import { useEffect, useRef } from "react";
import { useMap } from "./MapProvider";
import { CollectionPoint } from "@/lib/types";

const PIN_ICON_SVG = `
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
`;

function buildElement(): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "vv-pin";
  el.innerHTML = `<span class="vv-pin__body">${PIN_ICON_SVG}</span><span class="vv-pin__stem"></span>`;
  return el;
}

interface Props {
  points: CollectionPoint[];
  selectedPointId?: string | null;
  onSelect?: (pointId: string) => void;
}

export function CollectionPointMarkers({ points, selectedPointId, onSelect }: Props) {
  const { map } = useMap();
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    if (!map) return;

    const current = markersRef.current;
    const seen = new Set<string>();

    for (const point of points) {
      seen.add(point.id);
      let marker = current.get(point.id);
      if (!marker) {
        const el = buildElement();
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectRef.current?.(point.id);
        });
        marker = new Marker({ element: el, anchor: "bottom" })
          .setLngLat([point.location.lng, point.location.lat])
          .addTo(map);
        current.set(point.id, marker);
      }
    }

    for (const [id, marker] of current) {
      if (!seen.has(id)) {
        marker.remove();
        current.delete(id);
      }
    }
  }, [map, points]);

  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      const el = marker.getElement();
      el.classList.toggle("vv-pin--selected", id === selectedPointId);
    }
  }, [selectedPointId]);

  useEffect(() => {
    const markers = markersRef.current;
    return () => {
      markers.forEach((m) => m.remove());
      markers.clear();
    };
  }, []);

  return null;
}
