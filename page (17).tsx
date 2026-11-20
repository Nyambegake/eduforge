"use client";
import { useState } from "react";
import { categories, partners } from "@/data/partners";
import { LEVELS, meta } from "@/data/partner-meta";
export default function Tools() {
  const [cat, setCat] = useState("All"); const [level, setLevel] = useState("All"); const [q, setQ] = useState("");
  const shown = partners.filter(p => (cat === "All" || p.category === cat) && (level === "All" || meta[p.name]?.levels.includes(level as any)) && `${p.name} ${p.blurb} ${p.category}`.toLowerCase().includes(q.toLowerCase()));
  return (<main className="px-6 py-14 max-w-5xl mx-auto"><h1 className="text-3xl font-bold">Learning and Making Tools</h1>
    <p className="text-steel mt-2 max-w-2xl">A curated set of outside tools and libraries for learners from primary school to university. Each opens on its own website.</p>
    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search tools by name or need" aria-label="Search tools" className="mt-6 w-full border border-steel/40 rounded-md p-2" />
    <label className="block mt-3 text-sm">Level <select value={level} onChange={e => setLevel(e.target.value)} className="border border-steel/40 rounded-md p-1 ml-2"><option>All</option>{LEVELS.map(l => <option key={l}>{l}</option>)}</select></label>
    <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Filter by category">
      {["All", ...categories].map(c => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
        className={`px-3 py-1 rounded-md border text-sm ${cat === c ? "bg-ink text-white border-ink" : "bg-white border-steel/30"}`}>{c}</button>)}</div>
    <ul className="grid md:grid-cols-2 gap-4 mt-6">{shown.map(p => (<li key={p.url} className="bg-white border border-steel/20 rounded-md p-5">
      <h2 className="font-semibold">{p.name}</h2><p className="text-sm text-steel">{p.category} · {meta[p.name]?.levels.join(", ")}</p><p className="mt-2 text-sm">{p.blurb}</p>
      {p.note && <p className="mt-2 text-xs text-steel">{p.note}</p>}
      <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 underline font-medium">Open {p.name}</a></li>))}</ul>
    {shown.length === 0 && <p className="mt-6 text-steel">No tools match. Clear the search or filters.</p>}
    <p className="text-xs text-steel mt-8">These sites belong to their owners. EduForge links to them and does not host, copy or change their content.</p></main>);
}
