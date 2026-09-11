import test from "node:test";
import assert from "node:assert/strict";
import {aiPassages,parseAITerms,mergeAITerms} from "../lib/ai-terms.ts";
const passage="Recall means retrieving knowledge. Cycle includes plan, do and review.";
const entry={term:"Recall",definition:"Retrieving knowledge.",components:[],evidence:"Recall means retrieving knowledge."};
test("AI passages cover long notes with overlap and reject empty or oversized input",()=>{
  assert.throws(()=>aiPassages(" "));
  assert.throws(()=>aiPassages("a".repeat(24001)));
  const text="A study sentence. ".repeat(800), chunks=aiPassages(text);
  assert.ok(chunks.length>1);assert.ok(chunks.every(c=>c.length<=1800));
  assert.equal(chunks[0]+chunks.slice(1).map(c=>c.slice(150)).join(""),text);
});
test("AI output requires source evidence, valid bounds and explicit review",()=>{
  const terms=parseAITerms(JSON.stringify({terms:[entry,{...entry,term:"Invented"},{...entry,evidence:"A fabricated quote that does not occur."},{...entry,components:[3]}]}),passage,"notes.pdf",1);
  assert.equal(terms.length,1);assert.equal(terms[0].approved,false);assert.equal(terms[0].source.snippet,entry.evidence);
  assert.equal(terms[0].status,"unseen");assert.equal(mergeAITerms([...terms,...terms]).length,1);
  assert.equal(parseAITerms('<think>\n\n</think>\n'+JSON.stringify({terms:[entry]}),passage,"notes",1).length,1);
  assert.throws(()=>parseAITerms("invalid",passage,"notes",1));
  assert.throws(()=>parseAITerms('{"terms":{}}',passage,"notes",1));
});
