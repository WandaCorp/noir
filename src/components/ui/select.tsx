import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 appearance-none rounded-md bg-elevated bg-[length:12px] bg-[position:right_12px_center] bg-no-repeat px-3.5 pr-10 text-sm text-fg shadow-[var(--shadow-border)]",
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%238c8c88%22 stroke-width=%222%22><path d=%22M3 4.5 6 8l3-3.5%22/></svg>')]",
        "transition-[box-shadow] duration-150 ease-[var(--ease-out)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
