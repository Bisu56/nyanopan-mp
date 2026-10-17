"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import { buttonClassName } from "@/components/ui/button";

export function AdminSignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function signOut() {
    setPending(true);
    await createBrowserClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }
  return <button className={buttonClassName({ variant: "secondary" })} type="button" disabled={pending} onClick={signOut}>{pending ? "Signing out…" : "Sign out"}</button>;
}
