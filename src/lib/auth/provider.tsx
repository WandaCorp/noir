import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [client] = useState(makeQueryClient);
  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster
        theme="dark"
        position="top-center"
        offset={18}
        toastOptions={{
          classNames: {
            toast: "bg-elevated text-fg border-border shadow-[var(--shadow-border)] font-sans",
            title: "text-fg",
            description: "text-muted",
            success: "text-success",
            error: "text-danger",
          },
        }}
      />
    </QueryClientProvider>
  );
}
