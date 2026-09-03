import type { MediaType } from "./types";

export type CatalogCategory =
  | "popular"
  | "top_rated"
  | "now_playing"
  | "upcoming"
  | "on_the_air"
  | "airing_today"
  | "trending"
  | "discover";

type CatalogDef = {
  title: string;
  path: string;
};

export const CATALOGS: Record<MediaType, Partial<Record<CatalogCategory, CatalogDef>>> = {
  movie: {
    popular: { title: "Películas populares", path: "movie/popular" },
    top_rated: { title: "Mejor valoradas", path: "movie/top_rated" },
    now_playing: { title: "En cartelera", path: "movie/now_playing" },
    upcoming: { title: "Próximos estrenos", path: "movie/upcoming" },
    trending: { title: "Tendencias en cine", path: "trending/movie/week" },
    discover: { title: "Explorar cine", path: "discover/movie" },
  },
  tv: {
    popular: { title: "Series populares", path: "tv/popular" },
    top_rated: { title: "Series mejor valoradas", path: "tv/top_rated" },
    on_the_air: { title: "Al aire ahora", path: "tv/on_the_air" },
    airing_today: { title: "Hoy en emisión", path: "tv/airing_today" },
    trending: { title: "Tendencias en series", path: "trending/tv/week" },
    discover: { title: "Explorar series", path: "discover/tv" },
  },
};

export function catalogDef(media: MediaType, category: string): CatalogDef | null {
  const table = CATALOGS[media];
  if (!table) return null;
  return table[category as CatalogCategory] ?? null;
}

export const YEAR_OPTIONS = Array.from({ length: 80 }, (_, i) => String(new Date().getFullYear() - i));
