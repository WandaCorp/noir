import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Check, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/lib/watchlist";
import { useHydrated } from "@/lib/use-hydrated";
import { posterUrl } from "@/lib/tmdb/helpers";
import { cn } from "@/lib/utils";
import type { WatchlistItem } from "@/lib/watchlist";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Mi Watchlist · The Noir Database" },
      {
        name: "description",
        content: "Tu lista personal de películas y series para ver después.",
      },
    ],
  }),
  component: WatchlistPage,
});

type Tab = "pending" | "watched";

function WatchlistPage() {
  const hydrated = useHydrated();
  const items = useWatchlist((s) => s.items);
  const clear = useWatchlist((s) => s.clear);
  const [tab, setTab] = useState<Tab>("pending");

  const pending = items.filter((i) => !i.watched);
  const watched = items.filter((i) => i.watched);
  const current = tab === "pending" ? pending : watched;

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Mi lista</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight">
          Ver después
        </h1>
        <p className="mt-2 text-sm text-muted">
          {pending.length} pendientes · {watched.length} vistas
        </p>

        <div className="mt-5 flex gap-1 rounded-lg bg-elevated p-1">
          <button
            onClick={() => setTab("pending")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              tab === "pending" ? "bg-bg text-fg shadow-sm" : "text-muted hover:text-fg",
            )}
          >
            <Bookmark className="size-4" />
            Pendientes
            <span className="rounded-full bg-elevated px-2 py-0.5 text-xs tabular-nums">
              {pending.length}
            </span>
          </button>
          <button
            onClick={() => setTab("watched")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              tab === "watched" ? "bg-bg text-fg shadow-sm" : "text-muted hover:text-fg",
            )}
          >
            <Check className="size-4" />
            Vistas
            <span className="rounded-full bg-elevated px-2 py-0.5 text-xs tabular-nums">
              {watched.length}
            </span>
          </button>
        </div>

        {items.length > 0 ? (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm("¿Vaciar toda la watchlist?")) clear();
              }}
            >
              <Trash2 className="size-4" />
              Vaciar lista
            </Button>
          </div>
        ) : null}

        <div className="mt-6">
          {!hydrated ? null : current.length === 0 ? (
            <EmptyState tab={tab} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {current.map((item) => (
                <WatchlistCard key={`${item.mediaType}-${item.id}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function EmptyState({ tab }: { tab: Tab }) {
  return (
    <div className="rounded-xl bg-surface px-6 py-16 text-center shadow-[var(--shadow-border)]">
      <Bookmark className="mx-auto size-10 text-subtle" />
      <p className="mt-3 font-display text-xl font-medium">
        {tab === "pending" ? "Tu lista está vacía" : "Aún no has marcado nada como visto"}
      </p>
      <p className="mt-1 text-sm text-muted">
        {tab === "pending"
          ? "Agrega películas o series desde sus páginas de detalles."
          : "Marca títulos como vistos desde tu lista de pendientes."}
      </p>
      <Button asChild className="mt-5">
        <Link to="/">Explorar</Link>
      </Button>
    </div>
  );
}

function WatchlistCard({ item }: { item: WatchlistItem }) {
  const poster = posterUrl(item.posterPath, "w342");
  const toggleWatched = useWatchlist((s) => s.toggleWatched);
  const remove = useWatchlist((s) => s.remove);

  return (
    <div className="group">
      <Link
        to={item.mediaType === "movie" ? "/movie/$id" : "/tv/$id"}
        params={{ id: String(item.id) }}
        className="block"
      >
        <div className="relative overflow-hidden rounded-lg bg-elevated shadow-[var(--shadow-border)] transition-transform duration-200 group-hover:scale-105">
          {poster ? (
            <img
              src={poster}
              alt={item.title}
              loading="lazy"
              className={cn(
                "aspect-2/3 w-full object-cover",
                item.watched && "opacity-60",
              )}
            />
          ) : (
            <div className="grid aspect-2/3 place-items-center text-subtle">
              <Bookmark className="size-8" />
            </div>
          )}
          {item.watched ? (
            <div className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-accent text-accent-fg">
              <Check className="size-4" />
            </div>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-1 text-xs font-medium group-hover:text-accent">
          {item.title}
        </p>
        {item.year ? <p className="text-xs text-subtle">{item.year}</p> : null}
      </Link>
      <div className="mt-1.5 flex gap-1">
        <button
          onClick={() => toggleWatched(item.mediaType, item.id)}
          className="flex-1 rounded-md bg-elevated px-2 py-1 text-[11px] text-muted transition-colors hover:text-fg"
        >
          {item.watched ? "Marcar pendiente" : "Marcar vista"}
        </button>
        <button
          onClick={() => remove(item.mediaType, item.id)}
          className="grid size-7 place-items-center rounded-md bg-elevated text-muted transition-colors hover:text-danger"
          aria-label="Quitar"
        >
          <Trash2 className="size-3" />
        </button>
      </div>
    </div>
  );
}