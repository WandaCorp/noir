import { createFileRoute } from "@tanstack/react-router";
import { TitlePage } from "@/components/details/title-page";
import { AppShell } from "@/components/layout/app-shell";
import { DetailsSkeleton } from "@/components/media/skeletons";
import { getMovieDetails } from "@/lib/tmdb/api";
import { mediaTitle, mediaYear, posterUrl } from "@/lib/tmdb/helpers";

export const Route = createFileRoute("/movie/$id")({
  loader: ({ params }) => getMovieDetails({ data: { id: params.id } }),
  pendingComponent: () => (
    <AppShell>
      <DetailsSkeleton />
    </AppShell>
  ),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${mediaTitle(loaderData)} (${mediaYear(loaderData)}) · The Noir Database`
          : "Película · The Noir Database",
      },
      {
        name: "description",
        content: loaderData?.overview
          ? loaderData.overview.slice(0, 160)
          : "Detalles de la película en The Noir Database.",
      },
      {
        property: "og:title",
        content: loaderData ? mediaTitle(loaderData) : "Película · The Noir Database",
      },
      {
        property: "og:description",
        content: loaderData?.overview?.slice(0, 160) ?? "Detalles de la película en The Noir Database.",
      },
      {
        property: "og:image",
        content: posterUrl(loaderData?.poster_path, "w500") ?? "",
      },
      {
        property: "og:type",
        content: "video.movie",
      },
      {
        property: "og:url",
        content: loaderData ? `https://noirdatabase.vercel.app/movie/${loaderData.id}` : "",
      },
    ],
  }),
  component: MoviePage,
});

function MoviePage() {
  const data = Route.useLoaderData();
  return (
    <AppShell>
      <TitlePage data={{ ...data, mediaType: "movie" }} />
    </AppShell>
  );
}