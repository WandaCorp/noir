import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clapperboard, Star } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DetailsSkeleton } from "@/components/media/skeletons";
import { getCollectionDetails } from "@/lib/tmdb/api";
import { backdropUrl, posterUrl } from "@/lib/tmdb/helpers";
import { formatRating } from "@/lib/format";

export const Route = createFileRoute("/collection/$id")({
  loader: async ({ params }) => {
    const collection = await getCollectionDetails({ data: { id: params.id } });
    return { collection };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.collection.name} · Saga completa · The Noir Database`
          : "Colección · The Noir Database",
      },
      {
        name: "description",
        content: loaderData?.collection.overview
          ? loaderData.collection.overview.slice(0, 160)
          : `Colección ${loaderData?.collection.name ?? ""} en The Noir Database.`,
      },
      {
        property: "og:title",
        content: loaderData ? loaderData.collection.name : "Colección · The Noir Database",
      },
      {
        property: "og:description",
        content: loaderData?.collection.overview?.slice(0, 160) ?? "Colección en The Noir Database.",
      },
      {
        property: "og:image",
        content: backdropUrl(loaderData?.collection.backdrop_path) ?? "",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: loaderData
          ? `https://noirdatabase.vercel.app/collection/${loaderData.collection.id}`
          : "",
      },
    ],
  }),
  pendingComponent: () => <DetailsSkeleton />,
  component: CollectionDetailPage,
});

function CollectionDetailPage() {
  const { collection } = Route.useLoaderData();
  const { id } = Route.useParams();

  const collectionQuery = useQuery({
    queryKey: ["collection", id],
    queryFn: () => getCollectionDetails({ data: { id } }),
    initialData: collection, // Usar datos del loader como inicial
  });

  if (collectionQuery.isError || !collectionQuery.data) {
    return (
      <AppShell>
        <div className="py-16 text-center text-muted">No se pudo cargar la colección.</div>
      </AppShell>
    );
  }

  const collectionData = collectionQuery.data;
  const backdrop = backdropUrl(collectionData.backdrop_path);
  const parts = [...collectionData.parts].sort((a, b) =>
    a.release_date.localeCompare(b.release_date)
  );

  return (
    <AppShell>
      <article>
        {/* Header */}
        <section className="relative min-h-[50vh]">
          {backdrop ? (
            <img src={backdrop} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-surface" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/70 to-bg/25" />
          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <Link
              to="/collections"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
            >
              <ArrowLeft className="size-4" />
              Colecciones
            </Link>
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
                Colección · {parts.length} películas
              </p>
              <h1 className="mt-2 font-display text-4xl leading-none font-medium tracking-tight sm:text-5xl">
                {collectionData.name}
              </h1>
              {collectionData.overview ? (
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                  {collectionData.overview}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* Parts Grid */}
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="font-display text-2xl font-medium tracking-tight">Películas</h2>
          <p className="mt-1 text-sm text-muted">Ordenadas cronológicamente</p>

          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
            {parts.map((part, index) => (
              <Link
                key={part.id}
                to="/movie/$id"
                params={{ id: String(part.id) }}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-lg bg-elevated shadow-[var(--shadow-border)] transition-transform duration-200 group-hover:scale-105">
                  {posterUrl(part.poster_path, "w342") ? (
                    <img
                      src={posterUrl(part.poster_path, "w342")!}
                      alt={part.title}
                      loading="lazy"
                      className="aspect-2/3 w-full object-cover"
                    />
                  ) : (
                    <div className="grid aspect-2/3 place-items-center text-subtle">
                      <Clapperboard className="size-8" />
                    </div>
                  )}
                  {/* Número de orden */}
                  <div className="absolute top-2 left-2 grid size-7 place-items-center rounded-full bg-black/70 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  {/* Rating */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs text-white">
                    <Star className="size-3 fill-current text-accent" />
                    {formatRating(part.vote_average)}
                  </div>
                </div>
                <p className="mt-2 line-clamp-1 text-xs font-medium group-hover:text-accent">
                  {part.title}
                </p>
                {part.release_date ? (
                  <p className="text-xs text-subtle">{part.release_date.slice(0, 4)}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </AppShell>
  );
}