"use client";
import AdminTable from "@/components/admin/AdminTable";
import { useRole } from "@/lib/useRole";
import { can } from "@/lib/permissions";
import type { Field } from "@/lib/admin";
const q: Field[] = [{ key: "unit_id", label: "Unit", type: "select", ref: { table: "units", label: "title" } }, { key: "qtype", label: "Type (mcq, structured, practical)", type: "text" },
  { key: "question", label: "Question", type: "text", required: true }, { key: "marks", label: "Marks", type: "number" }, { key: "difficulty", label: "Difficulty", type: "text" }, { key: "answer", label: "Marking scheme answer", type: "text" }];
const a: Field[] = [{ key: "title", label: "Title", type: "text", required: true }, { key: "kind", label: "Kind (exam, CAT, practical, observation checklist)", type: "text" },
  { key: "unit_id", label: "Unit", type: "select", ref: { table: "units", label: "title" } }, { key: "total_marks", label: "Total marks", type: "number" }, { key: "duration_minutes", label: "Minutes", type: "number" }];
export default function Assessments() {
  const { role, error } = useRole();
  if (error) return <main className="px-6 py-14 max-w-4xl mx-auto"><p>{error}</p></main>;
  if (!role) return <main className="px-6 py-14 max-w-4xl mx-auto"><p>Loading…</p></main>;
  if (!can(role, "create_assessment")) return <main className="px-6 py-14 max-w-4xl mx-auto"><p>Your role cannot create assessments.</p></main>;
  return (<main className="px-6 py-14 max-w-4xl mx-auto"><h1 className="text-3xl font-bold mb-6">Assessment centre</h1>
    <AdminTable table="questions" title="Question bank" fields={q} show={r => `${r.question} [${r.marks ?? 0} marks]`} />
    <AdminTable table="assessments" title="Assessments and practical instruments" fields={a} show={r => `${r.title} (${r.kind ?? "assessment"}, ${r.status})`} /></main>);
}
