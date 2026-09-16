import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Preguntas Frecuentes · The Noir Database" },
      {
        name: "description",
        content:
          "Respuestas a las preguntas más frecuentes sobre The Noir Database: qué es, cómo funciona, de dónde viene la información y más.",
      },
    ],
  }),
  component: FaqPage,
});

const FAQ_ITEMS = [
  {
    q: "¿Qué es The Noir Database?",
    a: "The Noir Database es un catálogo cinematográfico moderno y gratuito que te permite descubrir películas, series, actores y sagas completas. No alojamos ni distribuimos contenido audiovisual: solo mostramos información para que descubras qué ver.",
  },
  {
    q: "¿Necesito crear una cuenta para usar la app?",
    a: "No. The Noir Database no requiere registro ni inicio de sesión. Puedes explorar todo el catálogo, buscar títulos y guardar tus favoritos sin crear ninguna cuenta.",
  },
  {
    q: "¿De dónde viene toda la información de películas y series?",
    a: "Toda la información (títulos, sinopsis, pósters, ratings, reparto, etc.) proviene de la API de The Movie Database (TMDb). The Noir Database no está respaldada ni certificada por TMDb, pero usamos su API bajo los términos de uso de su servicio.",
  },
  {
    q: "¿Puedo ver películas o series directamente aquí?",
    a: "No. The Noir Database no aloja, distribuye ni transmite contenido audiovisual. Somos un catálogo de descubrimiento: te mostramos información, tráilers y dónde ver cada título legalmente a través de plataformas de streaming oficiales.",
  },
  {
    q: "¿Dónde se guardan mis favoritos y mi lista de Ver después?",
    a: "Se guardan únicamente en tu dispositivo, usando el almacenamiento local (localStorage) de tu navegador. Nunca se envían a nuestros servidores ni se comparten con terceros. Si borras los datos del navegador, se perderán.",
  },
  {
    q: "¿The Noir Database es gratis?",
    a: "Sí, totalmente gratis. No hay planes de pago ni funciones premium. En el futuro podríamos mostrar anuncios (Google AdSense) para mantener el proyecto funcionando, pero el acceso siempre será gratuito.",
  },
  {
    q: "¿Por qué a veces veo información en otro idioma?",
    a: "La información se muestra principalmente en español. Sin embargo, algunos títulos menos conocidos pueden no tener traducción al español en TMDb, por lo que se muestran en su idioma original. Esto depende directamente de la base de datos de TMDb.",
  },
  {
    q: "¿Cómo puedo contactarlos o reportar un error?",
    a: "Puedes escribirnos a nettisssoftware@gmail.com. Aceptamos sugerencias, reportes de errores y consultas de cualquier tipo.",
  },
];

function FaqPage() {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Ayuda</p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Preguntas Frecuentes
        </h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          Encuentra respuestas rápidas sobre The Noir Database.
        </p>

        <Accordion type="single" collapsible className="mt-8 space-y-2">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="overflow-hidden rounded-lg bg-surface px-4 shadow-[var(--shadow-border)]"
            >
              <AccordionTrigger className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-fg hover:no-underline sm:text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 rounded-xl bg-surface p-6 text-center shadow-[var(--shadow-border)]">
          <p className="text-sm text-muted">
            ¿No encuentras la respuesta que buscas?
          </p>
          <a
            href="mailto:nettisssoftware@gmail.com"
            className="mt-2 inline-block text-sm font-medium text-accent hover:text-fg"
          >
            Contáctanos →
          </a>
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