import { createFileRoute } from "@tanstack/react-router";
import { getPersonDetails } from "@/lib/tmdb/api";
import { PersonPage } from "@/components/person/person-page";
import { DetailsSkeleton } from "@/components/media/skeletons";

export const Route = createFileRoute("/person/$id")({
  loader: async ({ params }) => {
    const person = await getPersonDetails({ data: { id: params.id } });
    return { person };
  },
  pendingComponent: () => <DetailsSkeleton />,
  component: PersonRoute,
});

function PersonRoute() {
  const { person } = Route.useLoaderData();
  return <PersonPage person={person} />;
}