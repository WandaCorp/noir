import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getPersonDetails } from "@/lib/tmdb/api";
import { PersonPage } from "@/components/person/person-page";
import { DetailsSkeleton } from "@/components/media/skeletons";

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