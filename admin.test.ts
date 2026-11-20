import { describe, it, expect } from "vitest";
import { missing, toPayload, Field } from "../src/lib/admin";
const f: Field[] = [{ key: "name", label: "Name", type: "text", required: true }, { key: "lvl", label: "Level", type: "number" },
  { key: "body", label: "Body", type: "select" }, { key: "ok", label: "Approved", type: "checkbox" }];
describe("admin helpers", () => {
  it("reports missing required fields", () => expect(missing(f, {})).toEqual(["Name"]));
  it("builds a typed payload", () => expect(toPayload(f, { name: " Welding ", lvl: "5", body: "2", ok: true })).toEqual({ name: "Welding", lvl: 5, body: 2, ok: true }));
  it("keeps uuids as strings and blanks as null", () => {
    const p = toPayload(f, { name: "x", body: "3f2a-uuid" }); expect(p.body).toBe("3f2a-uuid"); expect(p.lvl).toBeNull(); expect(p.ok).toBe(false); });
});
