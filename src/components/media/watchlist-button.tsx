import { Bookmark, BookmarkCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist, type WatchlistItem } from "@/lib/watchlist";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

type Props = {
  item: Omit<WatchlistItem, "addedAt" | "watched">;
  size?: "default" | "sm" | "icon";
  variant?: "default" | "outline";
  showWatched?: boolean;
};

export function WatchlistButton({
  item,
  size = "default",
  variant = "outline",
  showWatched = false,
}: Props) {
  const hydrated = useHydrated();
  const inWatchlist = useWatchlist((s) => s.has(item.mediaType, item.id));
  const isWatched = useWatchlist((s) =>
    s.items.find((i) => i.mediaType === item.mediaType && i.id === item.id)?.watched,
  );
  const add = useWatchlist((s) => s.add);
  const remove = useWatchlist((s) => s.remove);
  const toggleWatched = useWatchlist((s) => s.toggleWatched);

  const active = hydrated && inWatchlist;

  function handleClick() {
    if (!active) {
      add({ ...item, addedAt: Date.now(), watched: false });
    } else if (showWatched) {
      toggleWatched(item.mediaType, item.id);
    } else {
      remove(item.mediaType, item.id);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(active && "text-accent")}
      aria-label={
        active ? "Quitar de ver después" : "Agregar a ver después"
      }
    >
      {showWatched && active && isWatched ? (
        <>
          <Check className="size-4" />
          Vista
        </>
      ) : active ? (
        <>
          <BookmarkCheck className="size-4" />
          En lista
        </>
      ) : (
        <>
          <Bookmark className="size-4" />
          Ver después
        </>
      )}
    </Button>
  );
}