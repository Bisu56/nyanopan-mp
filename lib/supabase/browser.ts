/**
 * Browser-side Supabase client — for use inside Client Components only.
 *
 * This client uses Supabase's public publishable key. Never use a secret or
 * service-role key in a NEXT_PUBLIC_ variable.
 *
 * How it is used:
 *   import { createBrowserClient } from "@/lib/supabase/browser";
 *   const supabase = createBrowserClient();
 *
 * Call `createBrowserClient()` once per component (or once per module if the
 * component tree is small); @supabase/ssr handles singleton de-duplication
 * internally.
 */

import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";

import type { Database } from "./types";

export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local",
    );
  }

  return _createBrowserClient<Database>(url, key);
}
