import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/acerca")({
  head: () => ({
    meta: [
      { title: "Acerca de · The Noir Database" },
      {
        name: "description",
        content:
          "Conoce qué es The Noir Database, quién está detrás del proyecto y cuál es su misión: un catálogo cinematográfico moderno y gratuito.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Información</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Acerca de
        </h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            <strong className="text-fg">The Noir Database</strong> es un catálogo
            cinematográfico moderno, gratuito y sin registro, diseñado para que
            descubras películas, series, actores y sagas completas de forma rápida y
            agradable.
          </p>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              Nuestra misión
            </h2>
            <p className="mt-3">
              Creemos que explorar el mundo del cine debería ser simple, visual y sin
              fricciones. Por eso construimos una plataforma que combina la potencia de
              la base de datos de TMDb con una interfaz limpia inspirada en el cine
              clásico.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              ¿Qué puedes hacer en The Noir Database?
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Explorar películas y series populares, mejor valoradas y próximos estrenos.</li>
              <li>Buscar por título, género, año o persona.</li>
              <li>Consultar la filmografía completa de cualquier actor o actriz.</li>
              <li>Descubrir sagas y colecciones completas.</li>
              <li>Guardar tus favoritos y tu lista de "Ver después" directamente en tu dispositivo.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              Un proyecto en evolución
            </h2>
            <p className="mt-3">
              The Noir Database es un proyecto en constante mejora. Nuevas funciones,
              mejoras visuales y contenido adicional se irán incorporando con el tiempo.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              Sobre el contenido
            </h2>
            <p className="mt-3">
              Toda la información sobre películas, series, actores y colecciones es
              proporcionada por la{" "}
              <strong className="text-fg">API de The Movie Database (TMDb)</strong>. The
              Noir Database no aloja ni distribuye contenido audiovisual.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              Contacto
            </h2>
            <p className="mt-3">
              Para consultas, sugerencias o reportes de errores, escríbenos a:{" "}
              <a
                href="mailto:nettisssoftware@gmail.com"
                className="text-accent hover:text-fg"
              >
                nettisssoftware@gmail.com
              </a>
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