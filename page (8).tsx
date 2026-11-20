import Link from "next/link";
import { departments } from "@/components/departments";
export default function Home(){
  return (<main>
    <section className="bg-ink text-white px-6 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">One Platform. Every Level. Unlimited Learning Possibilities.</h1>
        <p className="mt-5 text-lg text-mist/80 max-w-2xl">Access curriculum-based learning materials, examinations, teaching resources, vocational training materials and engineering knowledge in one integrated digital environment.</p>
        <div className="mt-8 flex gap-3"><Link href="/departments" className="bg-ember text-ink font-semibold px-5 py-3 rounded-md">Browse departments</Link>
        <Link href="/tvet" className="border border-mist/40 px-5 py-3 rounded-md">Browse TVET courses</Link>
        <Link href="/tools" className="border border-mist/40 px-5 py-3 rounded-md">Learning tools</Link>
        <Link href="/founder" className="border border-mist/40 px-5 py-3 rounded-md">Meet the founder</Link></div>
      </div></section>
    <section className="px-6 py-14 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Departments</h2>
      <ul className="grid md:grid-cols-2 gap-4">{departments.map(d=>(
        <li key={d.slug}><Link href={`/departments#${d.slug}`} className="block bg-white border border-steel/20 rounded-md p-5 hover:border-ember">
          <h3 className="font-semibold">{d.name}</h3><p className="text-steel text-sm mt-1">{d.levels}</p></Link></li>))}</ul>
    </section></main>);
}
