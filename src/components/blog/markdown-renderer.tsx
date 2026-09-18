import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export function MarkdownRenderer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Estilos base del contenedor
        "space-y-4 text-[15px] leading-[1.75] text-muted sm:text-base",
        className,
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mt-10 mb-4 font-display text-3xl font-medium leading-tight tracking-tight text-fg sm:text-4xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 mb-3 font-display text-2xl font-medium leading-tight tracking-tight text-fg sm:text-3xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 mb-2 font-display text-xl font-medium leading-tight tracking-tight text-fg sm:text-2xl">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-6 mb-2 font-display text-lg font-medium leading-tight tracking-tight text-fg sm:text-xl">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="mt-5 mb-2 text-base font-semibold text-fg">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="mt-4 mb-2 text-sm font-semibold tracking-wide text-fg uppercase">
              {children}
            </h6>
          ),
          p: ({ children }) => <p className="my-4">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-fg">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:text-fg hover:decoration-fg"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-2 pl-6 marker:text-accent">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-decimal space-y-2 pl-6 marker:text-accent">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-accent pl-5 font-display text-lg italic text-fg">
              {children}
            </blockquote>
          ),
          code: ({ children, className: codeClassName }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
                  {children}
                </code>
              );
            }
            return (
              <code className="block overflow-x-auto rounded-lg bg-elevated p-4 font-mono text-sm text-fg">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="my-6">{children}</pre>,
          hr: () => <hr className="my-10 border-border" />,
          img: ({ src, alt }) =>
            src ? (
              <span className="my-6 block">
                <img
                  src={src}
                  alt={alt ?? ""}
                  loading="lazy"
                  className="w-full rounded-lg"
                />
                {alt ? (
                  <span className="mt-2 block text-center text-xs text-subtle italic">
                    {alt}
                  </span>
                ) : null}
              </span>
            ) : null,
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-lg shadow-[var(--shadow-border)]">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-elevated px-4 py-2 text-left font-semibold text-fg">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-4 py-2">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}