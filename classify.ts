// Curriculum-guided classifier: deterministic matching against APPROVED curriculum units.
// An LLM can later add suggestions, but this layer decides auto-publish vs human review.
export type Unit = { id:string; code?:string; title:string; moduleTitle:string; course:string; category:string;
  level:number; body:string; curriculumVersion:string; superseded?:boolean; topics:string[] };
export type ResourceType = "marking_scheme"|"practical_checklist"|"session_plan"|"course_outline"|"assessment"|"notes"|"unknown";
export type Result = { status:"auto"|"review"; confidence:number; unit?:Unit; resourceType:ResourceType; outdated:boolean; alternatives:{unitId:string;score:number}[] };
const RULES:[ResourceType,RegExp][]=[
 ["marking_scheme",/marking (scheme|guide)|model answers/i],
 ["practical_checklist",/(practical|observation)( assessment)? checklist/i],
 ["session_plan",/session plan/i],["course_outline",/course outline/i],
 ["assessment",/\b(exam|assessment|cat|test)\b/i],["notes",/\b(notes|lecture)\b/i]];
export const detectType=(t:string):ResourceType=>RULES.find(([,r])=>r.test(t))?.[0]??"unknown";
const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
export function classify(text:string, filename:string, units:Unit[], threshold=0.75):Result{
  const raw=`${filename} ${text}`, t=norm(raw);
  const scored=units.map(u=>{
    let s=0;
    if(u.code && t.includes(norm(u.code))) s+=0.5;
    if(t.includes(norm(u.title))) s+=0.5;
    if(t.includes(norm(u.course))) s+=0.15;
    if(new RegExp(`level ${u.level}\\b`).test(t)) s+=0.1;
    if(u.topics.some(x=>t.includes(norm(x)))) s+=0.15;
    return {unit:u,score:Math.round(Math.min(1,s)*100)/100};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  const best=scored[0], second=scored[1];
  const resourceType=detectType(raw);
  if(!best) return {status:"review",confidence:0,resourceType,outdated:false,alternatives:[]};
  const clear=best.score>=threshold && (!second || best.score-second.score>=0.15);
  return {status:clear?"auto":"review",confidence:best.score,unit:best.unit,resourceType,
    outdated:!!best.unit.superseded,alternatives:scored.slice(0,3).map(x=>({unitId:x.unit.id,score:x.score}))};
}
export async function sha256(data:Uint8Array):Promise<string>{
  const d=await crypto.subtle.digest("SHA-256",data as BufferSource);
  return Array.from(new Uint8Array(d)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
export const isDuplicate=(hash:string,known:Set<string>)=>known.has(hash);
