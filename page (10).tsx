"use client";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRole } from "@/lib/useRole";
import { can } from "@/lib/permissions";
import { validateFile } from "@/lib/upload";
import { classify, detectType, sha256, Unit } from "../../../backend/ai-classification/classify";
export default function Upload() {
  const { role, error } = useRole(); const [log, setLog] = useState<string[]>([]);
  const say = (s: string) => setLog(l => [...l, s]);
  async function run(files: FileList | null) {
    const sb = getSupabase(); if (!sb || !files) return;
    const { data: { session } } = await sb.auth.getSession(); const uid = session!.user.id;
    const { data: u } = await sb.from("units").select("id,code,title,curriculum_version_id,modules(title),curriculum_versions!inner(approved,version,courses(name,level_number))").eq("curriculum_versions.approved", true);
    const units: (Unit & { cv: string })[] = (u ?? []).map((x: any) => ({ id: x.id, code: x.code ?? undefined, title: x.title, moduleTitle: x.modules?.title ?? "",
      course: x.curriculum_versions.courses?.name ?? "", category: "", level: x.curriculum_versions.courses?.level_number ?? 0, body: "",
      curriculumVersion: x.curriculum_versions.version, topics: [], cv: x.curriculum_version_id }));
    for (const f of Array.from(files)) {
      const bad = validateFile(f.name, f.size); if (bad) { say(`${f.name}: ${bad}`); continue; }
      const buf = new Uint8Array(await f.arrayBuffer()); const hash = await sha256(buf);
      const { data: dup } = await sb.from("resources").select("id").eq("sha256", hash).maybeSingle();
      if (dup) { say(`${f.name}: duplicate of an existing resource, skipped`); continue; }
      const path = `${uid}/${hash}-${f.name.replace(/[^\w.\-]/g, "_")}`;
      const up = await sb.storage.from("originals").upload(path, f, { upsert: false });
      if (up.error) { say(`${f.name}: ${up.error.message}`); continue; }
      const text = f.name.toLowerCase().endsWith(".txt") || f.name.toLowerCase().endsWith(".csv") ? await f.text() : "";
      const res = classify(text, f.name, units);
      const { data: row, error: e } = await sb.from("resources").insert({ title: f.name, original_path: path, sha256: hash, original_filename: f.name,
        resource_type: res.resourceType === "unknown" ? detectType(f.name) : res.resourceType, uploaded_by: uid }).select("id").single();
      if (e || !row) { say(`${f.name}: ${e?.message}`); continue; }
      if (res.unit) { const m = units.find(x => x.id === res.unit!.id)!;
        await sb.from("resource_classifications").insert({ resource_id: row.id, unit_id: res.unit.id, curriculum_version_id: m.cv, confidence: res.confidence }); }
      say(`${f.name}: uploaded, waiting for approval. ${res.unit ? `Suggested unit: ${res.unit.title} (${Math.round(res.confidence * 100)}%)` : "No curriculum match, needs manual classification."}${res.outdated ? " Possibly outdated." : ""}${text ? "" : " Text scan for this file type is not enabled yet, so only the filename was used."}`);
    }
  }
  if (error) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>{error}</p></main>;
  if (!role) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Loading…</p></main>;
  if (!can(role, "upload_resource")) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Your role cannot upload resources.</p></main>;
  return (<main className="px-6 py-14 max-w-3xl mx-auto"><h1 className="text-3xl font-bold mb-2">Upload learning materials</h1>
    <p className="text-steel mb-4">Originals are kept unchanged. Every upload waits for administrator approval before learners see it.</p>
    <input type="file" multiple onChange={e => run(e.target.files)} className="block" aria-label="Choose files" />
    <ul className="mt-6 text-sm grid gap-2" role="status">{log.map((l, i) => <li key={i}>{l}</li>)}</ul></main>);
}
