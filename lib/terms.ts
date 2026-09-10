import type { Card } from "./study.ts";

export type LearningStatus = "unseen" | "learning" | "known";
export type StudyTerm = {
  id: string;
  term: string;
  definition: string;
  components: string[];
  source: { file: string; section?: string; snippet: string };
  approved: boolean;
  editedByUser: boolean;
  status: LearningStatus;
  kind: "definition" | "components" | "abbreviation" | "question";
};
const clean = (s: string) => s.replace(/\*\*|__/g, "").trim();
const name = (s: string) => clean(s).replace(/^(?:the|a|an|de|het|een)\s+/i, "").replace(/[.:;]+$/, "").trim();
export const termKey = (s: string) => name(s).toLocaleLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ");
const useful = (s: string) => s.length >= 2 && s.length <= 120 && s.split(/\s+/).length <= 9 && !/^(?:this|that|it|there|these|we|you|they|dit|dat|er|we|je|hij|zij|page|pagina|chapter|hoofdstuk|contents|inhoud|copyright|www\.)\b/i.test(s) && /\p{L}/u.test(s);
const components = (s: string) => clean(s).replace(/[.;]$/, "").split(/\s*[,;]\s*|\s+(?:and|en)\s+/i).map(s=>s.trim()).filter(Boolean);

/** Conservative EN/NL pattern matching. Suggestions always need explicit review. */
export function extractTerms(text: string, file = "Pasted notes"): StudyTerm[] {
  if (text.length > 500_000) throw new Error("Keep your notes under 500,000 characters.");
  const found = new Map<string, StudyTerm>();
  let section = "";
  const add = (term: string, definition: string, parts: string[], snippet: string, kind: StudyTerm["kind"] = "definition") => {
    term = name(term); definition = clean(definition).replace(/[;]+$/, "");
    if (!useful(term) || (!definition && !parts.length) || definition.length > 4000 || parts.some(part=>part.length>12000)) return;
    const key = termKey(term), existing = found.get(key);
    if (existing) {
      existing.components = [...new Set([...existing.components, ...parts])].slice(0, 30);
      if (!existing.definition) existing.definition = definition;
      return;
    }
    if (found.size >= 300) return;
    found.set(key, { id: `term-${found.size + 1}`, term, definition, components: parts.slice(0,30), source: {file, section: section || undefined, snippet: snippet.slice(0,500)}, approved:false, editedByUser:false, status:"unseen", kind });
  };
  const lines = text.replace(/\r/g, "").split("\n");
  for (let i=0; i<lines.length; i++) {
    const line = clean(lines[i]);
    if (!line || /^\d+$/.test(line)) continue;
    const heading = line.match(/^#{1,6}\s+(.+)/);
    if (heading) section = name(heading[1]);
    // A heading or label followed by bullets forms one structured concept.
    let j=i+1;
    while(j<lines.length && !lines[j].trim()) j++;
    const parts:string[]=[];
    while(j<lines.length) {
      const bullet=lines[j].match(/^\s*(?:[-*•]|\d+[.)])\s+(.+)/);
      if(!bullet) break;
      parts.push(clean(bullet[1])); j++;
    }
    if(parts.length>=2) {
      const label=line.replace(/^#{1,6}\s+/, "").replace(/:\s*$/, "");
      const split=label.match(/^(.+?)\s+(?:consists of|includes|bestaat uit|omvat)\s*$/i);
      const pair=label.match(/^(.{2,100}?)\s*:\s+(.+)/);
      add(split?.[1] || pair?.[1] || label, pair?.[2] || "", parts, lines.slice(i,j).join("\n"), "components");
      i=j-1; continue;
    }
    if (heading) continue;
    if(/^\s*(?:[-*•]|\d+[.)])\s+/.test(line)) continue;
    for(const sentence of line.split(/(?<=[.!?])\s+(?=[\p{Lu}])/u)) {
      const explicit=sentence.match(/^(.{2,120}?)\s*::\s*(.+)$/);
      if(explicit) { add(explicit[1],explicit[2],[],sentence,"question"); continue; }
      const expansion=sentence.match(/^(.{3,100}?)\s+\(([A-Z][A-Z0-9&-]{1,12})\)[.!]?$/);
      if(expansion) { add(expansion[2],expansion[1],[],sentence,"abbreviation"); continue; }
      const match=sentence.match(/^(.{2,120}?)\s+(means|is defined as|refers to|stands for|consists of|includes|is|are|betekent|staat voor|bestaat uit|omvat|zijn)\s+(.+)$/i)
        || sentence.match(/^(.{2,100}?)\s*(:|=|→|–)\s+(.+)$/);
      if(match) {
        let term=match[1],definition=match[3];
        const structured=/consists of|includes|bestaat uit|omvat|stands for|staat voor/i.test(match[2]);
        let parts=structured ? components(definition) : [];
        // Generic alias-list syntax: "X consists of the Y: a, b and c".
        const alias=structured && definition.match(/^(?:(?:the|de|het)\s+)?([^:]{2,80}):\s*(.+)$/i);
        if(alias) { term=alias[1]; parts=components(alias[2]); definition=name(match[1]); }
        else if(structured) definition="";
        if(!structured && /[:,;]/.test(definition) && components(definition).length>=3) {parts=components(definition); definition="";}
        add(term,definition,parts,sentence, /stands for|staat voor/i.test(match[2]) ? "abbreviation" : parts.length ? "components" : "definition");
      } else if (/^\*\*.+\*\*$/.test(lines[i].trim()) && lines[i+1]?.trim()) {
        add(line,clean(lines[++i]),[],`${line}\n${lines[i]}`);
      }
    }
  }
  return [...found.values()];
}

export function approvedTerms(terms: StudyTerm[]): StudyTerm[] {
  const seen=new Set<string>();
  return terms.filter(t=>t.approved).map(t=>({...t,term:t.term.trim(),definition:t.definition.trim(),components:t.components.map(s=>s.trim()).filter(Boolean)})).filter(t=>{
    const key=termKey(t.term);
    if(!key || (!t.definition && !t.components.length) || seen.has(key)) return false;
    seen.add(key); return true;
  });
}
export const termAnswer = (t: StudyTerm) => [t.definition, t.components.map(s=>`• ${s}`).join("\n")].filter(Boolean).join("\n\n");
export function termsToCards(terms: StudyTerm[]): Card[] {
  return approvedTerms(terms).map(t=>({id:t.id,termId:t.id,question:t.kind==="question"?t.term:t.kind==="abbreviation"?`What does ${t.term} stand for?`:`Explain: ${t.term}`,answer:termAnswer(t)}));
}
export function termQuiz(terms: StudyTerm[], random:()=>number=Math.random): Card[] {
  // Exactly one question per term in a session; vary direction on later sessions.
  return approvedTerms(terms).map(t=>{
    const reverse=random()<.35 && t.definition && t.kind!=="question";
    return {id:t.id,termId:t.id,question:reverse?`Which term matches this definition?\n\n${t.definition}`:t.components.length?`Name the components of ${t.term}.`:t.kind==="abbreviation"?`What does ${t.term} stand for?`:t.kind==="question"?t.term:`Explain: ${t.term}`,answer:reverse?t.term:termAnswer(t)};
  });
}
export function practiceOrder(terms: StudyTerm[], random:()=>number=Math.random): StudyTerm[] {
  const rank={learning:0,unseen:1,known:2};
  return approvedTerms(terms).map(t=>({t,r:random()})).sort((a,b)=>rank[a.t.status]-rank[b.t.status] || a.r-b.r).map(x=>x.t);
}
