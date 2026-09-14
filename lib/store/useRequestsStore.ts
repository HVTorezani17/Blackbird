"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CollectionRequest, GeoPoint } from "@/lib/types";

interface CreateRequestInput {
  wasteTypeId: string;
  quantityDescription: string;
  photoDataUrl?: string;
  address: string;
  location: GeoPoint | null;
}

interface RequestsState {
  requests: CollectionRequest[];
  createRequest: (input: CreateRequestInput) => CollectionRequest;
  getRequest: (id: string) => CollectionRequest | undefined;
}

function generateProtocol(): string {
  const year = new Date().getFullYear();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `VV-${year}-${n}`;
}

// Progressão de status SIMULADA para fins de demonstração do fluxo de
// acompanhamento (Seção 22). Uma integração real substituiria isto por
// atualizações vindas do sistema de gestão de solicitações da Prefeitura.
const DEMO_PROGRESSION: { status: CollectionRequest["status"]; afterMs: number }[] = [
  { status: "agendada", afterMs: 8000 },
  { status: "a_caminho", afterMs: 20000 },
  { status: "concluida", afterMs: 34000 },
];

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set, get) => ({
      requests: [],

      createRequest: (input) => {
        const now = Date.now();
        const request: CollectionRequest = {
          id: `req-${now}`,
          protocol: generateProtocol(),
          wasteTypeId: input.wasteTypeId,
          quantityDescription: input.quantityDescription,
          photoDataUrl: input.photoDataUrl,
          address: input.address,
          location: input.location,
          status: "recebida",
          createdAt: now,
          updatedAt: now,
        };
        set({ requests: [request, ...get().requests] });

        if (typeof window !== "undefined") {
          DEMO_PROGRESSION.forEach(({ status, afterMs }) => {
            setTimeout(() => {
              set((s) => ({
                requests: s.requests.map((r) =>
                  r.id === request.id ? { ...r, status, updatedAt: Date.now() } : r,
                ),
              }));
            }, afterMs);
          });
        }

        return request;
      },

      getRequest: (id) => get().requests.find((r) => r.id === id),
    }),
    { name: "vv-requests-v1" },
  ),
);
