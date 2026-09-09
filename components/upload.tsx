"use client";
import { useRef, useState } from "react";
import { ArrowRight, UploadCloud, Sparkles, ShieldCheck } from "lucide-react";
import { parseCards, type Material } from "@/lib/study";
import { PageHeading } from "./page-heading";
export default function Upload({
  onAdd,
  disabled,
}: {
  onAdd: (m: Material) => void;
  disabled: boolean;
}) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const cards = parseCards(text);
  async function read(file?: File) {
    if (!file) return;
    setError("");
    if (!/\.(txt|md)$/i.test(file.name)) {
      setError(
        "This first version reads TXT and Markdown. PDF and Word processing will be added later. No file was uploaded.",
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Choose a file smaller than 10 MB.");
      return;
    }
    setBusy(true);
    try {
      const bytes = await file.arrayBuffer();
      const content = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      if (content.length > 500000)
        throw new Error(
          "This file contains more than 500,000 characters. Please split it into smaller files.",
        );
      if (!content.trim())
        throw new Error("This file is empty. Choose notes with text.");
      setText(content);
      setTitle(file.name.replace(/\.[^.]+$/, ""));
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "We couldn’t read that file. Try UTF-8 text.",
      );
    } finally {
      setBusy(false);
    }
  }
  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) { setError('Give your material a title.'); return; }
    if (!text.trim()) {
      setError("Add some notes first.");
      return;
    }
    if (text.length > 500000) {
      setError("Keep your notes under 500,000 characters.");
      return;
    }
    if (text.split(/\r?\n/).filter((l) => l.includes("::")).length > 300) {
      setError("Use no more than 300 question-and-answer lines per material.");
      return;
    }
    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      text,
      cards,
      createdAt: new Date().toISOString(),
    });
  }
  return (
    <>
      <PageHeading
        eyebrow="A PLACE FOR YOUR IDEAS"
        title="Add study material"
        text="Upload a text file or paste your notes below."
      />
      <form onSubmit={submit} className="upload-layout">
        <section className="panel">
          <div
            role="button"
            tabIndex={0}
            aria-label="Choose a text or Markdown file"
            className={`dropzone ${drag ? "dragging" : ""}`}
            onClick={() => input.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                input.current?.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              void read(e.dataTransfer.files[0]);
            }}
          >
            <span className="upload-icon">
              <UploadCloud size={35} />
            </span>
            <h2>{busy ? "Reading your notes…" : "Drop your notes here"}</h2>
            <p>
              or <span className="accent">browse files</span>
            </p>
            <small>TXT or Markdown · Up to 10 MB</small>
          </div>
          <input
            ref={input}
            type="file"
            accept=".txt,.md,text/plain,text/markdown"
            hidden
            onChange={(e) => void read(e.target.files?.[0])}
          />
          <div className="divider">
            <span>or paste your notes</span>
          </div>
          <label>
            Material title
            <input
              required
              maxLength={100}
              value={title}
              placeholder="e.g. Biology · Cell structure"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            Your notes
            <textarea
              required
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                "Paste your notes here.\n\nTo create cards, use one pair per line:\nWhat is active recall? :: Retrieving information from memory."
              }
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="section-heading">
            <span className="subtle">
              {cards.length} cards found · Review before saving
            </span>
            <button
              className="button primary"
              disabled={busy || disabled}
              type="submit"
            >
              Save material <ArrowRight size={18} />
            </button>
          </div>
        </section>
        <aside className="upload-aside">
          <span className="mode-icon">
            <Sparkles />
          </span>
          <h2>
            Creating your cards
            <br />
            
          </h2>
          <p>
            Make a card with a question, two colons, then an answer. Each pair
            gets its own line.
          </p>
          <div className="example-note">
            What is a cell?
            <br />
            <span>::</span> The basic unit of life.
          </div>
          <p>
            Plain notes are saved as notes. Automatic question generation, PDF
            and Word reading are coming later.
          </p>
          <div className="aside-privacy">
            <ShieldCheck size={22} />
            <p>
              Read locally. Saved locally.
              <br />
              Nothing is sent to an AI service.
            </p>
          </div>
          {cards.length > 0 && (
            <details open>
              <summary>Preview your first card</summary>
              <strong>{cards[0].question}</strong>
              <p>{cards[0].answer}</p>
            </details>
          )}
        </aside>
      </form>
    </>
  );
}
