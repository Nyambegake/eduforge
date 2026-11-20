import { describe, it, expect } from "vitest";
import { can, SELF_SIGNUP } from "../src/lib/permissions";
describe("permissions",()=>{
 it("learners cannot upload or approve",()=>{expect(can("learner","upload_resource")).toBe(false);expect(can("learner","approve_resource")).toBe(false);});
 it("trainers can upload but not approve",()=>{expect(can("tvet_trainer","upload_resource")).toBe(true);expect(can("tvet_trainer","approve_resource")).toBe(false);});
 it("content admins approve",()=>{expect(can("content_admin","approve_resource")).toBe(true);});
 it("admin roles cannot be self-assigned",()=>{expect(SELF_SIGNUP).not.toContain("super_admin");});
});
