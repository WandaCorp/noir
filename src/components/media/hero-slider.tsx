import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { FavoriteButton } from "@/components/media/favorite-button";
import { Button } from "@/components/ui/button";
import { formatRating } from "@/lib/format";
import { backdropUrl, mediaTitle, mediaYear, resolveMediaType } from "@/lib/tmdb/helpers";
import type { MediaSummary } from "@/lib/tmdb/types";
import { cn } from "@/lib/utils";

const INTERVAL = 6500;

export function HeroSlider({ items }: { items: MediaSummary[] }) {
  const slides = items.filter((item) => item.backdrop_path).slice(0, 8);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const goTo = useCallback(
    (next: number) => {
      const el = scrollerRef.current;
      if (!el || slides.length === 0) return;
      const wrapped = (next + slides.length) % slides.length;
      const width = el.clientWidth;
      el.scrollTo({ left: wrapped * width, behavior: reduceMotion ? "auto" : "smooth" });
      setIndex(wrapped);
    },
    [reduceMotion, slides.length],
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const width = el.clientWidth || 1;
      const next = Math.round(el.scrollLeft / width);
      setIndex(Math.min(Math.max(next, 0), slides.length - 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [slides.length]);

  useEffect(() => {
    if (paused || reduceMotion || slides.length < 2) return;
    const id = window.setInterval(() => goTo(index + 1), INTERVAL);
    return () => window.clearInterval(id);
  }, [goTo, index, paused, reduceMotion, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carrusel"
      aria-label="Destacados"
    >
      <div
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ touchAction: "pan-y pinch-zoom" }}
      >
        {slides.map((item, i) => {
          const type = resolveMediaType(item);
          const title = mediaTitle(item);
          const year = mediaYear(item);
          const image = backdropUrl(item.backdrop_path);
          return (
            <article
              key={`${type}-${item.id}`}
              className="relative h-hero min-h-96 w-full shrink-0 snap-center"
              aria-hidden={i !== index}
            >
              {image ? (
                <img
                  src={image}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  fetchPriority={i === 0 ? "high" : "low"}
                />
              ) : null}
              <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/55 to-bg/20" />
              <div className="absolute inset-0 bg-linear-to-r from-bg/80 via-bg/20 to-transparent" />
              <div className="relative flex h-full items-end">
                <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
                  <p className="mb-2 text-xs font-medium tracking-[0.18em] text-accent uppercase">
                    {type === "tv" ? "Serie" : "Película"} · {year || "TMDb"}
                  </p>
                  <h2 className="max-w-3xl font-display text-4xl leading-none font-medium tracking-tight text-fg sm:text-6xl">
                    {title}
                  </h2>
                  <p className="mt-3 flex items-center gap-2 text-sm text-accent">
                    <Star className="size-4 fill-current" />
                    <span className="tabular-nums">{formatRating(item.vote_average)}</span>
                    <span className="text-muted">en TMDb</span>
                  </p>
                  {item.overview ? (
                    <p className="mt-3 max-w-xl line-clamp-3 text-sm leading-relaxed text-muted sm:text-base">
                      {item.overview}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Button asChild>
                      <Link to={type === "tv" ? "/tv/$id" : "/movie/$id"} params={{ id: String(item.id) }}>
                        <Play className="size-4" />
                        Ver ficha
                      </Link>
                    </Button>
                    <FavoriteButton
                      size="default"
                      item={{
                        id: item.id,
                        mediaType: type,
                        title,
                        posterPath: item.poster_path,
                        year,
                        rating: item.vote_average,
                      }}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {slides.length > 1 ? (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-1/2 left-3 hidden -translate-y-1/2 sm:inline-flex"
            aria-label="Anterior"
            onClick={() => goTo(index - 1)}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-1/2 right-3 hidden -translate-y-1/2 sm:inline-flex"
            aria-label="Siguiente"
            onClick={() => goTo(index + 1)}
          >
            <ChevronRight className="size-5" />
          </Button>
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((item, i) => (
              <button
                key={`${item.id}-dot`}
                type="button"
                aria-label={`Ir a la diapositiva ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-250 ease-[var(--ease-out)]",
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-fg/35 hover:bg-fg/60",
                )}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
