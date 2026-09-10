import test from "node:test";
import assert from "node:assert/strict";
import {extractTerms,approvedTerms,termsToCards,termQuiz,practiceOrder} from "../lib/terms.ts";
import {isStudyState,sampleMaterial} from "../lib/study.ts";

test("Dutch alias and framework lists extract without hardcoded concepts",()=>{
  const terms=extractTerms("De marketingmix bestaat uit de 4P's: prijs, product, plaats en promotie.\nEen SWOT-analyse bestaat uit strengths, weaknesses, opportunities en threats.","marketing.pdf");
  assert.equal(terms[0].term,"4P's");
  assert.deepEqual(terms[0].components,["prijs","product","plaats","promotie"]);
  assert.equal(terms[1].term,"SWOT-analyse");
  assert.deepEqual(terms[1].components,["strengths","weaknesses","opportunities","threats"]);
  assert.equal(terms[0].source.file,"marketing.pdf");
  assert.equal(terms[0].approved,false);
  const arbitrary=extractTerms("The operating model consists of the 3R framework: reduce, reuse and recycle.");
  assert.equal(arbitrary[0].term,"3R framework");
});
test("paragraph definitions, abbreviations, formulas and explicit pairs",()=>{
  const terms=extractTerms("Market segmentation means dividing a market into groups. Target group is a specific audience.\nROI stands for return on investment.\nReturn on investment (ROI)\nForce = mass × acceleration\nWhy practise? :: To strengthen recall.");
  assert.equal(terms.length,5);
  assert.equal(terms.find(t=>t.term==="ROI")?.kind,"abbreviation");
  assert.equal(terms.find(t=>t.term==="Force")?.definition,"mass × acceleration");
});
test("headings and bullet / numbered lists retain section context",()=>{
  const terms=extractTerms("# Research methods\n- Interviews\n- Observation\n# Planning cycle\n1. Plan\n2. Do\n3. Review");
  assert.equal(terms.length,2);
  assert.deepEqual(terms[1].components,["Plan","Do","Review"]);
  assert.equal(terms[0].source.section,"Research methods");
});
test("duplicates merge; filler, metadata, empty and unstructured prose produce no terms",()=>{
  assert.equal(extractTerms("Recall means retrieving knowledge.\nRecall means retrieving knowledge.").length,1);
  for(const text of ["","  ","Page 4\nCopyright 2026\nThis is a document.\nWe are studying today.","Students read their notes and then go home."]) assert.deepEqual(extractTerms(text),[]);
  assert.deepEqual(extractTerms(`Framework includes ${"x".repeat(12001)}.`),[]);
});
test("only approved unique terms produce cards; components stay structured",()=>{
  const terms=extractTerms("Recall means retrieving knowledge.\nCycle includes plan, do and review.");
  assert.equal(termsToCards(terms).length,0);
  terms[1].approved=true;
  assert.equal(termsToCards(terms).length,1);
  assert.match(termsToCards(terms)[0].answer,/• plan\n• do\n• review/);
  assert.equal(approvedTerms([...terms,terms[1]]).length,1);
});
test("quiz uses one question per approved term and varies direction",()=>{
  const terms=extractTerms("Recall means retrieving knowledge.\nCycle includes plan, do and review.").map(t=>({...t,approved:true}));
  const reverse=termQuiz(terms,()=>0),forward=termQuiz(terms,()=>1);
  assert.equal(reverse.length,2);
  assert.equal(new Set(reverse.map(c=>c.termId)).size,2);
  assert.equal(reverse[0].answer,"Recall");
  assert.notEqual(reverse[0].question,forward[0].question);
});
test("learning first, unseen next, known last without mutating or duplicating terms",()=>{
  const terms=extractTerms("One means first.\nTwo means second.\nThree means third.").map(t=>({...t,approved:true}));
  terms[0].status="known";terms[1].status="unseen";terms[2].status="learning";
  assert.deepEqual(practiceOrder(terms,()=>.5).map(t=>t.term),["Three","Two","One"]);
  assert.equal(terms[0].term,"One");
});
test("local schema retains legacy sets and validates structured term progress",()=>{
  const material=sampleMaterial();const state={version:1,materials:[material],results:[]};
  assert.equal(isStudyState(state),true);
  material.terms=extractTerms("Recall means retrieving knowledge.");
  assert.equal(isStudyState(JSON.parse(JSON.stringify(state))),true);
  const invalid=JSON.parse(JSON.stringify(state));invalid.materials[0].terms[0].status="invalid";
  assert.equal(isStudyState(invalid),false);
});
