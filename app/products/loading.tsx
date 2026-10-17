import { Container } from "@/components/ui/container";

export default function ProductsLoading() {
  return (
    <Container className="animate-pulse py-10 sm:py-14" role="status" aria-label="Loading catalog">
      <div className="mb-3 h-4 w-40 rounded bg-surface-container-high" />
      <div className="mb-3 h-10 max-w-md rounded-xl bg-surface-container-high" />
      <div className="mb-8 h-5 max-w-2xl rounded-lg bg-surface-container" />
      <div className="mb-8 h-24 rounded-2xl bg-surface-container-high" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="aspect-[4/5] rounded-2xl bg-surface-container-high" />
        ))}
      </div>
      <span className="sr-only">Loading products…</span>
    </Container>
  );
}
