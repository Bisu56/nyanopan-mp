/**
 * Next.js middleware — runs on every matched request before any page renders.
 *
 * Purpose: refresh the Supabase session token (if expired) and write the
 * updated auth cookies back onto the response. Without this, the server-side
 * client in Server Components would always see a stale session after the
 * JWT access token expires (~1 hour).
 *
 * The middleware itself does NOT protect routes. Route protection (checking
 * for a session or admin role) is done per-route in Server Components /
 * layout files, so the middleware stays lightweight and fast.
 *
 * Why we pass both request AND response cookies to setAll:
 *   @supabase/ssr writes refreshed tokens to the *response* headers so the
 *   browser's cookie jar is updated. It also needs to write them to the
 *   *request* object so any downstream Server Component in the same render
 *   cycle sees the refreshed session without doing another round-trip.
 */

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

import type { Database } from "@/lib/supabase/types";

export async function proxy(request: NextRequest) {
  // Start with a pass-through response. We may mutate its cookies below.
  let response = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Env vars missing — can't do anything useful. Let the request through
    // so the page itself can surface a useful error instead of a 500 here.
    return response;
  }

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, cacheHeaders) {
        // Write cookies onto the outgoing response.
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        // Apply cache-control headers that @supabase/ssr provides to prevent
        // CDNs from caching responses that contain session tokens.
        Object.entries(cacheHeaders).forEach(([headerName, headerValue]) => {
          response.headers.set(headerName, headerValue);
        });

        // Also update the request cookies so the same render cycle sees
        // the refreshed session without an extra DB round-trip.
        const updatedRequest = new NextRequest(request, {
          headers: response.headers,
        });
        response = NextResponse.next({
          request: updatedRequest,
        });
        // Re-apply cookies to the new response object.
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(cacheHeaders).forEach(([headerName, headerValue]) => {
          response.headers.set(headerName, headerValue);
        });
      },
    },
  });

  // Calling getUser() triggers the token refresh if the access token has
  // expired. The result is not used here — we just want the side-effect of
  // the refreshed cookies being written via setAll() above.
  await supabase.auth.getUser();

  return response;
}

/**
 * Route matcher — run the middleware on every page and API route.
 *
 * Excluded patterns (standard Next.js exclusions):
 *   - _next/static   compiled assets
 *   - _next/image    image optimisation endpoint
 *   - favicon.ico    browser icon
 *   - Files with an extension (e.g. .png, .svg, .js)
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
  ],
};
