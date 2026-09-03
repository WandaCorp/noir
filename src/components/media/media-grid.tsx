import { PosterCard } from "@/components/media/poster-card";
import { uniqueMedia } from "@/lib/tmdb/helpers";
import type { MediaSummary, MediaType } from "@/lib/tmdb/types";

export function MediaGrid({
  items,
  media,
}: {
  items: MediaSummary[];
  media?: MediaType;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
      {uniqueMedia(items, media).map((item) => (
        <PosterCard
          key={`${item.media_type ?? media}-${item.id}`}
          item={item}
          media={media}
          className="w-full"
        />
      ))}
    </div>
  );
}
