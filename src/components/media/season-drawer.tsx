import { Drawer } from "vaul";
import { useQuery } from "@tanstack/react-query";
import { Star, Clock, Calendar, Tv } from "lucide-react";
import { getSeasonDetails } from "@/lib/tmdb/api";
import { posterUrl, formatRating } from "@/lib/tmdb/helpers";
import { formatDate, formatRuntime } from "@/lib/format";
import type { Season } from "@/lib/tmdb/types";
import { Skeleton } from "@/components/ui/skeleton";

export function SeasonDrawer({
  season,
  tvId,
  tvName,
}: {
  season: Season;
  tvId: number;
  tvName: string;
}) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button className="w-36 shrink-0 text-left">
          <div className="aspect-2/3 overflow-hidden rounded-lg bg-elevated shadow-[var(--shadow-border)] transition-transform duration-200 hover:scale-105">
            {posterUrl(season.poster_path) ? (
              <img
                src={posterUrl(season.poster_path)!}
                alt={season.name}
                className="size-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="grid size-full place-items-center text-subtle">
                <Tv className="size-6" />
              </div>
            )}
          </div>
          <p className="mt-2 text-sm font-medium">{season.name}</p>
          <p className="text-xs text-muted">
            {season.episode_count} eps
            {season.air_date ? ` · ${season.air_date.slice(0, 4)}` : ""}
          </p>
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-h-[95dvh] max-w-3xl flex-col rounded-t-2xl bg-bg shadow-2xl outline-none">
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-border" />
          <SeasonContent season={season} tvId={tvId} tvName={tvName} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function SeasonContent({
  season,
  tvId,
  tvName,
}: {
  season: Season;
  tvId: number;
  tvName: string;
}) {
  const seasonQuery = useQuery({
    queryKey: ["season", tvId, season.season_number],
    queryFn: () =>
      getSeasonDetails({
        data: {
          tvId: String(tvId),
          seasonNumber: season.season_number,
        },
      }),
  });

  return (
    <div className="overflow-y-auto px-5 pb-8 pt-4">
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{tvName}</p>
        <h2 className="font-display text-2xl font-medium tracking-tight">{season.name}</h2>
        <p className="mt-1 text-sm text-muted">
          {seasonQuery.data?.episodes.length ?? season.episode_count} episodios
          {season.air_date ? ` · ${season.air_date.slice(0, 4)}` : ""}
        </p>
        {season.overview ? (
          <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">{season.overview}</p>
        ) : null}
      </div>

      {/* Episodes list */}
      <div className="space-y-3">
        {seasonQuery.isLoading ? (
          <>
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-20 w-32 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </>
        ) : seasonQuery.data?.episodes.length ? (
          seasonQuery.data.episodes.map((episode) => (
            <EpisodeItem key={episode.id} episode={episode} />
          ))
        ) : (
          <p className="py-8 text-center text-sm text-muted">
            No hay información de episodios disponible.
          </p>
        )}
      </div>
    </div>
  );
}

function EpisodeItem({ episode }: { episode: SeasonDetails["episodes"][0] }) {
  return (
    <div className="flex gap-3 rounded-lg bg-surface p-3 shadow-[var(--shadow-border)]">
      {episode.still_path ? (
        <div className="h-20 w-32 shrink-0 overflow-hidden rounded-md bg-elevated">
          <img
            src={`https://image.tmdb.org/t/p/w185${episode.still_path}`}
            alt=""
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="grid h-20 w-32 shrink-0 place-items-center rounded-md bg-elevated text-xs text-subtle">
          Sin imagen
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {episode.episode_number}. {episode.name}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          {episode.runtime ? (
            <span className="inline-flex items-center gap-0.5">
              <Clock className="size-3" />
              {formatRuntime(episode.runtime)}
            </span>
          ) : null}
          {episode.air_date ? (
            <span className="inline-flex items-center gap-0.5">
              <Calendar className="size-3" />
              {formatDate(episode.air_date)}
            </span>
          ) : null}
          {episode.vote_average > 0 ? (
            <span className="inline-flex items-center gap-0.5 text-accent">
              <Star className="size-3 fill-current" />
              {formatRating(episode.vote_average)}
            </span>
          ) : null}
        </div>
        {episode.overview ? (
          <p className="mt-1 text-xs leading-relaxed text-muted line-clamp-2">
            {episode.overview}
          </p>
        ) : null}
      </div>
    </div>
  );
}