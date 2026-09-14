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
import { RefreshCw, WifiOff } from "lucide-react";
import {
  getPrimaryMapStyle,
  getFallbackMapStyle,
  VILA_VELHA_CENTER,
  VILA_VELHA_DEFAULT_ZOOM,
} from "@/lib/mapConfig";

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

const TILE_TIMEOUT_MS = 7000;

type StyleAttempt = "primary" | "fallback";

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
  const [tileIssue, setTileIssue] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  // Tenta primeiro o estilo vetorial (mais bonito); se os tiles não
  // carregarem a tempo, troca automaticamente para o raster de fallback
  // sem exigir nenhuma ação do usuário. Só mostra o aviso manual se o
  // fallback também falhar.
  const [styleAttempt, setStyleAttempt] = useState<StyleAttempt>("primary");

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    setLoaded(false);
    setMapInstance(null);
    setTileIssue(false);

    const style = styleAttempt === "primary" ? getPrimaryMapStyle() : getFallbackMapStyle();

    const map = new MaplibreMap({
      container: containerRef.current,
      style,
      center,
      zoom,
      attributionControl: { compact: true },
    });

    if (!hideNativeControls) {
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    }

    let didLoad = false;

    map.on("load", () => {
      didLoad = true;
      setLoaded(true);
      setTileIssue(false);
    });

    // Se o estilo/tiles falharem (ex.: rede restrita, provedor exigindo
    // chave), a UI não deve travar: controles e marcadores continuam
    // funcionando sobre um mapa "em branco" — e avisamos visivelmente em
    // vez de deixar o mapa silenciosamente vazio.
    map.on("error", (e) => {
      console.warn("[MapProvider] Erro ao carregar recurso do mapa:", e?.error?.message ?? e);
    });

    const timeout = setTimeout(() => {
      if (didLoad) return;
      if (styleAttempt === "primary") {
        setStyleAttempt("fallback");
      } else {
        setTileIssue(true);
      }
    }, TILE_TIMEOUT_MS);

    mapRef.current = map;
    setMapInstance(map);

    return () => {
      clearTimeout(timeout);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryKey, styleAttempt]);

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <MapContext.Provider value={{ map: mapInstance, loaded }}>
        {mapInstance ? children : null}
      </MapContext.Provider>

      {tileIssue && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[var(--color-surface-muted)]/90 p-6">
          <div className="pointer-events-auto flex max-w-[260px] flex-col items-center gap-2 text-center">
            <WifiOff size={22} className="text-[var(--color-text-muted)]" />
            <p className="text-xs font-medium text-[var(--color-text)]">
              Não foi possível carregar os tiles do mapa
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Verifique a conexão com a internet. Marcadores e rota continuam funcionando.
            </p>
            <button
              onClick={() => {
                setStyleAttempt("primary");
                setRetryKey((k) => k + 1);
              }}
              className="mt-1 flex items-center gap-1.5 rounded-full bg-[var(--color-brand)] px-3 py-1.5 text-[11px] font-medium text-white"
            >
              <RefreshCw size={12} /> Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
