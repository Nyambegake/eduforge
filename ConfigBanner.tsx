"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
// Checks after the page loads in the browser, so building the site never touches Supabase.
export default function ConfigBanner() {
  const [missing, setMissing] = useState(false);
  useEffect(() => { setMissing(!getSupabase()); }, []);
  if (!missing) return null;
  return <p role="alert" className="mb-4 rounded-md border border-ember bg-white p-3 text-sm">Preview mode: Supabase keys are not set, so sign-in is switched off. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.</p>;
}
