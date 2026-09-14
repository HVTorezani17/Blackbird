"use client";

import { useEffect, useRef } from "react";
import { LngLatBounds } from "maplibre-gl";
import { useMap } from "@/components/map/MapProvider";
import { GeoPoint, CollectionPoint } from "@/lib/types";
import { VILA_VELHA_CENTER } from "@/lib/mapConfig";
import { distanceMeters } from "@/lib/geo/measure";

const SERVICE_AREA_RADIUS_M = 20000;
const VILA_VELHA_POINT: GeoPoint = { lat: VILA_VELHA_CENTER[1], lng: VILA_VELHA_CENTER[0] };

/**
 * Centraliza o mapa na localização do usuário ao abrir o app — a menos que
 * ele esteja fora da área de serviço coberta pelos dados desta
 * demonstração (Vila Velha), caso em que mostramos a área de serviço
 * inteira em vez de um mapa vazio longe de qualquer ponto de coleta.
 */
export function FitHome({
  userPosition,
  points,
}: {
  userPosition: GeoPoint | null;
  points: CollectionPoint[];
}) {
  const { map } = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (!map || done.current) return;

    if (userPosition && distanceMeters(userPosition, VILA_VELHA_POINT) <= SERVICE_AREA_RADIUS_M) {
      map.jumpTo({ center: [userPosition.lng, userPosition.lat], zoom: 15 });
      done.current = true;
      return;
    }

    if (userPosition) {
      // Usuário fora da área de serviço: mostra a área de serviço inteira
      // em vez de centralizar num mapa sem nenhum ponto de coleta visível.
      const coords: [number, number][] = points.map((p) => [p.location.lng, p.location.lat]);
      if (coords.length > 0) {
        const bounds = coords.reduce((b, c) => b.extend(c), new LngLatBounds(coords[0], coords[0]));
        map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 0 });
        done.current = true;
      }
    }
  }, [map, userPosition, points]);

  return null;
}
