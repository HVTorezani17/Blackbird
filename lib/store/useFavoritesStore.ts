"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Favorite } from "@/lib/types";

interface FavoritesState {
  favorites: Favorite[];
  homeAddressLabel: string | null;
  toggleFavorite: (fav: { type: Favorite["type"]; refId: string; label: string }) => void;
  isFavorite: (type: Favorite["type"], refId: string) => boolean;
  setHomeAddressLabel: (label: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      homeAddressLabel: null,

      toggleFavorite: (fav) => {
        const existing = get().favorites.find((f) => f.type === fav.type && f.refId === fav.refId);
        if (existing) {
          set({ favorites: get().favorites.filter((f) => f.id !== existing.id) });
        } else {
          const favorite: Favorite = {
            id: `${fav.type}-${fav.refId}-${Date.now()}`,
            type: fav.type,
            refId: fav.refId,
            label: fav.label,
            createdAt: Date.now(),
          };
          set({ favorites: [favorite, ...get().favorites] });
        }
      },

      isFavorite: (type, refId) => get().favorites.some((f) => f.type === type && f.refId === refId),

      setHomeAddressLabel: (label) => set({ homeAddressLabel: label }),
    }),
    { name: "vv-favorites-v1" },
  ),
);
