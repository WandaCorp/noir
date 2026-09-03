import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MediaType } from "@/lib/tmdb/types";

export type FavoriteItem = {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  year: string;
  rating: number;
};

type FavoritesState = {
  items: FavoriteItem[];
  has: (mediaType: MediaType, id: number) => boolean;
  toggle: (item: FavoriteItem) => "added" | "removed";
  clear: () => void;
};

function keyOf(mediaType: MediaType, id: number) {
  return `${mediaType}:${id}`;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (mediaType, id) => get().items.some((item) => keyOf(item.mediaType, item.id) === keyOf(mediaType, id)),
      toggle: (item) => {
        const exists = get().has(item.mediaType, item.id);
        set({
          items: exists
            ? get().items.filter((entry) => keyOf(entry.mediaType, entry.id) !== keyOf(item.mediaType, item.id))
            : [item, ...get().items],
        });
        return exists ? "removed" : "added";
      },
      clear: () => set({ items: [] }),
    }),
    { name: "noir-favorites" },
  ),
);
