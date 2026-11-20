"use client";
import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRole } from "@/lib/useRole";
import { rolesFor } from "@/lib/users";

type U = { id: string; email: string; full_name: string | null; role: string | null; country: string | null; institution: string | null;
  education_level: string | null; status: string; created_at: string; email_confirmed: boolean };

export default function AdminUsers() {
  const { role, error } = useRole();
  const [rows, setRows] = useState<U[]>([]); const [q, setQ] = useState(""); const [status, setStatus] = useState("");
  const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const allowed = role === "super_admin" || role === "system_admin";

  const load = useCallback(async () => {
    const sb = getSupabase(); if (!sb) return;
    setBusy(true);
    const { data, error: e } = await sb.rpc("admin_list_users", { p_search: q.trim(), p_status: status });
    setBusy(false);
    if (e) return setMsg(e.message.includes("admin_list_users") ? "Run migration 008 in Supabase first." : e.message);
    setRows((data ?? []) as U[]); setMsg("");
  }, [q, status]);
  useEffect(() => { if (allowed) load(); }, [allowed, load]);

  async function change(fn: "admin_set_role" | "admin_set_status", args: Record<string, string>, label: string) {
    if (!window.confirm(label)) return;
    const { error: e } = await getSupabase()!.rpc(fn, args);
    if (e) return setMsg(e.message);
    setMsg("Saved."); load();
  }

  if (error) return <main className="px-6 py-14 max-w-5xl mx-auto"><p>{error}</p></main>;
  if (!role) return <main className="px-6 py-14 max-w-5xl mx-auto"><p>Loading…</p></main>;
  if (!allowed) return <main className="px-6 py-14 max-w-5xl mx-auto"><h1 className="text-2xl font-bold">User management</h1><p className="mt-3">Only a Super Administrator or System Administrator can manage users.</p></main>;

  const sel = "border border-steel/40 rounded-md p-1 text-sm";
  return (<main className="px-6 py-14 max-w-6xl mx-auto">
    <h1 className="text-3xl font-bold">User management</h1>
    <p className="text-steel mt-1">Approve institution administrators, change roles, and suspend or restore accounts. You cannot change your own role or status.</p>
    <div className="mt-6 flex flex-wrap gap-3">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email or institution" className={`${sel} min-w-64 p-2`} />
      <select value={status} onChange={e => setStatus(e.target.value)} className={`${sel} p-2`} aria-label="Filter by status">
        <option value="">All statuses</option><option value="pending">Pending approval</option><option value="active">Active</option><option value="suspended">Suspended</option></select>
      <button onClick={load} disabled={busy} className="bg-ink text-white rounded-md px-4 py-2 font-semibold">{busy ? "Loading…" : "Refresh"}</button>
    </div>
    {msg && <p role="status" className="mt-3 text-sm">{msg}</p>}
    <div className="mt-6 overflow-x-auto"><table className="w-full text-sm text-left border-collapse">
      <thead><tr className="border-b border-steel/30"><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Institution</th><th className="p-2">Role</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
      <tbody>{rows.map(u => (<tr key={u.id} className="border-b border-steel/15 align-top">
        <td className="p-2">{u.full_name ?? "—"}<div className="text-xs text-steel">{u.country ?? ""} {u.education_level ? `· ${u.education_level}` : ""}</div></td>
        <td className="p-2">{u.email}{!u.email_confirmed && <div className="text-xs text-ember">Email not verified</div>}</td>
        <td className="p-2">{u.institution ?? "—"}</td>
        <td className="p-2"><select aria-label={`Role for ${u.email}`} className={sel} value={u.role ?? ""}
          onChange={e => change("admin_set_role", { target: u.id, role_name: e.target.value }, `Change ${u.email} to ${e.target.value}?`)}>
          {rolesFor(role).map(r => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}</select></td>
        <td className="p-2">{u.status}</td>
        <td className="p-2 flex gap-2 flex-wrap">
          {u.status !== "active" && <button className="underline" onClick={() => change("admin_set_status", { target: u.id, new_status: "active" }, `Approve / restore ${u.email}?`)}>Approve</button>}
          {u.status !== "suspended" && <button className="underline text-ember" onClick={() => change("admin_set_status", { target: u.id, new_status: "suspended" }, `Suspend ${u.email}?`)}>Suspend</button>}
        </td></tr>))}</tbody></table>
      {!rows.length && !busy && <p className="mt-4 text-steel">No users match.</p>}</div>
  </main>);
}
