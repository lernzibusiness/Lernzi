"use client";
import { useState } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { approvedTerms, type StudyTerm } from "@/lib/terms";
import { PageHeading } from "./page-heading";

export default function TermReview({ initial, source, onSave, onBack, disabled=false }: {
  initial: StudyTerm[]; source: string; onSave: (terms: StudyTerm[])=>void; onBack?: ()=>void; disabled?: boolean;
}) {
  const [terms,setTerms]=useState(initial);
  const [deleted,setDeleted]=useState<string[]>([]);
  const [error,setError]=useState("");
  const [openId,setOpenId]=useState("");
  const visible=terms.filter(t=>!deleted.includes(t.id));
  const count=visible.filter(t=>t.approved).length;
  function edit(id:string, patch:Partial<StudyTerm>) {
    setTerms(all=>all.map(t=>t.id===id?{...t,...patch,editedByUser:true,status:"unseen"}:t));
  }
  function add() {
    if(terms.length>=300) {setError("Keep this set under 300 terms.");return;}
    const id=crypto.randomUUID();
    setTerms(all=>[...all,{id,term:"",definition:"",components:[],source:{file:source,snippet:"Added manually"},approved:true,editedByUser:true,status:"unseen",kind:"definition"}]);
    setOpenId(id);
  }
  function save() {
    setError("");
    if(!count) {setError("Select at least one term to study.");return;}
    if(visible.some(t=>t.approved && (!t.term.trim() || (!t.definition.trim() && !t.components.some(s=>s.trim()))))) {setError("Each selected term needs a name and a definition or components.");return;}
    if(approvedTerms(visible).length!==count) {setError("Two selected terms have the same name. Rename or uncheck one before saving.");return;}
    try {
      onSave(visible.map(t=>({...t,term:t.term.trim(),definition:t.definition.trim(),components:t.components.map(s=>s.trim()).filter(Boolean)})));
    } catch {setError("Could not save your terms. Your edits are still here; check browser storage and try again.");}
  }
  return <>
    <PageHeading eyebrow="REVIEW BEFORE LEARNING" title="Review your study terms" text={`${initial.length} suggestions from ${source}. Check the source, edit what needs work, and select what to learn.`}/>
    <div className="term-review-toolbar"><span>{count} selected · {visible.length} terms</span><div className="actions"><button className="text-button" onClick={()=>setTerms(all=>all.map(t=>({...t,approved:true})))}>Select all</button><button className="text-button" onClick={()=>setTerms(all=>all.map(t=>({...t,approved:false})))}>Clear selection</button></div></div>
    {!visible.length && <section className="panel term-empty"><h2>No clear terms found</h2><p>Try definitions such as “Term means …”, headings with bullet lists, or add your own terms.</p></section>}
    <div className="term-review-list">{visible.map((t,i)=><article className="term-review-row panel" key={t.id}>
      <div className="term-row-heading"><label className="term-select"><input type="checkbox" checked={t.approved} onChange={e=>setTerms(all=>all.map(x=>x.id===t.id?{...x,approved:e.target.checked}:x))} aria-label={`Approve ${t.term || `term ${i+1}`}`}/><strong>{t.term || "New term"}</strong></label><button className="text-button" aria-expanded={openId===t.id} onClick={()=>setOpenId(openId===t.id?"":t.id)}>Edit</button><button className="icon-button" aria-label={`Delete term ${t.term || i+1}`} onClick={()=>setDeleted(ids=>[...ids,t.id])}><Trash2 size={18}/></button></div>
      <p>{t.definition}</p>{t.components.length>0 && <p className="term-components">{t.components.filter(Boolean).join(" · ")}</p>}
      {openId===t.id && <div className="term-editor"><label>Term<input autoFocus maxLength={120} value={t.term} onChange={e=>edit(t.id,{term:e.target.value})}/></label><label>Definition<textarea rows={3} maxLength={4000} value={t.definition} onChange={e=>edit(t.id,{definition:e.target.value})}/></label><label>Details / components (one per line)<textarea rows={3} maxLength={12000} value={t.components.join("\n")} onChange={e=>edit(t.id,{components:e.target.value.split("\n").slice(0,30)})}/></label><button className="text-button" onClick={()=>{const original=initial.find(x=>x.id===t.id);if(original)setTerms(all=>all.map(x=>x.id===t.id?{...original}:x));}} disabled={!initial.some(x=>x.id===t.id)}>Restore original suggestion</button></div>}
      <details className="term-source"><summary>View source</summary><small>{t.source.file}{t.source.section?` · ${t.source.section}`:""}</small><blockquote>{t.source.snippet}</blockquote></details>
    </article>)}</div>
    {deleted.length>0 && <div className="notice"><span>{deleted.length} deleted from this review</span><button className="text-button" onClick={()=>setDeleted([])}>Restore deleted terms</button></div>}
    {error && <p role="alert" className="form-error">{error}</p>}
    <div className="term-review-actions"><button className="button secondary" onClick={add}><Plus size={18}/> Add term</button><button className="button primary" disabled={disabled} onClick={save}>Save study terms ({count})</button></div>
    {onBack && <button className="text-button" onClick={onBack}><ArrowLeft size={16}/> Back to notes (discard this review)</button>}
    <p className="subtle">Suggestions are generated locally and may need corrections. Check each source. Only selected terms become study cards.</p>
  </>;
}
