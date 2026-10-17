import "server-only";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { isSameOriginRequest } from "@/lib/http/request-guards.mjs";

export async function getAdminApiContext(request: Request) {
  if (!isSameOriginRequest(request)) {
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

