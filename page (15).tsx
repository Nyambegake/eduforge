"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { safeNext } from "@/lib/routes";
import ConfigBanner from "@/components/ConfigBanner";
export default function Login() {
  const r = useRouter(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function signIn(e: React.FormEvent) {
    e.preventDefault(); const sb = getSupabase(); if (!sb) return setMsg("Sign-in is not configured yet.");
    setBusy(true); const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password }); setBusy(false);
    if (error) return setMsg(/confirm/i.test(error.message) ? "Verify your email first, using the link we sent you." : "Email or password is incorrect.");
    r.push(safeNext(new URLSearchParams(window.location.search).get("next")));
  }
  const box = "block w-full border border-steel/40 rounded-md p-2";
  return (<main className="px-6 py-14 max-w-md mx-auto"><h1 className="text-3xl font-bold mb-6">Log in</h1><ConfigBanner />
    <form onSubmit={signIn} className="grid gap-3">
      <label>Email<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={box} /></label>
      <label>Password<input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className={box} /></label>
      <button disabled={busy} className="bg-ink text-white rounded-md py-2 font-semibold">{busy ? "Signing in…" : "Log in"}</button></form>
    {msg && <p role="alert" className="mt-4 text-sm">{msg}</p>}
    <p className="mt-4 text-sm"><Link href="/forgot-password" className="underline">Forgot your password?</Link> · <Link href="/register" className="underline">Create an account</Link></p></main>);
}
