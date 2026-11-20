import { departments } from "@/components/departments";
import { partners } from "@/data/partners";
import { meta } from "@/data/partner-meta";
export default function Departments(){
  return (<main className="px-6 py-14 max-w-5xl mx-auto"><h1 className="text-3xl font-bold mb-6">Departments</h1>
    {departments.map(d=>(<section key={d.slug} id={d.slug} className="bg-white border border-steel/20 rounded-md p-5 mb-4">
      <h2 className="font-semibold text-lg">{d.name}</h2><p className="text-steel">{d.levels}</p>
      <p className="text-sm mt-2">Curriculum, resources and assessments are managed by administrators.</p>
      {partners.filter(t=>meta[t.name]?.depts.includes(d.slug)).length>0&&<div className="mt-3"><h3 className="text-sm font-semibold">Related tools</h3>
        <ul className="flex flex-wrap gap-3 mt-1 text-sm">{partners.filter(t=>meta[t.name]?.depts.includes(d.slug)).map(t=><li key={t.url}><a href={t.url} target="_blank" rel="noopener noreferrer" className="underline">{t.name}</a></li>)}</ul></div>}</section>))}</main>);
}
