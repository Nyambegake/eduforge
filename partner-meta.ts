// Which levels and departments each outside tool suits. Keyed by partner name.
export const LEVELS = ["Primary", "Junior", "Senior", "TVET", "University", "Professional"] as const;
export type Level = (typeof LEVELS)[number];
const m = (levels: Level[], depts: string[]) => ({ levels, depts });
export const meta: Record<string, { levels: Level[]; depts: string[] }> = {
  "Mindgrasp": m(["Senior","TVET","University"], ["university","senior-school","tvet"]),
  "Hugging Face": m(["University","Professional"], ["university","engineering"]),
  "Intangible": m(["Senior","University","Professional"], ["creative-design"]),
  "iamtechartist": m(["Junior","Senior","University"], ["junior-school","senior-school","engineering"]),
  "MIT OpenCourseWare": m(["University","Professional"], ["university","engineering"]),
  "Class Central": m(["TVET","University","Professional"], ["university","tvet"]),
  "Lunchbox Sessions": m(["TVET","University","Professional"], ["tvet","engineering"]),
  "Instructables": m(["Primary","Junior","Senior","TVET","University"], ["upper-primary","junior-school","engineering","tvet"]),
  "iFixit": m(["TVET","Professional"], ["tvet","engineering"]),
  "Tinkercad": m(["Primary","Junior","Senior","TVET","University"], ["junior-school","senior-school","engineering","tvet"]),
  "Zoo": m(["TVET","University","Professional"], ["engineering"]),
  "Things Workshop": m(["Senior","TVET","University"], ["engineering","senior-school"]),
  "BenchTwin": m(["TVET","University"], ["engineering","tvet"]),
  "Blueprint": m(["TVET","University","Professional"], ["engineering","tvet"]),
  "Tailornova": m(["TVET","Professional"], ["creative-design","tvet"]),
  "BioDigital Human": m(["Senior","University","Professional"], ["health-life-sciences","university"]),
  "Anatomy Atelier": m(["Senior","University"], ["health-life-sciences","creative-design"]),
  "Animagraffs": m(["Junior","Senior","TVET","University"], ["junior-school","senior-school","engineering"]),
  "Human Benchmark": m(["Primary","Junior","Senior","University","Professional"], ["economics-cognitive"]),
  "AhaBoard": m(["Junior","Senior","University"], ["economics-cognitive","university"]),
  "Scantrader": m(["Professional"], ["economics-cognitive"]),
  "OpenStax": m(["Senior","University"], ["senior-school","university"]),
  "Project Gutenberg": m(["Junior","Senior","University"], ["university"]),
  "Open Library": m(["Primary","Junior","Senior","University"], ["university"]),
  "Directory of Open Access Books": m(["University","Professional"], ["university"]),
};
