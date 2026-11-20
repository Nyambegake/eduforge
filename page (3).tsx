"use client";
import AdminTable from "@/components/admin/AdminTable";
import { useRole } from "@/lib/useRole";
import { can } from "@/lib/permissions";
import type { Field } from "@/lib/admin";
const f: Field[] = [{ key: "name", label: "Plan name", type: "text", required: true }, { key: "price_kes", label: "Price (KES)", type: "number" }, { key: "duration_days", label: "Duration (days)", type: "number" }, { key: "active", label: "Active", type: "checkbox" }];
export default function Plans() {
  const { role, error } = useRole();
  if (error) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>{error}</p></main>;
  if (!role) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Loading…</p></main>;
  if (!can(role, "manage_users")) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Your role cannot manage plans.</p></main>;
  return (<main className="px-6 py-14 max-w-3xl mx-auto"><h1 className="text-3xl font-bold mb-2">Subscription plans</h1>
    <p className="text-steel mb-6">Prices and durations are data, so you can change them without editing code. M-Pesa and card checkout are not connected yet.</p>
    <AdminTable table="plans" title="Plans" fields={f} show={r => `${r.name}: KES ${r.price_kes ?? 0} for ${r.duration_days ?? 0} days${r.active ? "" : " (inactive)"}`} /></main>);
}
