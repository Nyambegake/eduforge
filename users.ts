import type { Role } from "./permissions";
// Roles an administrator may assign from the user screen. super_admin is offered only to a super administrator.
export const ASSIGNABLE_ROLES: Role[] = ["learner", "teacher", "tvet_trainer", "institution_admin", "content_admin", "system_admin", "super_admin"];
export const STATUSES = ["active", "pending", "suspended"] as const;
// Which role options a given admin may see.
export const rolesFor = (me: Role): Role[] => (me === "super_admin" ? ASSIGNABLE_ROLES : ASSIGNABLE_ROLES.filter(r => r !== "super_admin"));
