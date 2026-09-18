import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Calendar, ImageOff } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllPosts, extractSections } from "@/lib/blog/api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog · The Noir Database" },
      {
        name: "description",
        content:
          "Artículos, guías y análisis de cine en The Noir Database. Descubre listas, recomendaciones y mucho más.",
      },
    ],
  }),
  component: BlogPage,
});

const POSTS_PER_PAGE = 5;
const ALL_TAB = "__all__";

function BlogPage() {
  const postsQuery = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchAllPosts,
  });

  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const posts = postsQuery.data ?? [];
  const sections = useMemo(() => extractSections(posts), [posts]);

  const filteredPosts = useMemo(() => {
    if (activeTab === ALL_TAB) return posts;
    return posts.filter((post) => post.seccion.includes(activeTab));
  }, [posts, activeTab]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  function handleTabChange(value: string) {
    setActiveTab(value);
    setVisibleCount(POSTS_PER_PAGE);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Editorial</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Blog
        </h1>
        <p className="mt-2 text-sm text-muted">
          Artículos, guías y análisis de cine.
        </p>

        {/* Tabs */}
        {posts.length > 0 ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
            <TabsList>
              <TabsTrigger value={ALL_TAB}>Todos</TabsTrigger>
              {sections.map((section) => (
                <TabsTrigger key={section} value={section}>
                  {section}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}

        {/* Contenido */}
        <div className="mt-6">
          {postsQuery.isLoading ? (
            <BlogGridSkeleton />
          ) : postsQuery.isError ? (
            <EmptyState
              title="No se pudieron cargar los artículos"
              message="Intenta de nuevo más tarde."
            />
          ) : posts.length === 0 ? (
            <EmptyState
              title="Aún no hay publicaciones"
              message="Pronto publicaremos contenido nuevo."
            />
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              title={`No hay artículos en "${activeTab}"`}
              message="Prueba con otra sección."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {hasMore ? (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}
                  >
                    Cargar más
                  </Button>
                </div>
              ) : (
                <p className="mt-10 text-center text-xs text-subtle">
                  — Has llegado al final —
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function BlogCard({ post }: { post: { id: string; titulo: string; descripcion: string; imagen: string; fecha: string } }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.id }}
      className="group block"
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-elevated">
        {post.imagen ? (
          <img
            src={post.imagen}
            alt={post.titulo}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid size-full place-items-center text-subtle">
            <ImageOff className="size-8" />
          </div>
        )}
      </div>
      <h2 className="mt-4 line-clamp-2 font-display text-xl font-medium leading-tight tracking-tight group-hover:text-accent">
        {post.titulo}
      </h2>
      {post.descripcion ? (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {post.descripcion}
        </p>
      ) : null}
      {post.fecha ? (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-subtle">
          <Calendar className="size-3" />
          {formatDate(post.fecha)}
        </p>
      ) : null}
    </Link>
  );
}

function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i}>
          <Skeleton className="aspect-video w-full rounded-lg" />
          <Skeleton className="mt-4 h-5 w-4/5" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-1.5 h-4 w-3/5" />
          <Skeleton className="mt-3 h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-xl bg-surface px-6 py-16 text-center shadow-[var(--shadow-border)]">
      <p className="font-display text-xl font-medium text-fg">{title}</p>
      <p className="mt-2 text-sm text-muted">{message}</p>
    </div>
  );
}