import { describe, it, expect } from "vitest";
import { classify, detectType, sha256 } from "../backend/ai-classification/classify";
import { demoUnits } from "../src/data/tvet-demo";
describe("classifier",()=>{
 it("auto-classifies a clear welding resource",()=>{
  const r=classify("Welding Technology Level 5. Arc Welding Processes II lecture notes","notes.pdf",demoUnits);
  expect(r.status).toBe("auto"); expect(r.unit?.id).toBe("u1"); expect(r.resourceType).toBe("notes");});
 it("sends vague material to review",()=>{
  expect(classify("General workshop handout","x.pdf",demoUnits).status).toBe("review");});
 it("flags superseded curriculum",()=>{
  const u=[{...demoUnits[0],superseded:true}];
  expect(classify("Welding Technology Level 5 Arc Welding Processes II","a.pdf",u).outdated).toBe(true);});
 it("detects types and duplicates",async()=>{
  expect(detectType("MMAW practical checklist")).toBe("practical_checklist");
  const a=await sha256(new TextEncoder().encode("a")), b=await sha256(new TextEncoder().encode("a"));
  expect(a).toBe(b);});
});
