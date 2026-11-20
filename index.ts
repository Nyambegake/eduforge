// Supabase Edge Function. Holds the OpenAI key server-side. Deploy via dashboard or CLI.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
async function ask(system: string, user: string, asJson = false): Promise<string> {
  const r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini", messages: [{ role: "system", content: system }, { role: "user", content: user }], ...(asJson ? { response_format: { type: "json_object" } } : {}) }) });
  if (!r.ok) throw new Error(`AI provider error ${r.status}`);
  return (await r.json()).choices[0].message.content as string;
}
const STAFF = ["teacher", "tvet_trainer", "content_admin", "system_admin", "super_admin"];
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
    const { data: { user } } = await sb.auth.getUser(); if (!user) return json({ error: "Not signed in" }, 401);
    const { data: p } = await sb.from("profiles").select("roles(name)").eq("id", user.id).single();
    const role = (p as any)?.roles?.name ?? "guest";
    const day = new Date(); day.setUTCHours(0, 0, 0, 0);
    const { count } = await sb.from("ai_usage").select("id", { count: "exact", head: true }).gte("created_at", day.toISOString());
    if ((count ?? 0) >= Number(Deno.env.get("AI_DAILY_LIMIT") ?? "50")) return json({ error: "Daily AI limit reached. Try again tomorrow." }, 429);
    const body = await req.json();
    await sb.from("ai_usage").insert({ user_id: user.id, task: String(body.task) });

    if (body.task === "assistant") {
      const q = String(body.question ?? "").slice(0, 1000); if (!q.trim()) return json({ error: "Ask a question first." }, 400);
      const kws = q.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3).slice(0, 4);
      let units: any[] = [], resources: any[] = [];
      if (kws.length) {
        const f = kws.map((k) => `title.ilike.%${k}%`).join(",");
        units = (await sb.from("units").select("title,code,curriculum_versions!inner(approved)").eq("curriculum_versions.approved", true).or(f).limit(5)).data ?? [];
        resources = (await sb.from("resources").select("title").eq("status", "approved").or(f).limit(5)).data ?? [];
      }
      const ctx = `Approved curriculum units: ${units.map((u) => `${u.title}${u.code ? ` (${u.code})` : ""}`).join("; ") || "none found"}. Approved resources: ${resources.map((r) => r.title).join("; ") || "none found"}.`;
      const answer = await ask("You are the EduForge learning assistant for Kenyan school and TVET learners. Use the official context to focus your answer. If the context does not cover the question, say so, then give a general explanation under the heading 'General AI explanation (not from approved EduForge materials)'. Be clear, age-appropriate and safe. Never claim to be official curriculum.", `Context: ${ctx}\n\nQuestion: ${q}`);
      return json({ answer, sources: { units: units.map((u) => u.title), resources: resources.map((r) => r.title) } });
    }
    if (body.task === "exam") {
      if (!STAFF.includes(role)) return json({ error: "Your role cannot generate examinations." }, 403);
      const marks = Math.min(200, Math.max(1, Number(body.totalMarks) || 50));
      const { data: unit } = await sb.from("units").select("title,code,modules(title)").eq("id", body.unitId).single();
      if (!unit) return json({ error: "Choose a unit first." }, 400);
      const raw = await ask("You write assessments. Reply with JSON only: {\"title\":string,\"instructions\":string,\"sections\":[{\"title\":string,\"questions\":[{\"text\":string,\"marks\":number,\"type\":string,\"answer\":string}]}]}. Question marks must add up exactly to the requested total. Include a model answer for every question.",
        `Unit: ${(unit as any).title} (module ${(unit as any).modules?.title ?? "n/a"}). Total marks: ${marks}. Duration: ${Number(body.minutes) || 60} minutes. Difficulty: ${String(body.difficulty ?? "medium")}.`, true);
      const exam = JSON.parse(raw);
      const { data: a } = await sb.from("assessments").insert({ title: exam.title ?? "Draft examination", kind: "exam", unit_id: body.unitId, total_marks: marks, duration_minutes: Number(body.minutes) || 60, status: "draft" }).select("id").single();
      const qs = (exam.sections ?? []).flatMap((s: any) => (s.questions ?? []).map((x: any) => ({ unit_id: body.unitId, qtype: x.type, question: x.text, marks: x.marks, difficulty: body.difficulty, answer: x.answer })));
      if (qs.length) await sb.from("questions").insert(qs);
      return json({ exam, assessmentId: (a as any)?.id });
    }
    return json({ error: "Unknown task" }, 400);
  } catch (e) { return json({ error: (e as Error).message }, 500); }
});
