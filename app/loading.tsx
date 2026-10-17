/**
 * Root loading state (engineering rule #7).
 * With Cache Components enabled this streams in for any route that reads
 * request data, giving visitors a warm, on-brand skeleton instead of a blank page.
 */
export default function RootLoading() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="mx-auto w-full max-w-7xl animate-pulse px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mb-4 h-4 w-32 rounded-full bg-surface-container-high" />
      <div className="mb-3 h-10 w-2/3 rounded-xl bg-surface-container-high" />
      <div className="mb-10 h-5 w-1/2 rounded-lg bg-surface-container" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/5] rounded-2xl bg-surface-container-high"
          />
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
