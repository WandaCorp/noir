import { Play, Share2 } from "lucide-react";
import { toast } from "sonner";
import { FavoriteButton } from "@/components/media/favorite-button";
import { WatchlistButton } from "@/components/media/watchlist-button";
import { Button } from "@/components/ui/button";
import type { FavoriteItem } from "@/lib/favorites";
import type { Video } from "@/lib/tmdb/types";

type Props = {
  item: FavoriteItem;
  trailer: Video | null;
  shareTitle: string;
};

export function TitleActions({ item, trailer, shareTitle }: Props) {
  async function handleShare() {
    const url = window.location.href;
    const data = {
      title: shareTitle,
      text: `Mira ${shareTitle} en NOIR`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Enlace copiado al portapapeles");
      }
    } catch {
      // Usuario canceló el compartir
    }
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {trailer ? (
        <Button
          asChild
          size="icon"
          className="size-10 rounded-full sm:h-10 sm:w-auto sm:rounded-md sm:px-4"
        >
          <a
            href={`https://www.youtube.com/watch?v=${trailer.key}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Ver tráiler"
          >
            <Play className="size-4" />
            <span className="hidden sm:inline">Ver tráiler</span>
          </a>
        </Button>
      ) : null}

      <WatchlistButton
        item={{
          id: item.id,
          mediaType: item.mediaType,
          title: item.title,
          posterPath: item.posterPath,
          year: item.year,
          rating: item.rating,
        }}
      />

      <FavoriteButton item={item} />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleShare}
        aria-label="Compartir"
        className="size-10 rounded-full sm:h-10 sm:w-auto sm:rounded-md sm:px-4"
      >
        <Share2 className="size-4" />
        <span className="hidden sm:inline">Compartir</span>
      </Button>
    </div>
  );
}