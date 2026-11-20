import { describe, it, expect } from "vitest";
import { parseExam, totalMarks, examToHtml } from "../src/lib/exam";
const raw = { title: "Test <1>", sections: [{ title: "A", questions: [{ text: "Define MMAW", marks: 4, answer: "Manual metal arc welding" }, { text: "List 3 PPE", marks: 6, answer: "Helmet" }] }] };
describe("exam helpers", () => {
  it("totals marks", () => expect(totalMarks(parseExam(raw))).toBe(10));
  it("rejects malformed exams", () => expect(() => parseExam({ title: 1 })).toThrow());
  it("escapes HTML and hides answers in the paper", () => { const h = examToHtml(parseExam(raw), false); expect(h).toContain("Test &lt;1&gt;"); expect(h).not.toContain("Manual metal arc"); });
  it("shows answers in the marking scheme", () => expect(examToHtml(parseExam(raw), true)).toContain("Manual metal arc welding"));
});
