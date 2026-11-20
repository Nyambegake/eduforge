"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRole } from "@/lib/useRole";
export default function Library() {
  const { role, error } = useRole(); const [q, setQ] = useState(""); const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { if (!role) return; getSupabase()!.from("resources").select("id,title,resource_type,original_path").eq("status", "approved").ilike("title", `%${q}%`).limit(50).then(r => setRows(r.data ?? [])); }, [role, q]);
  async function open(p: string) { const { data } = await getSupabase()!.storage.from("originals").createSignedUrl(p, 60); if (data) window.open(data.signedUrl, "_blank"); }
  if (error) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>{error}</p></main>;
  if (!role) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Loading…</p></main>;
  return (<main className="px-6 py-14 max-w-3xl mx-auto"><h1 className="text-3xl font-bold mb-4">Digital library</h1>
    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search approved resources" aria-label="Search" className="w-full border border-steel/40 rounded-md p-2" />
    {rows.length === 0 ? <p className="text-steel mt-4">No approved resources match yet.</p> :
      <ul className="mt-4 divide-y divide-steel/20">{rows.map(r => <li key={r.id} className="py-3 flex justify-between gap-3"><span>{r.title} <span className="text-steel text-sm">({r.resource_type})</span></span>
        <button onClick={() => open(r.original_path)} className="underline">Download</button></li>)}</ul>}</main>);
}
