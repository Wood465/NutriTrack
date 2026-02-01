export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="space-y-5">
        <div className="h-8 w-56 animate-pulse rounded-full bg-gray-200/80 dark:bg-gray-800/80" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-28 animate-pulse rounded-2xl border border-gray-200/70 bg-white/80 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/60"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl border border-gray-200/70 bg-white/80 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/60" />
      </div>
    </main>
  );
}
