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
    className={cn(
      active && "text-accent",
      // 🆕 Responsive
      "size-10 rounded-full px-0 sm:h-10 sm:w-auto sm:rounded-md sm:px-4",
    )}
    aria-label={active ? "Quitar de ver después" : "Agregar a ver después"}
  >
    {active ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
    {/* 🆕 Texto solo visible en desktop */}
    <span className="hidden sm:inline">
      {active ? "En lista" : "Ver después"}
    </span>
  </Button>
);
}