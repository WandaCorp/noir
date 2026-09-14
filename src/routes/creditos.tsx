import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/creditos")({
  head: () => ({
    meta: [
      { title: "Créditos · The Noir Database" },
      {
        name: "description",
        content:
          "Créditos y atribuciones de The Noir Database: TMDb, tecnologías utilizadas y recursos gráficos.",
      },
    ],
  }),
  component: CreditsPage,
});

function CreditsPage() {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Atribuciones</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Créditos
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted sm:text-base">
          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              Datos y contenido
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-fg">The Movie Database (TMDb):</strong> Toda la
                información sobre películas, series, personas y colecciones (incluyendo
                imágenes, sinopsis y metadatos) es proporcionada por TMDb a través de su
                API pública.{" "}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:text-fg"
                >
                  themoviedb.org
                </a>
              </li>
              <li>
                <strong className="text-fg">Aviso:</strong> Este producto usa la API de
                TMDb pero no está respaldado ni certificado por TMDb.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              Tecnologías utilizadas
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-fg">React 19</strong> — Biblioteca de interfaces
                de usuario.
              </li>
              <li>
                <strong className="text-fg">TanStack Start & Router</strong> — Framework
                full-stack y enrutamiento.
              </li>
              <li>
                <strong className="text-fg">TanStack Query</strong> — Gestión de datos y
                caché.
              </li>
              <li>
                <strong className="text-fg">TypeScript</strong> — Tipado estático.
              </li>
              <li>
                <strong className="text-fg">Tailwind CSS v4</strong> — Sistema de estilos
                utilitarios.
              </li>
              <li>
                <strong className="text-fg">Radix UI & Vaul</strong> — Componentes
                accesibles y hojas inferiores.
              </li>
              <li>
                <strong className="text-fg">Zustand</strong> — Gestión de estado local.
              </li>
              <li>
                <strong className="text-fg">Vite & Nitro</strong> — Empaquetado y
                despliegue.
              </li>
              <li>
                <strong className="text-fg">Vercel</strong> — Plataforma de despliegue.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              Tipografía e iconografía
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-fg">Cormorant Garamond</strong> y{" "}
                <strong className="text-fg">Outfit</strong> — Tipografías cortesía de{" "}
                <a
                  href="https://fonts.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:text-fg"
                >
                  Google Fonts
                </a>
                .
              </li>
              <li>
                <strong className="text-fg">Lucide Icons</strong> — Conjunto de iconos de
                código abierto.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              Reconocimientos
            </h2>
            <p className="mt-3">
              Gracias a la comunidad de código abierto y a TMDb por hacer posible este
              proyecto.
            </p>
          </section>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
          >
            ← Volver al inicio
          </Link>
        </div>
      </article>
    </AppShell>
  );
}