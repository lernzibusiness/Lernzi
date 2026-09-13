import test from "node:test";
import assert from "node:assert/strict";
import {aiPassages,parseAITerms,mergeAITerms,checkedTerms,extractVerifiedTerms} from "../lib/ai-terms.ts";
const passage="Recall means retrieving knowledge. Cycle includes plan, do and review.";
const entry={term:"Recall",definition:"Retrieving knowledge.",components:[],evidence:"Recall means retrieving knowledge."};
test("AI passages cover long notes with overlap and reject empty or oversized input",()=>{
  assert.throws(()=>aiPassages(" "));
  assert.throws(()=>aiPassages("a".repeat(24001)));
  const text="A study sentence. ".repeat(800), chunks=aiPassages(text);
  assert.ok(chunks.length>1);assert.ok(chunks.every(c=>c.length<=1800));
  assert.equal(chunks[0]+chunks.slice(1).map(c=>c.slice(150)).join(""),text);
});
test("quotes must support the named term and contain every claimed component",()=>{
  const text="Recall means retrieving knowledge. Cycle includes plan, do and review. A cart has wheels.";
  const entries=[{...entry,term:"Cycle"},{...entry,term:"art",evidence:"A cart has wheels."},{term:"Cycle",definition:"",components:["plan","invented"],evidence:"Cycle includes plan, do and review."}];
  assert.equal(parseAITerms(JSON.stringify({terms:entries}),text,"notes",1).length,0);
  const quote="The 4P’s are price, product, place and promotion.";
  assert.equal(parseAITerms(JSON.stringify({terms:[{term:"4P's",definition:"",components:["price","product","place","promotion"],evidence:quote}]}),quote,"notes",1).length,1);
});
test("second check rejects negative, missing, duplicate and malformed verdicts",()=>{
  const [term]=parseAITerms(JSON.stringify({terms:[entry]}),passage,"notes",1);
  for(const checks of [[],[{id:term.id,supported:false}],[{id:term.id,supported:"true"}],[{id:term.id,supported:true},{id:term.id,supported:false}]]) assert.equal(checkedTerms(JSON.stringify({checks}),[term]).length,0);
  assert.equal(checkedTerms(JSON.stringify({checks:[{id:term.id,supported:true}]}),[term])[0].approved,false);
  assert.throws(()=>checkedTerms('{"terms":[]}',[term]));
});
test("pipeline recovers missed explicit definitions and only returns checked candidates",async()=>{
  let calls=0;const updates:string[]=[];
  const result=await extractVerifiedTerms(passage,"notes.txt",async request=>{
    calls++;
    if(calls===1)return '{"terms":[]}';
    const input=JSON.parse(request.input);
    assert.equal(input.passage,passage);
    assert.equal(input.candidates.length,1);
    assert.equal(input.candidates[0].term,calls===2?"Recall":"Cycle");
    return JSON.stringify({checks:input.candidates.map((t:{id:string;term:string})=>({id:t.id,supported:t.term==="Recall"}))});
  },m=>updates.push(m));
  assert.equal(calls,3);assert.deepEqual(result.map(t=>t.term),["Recall"]);
  assert.match(result[0].source.section!,/source checked/);assert.ok(updates.some(m=>m.includes("Double-checking")));
});
test("failed verification never falls back to unchecked suggestions",async()=>{
  let calls=0;
  await assert.rejects(extractVerifiedTerms(passage,"notes",async()=>{if(++calls===1)return '{"terms":[]}';throw new Error("device lost");},()=>{}),/device lost/);
});
test("AI output requires source evidence, valid bounds and explicit review",()=>{
  const terms=parseAITerms(JSON.stringify({terms:[entry,{...entry,term:"Invented"},{...entry,evidence:"A fabricated quote that does not occur."},{...entry,components:[3]}]}),passage,"notes.pdf",1);
  assert.equal(terms.length,1);assert.equal(terms[0].approved,false);assert.equal(terms[0].source.snippet,entry.evidence);
  assert.equal(terms[0].status,"unseen");assert.equal(mergeAITerms([...terms,...terms]).length,1);
  assert.equal(parseAITerms('<think>\n\n</think>\n'+JSON.stringify({terms:[entry]}),passage,"notes",1).length,1);
  assert.throws(()=>parseAITerms("invalid",passage,"notes",1));
  assert.throws(()=>parseAITerms('{"terms":{}}',passage,"notes",1));
});
