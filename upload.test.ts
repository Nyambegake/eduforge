import { describe, it, expect } from "vitest";
import { validateFile } from "../src/lib/upload";
describe("validateFile",()=>{
 it("accepts supported types",()=>expect(validateFile("Notes.PDF",1000)).toBeNull());
 it("rejects executables",()=>expect(validateFile("a.exe",10)).toMatch(/not supported/));
 it("rejects empty and oversized",()=>{expect(validateFile("a.pdf",0)).toMatch(/empty/);expect(validateFile("a.mp4",101*1024*1024)).toMatch(/larger/);});
});
