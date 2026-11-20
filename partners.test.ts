import { describe, it, expect } from "vitest";
import { partners, categories } from "../src/data/partners";
describe("partner links", () => {
  it("uses https and no duplicates", () => { const u = partners.map(p => p.url); expect(u.every(x => x.startsWith("https://"))).toBe(true); expect(new Set(u).size).toBe(u.length); });
  it("uses known categories", () => expect(partners.every(p => categories.includes(p.category))).toBe(true));
  it("excludes piracy sites", () => expect(partners.some(p => /welib|z-lib|libgen/i.test(p.url))).toBe(false));
});
