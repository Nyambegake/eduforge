import type { Action } from "./permissions";
// Deny by default: anything not listed as public requires a signed-in, verified, active account.
const PUBLIC = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/founder", "/about"];
const ACTION_ROUTES: [string, Action][] = [["/admin/curriculum", "manage_curriculum"], ["/admin/approvals", "approve_resource"],
  ["/admin/subscriptions", "manage_users"], ["/upload", "upload_resource"], ["/assessments/generate", "create_assessment"]];
export type Requirement = { kind: "public" } | { kind: "auth"; action?: Action };
const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
export function requirementFor(path: string): Requirement {
  const p = norm(path.split("?")[0].split("#")[0]);
  if (PUBLIC.includes(p)) return { kind: "public" };
  const hit = ACTION_ROUTES.find(([r]) => p === r || p.startsWith(r + "/"));
  if (hit) return { kind: "auth", action: hit[1] };
  if (p === "/admin" || p.startsWith("/admin/")) return { kind: "auth", action: "manage_users" };
  return { kind: "auth" };
}
// Only allow same-site relative paths after login, never other websites.
export function safeNext(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/dashboard";
  return raw;
}
