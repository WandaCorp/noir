import { createFileRoute } from "@tanstack/react-router";
import { TitlePage } from "@/components/details/title-page";
import { AppShell } from "@/components/layout/app-shell";
import { DetailsSkeleton } from "@/components/media/skeletons";
import { getMovieDetails } from "@/lib/tmdb/api";
import { mediaTitle } from "@/lib/tmdb/helpers";

export const Route = createFileRoute("/movie/$id")({
  loader: ({ params }) => getMovieDetails({ data: { id: params.id } }),
  pendingComponent: () => (
    <AppShell>
      <DetailsSkeleton />
    </AppShell>
  ),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${mediaTitle(loaderData)} · NOIR` : "Película · NOIR" }],
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
