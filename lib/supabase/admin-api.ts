import "server-only";

import { requireAdmin } from "@/lib/supabase/require-admin";

export async function getAdminApiContext(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host")?.split(",")[0].trim() ?? request.headers.get("host");
  let sameOrigin = false;
  try {
    sameOrigin = Boolean(origin && host && new URL(origin).host === host);
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin) {
    return {
      admin: null,
      response: Response.json({ error: "Request origin is not allowed." }, { status: 403, headers: { "Cache-Control": "no-store" } }),
    };
  }
  try {
    return { admin: await requireAdmin(), response: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "Authentication required" ? 401 : 403;
    return {
      admin: null,
      response: Response.json(
        { error: status === 401 ? "Sign in is required." : "Administrator access is required." },
        { status, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }
}

