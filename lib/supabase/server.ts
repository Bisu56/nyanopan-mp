/**
 * Server-side Supabase client — for use in Server Components, Server Actions,
 * and Route Handlers only. Never import this in Client Components.
 *
 * It reads and writes auth cookies from the Next.js request/response context,
 * which is what makes the session available server-side in the App Router.
 *
 * Uses a request-bound publishable-key client so database RLS sees the
 * current user's session for server-side reads and writes.
 */

import "server-only";

import { createServerClient as _createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./types";

// ---------------------------------------------------------------------------
// Anon client (respects RLS) — use for Server Components and Server Actions
// ---------------------------------------------------------------------------

export async function createServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return _createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // Server Components cannot set cookies. Proxy handles refresh there.
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Cookie writes are unavailable while rendering a Server Component.
        }
      },
    },
  });
}
