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
      className={cn(
        has && "bg-danger text-fg hover:bg-danger/90",
        // 🆕 Responsive: círculo en móvil, píldora en desktop
        "size-10 rounded-full px-0 sm:h-10 sm:w-auto sm:rounded-md sm:px-4",
        className,
      )}
      onClick={...}
    >
      <Heart className={cn("size-4", has && "fill-current")} />
      {/* 🆕 Texto solo visible en desktop */}
      <span className="hidden sm:inline">
        {has ? "En favoritos" : "Favorito"}
      </span>
    </Button>
  );
}
