"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { can, Role } from "@/lib/permissions";
import { requirementFor } from "@/lib/routes";
type St = { s: "checking" } | { s: "anon" } | { s: "unverified" } | { s: "unconfigured" } | { s: "error"; msg: string } | { s: "ready"; role: Role; status: string };
const Screen = ({ title, children }: { title: string; children: ReactNode }) => (
  <main className="px-6 py-20 max-w-xl mx-auto text-center"><h1 className="text-3xl font-bold">{title}</h1><div className="mt-4 grid gap-3">{children}</div></main>);
const btn = "inline-block rounded-md px-5 py-3 font-semibold";
export default function AuthGate({ children }: { children: ReactNode }) {
  const path = usePathname() ?? "/"; const req = requirementFor(path); const isPublic = req.kind === "public";
  const action = req.kind === "auth" ? req.action : undefined;
  const [st, setSt] = useState<St>({ s: "checking" });
  useEffect(() => {
    if (isPublic) return;
    const sb = getSupabase(); if (!sb) { setSt({ s: "unconfigured" }); return; }
    let live = true;
    async function check() {
      const { data: { session } } = await sb!.auth.getSession(); if (!live) return;
      if (!session) return setSt({ s: "anon" });
      if (!session.user.email_confirmed_at) return setSt({ s: "unverified" });
      const { data, error } = await sb!.from("profiles").select("status, roles(name)").eq("id", session.user.id).single(); if (!live) return;
      if (error || !data) return setSt({ s: "error", msg: "Your profile could not be loaded. Ask an administrator to check your account." });
      setSt({ s: "ready", role: ((data as any).roles?.name ?? "guest") as Role, status: (data as any).status });
    }
    setSt({ s: "checking" }); check();
    const { data: sub } = sb.auth.onAuthStateChange(() => { check(); });
    return () => { live = false; sub.subscription.unsubscribe(); };
  }, [path, isPublic]);
  if (isPublic) return <>{children}</>;
  if (st.s === "checking") return <Screen title="Checking your session…"><p className="text-steel">One moment.</p></Screen>;
  if (st.s === "unconfigured") return process.env.NODE_ENV === "production"
    ? <Screen title="Service unavailable"><p>Sign-in is not configured yet. Please try again later.</p></Screen>
    : <><p role="alert" className="bg-white border-b border-ember p-3 text-sm text-center">Preview mode: Supabase keys are missing, so this page is not protected.</p>{children}</>;
  const next = encodeURIComponent(path);
  if (st.s === "anon") return (<Screen title="Sign up or log in to continue">
    <p className="text-steel">EduForge resources, tools and dashboards are for registered members. It is free to start.</p>
    <div className="flex justify-center gap-3"><Link href={`/register?next=${next}`} className={`${btn} bg-ember text-ink`}>Sign up</Link><Link href={`/login?next=${next}`} className={`${btn} bg-ink text-white`}>Log in</Link></div></Screen>);
  if (st.s === "unverified") return <Screen title="Verify your email"><p>Open the verification link we emailed you, then log in again.</p><Link href="/login" className="underline">Back to log in</Link></Screen>;
  if (st.s === "error") return <Screen title="Account problem"><p>{st.msg}</p></Screen>;
  if (st.s !== "ready") return null;
  if (st.status === "pending") return <Screen title="Waiting for approval"><p>Your account is waiting for administrator approval. You will be able to continue once it is approved.</p></Screen>;
  if (st.status !== "active") return <Screen title="Account suspended"><p>Contact an EduForge administrator to restore access.</p></Screen>;
  if (action && !can(st.role, action)) return <Screen title="You do not have access to this page"><p>Your role cannot open it.</p><Link href="/dashboard" className="underline">Go to your dashboard</Link></Screen>;
  return <>{children}</>;
}
