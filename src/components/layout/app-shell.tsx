import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Clapperboard, Heart, Home, Library, Search } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useFavorites } from "@/lib/favorites";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrated = useHydrated();
  const count = useFavorites((s) => s.items.length);
  const badge = hydrated ? count : 0;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:h-18 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-accent text-accent-fg">
              <Clapperboard className="size-4" />
            </span>
            <span className="font-display text-2xl leading-none tracking-tight">NOIR</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className={cn(
                "inline-flex h-11 items-center rounded-md px-3 text-sm transition-colors duration-150",
                pathname === "/" ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              Inicio
            </Link>
            <Link
                to="/collections"
                 className={cn("inline-flex h-11 items-center rounded-md px-3 text-sm transition-colors duration-150",pathname.startsWith("/collections") ? "text-fg" : "text-muted hover:text-fg",)}>
              Colecciones
            </Link>
            <Link
              to="/search"
              search={{ q: "", genre: "", year: "", media: "all" }}
              className={cn(
                "inline-flex h-11 items-center rounded-md px-3 text-sm transition-colors duration-150",
                pathname.startsWith("/search") ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              Buscar
            </Link>
            <Link
              to="/favorites"
              className={cn(
                "inline-flex h-11 items-center rounded-md px-3 text-sm transition-colors duration-150",
                pathname.startsWith("/favorites") ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              Favoritos
              {badge > 0 ? (
                <span className="ml-1.5 rounded-full bg-elevated px-1.5 text-[11px] tabular-nums text-muted">
                  {badge}
                </span>
              ) : null}
            </Link>
          </nav>
          <HeaderSearch />
        </div>
      </header>

      <main className="pb-24 md:pb-10">{children}</main>

      <footer className="hidden border-t border-border px-4 py-8 text-center text-xs text-subtle md:block">
        <p>Este producto usa la API de TMDb pero no está respaldado ni certificado por TMDb.</p>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-4">
          <li>
            <Link
              to="/"
              className={cn(
                "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px]",
                pathname === "/" ? "text-fg" : "text-muted",
              )}
            >
              <Home className="size-5" />
              Inicio
            </Link>
          </li>
          <li>
          	<li>
  <Link
    to="/collections"
    className={cn(
      "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px]",
      pathname.startsWith("/collections") ? "text-fg" : "text-muted",
    )}
  >
    <Library className="size-5" />
    Colecciones
  </Link>
</li>
            <Link
              to="/search"
              search={{ q: "", genre: "", year: "", media: "all" }}
              className={cn(
                "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px]",
                pathname.startsWith("/search") ? "text-fg" : "text-muted",
              )}
            >
              <Search className="size-5" />
              Buscar
            </Link>
          </li>
          <li>
            <Link
              to="/favorites"
              className={cn(
                "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px]",
                pathname.startsWith("/favorites") ? "text-fg" : "text-muted",
              )}
            >
              <Heart className={cn("size-5", pathname.startsWith("/favorites") && "fill-current")} />
              Favoritos
              {badge > 0 ? (
                <span className="absolute top-2 left-1/2 ml-3 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] text-fg">
                  {badge > 99 ? "99+" : badge}
                </span>
              ) : null}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function HeaderSearch() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void navigate({
      to: "/search",
      search: { q: value.trim(), genre: "", year: "", media: "all" },
    });
  }

  return (
    <form onSubmit={onSubmit} className="ml-auto hidden min-w-0 max-w-sm flex-1 md:block">
      <label className="sr-only" htmlFor="header-search">
        Buscar películas o series
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
        <Input
          id="header-search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar título, serie…"
          className="pl-9"
        />
      </div>
    </form>
  );
}
