import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FeedTabs, type FeedTab } from "@/components/feed/feed-tabs";
import { AppShell } from "@/components/layout/app-shell";
import { HeroSlider } from "@/components/media/hero-slider";
import { MediaRow } from "@/components/media/media-row";
import { HeroSkeleton } from "@/components/media/skeletons";
import { Badge } from "@/components/ui/badge";
import { getHomeFeed } from "@/lib/tmdb/api";
import type { Genre, HomeFeed } from "@/lib/tmdb/types";

export const Route = createFileRoute("/")({
  loader: () => getHomeFeed(),
  pendingComponent: HomePending,
  component: Home,
});

function HomePending() {
  return (
    <AppShell>
      <HeroSkeleton />
    </AppShell>
  );
}

function Home() {
  const data = Route.useLoaderData();
  const [tab, setTab] = useState<FeedTab>("featured");

  return (
    <AppShell>
      <HeroSlider items={data.trending} />
      <FeedTabs value={tab} onChange={setTab} />
      <div className="mx-auto max-w-6xl space-y-10 py-6">
        {tab === "featured" ? <Featured data={data} /> : null}
        {tab === "movies" ? <Movies data={data} /> : null}
        {tab === "series" ? <Series data={data} /> : null}
        {tab === "trending" ? <Trending data={data} /> : null}
      </div>
    </AppShell>
  );
}

function Featured({ data }: { data: HomeFeed }) {
  return (
    <>
      <MediaRow title="En cartelera" items={data.nowPlaying} media="movie" category="now_playing" />
      <MediaRow title="Series populares" items={data.popularTv} media="tv" category="popular" />
      <MediaRow title="Películas populares" items={data.popularMovies} media="movie" category="popular" />
      <MediaRow title="Próximos estrenos" items={data.upcoming} media="movie" category="upcoming" />
      <MediaRow title="Al aire ahora" items={data.onAir} media="tv" category="on_the_air" />
    </>
  );
}

function Movies({ data }: { data: HomeFeed }) {
  return (
    <>
      <GenreStrip media="movie" genres={data.movieGenres} />
      <MediaRow title="En cartelera" items={data.nowPlaying} media="movie" category="now_playing" />
      <MediaRow title="Populares" items={data.popularMovies} media="movie" category="popular" />
      <MediaRow title="Mejor valoradas" items={data.topMovies} media="movie" category="top_rated" />
      <MediaRow title="Próximos estrenos" items={data.upcoming} media="movie" category="upcoming" />
    </>
  );
}

function Series({ data }: { data: HomeFeed }) {
  return (
    <>
      <GenreStrip media="tv" genres={data.tvGenres} />
      <MediaRow title="Al aire ahora" items={data.onAir} media="tv" category="on_the_air" />
      <MediaRow title="Populares" items={data.popularTv} media="tv" category="popular" />
      <MediaRow title="Mejor valoradas" items={data.topTv} media="tv" category="top_rated" />
    </>
  );
}

function Trending({ data }: { data: HomeFeed }) {
  const movies = data.trending.filter((item) => item.media_type === "movie");
  const series = data.trending.filter((item) => item.media_type === "tv");
  return (
    <>
      <MediaRow title="Cine en tendencia" items={movies} media="movie" category="trending" />
      <MediaRow title="Series en tendencia" items={series} media="tv" category="trending" />
      <MediaRow title="Lo más visto en cine" items={data.popularMovies} media="movie" category="popular" />
      <MediaRow title="Lo más visto en series" items={data.popularTv} media="tv" category="popular" />
    </>
  );
}

function GenreStrip({ media, genres }: { media: "movie" | "tv"; genres: Genre[] }) {
  if (!genres.length) return null;
  return (
    <div className="px-4 sm:px-6">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {genres.slice(0, 16).map((genre) => (
          <Link
            key={genre.id}
            to="/catalog/$media/$category"
            params={{ media, category: "discover" }}
            search={{ genre: String(genre.id), year: "" }}
          >
            <Badge className="h-9 whitespace-nowrap hover:text-fg">{genre.name}</Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
