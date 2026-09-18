import { createFileRoute, notFound } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { fetchPostById } from "@/lib/blog/api";
import { formatDate } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await fetchPostById(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  pendingComponent: BlogPostSkeleton,
  notFoundComponent: BlogPostNotFound,
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.titulo} · The Noir Database` },
        {
          name: "description",
          content: post.descripcion.slice(0, 160),
        },
        { property: "og:title", content: post.titulo },
        { property: "og:description", content: post.descripcion.slice(0, 160) },
        { property: "og:image", content: post.imagen },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://noirdatabase.vercel.app/blog/${post.id}` },
        { property: "article:published_time", content: post.fecha },
        ...(post.seccion.length
          ? [{ property: "article:section", content: post.seccion.join(", ") }]
          : []),
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Meta superior */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tracking-[0.18em] text-muted uppercase">
          <span>The Noir Database</span>
          {post.seccion.length > 0 ? (
            <>
              <span aria-hidden="true">•</span>
              <span>{post.seccion.join(" • ")}</span>
            </>
          ) : null}
        </div>

        {/* Título */}
        <h1 className="mt-4 font-display text-3xl leading-tight font-medium tracking-tight text-fg sm:text-5xl">
          {post.titulo}
        </h1>

        {/* Descripción */}
        {post.descripcion ? (
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {post.descripcion}
          </p>
        ) : null}

        {/* Fecha */}
        {post.fecha ? (
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-subtle">
            <Calendar className="size-3.5" />
            {formatDate(post.fecha)}
          </p>
        ) : null}

        {/* Imagen */}
        {post.imagen ? (
          <div className="mt-8 overflow-hidden rounded-xl bg-elevated shadow-[var(--shadow-border)]">
            <img
              src={post.imagen}
              alt={post.titulo}
              className="aspect-video w-full object-cover"
            />
          </div>
        ) : null}

        {/* Contenido Markdown */}
        {post.contenido ? (
          <div className="mt-10">
            <MarkdownRenderer content={post.contenido} />
          </div>
        ) : null}
      </article>
    </AppShell>
  );
}

function BlogPostSkeleton() {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="mt-4 h-12 w-full" />
        <Skeleton className="mt-2 h-12 w-3/4" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
        <Skeleton className="mt-4 h-3 w-32" />
        <Skeleton className="mt-8 aspect-video w-full rounded-xl" />
        <div className="mt-10 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </article>
    </AppShell>
  );
}

function BlogPostNotFound() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">404</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
          Artículo no encontrado
        </h1>
        <p className="mt-3 text-sm text-muted">
          Este artículo no existe o ha sido despublicado.
        </p>
      </div>
    </AppShell>
  );
}