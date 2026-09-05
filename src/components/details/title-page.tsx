import { Link } from "@tanstack/react-router";
import { Calendar, Clock, Clapperboard, DollarSign, Globe, Play, Star, Tv } from "lucide-react";
import { FavoriteButton } from "@/components/media/favorite-button";
import { MediaRow } from "@/components/media/media-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCount, formatDate, formatMoney, formatRating, formatRuntime } from "@/lib/format";
import {
  backdropUrl,
  logoUrl,
  mediaTitle,
  mediaYear,
  pickTrailer,
  posterUrl,
  profileUrl,
} from "@/lib/tmdb/helpers";
import type { MovieDetails, TvDetails, WatchLocale } from "@/lib/tmdb/types";

type Details = (MovieDetails | TvDetails) & { mediaType: "movie" | "tv" };

export function TitlePage({ data }: { data: Details }) {
  const title = mediaTitle(data);
  const year = mediaYear(data);
  const poster = posterUrl(data.poster_path, "w500");
  const backdrop = backdropUrl(data.backdrop_path);
  const trailer = pickTrailer(data.videos?.results);
  const runtime =
    "runtime" in data ? formatRuntime(data.runtime) : formatRuntime(data.episode_run_time?.[0]);
  const director =
    data.credits?.crew.find((c) => c.job === "Director") ||
    ("created_by" in data ? data.created_by[0] : undefined);
  const cast = (data.credits?.cast ?? []).slice(0, 14);
  const providers = pickProviders(data["watch/providers"]?.results);
  const similar = (data.similar?.results ?? []).slice(0, 14);
  const recommended = (data.recommendations?.results ?? []).slice(0, 14);
  const reviews = (data.reviews?.results ?? []).slice(0, 3);

  return (
    <article>
      <section className="relative min-h-hero">
        {backdrop ? (
          <img src={backdrop} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-surface" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/70 to-bg/25" />
        <div className="relative mx-auto flex min-h-hero max-w-6xl flex-col justify-end gap-6 px-4 py-10 sm:flex-row sm:items-end sm:px-6">
          <div className="hidden w-52 shrink-0 overflow-hidden rounded-xl bg-elevated shadow-[var(--shadow-border)] sm:block">
            {poster ? (
              <img src={poster} alt="" className="aspect-2/3 w-full object-cover" />
            ) : (
              <div className="grid aspect-2/3 place-items-center text-subtle">
                <Clapperboard className="size-10" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
              {data.mediaType === "tv" ? "Serie" : "Película"}
              {year ? ` · ${year}` : ""}
            </p>
            <h1 className="mt-1 font-display text-4xl leading-none font-medium tracking-tight sm:text-6xl">
              {title}
            </h1>
            {data.tagline ? (
              <p className="mt-3 max-w-2xl font-display text-lg italic text-muted">{data.tagline}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1 text-accent">
                <Star className="size-4 fill-current text-[#FFD700]" />
                <span className="tabular-nums text-fg">{formatRating(data.vote_average)}</span>
                <span>({formatCount(data.vote_count)})</span>
              </span>
              {runtime ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {runtime}
                </span>
              ) : null}
              {formatDate(data.release_date || data.first_air_date) ? (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {formatDate(data.release_date || data.first_air_date)}
                </span>
              ) : null}
              {data.status ? <span>{data.status}</span> : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {data.genres?.map((genre) => (
                <Link
                  key={genre.id}
                  to="/catalog/$media/$category"
                  params={{ media: data.mediaType, category: "discover" }}
                  search={{ genre: String(genre.id), year: "" }}
                >
                  <Badge className="hover:text-fg">{genre.name}</Badge>
                </Link>
              ))}
            </div>
            {data.overview ? (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{data.overview}</p>
            ) : null}
            {director ? (
              <p className="mt-3 text-sm text-muted">
                {data.mediaType === "tv" ? "Creación" : "Dirección"}:{" "}
                <span className="text-fg">{director.name}</span>
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              {trailer ? (
                <Button asChild>
                  <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer">
                    <Play className="size-4" />
                    Ver tráiler
                  </a>
                </Button>
              ) : null}
              <FavoriteButton
                size="default"
                item={{
                  id: data.id,
                  mediaType: data.mediaType,
                  title,
                  posterPath: data.poster_path,
                  year,
                  rating: data.vote_average,
                }}
              />
              {data.homepage ? (
                <Button asChild variant="outline">
                  <a href={data.homepage} target="_blank" rel="noreferrer">
                    <Globe className="size-4" />
                    Sitio oficial
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-10 py-8">
        {cast.length > 0 ? (
          <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-medium tracking-tight">Reparto</h2>
            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
              {cast.map((person) => (
  <Link
    key={person.id}
    to="/person/$id"
    params={{ id: String(person.id) }}
    className="w-28 shrink-0 group"
  >
    <div className="aspect-2/3 overflow-hidden rounded-lg bg-elevated shadow-[var(--shadow-border)] transition-transform duration-200 group-hover:scale-105">
      {profileUrl(person.profile_path) ? (
        <img
          src={profileUrl(person.profile_path)!}
          alt=""
          className="size-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="grid size-full place-items-center text-xs text-subtle">Sin foto</div>
      )}
    </div>
    <p className="mt-2 line-clamp-2 text-sm font-medium group-hover:text-accent">
      {person.name}
    </p>
    <p className="line-clamp-2 text-xs text-muted">{person.character}</p>
  </Link>
))}
            </div>
          </section>
        ) : null}

        {trailer ? (
          <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-medium tracking-tight">Tráiler</h2>
            <div className="mt-4 overflow-hidden rounded-xl bg-elevated shadow-[var(--shadow-border)]">
              <div className="aspect-video">
                <iframe
                  title={trailer.name}
                  src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
                  className="size-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        ) : null}

        {"seasons" in data && data.seasons?.length ? (
          <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-medium tracking-tight">Temporadas</h2>
            <p className="mt-1 text-sm text-muted">
              {data.number_of_seasons} temporadas · {data.number_of_episodes} episodios
              {data.networks?.[0] ? ` · ${data.networks[0].name}` : ""}
            </p>
            <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
              {data.seasons
                .filter((s) => s.season_number > 0)
                .map((season) => (
                  <div key={season.id} className="w-36 shrink-0">
                    <div className="aspect-2/3 overflow-hidden rounded-lg bg-elevated">
                      {posterUrl(season.poster_path) ? (
                        <img src={posterUrl(season.poster_path)!} alt="" className="size-full object-cover" />
                      ) : (
                        <div className="grid size-full place-items-center text-subtle">
                          <Tv className="size-6" />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium">{season.name}</p>
                    <p className="text-xs text-muted">
                      {season.episode_count} eps{season.air_date ? ` · ${season.air_date.slice(0, 4)}` : ""}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        ) : null}

        {providers ? (
          <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-medium tracking-tight">Dónde ver</h2>
            <div className="mt-4 flex flex-wrap gap-6">
              {providers.flatrate?.length ? (
                <ProviderGroup label="Suscripción" items={providers.flatrate} />
              ) : null}
              {providers.rent?.length ? <ProviderGroup label="Alquiler" items={providers.rent} /> : null}
              {providers.buy?.length ? <ProviderGroup label="Compra" items={providers.buy} /> : null}
            </div>
          </section>
        ) : null}

        <Facts data={data} />

        {reviews.length > 0 ? (
          <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-medium tracking-tight">Críticas</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {reviews.map((review) => (
                <blockquote
                  key={review.id}
                  className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
                >
                  <p className="line-clamp-6 text-sm leading-relaxed text-muted">{review.content}</p>
                  <footer className="mt-3 text-xs text-subtle">— {review.author}</footer>
                </blockquote>
              ))}
            </div>
          </section>
        ) : null}

        {recommended.length > 0 ? (
          <MediaRow title="Recomendadas" items={recommended} media={data.mediaType} />
        ) : null}
        {similar.length > 0 ? (
          <MediaRow title="Similares" items={similar} media={data.mediaType} />
        ) : null}
      </div>
    </article>
  );
}

function ProviderGroup({
  label,
  items,
}: {
  label: string;
  items: NonNullable<WatchLocale["flatrate"]>;
}) {
  return (
    <div>
      <p className="mb-2 text-xs tracking-wide text-muted uppercase">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((p) => (
          <div
            key={p.provider_id}
            className="flex items-center gap-2 rounded-md bg-elevated pr-3 shadow-[var(--shadow-border)]"
          >
            {logoUrl(p.logo_path) ? (
              <img src={logoUrl(p.logo_path)!} alt="" className="size-8 rounded-md" />
            ) : null}
            <span className="text-xs">{p.provider_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Facts({ data }: { data: Details }) {
  const rows: { label: string; value: string }[] = [];
  if ("original_title" in data && data.original_title && data.original_title !== mediaTitle(data)) {
    rows.push({ label: "Título original", value: data.original_title });
  }
  if ("original_name" in data && data.original_name && data.original_name !== mediaTitle(data)) {
    rows.push({ label: "Título original", value: data.original_name });
  }
  if (data.spoken_languages?.length) {
    rows.push({
      label: "Idiomas",
      value: data.spoken_languages.map((l) => l.name || l.english_name).join(", "),
    });
  }
  if (data.production_countries?.length) {
    rows.push({ label: "Países", value: data.production_countries.map((c) => c.name).join(", ") });
  }
  if (data.production_companies?.length) {
    rows.push({ label: "Productoras", value: data.production_companies.map((c) => c.name).join(", ") });
  }
  if ("budget" in data && data.budget) {
    rows.push({ label: "Presupuesto", value: formatMoney(data.budget) ?? "—" });
  }
  if ("revenue" in data && data.revenue) {
    rows.push({ label: "Recaudación", value: formatMoney(data.revenue) ?? "—" });
  }
  if ("in_production" in data) {
    rows.push({ label: "En producción", value: data.in_production ? "Sí" : "No" });
  }
  if ("type" in data && data.type) rows.push({ label: "Formato", value: data.type });

  if (rows.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <h2 className="font-display text-2xl font-medium tracking-tight">Ficha técnica</h2>
      <dl className="mt-4 divide-y divide-border rounded-xl bg-surface px-4 shadow-[var(--shadow-border)]">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="text-sm text-fg">{row.value}</dd>
          </div>
        ))}
      </dl>
      {"budget" in data && data.budget ? (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-subtle">
          <DollarSign className="size-3.5" />
          Cifras en dólares, según TMDb.
        </p>
      ) : null}
    </section>
  );
}

function pickProviders(map: Record<string, WatchLocale> | undefined): WatchLocale | null {
  if (!map) return null;
  const locale = map.ES || map.US || map.MX || Object.values(map)[0];
  if (!locale) return null;
  if (!locale.flatrate?.length && !locale.rent?.length && !locale.buy?.length) return null;
  return locale;
}
