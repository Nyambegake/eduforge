"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import ConfigBanner from "@/components/ConfigBanner";
export default function Forgot() {
  const [email, setEmail] = useState(""); const [msg, setMsg] = useState("");
  async function send(e: React.FormEvent) { e.preventDefault(); const sb = getSupabase(); if (!sb) return setMsg("Password reset is not configured yet.");
    await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setMsg("If that email has an account, a reset link is on its way."); } // same reply either way, so accounts cannot be probed
  return (<main className="px-6 py-14 max-w-md mx-auto"><h1 className="text-3xl font-bold mb-6">Reset your password</h1><ConfigBanner />
    <form onSubmit={send} className="grid gap-3"><label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="block w-full border border-steel/40 rounded-md p-2" /></label>
      <button className="bg-ink text-white rounded-md py-2 font-semibold">Send reset link</button></form>{msg && <p role="status" className="mt-4 text-sm">{msg}</p>}</main>);
}
