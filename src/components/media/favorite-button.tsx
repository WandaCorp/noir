import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useFavorites, type FavoriteItem } from "@/lib/favorites";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  item,
  className,
  size = "icon",
}: {
  item: FavoriteItem;
  className?: string;
  size?: "icon" | "icon-sm" | "default";
}) {
  const hydrated = useHydrated();
  const stored = useFavorites((s) => s.has(item.mediaType, item.id));
  const toggle = useFavorites((s) => s.toggle);
  const has = hydrated && stored;

  return (
    <Button
      type="button"
      variant={has ? "default" : "secondary"}
      size={size}
      aria-pressed={has}
      aria-label={has ? "Quitar de favoritos" : "Añadir a favoritos"}
      className={cn(has && "bg-danger text-fg hover:bg-danger/90", className)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const result = toggle(item);
        if (result === "added") toast.success(`«${item.title}» se guardó en favoritos`);
        else toast.success(`«${item.title}» se quitó de favoritos`);
      }}
    >
      <Heart className={cn("size-4", has && "fill-current")} />
      {size === "default" ? (has ? "En favoritos" : "Favorito") : null}
    </Button>
  );
}
