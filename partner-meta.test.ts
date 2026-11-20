import { describe, it, expect } from "vitest";
import { partners } from "../src/data/partners";
import { meta } from "../src/data/partner-meta";
import { departments } from "../src/components/departments";
describe("partner metadata", () => {
  it("covers every partner", () => expect(partners.filter(p => !meta[p.name]).map(p => p.name)).toEqual([]));
  it("links only to real departments", () => { const slugs = departments.map(d => d.slug); expect(Object.values(meta).every(x => x.depts.every(d => slugs.includes(d)))).toBe(true); });
  it("has ten departments", () => expect(departments.length).toBe(10));
});
