export default function Loading() {
  return (
    <div className="animate-fade-in" aria-hidden>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="h-3 w-24 animate-pulse rounded bg-gray-100 dark:bg-gray-100/10" />
          <div className="mt-2 h-7 w-56 animate-pulse rounded bg-gray-100 dark:bg-gray-100/10" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100 dark:bg-gray-100/10" />
        </div>
        <div className="h-10 w-48 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-100/10" />
      </div>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card flex items-center gap-3 p-4">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-100/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-100/10" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-100/10" />
            </div>
          </div>
        ))}
      </div>
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card space-y-2 p-4">
            <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-100/10" />
            <div className="h-6 w-16 animate-pulse rounded bg-gray-100 dark:bg-gray-100/10" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-100/10" />
          </div>
        ))}
      </div>
    </div>
  );
}