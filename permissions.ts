export type Role = "super_admin"|"system_admin"|"content_admin"|"teacher"|"tvet_trainer"|"learner"|"institution_admin"|"guest";
export type Action = "view_resources"|"upload_resource"|"approve_resource"|"create_assessment"|"manage_curriculum"|"manage_users"|"view_reports";
const ALL: Action[] = ["view_resources","upload_resource","approve_resource","create_assessment","manage_curriculum","manage_users","view_reports"];
const MAP: Record<Role, Action[]> = {
  super_admin: ALL, system_admin: ALL,
  content_admin: ["view_resources","upload_resource","approve_resource","manage_curriculum"],
  teacher: ["view_resources","upload_resource","create_assessment","view_reports"],
  tvet_trainer: ["view_resources","upload_resource","create_assessment","view_reports"],
  institution_admin: ["view_resources","view_reports","manage_users"],
  learner: ["view_resources"], guest: [],
};
export const can = (r: Role, a: Action) => MAP[r]?.includes(a) ?? false;
export const actionsFor = (r: Role) => MAP[r] ?? [];
// Admin roles are never self-assigned; they are granted by a Super Administrator.
// institution_admin can sign up but stays pending until a Super Administrator approves it.
export const SELF_SIGNUP: Role[] = ["learner", "teacher", "tvet_trainer", "institution_admin"];
