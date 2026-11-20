import { describe, it, expect } from "vitest";
import { rolesFor, ASSIGNABLE_ROLES } from "../src/lib/users";
import { requirementFor } from "../src/lib/routes";
describe("user management", () => {
  it("only a super admin can grant super_admin", () => {
    expect(rolesFor("super_admin")).toContain("super_admin");
    expect(rolesFor("system_admin")).not.toContain("super_admin");
  });
  it("guest is never assignable here", () => expect(ASSIGNABLE_ROLES).not.toContain("guest"));
  it("/admin/users is protected", () => expect(requirementFor("/admin/users").kind).toBe("auth"));
});
