import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Administrator sign in", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <Container className="grid min-h-[65vh] place-items-center py-12">
      <section className="w-full max-w-md rounded-2xl border border-surface-container-highest bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Nyanopan admin</p>
        <h1 className="mt-2 font-serif text-3xl font-bold">Sign in</h1>
        <p className="mt-3 text-sm text-on-surface-variant">Administrator accounts are provisioned by a trusted database operator.</p>
        <AdminLoginForm />
      </section>
    </Container>
  );
}
