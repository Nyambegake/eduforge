export type RegForm = { name: string; email: string; password: string; country: string; education: string };
export function validateRegistration(f: RegForm): Record<string, string> {
  const e: Record<string, string> = {};
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) e.password = "Use at least 8 characters with a letter and a number.";
  if (!f.country.trim()) e.country = "Enter your country.";
  if (!f.education) e.education = "Choose your level or field.";
  return e;
}
