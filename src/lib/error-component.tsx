import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg">
      <span className="text-danger" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={1.6} />
      </span>
      <h1 className="font-display text-3xl font-medium tracking-tight">Algo salió mal</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {error.message || "Ocurrió un error inesperado. Prueba a recargar."}
      </p>
      <Link
        to="/"
        className="mt-2 inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
