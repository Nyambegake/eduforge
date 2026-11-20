import Link from "next/link";
const links=[["Departments","/departments"],["TVET","/tvet"],["Tools","/tools"],["Login","/login"],["Register","/register"],["Meet the Founder","/founder"]];
export default function Header(){
  return (<header className="bg-white border-b border-steel/20 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
    <Link href="/" className="flex items-center gap-2 font-bold text-lg">
      <span aria-hidden className="grid place-items-center w-9 h-9 bg-ink text-ember rounded-md">E</span>EduForge</Link>
    <nav className="flex gap-5 text-sm">{links.map(([t,h])=><Link key={h} href={h} className="hover:text-ember">{t}</Link>)}</nav>
  </header>);
}
