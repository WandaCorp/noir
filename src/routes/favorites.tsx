import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { FavoriteButton } from "@/components/media/favorite-button";
import { GridSkeleton } from "@/components/media/skeletons";
import { Button } from "@/components/ui/button";
import { formatRating } from "@/lib/format";
import { useFavorites } from "@/lib/favorites";
import { posterUrl } from "@/lib/tmdb/helpers";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const hydrated = useHydrated();
  const items = useFavorites((s) => s.items);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Tu archivo</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">Favoritos</h1>
        <p className="mt-2 text-sm text-muted">
          Se guardan en este dispositivo.
          {hydrated ? ` ${items.length} ${items.length === 1 ? "título" : "títulos"}.` : null}
        </p>

        {!hydrated ? (
          <div className="mt-8">
            <GridSkeleton count={6} />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <Heart className="size-10 text-subtle" />
            <p className="mt-4 max-w-sm text-muted">
              Aún no has marcado nada. Explora el feed y guarda películas o series para volver a ellas.
            </p>
            <Button asChild className="mt-5">
              <Link to="/">Ir al feed</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {items.map((item) => {
              const poster = posterUrl(item.posterPath, "w185");
              return (
                <li key={`${item.mediaType}-${item.id}`}>
                  <article className="flex gap-3 rounded-xl bg-surface p-2 shadow-[var(--shadow-border)]">
                    <Link
                      to={item.mediaType === "tv" ? "/tv/$id" : "/movie/$id"}
                      params={{ id: String(item.id) }}
                      className="flex min-w-0 flex-1 gap-3"
                    >
                      <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-elevated">
                        {poster ? <img src={poster} alt="" className="size-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0 py-1">
                        <p className="text-xs tracking-wide text-muted uppercase">
                          {item.mediaType === "tv" ? "Serie" : "Película"}
                        </p>
                        <h2 className="mt-1 line-clamp-2 font-medium">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted">
                          {item.year || "—"} · {formatRating(item.rating)}
                        </p>
                      </div>
                    </Link>
                    <FavoriteButton item={item} size="icon-sm" className="mt-1 mr-1" />
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
