import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MediaType } from "@/lib/tmdb/types";

export type WatchlistItem = {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  year: string;
  rating: number;
  addedAt: number;
  watched: boolean;
  watchedAt?: number;
};

type WatchlistState = {
  items: WatchlistItem[];
  has: (mediaType: MediaType, id: number) => boolean;
  add: (item: WatchlistItem) => void;
  remove: (mediaType: MediaType, id: number) => void;
  toggleWatched: (mediaType: MediaType, id: number) => void;
  clear: () => void;
};

function keyOf(mediaType: MediaType, id: number) {
  return `${mediaType}:${id}`;
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (mediaType, id) =>
        get().items.some(
          (item) => keyOf(item.mediaType, item.id) === keyOf(mediaType, id),
        ),
      add: (item) => {
        if (get().has(item.mediaType, item.id)) return;
        set({
          items: [{ ...item, addedAt: Date.now() }, ...get().items],
        });
      },
      remove: (mediaType, id) => {
        set({
          items: get().items.filter(
            (item) => keyOf(item.mediaType, item.id) !== keyOf(mediaType, id),
          ),
        });
      },
      toggleWatched: (mediaType, id) => {
        set({
          items: get().items.map((item) =>
            keyOf(item.mediaType, item.id) === keyOf(mediaType, id)
              ? {
                  ...item,
                  watched: !item.watched,
                  watchedAt: !item.watched ? Date.now() : undefined,
                }
              : item,
          ),
        });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "noir-watchlist" },
  ),
);