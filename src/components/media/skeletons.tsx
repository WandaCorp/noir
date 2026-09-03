import { Skeleton } from "@/components/ui/skeleton";

export function PosterSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="w-36 shrink-0 sm:w-40">
          <Skeleton className="aspect-2/3 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-1.5 h-3 w-1/2" />
        </div>
      ))}
    </>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-hero min-h-96 overflow-hidden bg-surface">
      <Skeleton className="size-full rounded-none" />
      <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 sm:p-10">
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-1/2 max-w-sm" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton className="aspect-2/3 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-1.5 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div>
      <div className="relative h-hero min-h-96">
        <Skeleton className="size-full rounded-none" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex gap-6">
          <Skeleton className="hidden h-80 w-52 shrink-0 rounded-xl sm:block" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
