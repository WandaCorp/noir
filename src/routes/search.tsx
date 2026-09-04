import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { MediaGrid } from "@/components/media/media-grid";
import { GridSkeleton } from "@/components/media/skeletons";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getGenres, tmdbDiscover, tmdbSearch, tmdbSearchPerson } from "@/lib/tmdb/api";
import { YEAR_OPTIONS } from "@/lib/tmdb/catalogs";
import { mediaYear, profileUrl } from "@/lib/tmdb/helpers";
import type { MediaSummary, MediaType, PersonSearchResult } from "@/lib/tmdb/types";
import { cn } from "@/lib/utils";

type SearchParams = {
  q: string;
  genre: string;
  year: string;
  media: "all" | "movie" | "tv" | "person";
};

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : "",
    genre: typeof search.genre === "string" ? search.genre : "",
    year: typeof search.year === "string" ? search.year : "",
    media:
      search.media === "movie" || search.media === "tv" || search.media === "person"
        ? search.media
        : "all",
  }),
  component: SearchPage,
});

function SearchPage() {
  const params = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [draft, setDraft] = useState(params.q);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(params.q);
  }, [params.q]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (draft === params.q) return;
      void navigate({
        search: (prev) => ({ ...prev, q: draft }),
        replace: true,
      });
    }, 400);
    return () => window.clearTimeout(id);
  }, [draft, navigate, params.q]);

  const genresQuery = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
  });

  const hasQuery = params.q.trim().length > 0;
  const discoverMedia: MediaType = params.media === "tv" ? "tv" : "movie";
  const isPersonSearch = params.media === "person";

  const searchQuery = useInfiniteQuery({
    queryKey: ["search", params.q, params.media],
    enabled: hasQuery,
    queryFn: ({ pageParam }) => {
      if (isPersonSearch) {
        return tmdbSearchPerson({
          data: {
            query: params.q,
            page: pageParam,
          },
        });
      }
      return tmdbSearch({
        data: {
          query: params.q,
          page: pageParam,
          media: params.media === "all" ? "multi" : params.media,
        },
      });
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.total_pages && last.page < 500 ? last.page + 1 : undefined,
  });

  const discoverQuery = useInfiniteQuery({
    queryKey: ["discover-search", discoverMedia, params.genre, params.year],
    enabled: !hasQuery && Boolean(params.genre || params.year),
    queryFn: ({ pageParam }) =>
      tmdbDiscover({
        data: {
          media: discoverMedia,
          page: pageParam,
          genre: params.genre || undefined,
          year: params.year || undefined,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.total_pages && last.page < 500 ? last.page + 1 : undefined,
  });

  const active = hasQuery ? searchQuery : discoverQuery;

  useEffect(() => {
    if (active.isError) toast.error("No se pudo completar la búsqueda.");
  }, [active.isError]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && active.hasNextPage && !active.isFetchingNextPage) {
          void active.fetchNextPage();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [active]);

  const genres =
    params.media === "tv"
      ? genresQuery.data?.tv
      : params.media === "movie"
        ? genresQuery.data?.movie
        : [...(genresQuery.data?.movie ?? []), ...(genresQuery.data?.tv ?? [])].filter(
            (g, i, arr) => arr.findIndex((x) => x.id === g.id) === i,
          );

  const items = useMemo(() => {
    const raw = active.data?.pages.flatMap((page) => page.results) ?? [];
    return raw.filter((item) => matchesFilters(item, params));
  }, [active.data, params]);

  function patch(next: Partial<SearchParams>) {
    void navigate({ search: (prev) => ({ ...prev, ...next }) });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Explorar</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">Buscar</h1>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <label className="relative sm:col-span-2 lg:col-span-4">
            <span className="sr-only">Título</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Nombre de película, serie o persona"
              className="pl-9"
              autoFocus
            />
          </label>

          {/* Tabs de tipo de búsqueda */}
          <div className="flex gap-1 rounded-lg bg-elevated p-1 sm:col-span-2 lg:col-span-4">
            <button
              onClick={() => patch({ media: "all" })}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                params.media === "all" ? "bg-bg text-fg shadow-sm" : "text-muted hover:text-fg",
              )}
            >
              Todos
            </button>
            <button
              onClick={() => patch({ media: "movie" })}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                params.media === "movie" ? "bg-bg text-fg shadow-sm" : "text-muted hover:text-fg",
              )}
            >
              Películas
            </button>
            <button
              onClick={() => patch({ media: "tv" })}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                params.media === "tv" ? "bg-bg text-fg shadow-sm" : "text-muted hover:text-fg",
              )}
            >
              Series
            </button>
            <button
              onClick={() => patch({ media: "person" })}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                params.media === "person"
                  ? "bg-bg text-fg shadow-sm"
                  : "text-muted hover:text-fg",
              )}
            >
              Personas
            </button>
          </div>

          {/* Selects de Género y Año - solo visibles para películas/series */}
          {params.media !== "person" ? (
            <>
              <Select
                value={params.genre}
                onChange={(e) => patch({ genre: e.target.value })}
                aria-label="Género"
              >
                <option value="">Todos los géneros</option>
                {(genres ?? []).map((genre) => (
                  <option key={genre.id} value={String(genre.id)}>
                    {genre.name}
                  </option>
                ))}
              </Select>
              <Select
                value={params.year}
                onChange={(e) => patch({ year: e.target.value })}
                aria-label="Año"
              >
                <option value="">Cualquier año</option>
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </>
          ) : null}
        </div>

        <div className="mt-8">
          {!hasQuery && !params.genre && !params.year ? (
            <p className="py-16 text-center text-muted">
              Escribe un título o filtra por género y fecha para ver el catálogo.
            </p>
          ) : active.isLoading ? (
            <GridSkeleton />
          ) : items.length === 0 ? (
            <p className="py-16 text-center text-muted">No hay coincidencias con esos filtros.</p>
          ) : isPersonSearch ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((person) => (
                <PersonResult key={person.id} person={person as PersonSearchResult} />
              ))}
            </div>
          ) : (
            <MediaGrid items={items} />
          )}
        </div>
        <div ref={sentinel} className="h-12" />
        {active.isFetchingNextPage ? (
          <div className="mt-4">
            <GridSkeleton count={6} />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function PersonResult({ person }: { person: PersonSearchResult }) {
  return (
    <Link
      to="/person/$id"
      params={{ id: String(person.id) }}
      className="group flex items-center gap-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-colors hover:bg-elevated"
    >
      <div className="size-14 shrink-0 overflow-hidden rounded-full bg-elevated sm:size-16">
        {profileUrl(person.profile_path) ? (
          <img
            src={profileUrl(person.profile_path)!}
            alt={person.name}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="grid size-full place-items-center text-subtle">
            <User className="size-6" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium group-hover:text-accent">{person.name}</p>
      </div>
    </Link>
  );
}

function matchesFilters(item: MediaSummary, params: SearchParams) {
  if (params.media !== "all" && item.media_type && item.media_type !== params.media) return false;
  if (params.genre && !(item.genre_ids ?? []).includes(Number(params.genre))) return false;
  if (params.year && mediaYear(item) !== params.year) return false;
  return true;
}