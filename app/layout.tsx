import type { Metadata, Viewport } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import { SimulationProvider } from "@/components/providers/SimulationProvider";
import { BottomNav } from "@/components/layout/BottomNav";
import { PointSheetHost } from "@/components/point/PointSheetHost";

export const metadata: Metadata = {
  title: "Coleta VV — Vila Velha",
  description:
    "Protótipo: saiba quando o caminhão de lixo passa e acompanhe em tempo real onde ele está, em Vila Velha, ES.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f9d6e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full antialiased">
        <SimulationProvider>
          <div className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-[var(--color-bg)] sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-[2rem] sm:border sm:border-[var(--color-border)] sm:shadow-2xl">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
            <BottomNav />
          </div>
          <PointSheetHost />
        </SimulationProvider>
      </body>
    </html>
  );
}
