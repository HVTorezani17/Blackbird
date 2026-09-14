"use client";

import { useCallback, useEffect, useState } from "react";
import { GeoPoint } from "@/lib/types";
import { VILA_VELHA_CENTER } from "@/lib/mapConfig";

export type LocationPermissionState =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unavailable";

interface UserLocationState {
  position: GeoPoint | null;
  permission: LocationPermissionState;
  error: string | null;
}

// Centro de Vila Velha — usado como posição de referência caso o usuário
// negue a permissão de localização, para que o app continue funcionável.
const FALLBACK_POSITION: GeoPoint = { lat: VILA_VELHA_CENTER[1], lng: VILA_VELHA_CENTER[0] };

export function useUserLocation() {
  const [state, setState] = useState<UserLocationState>({
    position: null,
    permission: "idle",
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setState({
        position: FALLBACK_POSITION,
        permission: "unavailable",
        error: "Geolocalização não é suportada neste dispositivo.",
      });
      return;
    }

    setState((s) => ({ ...s, permission: "requesting" }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          permission: "granted",
          error: null,
        });
      },
      (err) => {
        setState({
          position: FALLBACK_POSITION,
          permission: "denied",
          error: err.message,
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  }, []);

  useEffect(() => {
    if (state.permission !== "granted") return;
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState((s) => ({
          ...s,
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        }));
      },
      () => {
        // mantém a última posição conhecida em caso de erro pontual do sensor
      },
      { enableHighAccuracy: true, maximumAge: 30000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [state.permission]);

  return { ...state, requestLocation };
}
