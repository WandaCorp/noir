import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MediaGrid } from "@/components/media/media-grid";
import { GridSkeleton } from "@/components/media/skeletons";
import { getCatalogPage } from "@/lib/tmdb/api";
import { catalogDef } from "@/lib/tmdb/catalogs";
import type { MediaType } from "@/lib/tmdb/types";

export function InfiniteCatalog({
  media,
  category,
  genre,
  year,
}: {
  media: MediaType;
  category: string;
  genre?: string;
  year?: string;
}) {
  const def = catalogDef(media, category);
  const sentinel = useRef<HTMLDivElement>(null);

  const query = useInfiniteQuery({
    queryKey: ["catalog", media, category, genre, year],
    queryFn: ({ pageParam }) =>
      getCatalogPage({
        data: { media, category, page: pageParam, genre, year },
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.total_pages && last.page < 500 ? last.page + 1 : undefined,
  });

  useEffect(() => {
    if (query.isError) toast.error("No se pudo cargar el catálogo. Inténtalo de nuevo.");
  }, [query.isError]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          void query.fetchNextPage();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [query]);

  const items = query.data?.pages.flatMap((page) => page.results) ?? [];
  const title = genreTitle(def?.title ?? "Catálogo", genre, year);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">
        {media === "tv" ? "Series" : "Películas"}
      </p>
      <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">
        {query.data?.pages[0]?.total_results
          ? `${query.data.pages[0].total_results.toLocaleString("es-ES")} títulos · desplaza para cargar más`
          : "Catálogo TMDb"}
      </p>

      <div className="mt-6">
        {query.isLoading ? (
          <GridSkeleton />
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-muted">No hay títulos para estos filtros.</p>
        ) : (
          <MediaGrid items={items} media={media} />
        )}
      </div>

      <div ref={sentinel} className="h-12" />
      {query.isFetchingNextPage ? (
        <div className="mt-4">
          <GridSkeleton count={6} />
        </div>
      ) : null}
    </div>
  );
}

function genreTitle(base: string, genre?: string, year?: string) {
  if (!genre && !year) return base;
  const bits = [base];
  if (year) bits.push(year);
  return bits.join(" · ");
}
