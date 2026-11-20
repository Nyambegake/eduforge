"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRole } from "@/lib/useRole";
export default function Assistant() {
  const { role, error } = useRole(); const [q, setQ] = useState(""); const [out, setOut] = useState<any>(null); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  async function ask(e: React.FormEvent) { e.preventDefault(); setBusy(true); setMsg(""); setOut(null);
    const { data, error: er } = await getSupabase()!.functions.invoke("ai", { body: { task: "assistant", question: q } });
    setBusy(false); if (er || data?.error) return setMsg(data?.error ?? "The assistant is not available. Check that the ai function is deployed."); setOut(data); }
  if (error) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>{error}</p></main>;
  if (!role) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Loading…</p></main>;
  return (<main className="px-6 py-14 max-w-3xl mx-auto"><h1 className="text-3xl font-bold mb-4">EduForge AI Learning Assistant</h1>
    <form onSubmit={ask} className="grid gap-3"><textarea required value={q} onChange={e => setQ(e.target.value)} rows={3} aria-label="Your question" className="border border-steel/40 rounded-md p-2" placeholder="Ask about a lesson or a technical procedure" />
      <button disabled={busy} className="bg-ink text-white rounded-md py-2 font-semibold">{busy ? "Thinking…" : "Ask"}</button></form>
    {msg && <p role="status" className="mt-4">{msg}</p>}
    {out && <section className="mt-6 bg-white border border-steel/20 rounded-md p-5"><p className="whitespace-pre-wrap">{out.answer}</p>
      <p className="text-sm text-steel mt-4">Matched approved units: {out.sources.units.join(", ") || "none"}. Matched approved resources: {out.sources.resources.join(", ") || "none"}. This reply is AI-generated and is not official curriculum content.</p></section>}</main>);
}
