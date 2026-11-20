export const ALLOWED = ["pdf","doc","docx","ppt","pptx","xls","xlsx","csv","txt","jpg","jpeg","png","webp","mp4","mov","avi","mp3","wav","zip"];
export const MAX_MB = 100;
export function validateFile(name: string, size: number): string | null {
  const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
  if (!ALLOWED.includes(ext)) return `.${ext || "?"} files are not supported`;
  if (size === 0) return "File is empty";
  if (size > MAX_MB * 1024 * 1024) return `File is larger than ${MAX_MB} MB`;
  return null;
}
