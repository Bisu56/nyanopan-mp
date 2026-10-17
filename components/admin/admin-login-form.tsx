"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser";
import { buttonClassName } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setMessage("");
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setMessage("Sign in failed. Check your credentials and administrator access.");
      setPending(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  const input = "mt-1 w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-primary";
  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div><label className="block text-sm font-semibold" htmlFor="admin-email">Email</label><input className={input} id="admin-email" type="email" autoComplete="username" maxLength={254} required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
      <div><label className="block text-sm font-semibold" htmlFor="admin-password">Password</label><input className={input} id="admin-password" type="password" autoComplete="current-password" maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} /></div>
      {message && <p role="alert" className="text-sm text-error">{message}</p>}
      <button className={buttonClassName({ size: "lg", className: "w-full" })} type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
