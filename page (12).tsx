"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRole } from "@/lib/useRole";
import { can } from "@/lib/permissions";
import { Exam, examToHtml, parseExam, totalMarks } from "@/lib/exam";
export default function Generate() {
  const { role, error } = useRole(); const [units, setUnits] = useState<any[]>([]); const [f, setF] = useState({ unitId: "", totalMarks: "50", minutes: "60", difficulty: "medium" });
  const [exam, setExam] = useState<Exam | null>(null); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (role) getSupabase()!.from("units").select("id,title,code").then(r => setUnits(r.data ?? [])); }, [role]);
  async function run(e: React.FormEvent) { e.preventDefault(); setBusy(true); setMsg(""); setExam(null);
    const { data, error: er } = await getSupabase()!.functions.invoke("ai", { body: { task: "exam", ...f } }); setBusy(false);
    if (er || data?.error) return setMsg(data?.error ?? "Generation failed. Check that the ai function is deployed.");
    try { const x = parseExam(data.exam); setExam(x); const t = totalMarks(x);
      setMsg(t === Number(f.totalMarks) ? "Draft saved. Review it before use." : `Draft saved, but marks add up to ${t}, not ${f.totalMarks}. Edit before use.`); } catch (x) { setMsg((x as Error).message); } }
  function word(withAnswers: boolean) { const b = new Blob([examToHtml(exam!, withAnswers)], { type: "application/msword" }); const a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = `${exam!.title}${withAnswers ? "-marking-scheme" : ""}.doc`; a.click(); }
  function pdf(withAnswers: boolean) { const w = window.open("", "_blank"); if (!w) return; w.document.write(examToHtml(exam!, withAnswers)); w.document.close(); w.print(); }
  if (error) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>{error}</p></main>;
  if (!role) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Loading…</p></main>;
  if (!can(role, "create_assessment")) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Your role cannot generate examinations.</p></main>;
  const box = "block w-full border border-steel/40 rounded-md p-2";
  return (<main className="px-6 py-14 max-w-3xl mx-auto"><h1 className="text-3xl font-bold mb-2">Generate an examination</h1>
    <p className="text-steel mb-4">Drafts are saved as drafts. Review them against the approved unit specification before official use.</p>
    <form onSubmit={run} className="grid gap-3">
      <label>Unit<select required value={f.unitId} onChange={e => setF({ ...f, unitId: e.target.value })} className={box}><option value="">Choose…</option>{units.map(u => <option key={u.id} value={u.id}>{u.code ? `${u.code} ` : ""}{u.title}</option>)}</select></label>
      <label>Total marks<input type="number" min={1} max={200} value={f.totalMarks} onChange={e => setF({ ...f, totalMarks: e.target.value })} className={box} /></label>
      <label>Minutes<input type="number" min={5} value={f.minutes} onChange={e => setF({ ...f, minutes: e.target.value })} className={box} /></label>
      <label>Difficulty<select value={f.difficulty} onChange={e => setF({ ...f, difficulty: e.target.value })} className={box}><option>easy</option><option>medium</option><option>hard</option></select></label>
      <button disabled={busy} className="bg-ember text-ink rounded-md py-2 font-semibold">{busy ? "Generating…" : "Generate draft"}</button></form>
    {msg && <p role="status" className="mt-4">{msg}</p>}
    {exam && <section className="mt-6 bg-white border border-steel/20 rounded-md p-5"><h2 className="font-semibold text-lg">{exam.title}</h2>
      {exam.sections.map((s, i) => <div key={i} className="mt-3"><h3 className="font-medium">{s.title}</h3><ol className="list-decimal ml-5">{s.questions.map((q, j) => <li key={j}>{q.text} <span className="text-steel text-sm">({q.marks} marks)</span></li>)}</ol></div>)}
      <div className="mt-4 flex flex-wrap gap-4 text-sm underline"><button onClick={() => word(false)}>Word: paper</button><button onClick={() => word(true)}>Word: marking scheme</button><button onClick={() => pdf(false)}>PDF: paper</button><button onClick={() => pdf(true)}>PDF: marking scheme</button></div></section>}</main>);
}
