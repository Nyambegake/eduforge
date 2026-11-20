"use client";
import Link from "next/link";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { SELF_SIGNUP } from "@/lib/permissions";
import { safeNext } from "@/lib/routes";
import { validateRegistration } from "@/lib/validate";
import ConfigBanner from "@/components/ConfigBanner";
const labels: Record<string, string> = { learner: "Learner (school, TVET or university)", teacher: "Teacher", tvet_trainer: "TVET Trainer", institution_admin: "Institution Administrator (needs approval)" };
const levels = ["Early Years and Primary", "Junior School", "Senior School", "TVET", "University", "Engineering or professional field", "Other"];
export default function Register() {
  const [f, setF] = useState({ name: "", email: "", password: "", country: "Kenya", role: "learner", institution: "", education: "" });
  const [errs, setErrs] = useState<Record<string, string>>({}); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault(); const sb = getSupabase(); if (!sb) return setMsg("Sign-up is not configured yet.");
    const v = validateRegistration(f); setErrs(v); if (Object.keys(v).length) return;
    setBusy(true); const next = safeNext(new URLSearchParams(window.location.search).get("next"));
    const { error } = await sb.auth.signUp({ email: f.email.trim(), password: f.password, options: { emailRedirectTo: `${window.location.origin}/login?next=${encodeURIComponent(next)}`,
      data: { full_name: f.name.trim(), role: f.role, country: f.country.trim(), institution: f.institution.trim(), education_level: f.education } } });
    setBusy(false); setMsg(error ? error.message : "Account created. Open the verification link we emailed you, then log in.");
  }
  const box = "block w-full border border-steel/40 rounded-md p-2"; const err = (k: string) => errs[k] && <span role="alert" className="text-sm text-ember">{errs[k]}</span>;
  return (<main className="px-6 py-14 max-w-md mx-auto"><h1 className="text-3xl font-bold mb-6">Create your account</h1><ConfigBanner />
    <form onSubmit={submit} className="grid gap-3" noValidate>
      <label>Full name<input value={f.name} onChange={set("name")} autoComplete="name" className={box} />{err("name")}</label>
      <label>Email<input type="email" value={f.email} onChange={set("email")} autoComplete="email" className={box} />{err("email")}</label>
      <label>Password<input type="password" value={f.password} onChange={set("password")} autoComplete="new-password" className={box} />{err("password")}</label>
      <label>Country<input value={f.country} onChange={set("country")} className={box} />{err("country")}</label>
      <label>I am a<select value={f.role} onChange={set("role")} className={box}>{SELF_SIGNUP.map(r => <option key={r} value={r}>{labels[r]}</option>)}</select></label>
      <label>Institution (optional)<input value={f.institution} onChange={set("institution")} className={box} /></label>
      <label>Education level or field<select value={f.education} onChange={set("education")} className={box}><option value="">Choose…</option>{levels.map(l => <option key={l}>{l}</option>)}</select>{err("education")}</label>
      <button disabled={busy} className="bg-ember text-ink rounded-md py-2 font-semibold">{busy ? "Creating…" : "Create account"}</button></form>
    {msg && <p role="status" className="mt-4 text-sm">{msg}</p>}
    <p className="mt-4 text-sm">Already registered? <Link href="/login" className="underline">Log in</Link></p></main>);
}
