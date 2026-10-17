"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CategoryRow } from "@/lib/supabase/types";
import { buttonClassName } from "@/components/ui/button";

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", description: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newCategory, sortOrder: categories.length }) });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) setMessage(result.error ?? "Could not create category.");
    else { setNewCategory({ name: "", slug: "", description: "" }); router.refresh(); }
  }
  async function update(category: CategoryRow, values: { name: string; slug: string; description: string }) {
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/categories/" + category.id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) setMessage(result.error ?? "Could not update category.");
    else router.refresh();
  }
  async function remove(category: CategoryRow) {
    if (!window.confirm("Delete category " + category.name + "?")) return;
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/categories/" + category.id, { method: "DELETE" });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) setMessage(result.error ?? "Could not delete category.");
    else router.refresh();
  }

  const input = "mt-1 w-full rounded-lg border border-outline-variant px-3 py-2 text-sm";
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="space-y-3">
        {categories.map((category) => <CategoryRowEditor key={category.id} category={category} inputClass={input} disabled={busy} onSave={update} onDelete={remove} />)}
        {categories.length === 0 && <p className="rounded-xl bg-surface-container-low p-5 text-sm">No categories yet.</p>}
      </section>
      <form onSubmit={create} className="h-fit space-y-4 rounded-2xl border border-surface-container-highest bg-white p-5">
        <h2 className="font-serif text-xl font-bold">Add category</h2>
        <div><label htmlFor="new-category-name" className="text-sm font-semibold">Name</label><input id="new-category-name" className={input} maxLength={60} required value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} /></div>
        <div><label htmlFor="new-category-slug" className="text-sm font-semibold">Slug</label><input id="new-category-slug" className={input} maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" required value={newCategory.slug} onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })} /></div>
        <div><label htmlFor="new-category-description" className="text-sm font-semibold">Description</label><textarea id="new-category-description" className={input} maxLength={1000} rows={3} value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} /></div>
        {message && <p role="alert" className="text-sm text-error">{message}</p>}
        <button className={buttonClassName({ className: "w-full" })} type="submit" disabled={busy}>Add category</button>
      </form>
      {message && <p role="alert" className="text-sm text-error lg:col-span-2">{message}</p>}
    </div>
  );
}

function CategoryRowEditor({ category, inputClass, disabled, onSave, onDelete }: {
  category: CategoryRow; inputClass: string; disabled: boolean;
  onSave: (category: CategoryRow, values: { name: string; slug: string; description: string }) => void;
  onDelete: (category: CategoryRow) => void;
}) {
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [description, setDescription] = useState(category.description ?? "");
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSave(category, { name, slug, description }); }} className="grid gap-3 rounded-2xl border border-surface-container-highest bg-white p-4 sm:grid-cols-[1fr_1fr_auto]">
      <div><label className="text-xs font-semibold" htmlFor={"category-name-" + category.id}>Name</label><input id={"category-name-" + category.id} className={inputClass} maxLength={60} required value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><label className="text-xs font-semibold" htmlFor={"category-slug-" + category.id}>Slug</label><input id={"category-slug-" + category.id} className={inputClass} maxLength={120} required value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
      <div className="sm:col-span-3"><label className="text-xs font-semibold" htmlFor={"category-description-" + category.id}>Description</label><input id={"category-description-" + category.id} className={inputClass} maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div className="flex items-center justify-between gap-3 sm:col-span-3"><span className="text-xs text-on-surface-variant">{category.slug}</span><span className="flex gap-2"><button className={buttonClassName({ variant: "secondary", size: "md" })} disabled={disabled} type="button" onClick={() => onDelete(category)}>Delete</button><button className={buttonClassName({ size: "md" })} disabled={disabled} type="submit">Save</button></span></div>
    </form>
  );
}

