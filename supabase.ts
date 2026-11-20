import { createClient, SupabaseClient } from "@supabase/supabase-js";
let client: SupabaseClient | null = null;
// Returns null if the URL or anon key is missing or invalid. Only public keys belong here.
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(), key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  try { return (client ??= createClient(url, key)); } catch { return null; }
}
