"use client";
import { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { getSupabase } from "@/lib/supabase";
import { useRole } from "@/lib/useRole";
import { can } from "@/lib/permissions";
import type { Field } from "@/lib/admin";
const v: Field[] = [{ key: "title", label: "Title", type: "text", required: true }, { key: "url", label: "Video link (YouTube or file URL)", type: "text", required: true },
  { key: "category", label: "Category", type: "text" }, { key: "transcript", label: "Transcript", type: "text" }, { key: "status", label: "Status (pending; admins may use approved)", type: "text" }];
export default function Videos() {
  const { role, error } = useRole(); const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { if (role) getSupabase()!.from("videos").select("id,title,url,category").eq("status", "approved").then(r => setRows(r.data ?? [])); }, [role]);
  if (error) return <main className="px-6 py-14 max-w-4xl mx-auto"><p>{error}</p></main>;
  if (!role) return <main className="px-6 py-14 max-w-4xl mx-auto"><p>Loading…</p></main>;
  return (<main className="px-6 py-14 max-w-4xl mx-auto"><h1 className="text-3xl font-bold mb-4">Video Academy</h1>
    {rows.length === 0 ? <p className="text-steel mb-6">No approved videos yet.</p> :
      <ul className="mb-8 divide-y divide-steel/20">{rows.map(r => <li key={r.id} className="py-2"><a href={r.url} target="_blank" rel="noopener noreferrer" className="underline">{r.title}</a> <span className="text-steel text-sm">{r.category}</span></li>)}</ul>}
    {can(role, "upload_resource") && <AdminTable table="videos" title="Add a video" fields={v} show={r => `${r.title} (${r.status})`} />}</main>);
}
