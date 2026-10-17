import "server-only";

import { createServerClient } from "@/lib/supabase/server";

/**
 * Verifies the signed-in user's role before a server-side administrative
 * operation. Use the returned request-bound client for the operation itself;
 * database and Storage RLS independently enforce the same admin role.
 */
export async function requireAdmin() {
  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") {
    throw new Error("Authentication required");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Administrator access required");
  }

  return { supabase, userId };
}
