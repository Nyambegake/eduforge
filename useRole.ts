"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "./supabase";
import type { Role } from "./permissions";
export function useRole() {
  const r = useRouter();
  const [state, setState] = useState<{ role: Role | null; error: string }>({ role: null, error: "" });
  useEffect(() => { (async () => {
    const sb = getSupabase(); if (!sb) return setState({ role: null, error: "Supabase is not configured." });
    const { data: { session } } = await sb.auth.getSession(); if (!session) return r.replace("/login");
    const { data } = await sb.from("profiles").select("status, roles(name)").eq("id", session.user.id).single();
    setState({ role: (((data as any)?.status === "active" ? (data as any)?.roles?.name : null) ?? "guest") as Role, error: "" });
  })(); }, [r]);
  return state;
}
