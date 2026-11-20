"use client";
import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Field, Form, missing, toPayload } from "@/lib/admin";
type Row = Record<string, any>;
export default function AdminTable({ table, title, fields, show }: { table: string; title: string; fields: Field[]; show: (r: Row) => string }) {
  const [rows, setRows] = useState<Row[]>([]); const [form, setForm] = useState<Form>({}); const [msg, setMsg] = useState("");
  const [opts, setOpts] = useState<Record<string, Row[]>>({});
  const load = useCallback(async () => {
    const sb = getSupabase(); if (!sb) return;
    const { data } = await sb.from(table).select("*").order("id"); setRows(data ?? []);
    const o: Record<string, Row[]> = {};
    for (const f of fields) if (f.ref) { const { data: d } = await sb.from(f.ref.table).select(`id, ${f.ref.label}`); o[f.key] = (d ?? []) as unknown as Row[]; }
    setOpts(o);
  }, [table, fields]);
  useEffect(() => { load(); }, [load]);
  async function add(e: React.FormEvent) {
    e.preventDefault(); const sb = getSupabase(); if (!sb) return;
    const m = missing(fields, form); if (m.length) return setMsg(`Fill in: ${m.join(", ")}`);
    const { error } = await sb.from(table).insert(toPayload(fields, form));
    if (error) return setMsg(error.message); setForm({}); setMsg("Saved."); load();
  }
  async function del(id: string | number) {
    const { error } = await getSupabase()!.from(table).delete().eq("id", id); setMsg(error ? error.message : "Deleted."); load();
  }
  const box = "border border-steel/40 rounded-md p-2";
  const label = (r: Row, f: Field) => r[f.ref!.label];
  return (<section className="bg-white border border-steel/20 rounded-md p-5 mb-6"><h2 className="font-semibold text-lg mb-3">{title}</h2>
    <form onSubmit={add} className="flex flex-wrap gap-3 items-end">
      {fields.map(f => (<label key={f.key} className="text-sm grid gap-1">{f.label}
        {f.type === "select" ? (<select className={box} value={String(form[f.key] ?? "")} onChange={e => setForm({ ...form, [f.key]: e.target.value })}>
            <option value="">Choose…</option>{(opts[f.key] ?? []).map(o => <option key={o.id} value={o.id}>{label(o, f)}</option>)}</select>)
        : f.type === "checkbox" ? <input type="checkbox" checked={!!form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.checked })} />
        : <input className={box} type={f.type} value={String(form[f.key] ?? "")} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />}
      </label>))}
      <button className="bg-ink text-white rounded-md px-4 py-2">Add</button></form>
    {msg && <p role="status" className="text-sm mt-2">{msg}</p>}
    {rows.length === 0 ? <p className="text-sm text-steel mt-3">Nothing added yet. Use the form above.</p> :
      <ul className="mt-3 divide-y divide-steel/20">{rows.map(r => (<li key={r.id} className="py-2 flex justify-between gap-3 text-sm"><span>{show(r)}</span>
        <button onClick={() => del(r.id)} className="text-ember underline">Delete</button></li>))}</ul>}
  </section>);
}
