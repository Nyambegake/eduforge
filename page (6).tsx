import { demoUnits } from "@/data/tvet-demo";
export const metadata={title:"TVET | EduForge"};
export default function Tvet(){
  return (<main className="px-6 py-14 max-w-5xl mx-auto"><h1 className="text-3xl font-bold">TVET and Vocational Training</h1>
    <p className="text-steel mt-2">Demonstration data. Category and level are stored separately, and each course keeps its own modules and units.</p>
    <div className="mt-6 grid gap-4">{demoUnits.map(u=>(<article key={u.id} className="bg-white border border-steel/20 rounded-md p-5">
      <h2 className="font-semibold">{u.course}</h2>
      <dl className="text-sm mt-2 grid grid-cols-2 gap-1"><dt className="text-steel">Examining body</dt><dd>{u.body}</dd>
      <dt className="text-steel">Category</dt><dd>{u.category}</dd><dt className="text-steel">Level</dt><dd>{u.level}</dd>
      <dt className="text-steel">Module</dt><dd>{u.moduleTitle}</dd><dt className="text-steel">Unit</dt><dd>{u.title}</dd>
      <dt className="text-steel">Curriculum version</dt><dd>{u.curriculumVersion}</dd></dl></article>))}</div></main>);
}
