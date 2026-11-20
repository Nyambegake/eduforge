"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
export default function Reset() {
  const r = useRouter(); const [ready, setReady] = useState(false); const [pw, setPw] = useState(""); const [msg, setMsg] = useState("");
  useEffect(() => { const sb = getSupabase(); if (!sb) return;
    sb.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    const { data: sub } = sb.auth.onAuthStateChange(ev => { if (ev === "PASSWORD_RECOVERY") setReady(true); });
    return () => sub.subscription.unsubscribe(); }, []);
  async function save(e: React.FormEvent) { e.preventDefault();
    if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return setMsg("Use at least 8 characters with a letter and a number.");
    const { error } = await getSupabase()!.auth.updateUser({ password: pw }); if (error) return setMsg(error.message);
    await getSupabase()!.auth.signOut(); r.push("/login"); }
  return (<main className="px-6 py-14 max-w-md mx-auto"><h1 className="text-3xl font-bold mb-6">Choose a new password</h1>
    {!ready ? <p>Open this page from the link in your reset email.</p> :
      <form onSubmit={save} className="grid gap-3"><label>New password<input type="password" required autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} className="block w-full border border-steel/40 rounded-md p-2" /></label>
        <button className="bg-ember text-ink rounded-md py-2 font-semibold">Save password</button></form>}
    {msg && <p role="alert" className="mt-4 text-sm">{msg}</p>}</main>);
}
