import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad · The Noir Database" },
      {
        name: "description",
        content:
          "Política de Privacidad de The Noir Database. Conoce cómo manejamos tu información y el uso del almacenamiento local.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Legal</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-muted">
          Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            En The Noir Database, valoramos tu privacidad. Esta Política de Privacidad
            describe cómo manejamos la información cuando utilizas nuestro sitio web (en
            adelante, "el Servicio").
          </p>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              1. Información que Recopilamos
            </h2>
            <p className="mt-3">
              The Noir Database es un catálogo de información sobre películas y series.{" "}
              <strong className="text-fg">
                No requerimos que te registres ni que inicies sesión
              </strong>{" "}
              para usar la aplicación. Por lo tanto, no recopilamos activamente información
              de identificación personal tuya, como tu nombre, dirección de correo
              electrónico o número de teléfono.
            </p>
            <p className="mt-3">
              Sin embargo, utilizamos la tecnología de{" "}
              <strong className="text-fg">Almacenamiento Local (Local Storage)</strong> de
              tu navegador para mejorar tu experiencia. Esta es una tecnología estándar que
              permite a los sitios web almacenar datos directamente en tu dispositivo.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              2. Cómo Usamos el Almacenamiento Local
            </h2>
            <p className="mt-3">
              Utilizamos el Almacenamiento Local para guardar tus preferencias y actividad
              dentro de The Noir Database. Los datos que almacenamos son:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-fg">Tu lista de Favoritos:</strong> Cuando marcas
                una película o serie como favorita, guardamos esa selección en tu
                dispositivo para que esté disponible la próxima vez que visites el sitio.
              </li>
              <li>
                <strong className="text-fg">Tu lista de "Ver después" (Watchlist):</strong>{" "}
                Cuando agregas un título a tu lista de "Ver después", guardamos esa
                información en tu dispositivo, junto con el estado de si la has visto o no.
              </li>
            </ul>
            <p className="mt-3">
              Estos datos{" "}
              <strong className="text-fg">
                se almacenan únicamente en tu dispositivo local
              </strong>{" "}
              y <strong className="text-fg">nunca son transmitidos a nuestros servidores</strong>{" "}
              ni compartidos con terceros. Esto significa que tu lista de favoritos y tu
              watchlist son privadas y solo son accesibles desde el navegador que utilizas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              3. Publicidad y Cookies de Terceros (Futuro)
            </h2>
            <p className="mt-3">
              Actualmente, The Noir Database no muestra anuncios. Sin embargo, estamos en
              proceso de solicitar la aprobación para implementar{" "}
              <strong className="text-fg">Google AdSense</strong>, un servicio de publicidad
              de Google.
            </p>
            <p className="mt-3">
              Una vez que AdSense sea aprobado e implementado, esta Política de Privacidad
              será actualizada para reflejar lo siguiente:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-fg">Cookies de Publicidad:</strong> Google, como
                proveedor externo, utiliza cookies para publicar anuncios en este sitio.
              </li>
              <li>
                <strong className="text-fg">Cookie de DoubleClick DART:</strong> El uso de
                la cookie DART por parte de Google permite publicar anuncios a los usuarios
                basados en su visita a este sitio y a otros sitios en Internet.
              </li>
              <li>
                <strong className="text-fg">Opción de Exclusión:</strong> Los usuarios
                pueden optar por no utilizar la cookie DART visitando la Política de
                Privacidad de la red de anuncios y contenido de Google. Como alternativa,
                pueden optar por no participar en el uso de cookies de terceros para
                publicidad basada en intereses visitando{" "}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:text-fg"
                >
                  www.aboutads.info
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              4. Tus Derechos
            </h2>
            <p className="mt-3">
              Dado que no recopilamos datos personales a través de nuestros servidores, no
              podemos proporcionar, corregir o eliminar tu información personal. La
              información almacenada localmente (favoritos y watchlist) puede ser eliminada
              en cualquier momento por ti, simplemente borrando los datos de tu navegador
              para este sitio web.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              5. Cumplimiento Legal
            </h2>
            <p className="mt-3">
              Nos esforzamos por cumplir con las normativas aplicables a nivel
              internacional. Dado que no recopilamos datos personales, no estamos sujetos a
              muchas de las obligaciones de notificación de leyes como el Reglamento
              General de Protección de Datos (GDPR) de la Unión Europea o la Ley de
              Privacidad del Consumidor de California (CCPA). Sin embargo, estamos
              comprometidos con la transparencia y la claridad en cuanto a nuestras
              prácticas de datos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium tracking-tight text-fg">
              6. Contacto
            </h2>
            <p className="mt-3">
              Si tienes alguna pregunta sobre esta Política de Privacidad, puedes
              contactarnos en:{" "}
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