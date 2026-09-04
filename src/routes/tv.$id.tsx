import { createFileRoute } from "@tanstack/react-router";
import { TitlePage } from "@/components/details/title-page";
import { AppShell } from "@/components/layout/app-shell";
import { DetailsSkeleton } from "@/components/media/skeletons";
import { getTvDetails } from "@/lib/tmdb/api";
import { mediaTitle, mediaYear, posterUrl } from "@/lib/tmdb/helpers";

export const Route = createFileRoute("/tv/$id")({
  loader: ({ params }) => getTvDetails({ data: { id: params.id } }),
  pendingComponent: () => (
    <AppShell>
      <DetailsSkeleton />
    </AppShell>
  ),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${mediaTitle(loaderData)} (${mediaYear(loaderData)}) · NOIR`
          : "Serie · NOIR",
      },
      {
        name: "description",
        content: loaderData?.overview
          ? loaderData.overview.slice(0, 160)
          : "Detalles de la serie en NOIR.",
      },
      {
        property: "og:title",
        content: loaderData ? mediaTitle(loaderData) : "Serie · NOIR",
      },
      {
        property: "og:description",
        content: loaderData?.overview?.slice(0, 160) ?? "Detalles de la serie en NOIR.",
      },
      {
        property: "og:image",
        content: posterUrl(loaderData?.poster_path, "w500") ?? "",
      },
      {
        property: "og:type",
        content: "video.tv_show",
      },
      {
        property: "og:url",
        content: loaderData ? `https://noirdatabase.vercel.app/tv/${loaderData.id}` : "",
      },
    ],
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