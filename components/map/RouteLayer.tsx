"use client";

import { useEffect } from "react";
import { useMap } from "./MapProvider";
import { GeoPoint } from "@/lib/types";
import type { FeatureCollection, LineString } from "geojson";
import type { GeoJSONSource } from "maplibre-gl";

function toLine(points: GeoPoint[]): FeatureCollection<LineString> {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: points.map((p) => [p.lng, p.lat]),
        },
      },
    ],
  };
}

const EMPTY: FeatureCollection<LineString> = { type: "FeatureCollection", features: [] };

interface Props {
  /** Trecho já percorrido pelo caminhão (desenhado com menor destaque). */
  traveled?: GeoPoint[];
  /** Trecho restante até o destino (desenhado com cor de destaque). */
  remaining?: GeoPoint[];
  /** Usado quando não há distinção percorrido/restante (ex.: pré-visualização). */
  full?: GeoPoint[];
}

const SOURCE_TRAVELED = "vv-route-traveled";
const SOURCE_REMAINING = "vv-route-remaining";
const CASING_TRAVELED = "vv-route-traveled-casing";
const CASING_REMAINING = "vv-route-remaining-casing";

export function RouteLayer({ traveled, remaining, full }: Props) {
  const { map, loaded } = useMap();

  useEffect(() => {
    if (!map || !loaded) return;

    // Camada de "contorno" (casing) mais larga e clara, desenhada ANTES da
    // linha colorida, para garantir contraste visível sobre qualquer
    // basemap (claro, escuro, ou tiles ausentes/com marca d'água).
    if (!map.getSource(SOURCE_TRAVELED)) {
      map.addSource(SOURCE_TRAVELED, { type: "geojson", data: EMPTY });
      map.addLayer({
        id: CASING_TRAVELED,
        type: "line",
        source: SOURCE_TRAVELED,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ffffff", "line-width": 7, "line-opacity": 0.9 },
      });
      map.addLayer({
        id: SOURCE_TRAVELED,
        type: "line",
        source: SOURCE_TRAVELED,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#94a3b8",
          "line-width": 4,
          "line-opacity": 0.8,
          "line-dasharray": [0.2, 1.6],
        },
      });
    }

    if (!map.getSource(SOURCE_REMAINING)) {
      map.addSource(SOURCE_REMAINING, { type: "geojson", data: EMPTY });
      map.addLayer({
        id: CASING_REMAINING,
        type: "line",
        source: SOURCE_REMAINING,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ffffff", "line-width": 9, "line-opacity": 0.95 },
      });
      map.addLayer({
        id: SOURCE_REMAINING,
        type: "line",
        source: SOURCE_REMAINING,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#0f9d6e",
          "line-width": 6,
          "line-opacity": 1,
        },
      });
    }

    return () => {
      for (const id of [SOURCE_REMAINING, CASING_REMAINING, SOURCE_TRAVELED, CASING_TRAVELED]) {
        if (map.getLayer(id)) map.removeLayer(id);
      }
      if (map.getSource(SOURCE_REMAINING)) map.removeSource(SOURCE_REMAINING);
      if (map.getSource(SOURCE_TRAVELED)) map.removeSource(SOURCE_TRAVELED);
    };
  }, [map, loaded]);

  useEffect(() => {
    if (!map || !loaded) return;
    const traveledSource = map.getSource(SOURCE_TRAVELED) as GeoJSONSource | undefined;
    const remainingSource = map.getSource(SOURCE_REMAINING) as GeoJSONSource | undefined;

    if (full) {
      traveledSource?.setData(EMPTY);
      remainingSource?.setData(toLine(full));
      return;
    }

    traveledSource?.setData(traveled && traveled.length > 1 ? toLine(traveled) : EMPTY);
    remainingSource?.setData(remaining && remaining.length > 1 ? toLine(remaining) : EMPTY);
  }, [map, loaded, traveled, remaining, full]);

  return null;
}
