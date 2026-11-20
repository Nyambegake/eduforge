"use client";
import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRole } from "@/lib/useRole";
import { can } from "@/lib/permissions";
export default function Approvals() {
  const { role, error } = useRole(); const [rows, setRows] = useState<any[]>([]); const [msg, setMsg] = useState("");
  const load = useCallback(async () => { const { data } = await getSupabase()!.from("resources").select("id,title,resource_type,resource_classifications(confidence,units(title,code))").eq("status", "pending"); setRows(data ?? []); }, []);
  useEffect(() => { if (role && can(role, "approve_resource")) load(); }, [role, load]);
  async function decide(id: string, status: "approved" | "rejected", access: string) {
    const sb = getSupabase()!; const { data: { session } } = await sb.auth.getSession();
    const { error: e } = await sb.from("resources").update({ status, access_level: access, approved_by: session!.user.id }).eq("id", id);
    setMsg(e ? e.message : status === "approved" ? "Approved." : "Rejected."); load(); }
  if (error) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>{error}</p></main>;
  if (!role) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Loading…</p></main>;
  if (!can(role, "approve_resource")) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Your role cannot approve resources.</p></main>;
  return (<main className="px-6 py-14 max-w-3xl mx-auto"><h1 className="text-3xl font-bold mb-4">Pending approvals</h1>{msg && <p role="status">{msg}</p>}
    {rows.length === 0 ? <p className="text-steel">Nothing is waiting for approval.</p> :
      <ul className="grid gap-4">{rows.map(r => { const c = r.resource_classifications?.[0]; return (<li key={r.id} className="bg-white border border-steel/20 rounded-md p-4">
        <p className="font-semibold">{r.title} <span className="text-steel text-sm">({r.resource_type})</span></p>
        <p className="text-sm text-steel">{c ? `AI suggestion: ${c.units?.title} (${Math.round(c.confidence * 100)}%). This is a suggestion, not verified alignment.` : "No curriculum match."}</p>
        <div className="mt-2 flex gap-3 text-sm"><button onClick={() => decide(r.id, "approved", "free")} className="underline">Approve as free</button>
          <button onClick={() => decide(r.id, "approved", "restricted")} className="underline">Approve as restricted</button>
          <button onClick={() => decide(r.id, "rejected", "restricted")} className="text-ember underline">Reject</button></div></li>); })}</ul>}</main>);
}
