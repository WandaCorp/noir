import { createFileRoute } from "@tanstack/react-router";
import { TitlePage } from "@/components/details/title-page";
import { AppShell } from "@/components/layout/app-shell";
import { DetailsSkeleton } from "@/components/media/skeletons";
import { getTvDetails } from "@/lib/tmdb/api";
import { mediaTitle } from "@/lib/tmdb/helpers";

export const Route = createFileRoute("/tv/$id")({
  loader: ({ params }) => getTvDetails({ data: { id: params.id } }),
  pendingComponent: () => (
    <AppShell>
      <DetailsSkeleton />
    </AppShell>
  ),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${mediaTitle(loaderData)} · NOIR` : "Serie · NOIR" }],
  }),
  component: TvPage,
});

function TvPage() {
  const data = Route.useLoaderData();
  return (
    <AppShell>
      <TitlePage data={{ ...data, mediaType: "tv" }} />
    </AppShell>
  );
}
