import { Link } from "@tanstack/react-router";
import { Calendar, Globe, MapPin, Star, User, Film, Tv, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { profileUrl, posterUrl } from "@/lib/tmdb/helpers";
import { formatDate } from "@/lib/format";
import type { PersonDetails, PersonCast, MediaType } from "@/lib/tmdb/types";

type TabType = "movie" | "tv";

export function PersonPage({ 
	person, 
	activeTab, 
	onTabChange 
	
}: { 
	person: PersonDetails;
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
}) {
  
  const movieCredits = person.combined_credits.cast.filter(
    (c) => c.media_type === "movie" && c.poster_path
  );
  const tvCredits = person.combined_credits.cast.filter(
    (c) => c.media_type === "tv" && c.poster_path
  );

  const currentCredits = activeTab === "movie" ? movieCredits : tvCredits;

  return (
    <article>
      {/* Header */}
      <section className="relative min-h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-elevated via-bg to-bg" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>

          <div className="flex flex-col gap-8 sm:flex-row">
            {/* Profile Image */}
            <div className="shrink-0">
              <div className="w-40 overflow-hidden rounded-xl bg-elevated shadow-[var(--shadow-border)] sm:w-52">
                {profileUrl(person.profile_path, "w500") ? (
                  <img
                    src={profileUrl(person.profile_path, "w500")!}
                    alt={person.name}
                    className="aspect-2/3 w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-2/3 place-items-center text-subtle">
                    <User className="size-16" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
                {person.name}
              </h1>
              <p className="mt-2 text-sm text-muted">{person.known_for_department}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
                {person.birthday ? (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {formatDate(person.birthday)}
                    {person.deathday ? ` - ${formatDate(person.deathday)}` : ""}
                  </span>
                ) : null}
                {person.place_of_birth ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {person.place_of_birth}
                  </span>
                ) : null}
                {person.popularity > 0 ? (
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5 text-accent" />
                    {person.popularity.toFixed(1)} popularidad
                  </span>
                ) : null}
              </div>

              {person.homepage ? (
                <Button asChild variant="outline" className="mt-4">
                  <a href={person.homepage} target="_blank" rel="noreferrer">
                    <Globe className="size-4" />
                    Sitio oficial
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          {/* Biography */}
          {person.biography ? (
            <div className="mt-8 max-w-3xl">
              <h2 className="font-display text-xl font-medium">Biografía</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {person.biography}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Filmography */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Filmografía
          </h2>
          <span className="text-sm text-muted">{currentCredits.length} títulos</span>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-1 rounded-lg bg-elevated p-1">
          <TabButton
            active={activeTab === "movie"}
            onClick={() => onTabChange("movie")}
            icon={<Film className="size-4" />}
            label="Películas"
            count={movieCredits.length}
          />
          <TabButton
            active={activeTab === "tv"}
            onClick={() => onTabChange("tv")}
            icon={<Tv className="size-4" />}
            label="Series"
            count={tvCredits.length}
          />
        </div>

        {/* Poster Grid */}
        {currentCredits.length > 0 ? (
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
            {currentCredits.map((credit) => (
              <PosterGridItem key={`${credit.media_type}-${credit.id}`} credit={credit} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg bg-surface p-8 text-center text-sm text-muted">
            No hay {activeTab === "movie" ? "películas" : "series"} disponibles
          </div>
        )}
      </section>
    </article>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
        active ? "bg-bg text-fg shadow-sm" : "text-muted hover:text-fg"
      )}
    >
      {icon}
      {label}
      <span className="rounded-full bg-elevated px-2 py-0.5 text-xs tabular-nums">{count}</span>
    </button>
  );
}

function PosterGridItem({ credit }: { credit: PersonCast }) {
  const mediaType: MediaType = credit.media_type === "tv" ? "tv" : "movie";
  
  return (
    <Link
      to={mediaType === "movie" ? "/movie/$id" : "/tv/$id"}
      params={{ id: String(credit.id) }}
      className="group block"
    >
      <div className="overflow-hidden rounded-lg bg-elevated shadow-[var(--shadow-border)] transition-transform duration-200 group-hover:scale-105">
        {posterUrl(credit.poster_path, "w342") ? (
          <img
            src={posterUrl(credit.poster_path, "w342")!}
            alt={credit.title || credit.name || ""}
            loading="lazy"
            className="aspect-2/3 w-full object-cover"
          />
        ) : (
          <div className="grid aspect-2/3 place-items-center text-subtle">
            <Film className="size-8" />
          </div>
        )}
      </div>
      {credit.character ? (
        <p className="mt-2 line-clamp-1 text-xs text-muted">{credit.character}</p>
      ) : null}
      <p className="line-clamp-1 text-xs text-subtle">
        {credit.release_date?.slice(0, 4) || credit.first_air_date?.slice(0, 4) || ""}
      </p>
    </Link>
  );
}