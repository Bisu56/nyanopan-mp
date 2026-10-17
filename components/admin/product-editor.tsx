"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CategoryRow, ProductImageRow, ProductRow, ProductVariantRow } from "@/lib/supabase/types";
import { buttonClassName } from "@/components/ui/button";
import { ProductPhoto } from "@/components/products/product-photo";

type ProductDraft = {
  slug: string; name: string; description: string; category_id: string;
  price_paisa: number; stock_quantity: number; is_active: boolean; is_published: boolean;
};
const blank: ProductDraft = { slug: "", name: "", description: "", category_id: "", price_paisa: 0, stock_quantity: 0, is_active: false, is_published: false };
type ProductImagePreview = ProductImageRow & { signedUrl?: string | null };

export function ProductEditor({ product, categories, variants = [], images = [] }: {
  product: ProductRow | null;
  categories: CategoryRow[];
  variants?: ProductVariantRow[];
  images?: ProductImagePreview[];
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<ProductDraft>(product ? {
    slug: product.slug, name: product.name, description: product.description, category_id: product.category_id,
    price_paisa: product.price_paisa, stock_quantity: product.stock_quantity, is_active: product.is_active, is_published: product.is_published,
  } : blank);
  const [price, setPrice] = useState(product ? (product.price_paisa / 100).toFixed(2) : "");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setStatus("");
    const priceValue = /^\d+(?:\.\d{1,2})?$/.test(price) ? Math.round(Number(price) * 100) : NaN;
    const body = {
      slug: draft.slug, name: draft.name, description: draft.description,
      categoryId: draft.category_id, pricePaisa: priceValue,
      stockQuantity: draft.stock_quantity, isActive: draft.is_active, isPublished: draft.is_published,
    };
    try {
      const response = await fetch(product ? "/api/admin/products/" + product.id : "/api/admin/products", {
        method: product ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to save product.");
      if (!product) {
        router.replace("/admin/products/" + result.id);
        router.refresh();
        return;
      }
      if (file) {
        const form = new FormData();
        form.set("image", file);
        form.set("altText", altText);
        const upload = await fetch("/api/admin/products/" + product.id + "/images", { method: "POST", body: form });
        const uploadResult = await upload.json();
        if (!upload.ok) throw new Error(uploadResult.error ?? "Product was saved, but the image upload failed.");
        setFile(null);
        setAltText("");
      }
      setStatus("Product saved.");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setPending(false);
    }
  }

  const input = "mt-1 w-full rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-primary";
  const label = "block text-sm font-semibold";
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <form data-product-editor onSubmit={save} className="space-y-5 rounded-2xl border border-surface-container-highest bg-white p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className={label} htmlFor="product-name">Product name</label><input id="product-name" className={input} maxLength={120} required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
          <div><label className={label} htmlFor="product-slug">URL slug</label><input id="product-slug" className={input} maxLength={120} pattern="[a-z0-9]+(-[a-z0-9]+)*" required value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></div>
          <div><label className={label} htmlFor="product-category">Category</label><select id="product-category" className={input} required value={draft.category_id} onChange={(e) => setDraft({ ...draft, category_id: e.target.value })}><option value="">Choose category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
          <div><label className={label} htmlFor="product-price">Price (NPR)</label><input id="product-price" className={input} inputMode="decimal" type="number" min="0.01" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} /></div>
          <div><label className={label} htmlFor="product-stock">Base stock</label><input id="product-stock" className={input} type="number" min="0" max="1000000" step="1" required value={draft.stock_quantity} onChange={(e) => setDraft({ ...draft, stock_quantity: Number(e.target.value) })} /><p className="mt-1 text-xs text-on-surface-variant">When options have stock, keep this total at least as high as the sum of option stock.</p></div>
        </div>
        <div><label className={label} htmlFor="product-description">Description</label><textarea id="product-description" className={input} rows={5} maxLength={5000} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></div>
        <fieldset className="flex flex-wrap gap-5 text-sm"><legend className="mb-2 font-semibold">Storefront status</legend><label className="inline-flex items-center gap-2"><input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })} /> Active</label><label className="inline-flex items-center gap-2"><input type="checkbox" checked={draft.is_published} onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })} /> Published</label></fieldset>
        {status && <p role="status" className="text-sm text-error">{status}</p>}
        <button type="submit" disabled={pending} className={buttonClassName({ size: "lg" })}>{pending ? "Saving…" : product ? "Save product" : "Create product"}</button>
      </form>

      <aside className="space-y-6">
        {product && <VariantManager productId={product.id} variants={variants} />}
        {product && (
          <section className="rounded-2xl border border-surface-container-highest bg-white p-5">
            <h2 className="font-serif text-lg font-bold">Product images</h2>
            {images.length > 0 ? <ul className="mt-3 grid grid-cols-2 gap-3 text-sm">{images.map((image) => <li key={image.id} className="min-w-0"><div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-container-low">{image.signedUrl ? <ProductPhoto src={image.signedUrl} alt={image.alt_text || "Product photo"} sizes="320px" /> : <div className="grid h-full place-items-center text-xs text-on-surface-variant">Preview unavailable</div>}</div><span className="mt-1 block truncate text-xs text-on-surface-variant">{image.alt_text || "Image"}</span></li>)}</ul> : <p className="mt-2 text-sm text-on-surface-variant">No uploaded images.</p>}
            <label className={label + " mt-5"} htmlFor="product-image">Upload image (max 5 MiB)</label>
            <input id="product-image" className={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <label className={label + " mt-4"} htmlFor="image-alt">Image description</label>
            <input id="image-alt" className={input} maxLength={200} value={altText} onChange={(e) => setAltText(e.target.value)} />
            {file && <button className={buttonClassName({ variant: "secondary" }) + " mt-4 w-full"} type="button" disabled={pending || !altText.trim()} onClick={() => { const form = document.querySelector<HTMLFormElement>("form[data-product-editor]"); form?.requestSubmit(); }}>Save product and upload image</button>}
            <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">Images are stored in the private product-images bucket. Uploads validate file signatures and RLS checks administrator access.</p>
          </section>
        )}
        {!product && <p className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">Create the product first, then add options and images.</p>}
      </aside>
    </div>
  );
}

function VariantManager({ productId, variants }: { productId: string; variants: ProductVariantRow[] }) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [stock, setStock] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function add() {
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/products/" + productId + "/variants", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sizeLabel: label, stockQuantity: stock, isActive: true }) });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) setMessage(result.error ?? "Could not add option.");
    else { setLabel(""); setStock(0); router.refresh(); }
  }
  async function update(variant: ProductVariantRow, value: number) {
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/products/" + productId + "/variants/" + variant.id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stockQuantity: value }) });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) setMessage(result.error ?? "Could not update stock.");
    else router.refresh();
  }
  async function remove(variant: ProductVariantRow) {
    if (!window.confirm("Remove option " + variant.size_label + "?")) return;
    setBusy(true);
    const response = await fetch("/api/admin/products/" + productId + "/variants/" + variant.id, { method: "DELETE" });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) setMessage(result.error ?? "Could not remove option.");
    else router.refresh();
  }
  return (
    <section className="rounded-2xl border border-surface-container-highest bg-white p-5">
      <h2 className="font-serif text-lg font-bold">Options and stock</h2>
      <ul className="mt-3 space-y-3">
        {variants.map((variant) => <li key={variant.id} className="flex items-center gap-2 text-sm"><span className="min-w-10 font-semibold">{variant.size_label}</span><label className="sr-only" htmlFor={"stock-" + variant.id}>Stock for {variant.size_label}</label><input id={"stock-" + variant.id} className="w-24 rounded-lg border border-outline-variant px-2 py-1.5" type="number" min="0" max="1000000" defaultValue={variant.stock_quantity} onBlur={(e) => { if (Number(e.target.value) !== variant.stock_quantity) void update(variant, Number(e.target.value)); }} /><button className="rounded-lg px-2 py-1 text-error hover:bg-error-container/30" type="button" disabled={busy} aria-label={"Remove option " + variant.size_label} onClick={() => void remove(variant)}>×</button></li>)}
      </ul>
      <div className="mt-4 grid grid-cols-[1fr_5rem_auto] gap-2"><label className="sr-only" htmlFor="new-option">Option label</label><input id="new-option" className="rounded-lg border border-outline-variant px-3 py-2 text-sm" maxLength={20} placeholder="Size" value={label} onChange={(e) => setLabel(e.target.value)} /><label className="sr-only" htmlFor="new-stock">Option stock</label><input id="new-stock" className="rounded-lg border border-outline-variant px-2 py-2 text-sm" type="number" min="0" max="1000000" value={stock} onChange={(e) => setStock(Number(e.target.value))} /><button className="rounded-lg bg-primary px-3 text-sm font-semibold text-white disabled:opacity-50" type="button" disabled={busy || !label.trim()} onClick={() => void add()}>Add</button></div>
      {message && <p role="alert" className="mt-3 text-sm text-error">{message}</p>}
    </section>
  );
}

