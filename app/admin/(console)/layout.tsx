import type { ReactNode } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { AdminSignOut } from "@/components/admin/admin-sign-out";
import { Container } from "@/components/ui/container";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Container className="py-16"><p role="status">Checking administrator access…</p></Container>}>
      <AuthorizedAdmin>{children}</AuthorizedAdmin>
    </Suspense>
  );
}

async function AuthorizedAdmin({ children }: { children: ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }
  return (
    <Container className="py-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-surface-container-highest pb-5">
        <div>
          <Link href="/admin" className="font-serif text-2xl font-bold">Nyanopan admin</Link>
          <nav aria-label="Admin" className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
            <Link className="hover:text-primary" href="/admin/products">Products</Link>
            <Link className="hover:text-primary" href="/admin/categories">Categories</Link>
            <Link className="hover:text-primary" href="/">View storefront</Link>
          </nav>
        </div>
        <AdminSignOut />
      </div>
      {children}
    </Container>
  );
}
