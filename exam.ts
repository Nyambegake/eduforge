export type Q = { text: string; marks: number; type?: string; answer?: string };
export type Exam = { title: string; instructions?: string; sections: { title: string; questions: Q[] }[] };
export function parseExam(raw: any): Exam {
  if (!raw || typeof raw.title !== "string" || !Array.isArray(raw.sections)) throw new Error("The AI reply was not a valid examination.");
  for (const s of raw.sections) for (const q of s.questions ?? []) if (typeof q.text !== "string" || typeof q.marks !== "number") throw new Error("A question is missing text or marks.");
  return raw as Exam;
}
export const totalMarks = (e: Exam) => e.sections.reduce((a, s) => a + s.questions.reduce((b, q) => b + q.marks, 0), 0);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// withAnswers=true produces the marking scheme. Word opens this HTML as a document.
export function examToHtml(e: Exam, withAnswers: boolean): string {
  let n = 0;
  const body = e.sections.map(s => `<h2>${esc(s.title)}</h2>` + s.questions.map(q => { n++;
    return `<p><b>${n}.</b> ${esc(q.text)} <i>(${q.marks} marks)</i></p>` + (withAnswers ? `<p style="margin-left:24px"><b>Answer:</b> ${esc(q.answer ?? "")}</p>` : `<p>&nbsp;</p>`); }).join("")).join("");
  return `<html><head><meta charset="utf-8"><title>${esc(e.title)}</title></head><body><h1>${esc(e.title)}${withAnswers ? " - Marking scheme" : ""}</h1>` +
    (withAnswers ? "" : `<p>Name: ____________________ Reg No: ____________</p><p>${esc(e.instructions ?? "")}</p>`) + body + `<p><i>Total: ${totalMarks(e)} marks. AI-generated draft: review against the approved curriculum before use.</i></p></body></html>`;
}
