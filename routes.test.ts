import { describe, it, expect } from "vitest";
import { requirementFor, safeNext } from "../src/lib/routes";
import { validateRegistration } from "../src/lib/validate";
describe("route gate", () => {
  it("keeps landing, auth pages and founder public", () => { for (const p of ["/", "/login", "/register", "/forgot-password", "/reset-password", "/founder", "/login/"]) expect(requirementFor(p).kind).toBe("public"); });
  it("protects the ecosystem by default", () => { for (const p of ["/dashboard", "/departments", "/tvet", "/tools", "/library", "/assistant", "/engineering/x", "/university", "/anything-new"]) expect(requirementFor(p).kind).toBe("auth"); });
  it("requires permissions on admin routes", () => { expect(requirementFor("/admin/approvals")).toEqual({ kind: "auth", action: "approve_resource" }); expect(requirementFor("/admin/unknown")).toEqual({ kind: "auth", action: "manage_users" }); });
  it("blocks open redirects", () => { expect(safeNext("//evil.com")).toBe("/dashboard"); expect(safeNext("https://evil.com")).toBe("/dashboard"); expect(safeNext("/tvet")).toBe("/tvet"); expect(safeNext(null)).toBe("/dashboard"); });
});
describe("registration validation", () => {
  const ok = { name: "Amina Wanjiku", email: "a@b.co", password: "abcd1234", country: "Kenya", education: "TVET" };
  it("accepts a good form", () => expect(validateRegistration(ok)).toEqual({}));
  it("flags weak passwords and bad emails", () => { const e = validateRegistration({ ...ok, password: "short", email: "nope" }); expect(e.password).toBeTruthy(); expect(e.email).toBeTruthy(); });
});
