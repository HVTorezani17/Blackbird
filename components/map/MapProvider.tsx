"use client";

import { Map as MaplibreMap, NavigationControl } from "maplibre-gl";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { getMapStyleUrl, VILA_VELHA_CENTER, VILA_VELHA_DEFAULT_ZOOM } from "@/lib/mapConfig";

interface MapContextValue {
  map: MaplibreMap | null;
  loaded: boolean;
}

const MapContext = createContext<MapContextValue>({ map: null, loaded: false });

export function useMap() {
  return useContext(MapContext);
}

interface MapProviderProps {
  children?: ReactNode;
  className?: string;
  center?: [number, number];
  zoom?: number;
  /** Se true, esconde os controles nativos de navegação (usamos controles próprios). */
  hideNativeControls?: boolean;
}

export function MapProvider({
  children,
  className,
  center = VILA_VELHA_CENTER,
  zoom = VILA_VELHA_DEFAULT_ZOOM,
  hideNativeControls = false,
}: MapProviderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<MaplibreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MaplibreMap({
      container: containerRef.current,
      style: getMapStyleUrl(),
      center,
      zoom,
      attributionControl: { compact: true },
    });

    if (!hideNativeControls) {
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    }

    map.on("load", () => {
      setLoaded(true);
    });

    // Se o estilo/tiles falharem (ex.: sem internet no momento), a UI não
    // deve travar: os controles e marcadores continuam funcionando sobre um
    // mapa "em branco" — apenas os tiles visuais ficam ausentes.
    map.on("error", (e) => {
      console.warn("[MapProvider] Erro ao carregar recurso do mapa:", e?.error?.message ?? e);
    });

    mapRef.current = map;
    setMapInstance(map);

    return () => {
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
      setLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <MapContext.Provider value={{ map: mapInstance, loaded }}>
        {mapInstance ? children : null}
      </MapContext.Provider>
    </div>
  );
}
