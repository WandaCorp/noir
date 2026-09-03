import { Link } from "@tanstack/react-router";
import { Film } from "lucide-react";
import { FavoriteButton } from "@/components/media/favorite-button";
import { formatRating } from "@/lib/format";
import { mediaTitle, mediaYear, posterUrl, resolveMediaType } from "@/lib/tmdb/helpers";
import type { MediaSummary, MediaType } from "@/lib/tmdb/types";
import { cn } from "@/lib/utils";

export function PosterCard({
  item,
  media,
  className,
}: {
  item: MediaSummary;
  media?: MediaType;
  className?: string;
}) {
  const type = resolveMediaType(item, media ?? "movie");
  const title = mediaTitle(item);
  const year = mediaYear(item);
  const poster = posterUrl(item.poster_path);

  return (
    <article className={cn("group relative w-36 shrink-0 sm:w-40", className)}>
      <Link
        to={type === "tv" ? "/tv/$id" : "/movie/$id"}
        params={{ id: String(item.id) }}
        className="block focus-visible:outline-none"
      >
        <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-elevated shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-250 ease-[var(--ease-smooth-out)] group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-border-hover)] group-focus-visible:ring-2 group-focus-visible:ring-accent/40">
          {poster ? (
            <img
              src={poster}
              alt=""
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-subtle">
              <Film className="size-8" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-bg/90 to-transparent" />
          <span className="absolute bottom-2 left-2 rounded-full bg-bg/80 px-2 py-0.5 text-xs font-medium tabular-nums text-accent">
            {formatRating(item.vote_average)}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-fg">{title}</h3>
        <p className="mt-0.5 text-xs text-muted">
          {year || "—"} · {type === "tv" ? "Serie" : "Película"}
        </p>
      </Link>
      <div className="absolute top-2 right-2 opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <FavoriteButton
          size="icon-sm"
          item={{
            id: item.id,
            mediaType: type,
            title,
            posterPath: item.poster_path,
            year,
            rating: item.vote_average,
          }}
        />
      </div>
    </article>
  );
}
