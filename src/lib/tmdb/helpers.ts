import type { MediaSummary, MediaType, Video } from "./types";

const IMG = "https://image.tmdb.org/t/p";

export function posterUrl(
  path: string | null | undefined,
  size: "w185" | "w342" | "w500" | "w780" = "w342",
) {
  return path ? `${IMG}/${size}${path}` : null;
}

export function backdropUrl(
  path: string | null | undefined,
  size: "w780" | "w1280" | "original" = "w1280",
) {
  return path ? `${IMG}/${size}${path}` : null;
}

export function profileUrl(path: string | null | undefined, size: "w185" | "w500" = "w185") {
  return path ? `${IMG}/${size}${path}` : null;
}

export function logoUrl(path: string | null | undefined) {
  return path ? `${IMG}/w92${path}` : null;
}

export function mediaTitle(item: {
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
}) {
  return item.title || item.name || item.original_title || item.original_name || "Sin título";
}

export function mediaDate(item: { release_date?: string; first_air_date?: string }) {
  return item.release_date || item.first_air_date || "";
}

export function mediaYear(item: { release_date?: string; first_air_date?: string }) {
  const date = mediaDate(item);
  return date ? date.slice(0, 4) : "";
}

export function resolveMediaType(
  item: Pick<MediaSummary, "media_type" | "title" | "name">,
  fallback: MediaType = "movie",
): MediaType {
  if (item.media_type === "movie" || item.media_type === "tv") return item.media_type;
  if (item.title) return "movie";
  if (item.name) return "tv";
  return fallback;
}

export function titlePath(media: MediaType, id: number) {
  return media === "tv" ? `/tv/${id}` : `/movie/${id}`;
}

export function pickTrailer(videos: Video[] | undefined): Video | null {
  if (!videos?.length) return null;
  const youtube = videos.filter((v) => v.site === "YouTube");
  return (
    youtube.find((v) => v.type === "Trailer" && v.official) ||
    youtube.find((v) => v.type === "Trailer") ||
    youtube.find((v) => v.type === "Teaser") ||
    youtube[0] ||
    null
  );
}

export function tagMedia(items: MediaSummary[], mediaType: MediaType): MediaSummary[] {
  return items
    .filter((item) => item.media_type !== "person")
    .map((item) => ({
      ...item,
      media_type: item.media_type === "tv" || item.media_type === "movie" ? item.media_type : mediaType,
    }));
}

export function uniqueMedia(items: MediaSummary[], media?: MediaType) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.media_type ?? media ?? "x"}-${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
