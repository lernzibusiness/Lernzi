"use client";
import { useEffect, useRef, useState } from "react";
import type { WebWorkerMLCEngine } from "@mlc-ai/web-llm";
import { aiPassages, MODEL_ID, extractVerifiedTerms } from "@/lib/ai-terms";
import type { StudyTerm } from "@/lib/terms";

export default function LocalTermAI({text,source,disabled,onTerms,onBusy}:{text:string;source:string;disabled:boolean;onTerms:(terms:StudyTerm[])=>void;onBusy:(busy:boolean)=>void}) {
  const [phase,setPhase]=useState<"idle"|"loading"|"ready"|"running"|"removing">("idle");
  const [message,setMessage]=useState("");
  const [progress,setProgress]=useState(0);
  const engine=useRef<WebWorkerMLCEngine | null>(null);
  const worker=useRef<Worker | null>(null);
  const job=useRef(0);
  const locked=useRef(false);
  const abortPending=useRef<(() => void) | null>(null);
  useEffect(()=>()=>{job.current++;abortPending.current?.();worker.current?.terminate();},[]);
  const busy=phase==="loading" || phase==="running" || phase==="removing";
  function cancel() {
    job.current++;abortPending.current?.();worker.current?.terminate();worker.current=null;engine.current=null;
    locked.current=false;onBusy(false);setPhase("idle");setMessage("Stopped. Your notes are unchanged; cached model files can be reused.");
  }
  async function load() {
    if(locked.current)return;
    locked.current=true;const id=++job.current;setPhase("loading");setMessage("Checking this device…");setProgress(0);onBusy(true);
    let timer:ReturnType<typeof setTimeout> | undefined;
    try {
      if(!window.isSecureContext || !("gpu" in navigator)) throw new Error("Local AI needs a WebGPU-compatible browser and device. Try current Chrome or Edge, or use quick extraction below.");
      const {CreateWebWorkerMLCEngine}=await import("@mlc-ai/web-llm");
      if(id!==job.current)return;
      worker.current=new Worker(new URL("../lib/ai.worker.ts",import.meta.url),{type:"module"});
      const loading=CreateWebWorkerMLCEngine(worker.current,MODEL_ID,{initProgressCallback:p=>{if(id===job.current){setProgress(Math.max(0,Math.min(1,p.progress)));setMessage(p.text);}}});
      const loaded=await Promise.race([loading,new Promise<never>((_,reject)=>{abortPending.current=()=>reject(new Error("Cancelled"));timer=setTimeout(()=>reject(new Error("Download timed out. Check your connection and retry; cached files will be reused.")),15*60*1000);})]);
      if(id!==job.current)return;
      engine.current=loaded;
      setPhase("ready");setMessage("Model ready on this device.");
    } catch(error) {
      if(id!==job.current)return;
      worker.current?.terminate();worker.current=null;engine.current=null;setPhase("idle");
      setMessage(error instanceof Error?error.message:"Could not load local AI. Retry or use quick extraction.");
    } finally {if(timer)clearTimeout(timer);if(id===job.current){abortPending.current=null;locked.current=false;onBusy(false);}}
  }
  async function extract() {
    if(locked.current || !engine.current)return;

    try {aiPassages(text);} catch(error){setMessage((error as Error).message);return;}
    locked.current=true;const id=++job.current;setPhase("running");onBusy(true);

    let timer:ReturnType<typeof setTimeout> | undefined;
    try {
      const terms=await extractVerifiedTerms(text,source,async request=>{
        if(id!==job.current || !engine.current) throw new Error("Cancelled");
        const response=await Promise.race([engine.current.chat.completions.create({messages:[
          {role:"system",content:request.system}, {role:"user",content:request.input}
        ],response_format:{type:"json_object",schema:request.schema},extra_body:{enable_thinking:false},temperature:0,max_tokens:request.maxTokens,stream:false}),new Promise<never>((_,reject)=>{abortPending.current=()=>reject(new Error("Cancelled"));timer=setTimeout(()=>reject(new Error("This device is taking too long. Try a shorter excerpt or quick extraction.")),180000);})]);
        if(timer)clearTimeout(timer);
        if(id!==job.current) throw new Error("Cancelled");
        if(response.choices[0]?.finish_reason==="length") throw new Error("The model ran out of space. Try a shorter excerpt or quick extraction.");
        return response.choices[0]?.message.content || "";
      },(message,progress)=>{if(id===job.current){setMessage(message);setProgress(progress);}});
      if(id!==job.current)return;
      setPhase("ready");setMessage("Suggestions ready to review.");onTerms(terms);
    } catch(error) {
      if(id!==job.current)return;
      worker.current?.terminate();worker.current=null;engine.current=null;setPhase("idle");
      setMessage(error instanceof Error?error.message:"AI could not read these notes. Retry or use quick extraction.");
    } finally {if(timer)clearTimeout(timer);if(id===job.current){abortPending.current=null;locked.current=false;onBusy(false);}}
  }
  async function remove() {
    if(locked.current)return;
    cancel();locked.current=true;setPhase("removing");onBusy(true);const id=job.current;
    try {const {deleteModelAllInfoInCache}=await import("@mlc-ai/web-llm");await deleteModelAllInfoInCache(MODEL_ID);if(id===job.current)setMessage("Downloaded model removed. Your study materials are unchanged.");}
    catch {if(id===job.current)setMessage("Could not remove the model cache. You can clear it in your browser’s site-storage settings.");}
    finally {if(id===job.current){locked.current=false;setPhase("idle");onBusy(false);}}
  }
  return <section className="local-ai" aria-labelledby="local-ai-title">
    <h2 id="local-ai-title">Find seeds of knowledge with local AI</h2>
    <p>Give your study garden a starting point: find terms and definitions with Qwen3, then run a second AI check against your source. Both passes run in your browser. AI checks can still miss mistakes; review the suggestions before learning.</p>
    <p className="subtle">First use downloads several hundred MB from Hugging Face and MLC’s GitHub hosting. Allow around 2 GB of graphics memory. Model files are cached when browser storage allows; your text stays on this device. Use excerpts up to 24,000 characters.</p>
    <div className="actions">
      {phase==="ready"?<button type="button" className="button primary" disabled={disabled || !text.trim()} onClick={()=>void extract()}>Create terms with AI</button>:!busy && <button type="button" className="button secondary" disabled={disabled} onClick={()=>void load()}>Download / load local AI</button>}
      {(phase==="loading" || phase==="running") && <button type="button" className="button secondary" onClick={cancel}>Cancel AI</button>}
      {!busy && <button type="button" className="text-button" onClick={()=>void remove()}>Remove downloaded model</button>}
    </div>
    {(phase==="loading" || phase==="running") && <progress value={progress} max={1} aria-label="Local AI progress"/>}
    <p role="status" className="local-ai-status">{message}</p>
  </section>;
}
