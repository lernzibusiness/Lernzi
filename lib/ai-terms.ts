import { termKey, type StudyTerm } from "./terms.ts";

export const MODEL_ID = "Qwen3-0.6B-q4f32_1-MLC";
export const MAX_AI_TEXT = 24000;
export function aiPassages(text: string): string[] {
  if (!text.trim()) throw new Error("Add some notes first.");
  if (text.length > MAX_AI_TEXT) throw new Error("Use an excerpt under 24,000 characters for local AI, or use quick extraction for longer notes.");
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + 1800, text.length);
    if (end < text.length) {
      const space = text.lastIndexOf(" ", end);
      if (space > start + 1200) end = space;
    }
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start = end - 150;
  }
  return chunks;
}
export const termSchema = JSON.stringify({type:"object",properties:{terms:{type:"array",items:{type:"object",properties:{term:{type:"string"},definition:{type:"string"},components:{type:"array",items:{type:"string"}},evidence:{type:"string"}},required:["term","definition","components","evidence"],additionalProperties:false}}},required:["terms"],additionalProperties:false});
const normalize = (s:string) => s.replace(/\s+/g," ").trim().toLowerCase();

/** Model output is untrusted. Keep only bounded, source-backed suggestions. */
export function parseAITerms(output:string, passage:string, file:string, section:number): StudyTerm[] {
  // Qwen adds an empty thinking prefix even with thinking disabled.
  const json=output.replace(/^\s*<think>[\s\S]*?<\/think>\s*/,"").replace(/^```(?:json)?\s*([\s\S]*?)\s*```\s*$/, "$1");
  let data:unknown;
  try {data=JSON.parse(json);} catch {throw new Error("The model returned an incomplete term list. Try a shorter excerpt or quick extraction.");}
  if (!data || typeof data!=="object" || !("terms" in data) || !Array.isArray(data.terms)) throw new Error("The model returned an invalid term list. Try a shorter excerpt.");
  const source = normalize(passage);
  const terms:StudyTerm[]=[];
  for (const item of data.terms.slice(0,12)) {
    if(!item || typeof item!=="object" || typeof item.term!=="string" || typeof item.definition!=="string" || typeof item.evidence!=="string" || !Array.isArray(item.components)) continue;
    const term=item.term.trim(), definition=item.definition.trim(), evidence=item.evidence.trim();
    if(term.length<2 || term.length>120 || definition.length>4000 || evidence.length<8 || evidence.length>500 || !source.includes(normalize(evidence)) || !source.includes(normalize(term))) continue;
    if(item.components.length>30 || item.components.some((s:unknown)=>typeof s!=="string" || s.length>500)) continue;
    const components:string[]=item.components.map((s:string)=>s.trim()).filter(Boolean);
    if(!definition && !components.length) continue;
    terms.push({id:`ai-${section}-${terms.length}`,term,definition,components,source:{file,section:`Local AI · passage ${section}`,snippet:evidence},approved:false,editedByUser:false,status:"unseen",kind:components.length?"components":"definition"});
  }
  return terms;
}
export function mergeAITerms(terms:StudyTerm[]):StudyTerm[] {
  const seen=new Set<string>();
  return terms.filter(t=>{const key=termKey(t.term);if(seen.has(key))return false;seen.add(key);return true;}).slice(0,150);
}
