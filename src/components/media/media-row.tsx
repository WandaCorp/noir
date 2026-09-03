import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { PosterCard } from "@/components/media/poster-card";
import { PosterSkeleton } from "@/components/media/skeletons";
import type { CatalogCategory } from "@/lib/tmdb/catalogs";
import { uniqueMedia } from "@/lib/tmdb/helpers";
import type { MediaSummary, MediaType } from "@/lib/tmdb/types";

export function MediaRow({
  title,
  items,
  media,
  category,
  loading,
}: {
  title: string;
  items: MediaSummary[];
  media?: MediaType;
  category?: CatalogCategory;
  loading?: boolean;
}) {
  const list = uniqueMedia(items, media);
  if (!loading && list.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3 px-4 sm:px-6">
        <h2 className="font-display text-2xl font-medium tracking-tight text-fg sm:text-3xl">{title}</h2>
        {media && category ? (
          <Link
            to="/catalog/$media/$category"
            params={{ media, category }}
            search={{ genre: "", year: "" }}
            className="inline-flex h-11 items-center gap-1 text-sm text-muted transition-colors duration-150 hover:text-fg"
          >
            Ver todo
            <ChevronRight className="size-4" />
          </Link>
        ) : null}
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1 sm:gap-4 sm:px-6">
        {loading ? (
          <PosterSkeleton count={8} />
        ) : (
          list.map((item) => (
            <PosterCard key={`${item.media_type ?? media}-${item.id}`} item={item} media={media} />
          ))
        )}
      </div>
    </section>
  );
}
