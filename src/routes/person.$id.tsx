import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getPersonDetails } from "@/lib/tmdb/api";
import { PersonPage } from "@/components/person/person-page";
import { DetailsSkeleton } from "@/components/media/skeletons";
import { profileUrl } from "@/lib/tmdb/helpers";

const personSearchSchema = z.object({
  tab: z.enum(["movie", "tv"]).default("movie"),
});

export const Route = createFileRoute("/person/$id")({
  loader: async ({ params }) => {
    const person = await getPersonDetails({ data: { id: params.id } });
    return { person };
  },
  validateSearch: personSearchSchema,
  pendingComponent: () => <DetailsSkeleton />,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.person.name} · Biografía y filmografía · The Noir Database`
          : "Actor · The Noir Database",
      },
      {
        name: "description",
        content: loaderData?.person.biography
          ? loaderData.person.biography.slice(0, 160)
          : `Perfil de ${loaderData?.person.name ?? "actor"} en The Noir Database.`,
      },
      {
        property: "og:title",
        content: loaderData ? loaderData.person.name : "Actor · The Noir Database",
      },
      {
        property: "og:description",
        content: loaderData?.person.biography?.slice(0, 160) ?? "Perfil en The Noir Database.",
      },
      {
        property: "og:image",
        content: profileUrl(loaderData?.person.profile_path, "w500") ?? "",
      },
      {
        property: "og:type",
        content: "profile",
      },
      {
        property: "og:url",
        content: loaderData ? `https://noirdatabase.vercel.app/person/${loaderData.person.id}` : "",
      },
    ],
  }),
  component: PersonRoute,
});

function PersonRoute() {
  const { person } = Route.useLoaderData();
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <PersonPage
      person={person}
      activeTab={tab}
      onTabChange={(newTab) => {
        void navigate({
          search: { tab: newTab },
          replace: true,
        });
      }}
    />
  );
}