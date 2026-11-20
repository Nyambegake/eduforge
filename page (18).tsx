"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import { actionsFor, can, Role } from "@/lib/permissions";
const text:Record<string,string>={view_resources:"Browse approved resources",upload_resource:"Upload learning materials",approve_resource:"Approve resources",create_assessment:"Create assessments",manage_curriculum:"Manage curricula",manage_users:"Manage users",view_reports:"View learner reports"};
export default function Dashboard(){
  const r=useRouter(); const [info,setInfo]=useState<{name:string;role:Role}|null>(null); const [err,setErr]=useState("");
  useEffect(()=>{ (async()=>{ const sb=getSupabase(); if(!sb) return setErr("Supabase is not configured.");
    const {data:{session}}=await sb.auth.getSession(); if(!session) return r.replace("/login");
    const {data,error}=await sb.from("profiles").select("full_name, roles(name)").eq("id",session.user.id).single();
    if(error||!data) return setErr("Profile not found. Run migration 003 in Supabase.");
    const role=((data as any).roles?.name ?? "guest") as Role; setInfo({name:data.full_name??session.user.email??"",role}); })(); },[r]);
  async function out(){ await getSupabase()?.auth.signOut(); r.push("/login"); }
  if(err) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>{err}</p></main>;
  if(!info) return <main className="px-6 py-14 max-w-3xl mx-auto"><p>Loading your dashboard…</p></main>;
  return (<main className="px-6 py-14 max-w-3xl mx-auto"><h1 className="text-3xl font-bold">Welcome, {info.name}</h1>
    <p className="text-steel mt-1">Role: {info.role.replace("_"," ")}</p>
    <h2 className="font-semibold mt-6">Your permissions</h2>
    <ul className="list-disc ml-5 mt-2">{actionsFor(info.role).map(a=><li key={a}>{text[a]}</li>)}</ul>
    <p className="text-sm text-steel mt-4">The tools behind these permissions arrive in the next stages.</p>
    <nav className="mt-6 flex flex-wrap gap-4 underline">
      <Link href="/library">Library</Link><Link href="/videos">Video Academy</Link><Link href="/assistant">AI assistant</Link>
      {can(info.role,"upload_resource")&&<Link href="/upload">Upload</Link>}
      {can(info.role,"approve_resource")&&<Link href="/admin/approvals">Approvals</Link>}
      {can(info.role,"create_assessment")&&<><Link href="/assessments">Assessments</Link><Link href="/assessments/generate">Generate exam</Link></>}
      {can(info.role,"manage_users")&&<Link href="/admin/subscriptions">Plans</Link>}
      {(info.role==="super_admin"||info.role==="system_admin")&&<Link href="/admin/users">Users</Link>}
    </nav>
    {can(info.role,"manage_curriculum")&&<p className="mt-4"><Link href="/admin/curriculum" className="underline font-semibold">Open curriculum management</Link></p>}
    <button onClick={out} className="mt-6 border border-ink rounded-md px-4 py-2">Log out</button></main>);
}
