"use client";
import AdminTable from "@/components/admin/AdminTable";
import { useRole } from "@/lib/useRole";
import { can } from "@/lib/permissions";
import type { Field } from "@/lib/admin";
const bodies: Field[] = [{ key: "name", label: "Examining body", type: "text", required: true }];
const cats: Field[] = [{ key: "name", label: "Qualification category", type: "text", required: true }];
const courses: Field[] = [
  { key: "name", label: "Course", type: "text", required: true },
  { key: "body_id", label: "Examining body", type: "select", required: true, ref: { table: "examining_bodies", label: "name" } },
  { key: "category_id", label: "Category", type: "select", required: true, ref: { table: "qualification_categories", label: "name" } },
  { key: "level_number", label: "Level number", type: "number" },
  { key: "duration", label: "Duration", type: "text" }];
const versions: Field[] = [
  { key: "course_id", label: "Course", type: "select", required: true, ref: { table: "courses", label: "name" } },
  { key: "version", label: "Version", type: "text", required: true },
  { key: "approved", label: "Approved", type: "checkbox" }];
const modules: Field[] = [
  { key: "curriculum_version_id", label: "Curriculum version", type: "select", required: true, ref: { table: "curriculum_versions", label: "version" } },
  { key: "position", label: "Position", type: "number" },
  { key: "title", label: "Module title", type: "text", required: true }];
const units: Field[] = [
  { key: "module_id", label: "Module", type: "select", required: true, ref: { table: "modules", label: "title" } },
  { key: "curriculum_version_id", label: "Curriculum version", type: "select", required: true, ref: { table: "curriculum_versions", label: "version" } },
  { key: "code", label: "Unit code (from approved curriculum)", type: "text" },
  { key: "title", label: "Unit title", type: "text", required: true }];
export default function CurriculumAdmin() {
  const { role, error } = useRole();
  if (error) return <main className="px-6 py-14 max-w-4xl mx-auto"><p>{error}</p></main>;
  if (!role) return <main className="px-6 py-14 max-w-4xl mx-auto"><p>Loading…</p></main>;
  if (!can(role, "manage_curriculum")) return <main className="px-6 py-14 max-w-4xl mx-auto"><p>Your role cannot manage curricula.</p></main>;
  return (<main className="px-6 py-14 max-w-4xl mx-auto"><h1 className="text-3xl font-bold mb-2">Curriculum management</h1>
    <p className="text-steel mb-6">Add items from the top down. Only approved curriculum versions guide AI classification.</p>
    <AdminTable table="examining_bodies" title="Examining bodies" fields={bodies} show={r => r.name} />
    <AdminTable table="qualification_categories" title="Qualification categories" fields={cats} show={r => r.name} />
    <AdminTable table="courses" title="Courses" fields={courses} show={r => `${r.name}, level ${r.level_number ?? "n/a"}`} />
    <AdminTable table="curriculum_versions" title="Curriculum versions" fields={versions} show={r => `${r.version} ${r.approved ? "(approved)" : "(draft)"}`} />
    <AdminTable table="modules" title="Modules" fields={modules} show={r => r.title} />
    <AdminTable table="units" title="Units of competency" fields={units} show={r => `${r.code ?? "no code"}: ${r.title}`} />
  </main>);
}
