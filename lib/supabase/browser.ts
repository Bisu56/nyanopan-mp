/**
 * Browser-side Supabase client — for use inside Client Components only.
 *
 * This client uses the public ANON key. It is safe to expose to the browser
 * because every table has Row Level Security enabled — the anon key can never
 * bypass RLS policies.
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
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local",
    );
  }

  return _createBrowserClient<Database>(url, key);
}
