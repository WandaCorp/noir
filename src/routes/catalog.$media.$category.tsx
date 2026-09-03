import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { InfiniteCatalog } from "@/components/media/infinite-catalog";
import { catalogDef } from "@/lib/tmdb/catalogs";
import type { MediaType } from "@/lib/tmdb/types";

type CatalogSearch = {
  genre: string;
  year: string;
};

export const Route = createFileRoute("/catalog/$media/$category")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    genre: typeof search.genre === "string" ? search.genre : "",
    year: typeof search.year === "string" ? search.year : "",
  }),
  beforeLoad: ({ params }) => {
    if (params.media !== "movie" && params.media !== "tv") {
      throw new Error("Tipo de catálogo no válido");
    }
    if (!catalogDef(params.media as MediaType, params.category)) {
      throw new Error("Categoría no encontrada");
    }
  },
  component: CatalogPage,
});

function CatalogPage() {
  const { media, category } = Route.useParams();
  const { genre, year } = Route.useSearch();
  return (
    <AppShell>
      <InfiniteCatalog
        media={media as MediaType}
        category={category}
        genre={genre || undefined}
        year={year || undefined}
      />
    </AppShell>
  );
}
