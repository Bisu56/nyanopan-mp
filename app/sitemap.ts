import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import type { Database } from "@/lib/supabase/types";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A request-time dependency keeps product URLs current as the catalog changes.
  await headers();
  const base = siteConfig.url.replace(/\/+$/, "");
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/products`, changeFrequency: "daily", priority: 0.9 },
  ];
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return entries;

  try {
    const supabase = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const pageSize = 1000;
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await supabase.from("products").select("slug,updated_at")
        .eq("is_active", true).eq("is_published", true).order("id").range(offset, offset + pageSize - 1);
      if (error) throw error;
      for (const product of data ?? []) entries.push({
        url: `${base}/products/${product.slug}`,
        lastModified: product.updated_at,
        changeFrequency: "weekly",
        priority: 0.7,
      });
      if ((data?.length ?? 0) < pageSize) break;
    }
  } catch {
    console.error("[SEO] Public product sitemap could not be refreshed.");
  }
  return entries;
}
