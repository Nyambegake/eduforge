export type Field = { key:string; label:string; type:"text"|"number"|"select"|"checkbox"; required?:boolean; ref?:{table:string;label:string} };
export type Form = Record<string, string | boolean | undefined>;
export function missing(fields: Field[], form: Form): string[] {
  return fields.filter(f => f.required && (form[f.key] === undefined || form[f.key] === "")).map(f => f.label);
}
export function toPayload(fields: Field[], form: Form): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = form[f.key];
    if (f.type === "checkbox") out[f.key] = !!v;
    else if (v === undefined || v === "") out[f.key] = null;
    else if (f.type === "number") out[f.key] = Number(v);
    else if (f.type === "select") out[f.key] = /^\d+$/.test(String(v)) ? Number(v) : v; // serial ids are numbers, uuids stay strings
    else out[f.key] = String(v).trim();
  }
  return out;
}
