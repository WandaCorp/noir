import { createServerFn } from "@tanstack/react-start";
import { catalogDef } from "./catalogs";
import { tagMedia } from "./helpers";
import type {
  Genre,
  HomeFeed,
  MediaSummary,
  MediaType,
  MovieDetails,
  Paginated,
  TvDetails,
} from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const APPEND = "credits,videos,similar,recommendations,reviews,watch/providers";

type Query = Record<string, string | number | undefined>;

function assertPath(path: string) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/.test(path)) {
    throw new Error("Ruta de TMDb no válida");
  }
}

async function tmdbFetch<T>(path: string, query: Query = {}): Promise<T> {
  assertPath(path);
  const apiKey = "692a43c4c264e6dd28bff9f69c0fa8eb";
  const url = new URL(`${TMDB_BASE}/${path}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", "es-ES");
  url.searchParams.set("include_adult", "false");
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`No se pudo consultar TMDb (${res.status})`);
  }
  return (await res.json()) as T;
}

async function list(path: string, media: MediaType, query: Query = {}) {
  const data = await tmdbFetch<Paginated<MediaSummary>>(path, query);
  return { ...data, results: tagMedia(data.results ?? [], media) };
}

export const getHomeFeed = createServerFn({ method: "GET" }).handler(async (): Promise<HomeFeed> => {
  const settled = await Promise.allSettled([
    list("trending/all/week", "movie"),
    list("movie/popular", "movie"),
    list("movie/top_rated", "movie"),
    list("movie/now_playing", "movie", { region: "ES" }),
    list("movie/upcoming", "movie", { region: "ES" }),
    list("tv/popular", "tv"),
    list("tv/top_rated", "tv"),
    list("tv/on_the_air", "tv"),
    tmdbFetch<{ genres: Genre[] }>("genre/movie/list"),
    tmdbFetch<{ genres: Genre[] }>("genre/tv/list"),
  ]);

  const take = <T>(index: number, fallback: T): T => {
    const result = settled[index];
    return result && result.status === "fulfilled" ? (result.value as T) : fallback;
  };

  const emptyPage: Paginated<MediaSummary> = { page: 1, results: [], total_pages: 0, total_results: 0 };

  return {
    trending: take(0, emptyPage).results.filter((item) => item.media_type === "movie" || item.media_type === "tv"),
    popularMovies: take(1, emptyPage).results,
    topMovies: take(2, emptyPage).results,
    nowPlaying: take(3, emptyPage).results,
    upcoming: take(4, emptyPage).results,
    popularTv: take(5, emptyPage).results,
    topTv: take(6, emptyPage).results,
    onAir: take(7, emptyPage).results,
    movieGenres: take(8, { genres: [] as Genre[] }).genres,
    tvGenres: take(9, { genres: [] as Genre[] }).genres,
  };
});

export const tmdbList = createServerFn({ method: "GET" })
  .validator((data: { path: string; media: MediaType; query?: Query }) => {
    assertPath(data.path);
    if (data.media !== "movie" && data.media !== "tv") throw new Error("Tipo no válido");
    return data;
  })
  .handler(async ({ data }) => list(data.path, data.media, data.query));

export const tmdbSearch = createServerFn({ method: "GET" })
  .validator((data: { query: string; page?: number; media?: "movie" | "tv" | "multi" }) => {
    return {
      query: data.query.trim(),
      page: data.page ?? 1,
      media: data.media ?? "multi",
    };
  })
  .handler(async ({ data }) => {
    if (!data.query) {
      return { page: 1, results: [] as MediaSummary[], total_pages: 0, total_results: 0 };
    }
    const path = data.media === "movie" ? "search/movie" : data.media === "tv" ? "search/tv" : "search/multi";
    const fallback: MediaType = data.media === "tv" ? "tv" : "movie";
    const result = await tmdbFetch<Paginated<MediaSummary>>(path, { query: data.query, page: data.page });
    return {
      ...result,
      results: tagMedia(
        (result.results ?? []).filter((item) => item.media_type !== "person"),
        fallback,
      ),
    };
  });
  
export const tmdbSearchPerson = createServerFn({ method: "GET" })
  .validator((data: { query: string; page?: number }) => ({
    query: data.query.trim(),
    page: data.page ?? 1,
  }))
  .handler(async ({ data }) => {
    if (!data.query) {
      return { page: 1, results: [] as PersonDetails[], total_pages: 0, total_results: 0 };
    }
    return tmdbFetch<Paginated<PersonDetails>>("search/person", {
      query: data.query,
      page: data.page,
    });
  });

export const tmdbDiscover = createServerFn({ method: "GET" })
  .validator((data: { media: MediaType; page?: number; genre?: string; year?: string; sort?: string }) => data)
  .handler(async ({ data }) => {
    const path = data.media === "tv" ? "discover/tv" : "discover/movie";
    const query: Query = {
      page: data.page ?? 1,
      sort_by: data.sort || "popularity.desc",
      with_genres: data.genre || undefined,
      include_adult: "false",
    };
    if (data.year) {
      if (data.media === "tv") query.first_air_date_year = data.year;
      else query.primary_release_year = data.year;
    }
    return list(path, data.media, query);
  });

export const getMovieDetails = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return tmdbFetch<MovieDetails>(`movie/${data.id}`, { append_to_response: APPEND });
  });

export const getTvDetails = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return tmdbFetch<TvDetails>(`tv/${data.id}`, { append_to_response: APPEND });
  });
  
export const getPersonDetails = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return tmdbFetch<PersonDetails>(`person/${data.id}`, {
      append_to_response: "combined_credits,images",
    });
  });
  
export const getPopularCollections = createServerFn({ method: "GET" })
  .handler(async () => {
    // IDs de colecciones famosas (sagas conocidas)
    const famousCollectionIds = [
      10,    // Star Wars
      1241,  // Harry Potter
      131,   // Jurassic Park
      295,   // Pirates of the Caribbean
      2980,  // Matrix
      748,   // Spider-Man
      9485,  // X-Men
      10194, // The Fast and the Furious
      2254,  // The Lord of the Rings
      528,   // The Godfather
      860,   // Mission: Impossible
      873,   // Indiana Jones
      1570,  // Batman
      173710, // The Hunger Games
      293,   // Men in Black
      196,   // Alien
      308,   // Die Hard
      1575,  // Rocky
      1669,  // Terminator
    ];

    const collections: CollectionDetails[] = [];
    
    // Obtener detalles de cada colección famosa
    const results = await Promise.allSettled(
      famousCollectionIds.map((id) =>
        tmdbFetch<CollectionDetails>(`collection/${id}`, {
          language: "es-ES",
        })
      )
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        collections.push(result.value);
      }
    }

    return {
      page: 1,
      results: collections,
      total_pages: 1,
      total_results: collections.length,
    } as Paginated<CollectionDetails>;
  });
    
    // Filtramos las que tienen colección
    const withCollections = popular.results.filter((movie) => movie.belongs_to_collection);
    
    // Extraemos las colecciones únicas
    const collections: CollectionSummary[] = [];
    const seen = new Set<number>();
    
    for (const movie of withCollections) {
      const collection = movie.belongs_to_collection!;
      if (!seen.has(collection.id)) {
        seen.add(collection.id);
        collections.push({
          id: collection.id,
          name: collection.name,
          overview: "",
          poster_path: collection.poster_path,
          backdrop_path: collection.backdrop_path,
        });
      }
    }
    
    return {
      page: 1,
      results: collections,
      total_pages: 1,
      total_results: collections.length,
    } as Paginated<CollectionSummary>;
  });

export const getCollectionDetails = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return tmdbFetch<CollectionDetails>(`collection/${data.id}`, {
      language: "es-ES",
    });
  });

export const getGenres = createServerFn({ method: "GET" }).handler(async () => {
  const [movie, tv] = await Promise.all([
    tmdbFetch<{ genres: Genre[] }>("genre/movie/list"),
    tmdbFetch<{ genres: Genre[] }>("genre/tv/list"),
  ]);
  return { movie: movie.genres, tv: tv.genres };
});

export const getCatalogPage = createServerFn({ method: "GET" })
  .validator((data: { media: MediaType; category: string; page?: number; genre?: string; year?: string }) => data)
  .handler(async ({ data }) => {
    const def = catalogDef(data.media, data.category);
    if (!def) throw new Error("Categoría no encontrada");
    const page = data.page ?? 1;
    if (data.category === "discover" || data.genre || data.year) {
      const path = data.media === "tv" ? "discover/tv" : "discover/movie";
      const query: Query = {
        page,
        sort_by: "popularity.desc",
        with_genres: data.genre || undefined,
      };
      if (data.year) {
        if (data.media === "tv") query.first_air_date_year = data.year;
        else query.primary_release_year = data.year;
      }
      return list(path, data.media, query);
    }
    return list(def.path, data.media, { page, region: data.media === "movie" ? "ES" : undefined });
  });
