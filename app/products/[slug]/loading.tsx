import { Container } from "@/components/ui/container";

export default function ProductLoading() {
  return (
    <Container className="animate-pulse py-10" role="status" aria-label="Loading product">
      <div className="mb-6 h-4 w-64 rounded bg-surface-container-high" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square rounded-3xl bg-surface-container-high" />
        <div className="space-y-4 py-4">
          <div className="h-6 w-28 rounded-full bg-surface-container-high" />
          <div className="h-12 max-w-lg rounded-xl bg-surface-container-high" />
          <div className="h-8 w-36 rounded-lg bg-surface-container" />
          <div className="h-24 max-w-xl rounded-xl bg-surface-container" />
        </div>
      </div>
      <span className="sr-only">Loading product…</span>
    </Container>
  );
}
