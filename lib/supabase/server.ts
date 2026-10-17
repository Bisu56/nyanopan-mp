/**
 * Server-side Supabase client — for use in Server Components, Server Actions,
 * and Route Handlers only. Never import this in Client Components.
 *
 * It reads and writes auth cookies from the Next.js request/response context,
 * which is what makes the session available server-side in the App Router.
 *
 * Two factories are exported:
 *
 *   createServerClient()
 *     - Uses the ANON key with RLS enforced.
 *     - Use for all normal server-side data fetching.
 *
 *   createServiceClient()
 *     - Uses the SERVICE_ROLE key — bypasses RLS entirely.
 *     - Use ONLY for privileged server operations (e.g. order creation RPC,
 *       admin writes). Never leak this client to any response or log.
 */

import { createServerClient as _createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./types";

// ---------------------------------------------------------------------------
// Anon client (respects RLS) — use for Server Components and Server Actions
// ---------------------------------------------------------------------------

export async function createServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set",
    );
  }

  return _createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // Server Components cannot set cookies, so we silently skip writes here.
      // The middleware (middleware.ts) handles session refresh and cookie writes.
      setAll() {},
    },
  });
}

// ---------------------------------------------------------------------------
// Service-role client (bypasses RLS) — use ONLY for privileged server code
// ---------------------------------------------------------------------------

export async function createServiceClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set",
    );
  }

  return _createServerClient<Database>(url, serviceKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });
}
