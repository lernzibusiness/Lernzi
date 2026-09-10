"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, Shuffle } from "lucide-react";
import { practiceOrder, termAnswer, type LearningStatus } from "@/lib/terms";
import type { Material } from "@/lib/study";

export default function TermLearner({material,onMark}:{material:Material;onMark:(id:string,status:LearningStatus)=>boolean}) {
  const [order,setOrder]=useState(()=>practiceOrder(material.terms || []).map(t=>t.id));
  const [index,setIndex]=useState(0);
  const [back,setBack]=useState(false);
  const [error,setError]=useState("");
  const card=useRef<HTMLButtonElement>(null);
  const terms=material.terms || [];
  const term=terms.find(t=>t.id===order[index]);
  useEffect(()=>{card.current?.focus();},[index,order]);
  function restart() {setOrder(practiceOrder(terms).map(t=>t.id));setIndex(0);setBack(false);setError("");}
  function move(to:number) {setIndex(to);setBack(false);setError("");}
  function mark(status:LearningStatus) {
    if(!term || !back)return;
    try {
      if(!onMark(term.id,status)) throw new Error("Storage unavailable");
    } catch {setError("Could not save your progress. Check browser storage and try again.");return;}
    move(index+1);
  }
  if(!term) return <section className="panel study-result"><h2>Set complete</h2><p>Your term checks are saved on this device.</p><p>{terms.filter(t=>t.approved && t.status==="known").length} known · {terms.filter(t=>t.approved && t.status==="learning").length} still learning</p><div className="actions"><button className="button primary" onClick={restart}>Practise again</button><button className="button secondary" onClick={()=>move(Math.max(0,order.length-1))}>Go back</button><Link href="/progress" className="text-button">View progress</Link></div></section>;
  return <section className="study-active">
    <div className="section-heading"><span className="pill">Term {index+1} / {order.length} · {term.status==="known"?"Known":term.status==="learning"?"Still learning":"Unseen"}</span><Link className="text-button" href={`/review?material=${encodeURIComponent(material.id)}`}>Edit terms</Link></div>
    <p className="subtle">Still-learning terms come first, then unseen, then known.</p>
    <progress value={index} max={order.length} aria-label="Term session progress"/>
    <button ref={card} key={term.id} type="button" className={`flashcard ${back?"is-flipped":""}`} aria-pressed={back} aria-label={`${back?"Definition: "+termAnswer(term):"Term: "+term.term}. Flip ${back?"to term":"to definition"}.`} onClick={()=>setBack(v=>!v)}>
      <span className="flashcard-inner"><span className="flashcard-face flashcard-front" aria-hidden={back}><span className="eyebrow">TERM</span><span className="flashcard-text">{term.term}</span><span className="flashcard-hint">Click, tap or press Enter / Space to flip</span></span><span className="flashcard-face flashcard-back" aria-hidden={!back}><span className="eyebrow">DEFINITION</span><span className="flashcard-text">{termAnswer(term)}</span><span className="flashcard-hint">Flip back to the term</span></span></span>
    </button>
    <div className="actions term-mark"><button className="button secondary" disabled={!back} onClick={()=>mark("learning")}>Still learning</button><button className="button primary" disabled={!back} onClick={()=>mark("known")}>Know it</button></div>
    {error && <p role="alert">{error}</p>}
    <div className="term-controls"><button className="button secondary" disabled={index===0} onClick={()=>move(index-1)}><ArrowLeft size={16}/> Back</button><button className="button secondary" onClick={()=>move(index+1)}>Next term <ArrowRight size={16}/></button><button className="text-button" onClick={restart}><Shuffle size={16}/> Shuffle</button><button className="text-button" onClick={()=>{setIndex(0);setBack(false);setError("");}}><RotateCcw size={16}/> Restart set</button></div>
    <details className="term-source"><summary>View source</summary><small>{term.source.file}</small><blockquote>{term.source.snippet}</blockquote></details>
  </section>;
}
