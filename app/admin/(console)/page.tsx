import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";

export default function AdminHomePage() {
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Store management</p>
      <h1 className="mt-2 font-serif text-3xl font-bold">Administrator dashboard</h1>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link className={buttonClassName()} href="/admin/products">Manage products</Link>
        <Link className={buttonClassName({ variant: "secondary" })} href="/admin/categories">Manage categories</Link>
      </div>
    </section>
  );
}
