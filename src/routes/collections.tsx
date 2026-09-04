import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clapperboard } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { GridSkeleton } from "@/components/media/skeletons";
import { getPopularCollections } from "@/lib/tmdb/api";
import { backdropUrl } from "@/lib/tmdb/helpers";

export const Route = createFileRoute("/collections")({
  component: CollectionsPage,
});

function CollectionsPage() {
  const collectionsQuery = useQuery({
    queryKey: ["collections"],
    queryFn: () => getPopularCollections(),
  });

  const collections = collectionsQuery.data?.results ?? [];

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Sagas y franquicias</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">Colecciones</h1>
        <p className="mt-2 text-sm text-muted">
          Explora las sagas completas, desde la primera entrega hasta la última.
        </p>

        <div className="mt-8">
          {collectionsQuery.isLoading ? (
            <GridSkeleton count={8} />
          ) : collections.length === 0 ? (
            <p className="py-16 text-center text-muted">No hay colecciones disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function CollectionCard({ collection }: { collection: CollectionSummary }) {
  const backdrop = backdropUrl(collection.backdrop_path, "w780");

  return (
    <Link
      to="/collection/$id"
      params={{ id: String(collection.id) }}
      className="group overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)] transition-transform duration-200 hover:scale-[1.02]"
    >
      <div className="relative aspect-video overflow-hidden bg-elevated">
        {backdrop ? (
          <img
            src={backdrop}
            alt={collection.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid size-full place-items-center text-subtle">
            <Clapperboard className="size-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="font-display text-lg font-medium leading-tight text-white">
            {collection.name}
          </h2>
        </div>
      </div>
    </Link>
  );
}