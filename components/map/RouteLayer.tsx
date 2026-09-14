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

export function RouteLayer({ traveled, remaining, full }: Props) {
  const { map, loaded } = useMap();

  useEffect(() => {
    if (!map || !loaded) return;

    if (!map.getSource(SOURCE_TRAVELED)) {
      map.addSource(SOURCE_TRAVELED, { type: "geojson", data: EMPTY });
      map.addLayer({
        id: SOURCE_TRAVELED,
        type: "line",
        source: SOURCE_TRAVELED,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#94a3b8",
          "line-width": 4,
          "line-opacity": 0.55,
          "line-dasharray": [0.2, 1.6],
        },
      });
    }

    if (!map.getSource(SOURCE_REMAINING)) {
      map.addSource(SOURCE_REMAINING, { type: "geojson", data: EMPTY });
      map.addLayer({
        id: SOURCE_REMAINING,
        type: "line",
        source: SOURCE_REMAINING,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#0f9d6e",
          "line-width": 5,
          "line-opacity": 0.95,
        },
      });
    }

    return () => {
      if (map.getLayer(SOURCE_REMAINING)) map.removeLayer(SOURCE_REMAINING);
      if (map.getSource(SOURCE_REMAINING)) map.removeSource(SOURCE_REMAINING);
      if (map.getLayer(SOURCE_TRAVELED)) map.removeLayer(SOURCE_TRAVELED);
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
