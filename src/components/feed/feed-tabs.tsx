import { cn } from "@/lib/utils";

export const FEED_TABS = [
  { id: "featured", label: "Destacados" },
  { id: "movies", label: "Películas" },
  { id: "series", label: "Series" },
  { id: "trending", label: "Tendencias" },
] as const;

export type FeedTab = (typeof FEED_TABS)[number]["id"];

export function FeedTabs({
  value,
  onChange,
}: {
  value: FeedTab;
  onChange: (tab: FeedTab) => void;
}) {
  return (
    <div className="sticky top-16 z-30 bg-bg/90 py-3 backdrop-blur-md sm:top-[4.25rem]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          role="tablist"
          aria-label="Secciones del feed"
          className="flex gap-1 overflow-x-auto rounded-xl bg-surface p-1 shadow-[var(--shadow-border)]"
        >
          {FEED_TABS.map((tab) => {
            const selected = tab.id === value;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={cn(
                  "h-10 min-w-0 flex-1 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-[background-color,color,transform] duration-150 ease-[var(--ease-out)]",
                  selected ? "bg-elevated text-fg shadow-[var(--shadow-border)]" : "text-muted hover:text-fg",
                )}
                onClick={() => onChange(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
