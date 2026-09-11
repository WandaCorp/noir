import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos de Uso · The Noir Database" },
      {
        name: "description",
        content:
          "Términos de Uso de The Noir Database. Condiciones de uso, créditos a TMDb y limitación de responsabilidad.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Legal</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Términos de Uso
        </h1>
        <p className="mt-2 text-sm text-muted">
          Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            Bienvenido a The Noir Database. Al acceder o utilizar nuestro sitio web (en
            adelante, "el Servicio"), aceptas estar sujeto a estos Términos de Uso.
          </p>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              1. Descripción del Servicio
            </h2>
            <p className="mt-3">
              The Noir Database es una plataforma de catalogación y descubrimiento de
              contenido audiovisual.{" "}
              <strong className="text-fg">
                El Servicio no aloja, distribuye ni transmite películas, series o cualquier
                otro contenido audiovisual.
              </strong>{" "}
              Toda la información proporcionada es de carácter informativo y se obtiene de
              la <strong className="text-fg">API de The Movie Database (TMDb)</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              2. Propiedad Intelectual y Créditos
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-fg">The Noir Database:</strong> El diseño, la
                interfaz y el código de este sitio web son propiedad de The Noir Database.
              </li>
              <li>
                <strong className="text-fg">The Movie Database (TMDb):</strong> Esta
                aplicación utiliza la API de TMDb, pero{" "}
                <strong className="text-fg">no está respaldada ni certificada por TMDb</strong>.
                Toda la información, incluyendo imágenes, sinopsis y metadatos, es
                proporcionada por TMDb. Los derechos de este contenido pertenecen a sus
                respectivos propietarios.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              3. Uso Aceptable
            </h2>
            <p className="mt-3">
              Te comprometes a utilizar el Servicio de manera lícita y a no:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Utilizar el Servicio para fines ilegales.</li>
              <li>Intentar acceder a áreas restringidas del Servicio.</li>
              <li>Interferir con el funcionamiento correcto del Servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              4. Limitación de Responsabilidad
            </h2>
            <p className="mt-3">
              The Noir Database se proporciona "tal cual". No garantizamos que el Servicio
              sea ininterrumpido, libre de errores o que la información sea completamente
              precisa. No nos hacemos responsables de ningún daño derivado del uso del
              Servicio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              5. Publicidad
            </h2>
            <p className="mt-3">
              El Servicio puede mostrar anuncios de terceros, como Google AdSense, en el
              futuro. Al utilizar el Servicio, aceptas la posible visualización de dichos
              anuncios.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              6. Modificaciones
            </h2>
            <p className="mt-3">
              Nos reservamos el derecho de modificar estos Términos de Uso en cualquier
              momento. Los cambios entrarán en vigor inmediatamente después de su
              publicación en el sitio web.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              7. Ley Aplicable y Jurisdicción
            </h2>
            <p className="mt-3">
              Estos Términos de Uso se regirán e interpretarán de acuerdo con las leyes de
              la República de Paraguay. Cualquier disputa relacionada con el Servicio se
              someterá a la jurisdicción exclusiva de los tribunales de Paraguay.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              8. Contacto
            </h2>
            <p className="mt-3">
              Para cualquier consulta sobre estos Términos de Uso, puedes contactarnos en:{" "}
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