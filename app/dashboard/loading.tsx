export default function Loading() {
  return (
    <div className="animate-fade-in" aria-hidden>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-100/10" />
        <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-100/10" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="card overflow-hidden p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="mb-4 h-1.5 rounded-full bg-indigo-500/30" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-100/10" />
            <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-100/10" />
            <div className="mt-4 h-1.5 w-full animate-pulse rounded-full bg-gray-100 dark:bg-gray-100/10" />
            <div className="mt-5 flex gap-1.5">
              {[0, 1, 2].map((n) => (
                <div
                  key={n}
                  className="h-8 flex-1 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-100/10"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}