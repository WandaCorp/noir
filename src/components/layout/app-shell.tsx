import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bookmark, Heart, Home, Library, Search, Send } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useFavorites } from "@/lib/favorites";
import { useWatchlist } from "@/lib/watchlist";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrated = useHydrated();
  const count = useFavorites((s) => s.items.length);
  const badge = hydrated ? count : 0;

  const watchlistCount = useWatchlist((s) => s.items.filter((i) => !i.watched).length);
  const watchlistBadge = hydrated ? watchlistCount : 0;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-18 sm:px-6 md:justify-start md:gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src="/The-Noir-Database-logo-app.png"
              alt="The Noir Database"
              className="h-auto w-[clamp(80px,18vw,150px)]"
            />
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
              className={cn(
                "inline-flex h-11 items-center rounded-md px-3 text-sm transition-colors duration-150",
                pathname.startsWith("/collections") ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
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
              to="/watchlist"
              className={cn(
                "inline-flex h-11 items-center rounded-md px-3 text-sm transition-colors duration-150",
                pathname.startsWith("/watchlist") ? "text-fg" : "text-muted hover:text-fg",
              )}
            >
              Watchlist
              {watchlistBadge > 0 ? (
                <span className="ml-1.5 rounded-full bg-elevated px-1.5 text-[11px] tabular-nums text-muted">
                  {watchlistBadge}
                </span>
              ) : null}
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

          <a
            href="https://t.me/thenoirdatabase"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-[#27A7E8] px-3 text-sm font-medium text-white transition-colors hover:bg-[#229ED9] md:hidden"
          >
            <Send className="size-4" />
            Telegram
          </a>

          <HeaderSearch />
        </div>
      </header>

      <main className="pb-24 md:pb-10">{children}</main>

      <footer className="mb-16 border-t border-border px-4 py-8 md:mb-0">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 text-xs text-subtle sm:flex-row sm:justify-between">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link
              to="/blog"
              className={cn(
                "transition-colors hover:text-fg",
                pathname.startsWith("/blog") ? "text-fg" : "",
              )}
            >
              Blog
            </Link>
            <span className="text-border" aria-hidden="true">
              ·
            </span>
            <Link
              to="/acerca"
              className={cn(
                "transition-colors hover:text-fg",
                pathname === "/acerca" ? "text-fg" : "",
              )}
            >
              Acerca de
            </Link>
            <span className="text-border" aria-hidden="true">
              ·
            </span>
            <Link
              to="/creditos"
              className={cn(
                "transition-colors hover:text-fg",
                pathname === "/creditos" ? "text-fg" : "",
              )}
            >
              Créditos
            </Link>
            <span className="text-border" aria-hidden="true">
              ·
            </span>
            <Link
              to="/privacidad"
              className={cn(
                "transition-colors hover:text-fg",
                pathname === "/privacidad" ? "text-fg" : "",
              )}
            >
              Políticas de Privacidad
            </Link>
            <span className="text-border" aria-hidden="true">
              ·
            </span>
            <Link
              to="/terminos"
              className={cn(
                "transition-colors hover:text-fg",
                pathname === "/terminos" ? "text-fg" : "",
              )}
            >
              Términos de uso
            </Link>
            <span className="text-border" aria-hidden="true">
              ·
            </span>
            <a href="mailto:nettisssoftware@gmail.com" className="transition-colors hover:text-fg">
              Contacto
            </a>
            <span className="text-border" aria-hidden="true">
              ·
            </span>
            <Link
              to="/faq"
              className={cn(
                "transition-colors hover:text-fg",
                pathname === "/faq" ? "text-fg" : "",
              )}
            >
              Preguntas frecuentes
            </Link>
          </nav>
          <p className="text-center sm:text-left">
            Explorador de cine y series alimentado por The Movie Database. Este producto usa la API
            de TMDB, pero no está avalado ni certificado por TMDB.
          </p>
          <p className="text-center sm:text-left">
            © 2026 Copyright The Noir Database, NetTiss Software. Algunos derechos reservados.
          </p>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-5">
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
          <li>
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
              to="/watchlist"
              className={cn(
                "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px]",
                pathname.startsWith("/watchlist") ? "text-fg" : "text-muted",
              )}
            >
              <Bookmark
                className={cn("size-5", pathname.startsWith("/watchlist") && "fill-current")}
              />
              Watchlist
              {watchlistBadge > 0 ? (
                <span className="absolute top-2 left-1/2 ml-3 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] text-accent-fg">
                  {watchlistBadge > 99 ? "99+" : watchlistBadge}
                </span>
              ) : null}
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
              <Heart
                className={cn("size-5", pathname.startsWith("/favorites") && "fill-current")}
              />
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
        Buscar películas, series y/o actores.
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
        <Input
          id="header-search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar título, series y actores..."
          className="pl-9"
        />
      </div>
    </form>
  );
}
