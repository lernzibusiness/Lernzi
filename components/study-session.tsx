"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock3, Layers3, Target, Plus } from "lucide-react";
import {
  shuffle,
  remainingSeconds,
  type Card,
  type Material,
  type Result,
} from "@/lib/study";
export default function StudySession({
  mode,
  material,
  onComplete,
}: {
  mode: string;
  material: Material;
  onComplete: (r: Result) => boolean;
}) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [seconds, setSeconds] = useState(900);
  const [count, setCount] = useState(Math.min(10, material.cards.length));
  const [error, setError] = useState("");
  const [totalCompleted, setTotalCompleted] = useState(0);
  const start = useRef(0);
  const saved = useRef(false);
  const lock = useRef(false);
  const quiz = mode === "/quiz";
  const flash = mode === "/flashcards";
  useEffect(() => {
    if (!started || !quiz || finished) return;
    const tick = () => setSeconds(remainingSeconds(start.current, Date.now()));
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [started, quiz, finished]);
  function begin() {
    setDeck(
      shuffle(material.cards).slice(
        0,
        quiz || flash ? material.cards.length : count,
      ),
    );
    setIndex(0);
    setCorrect(0);
    setFinished(false);
    setRevealed(false);
    setAnswer("");
    saved.current = false;
    lock.current = false;
    start.current = Date.now();
    setSeconds(900);
    setStarted(true);
  }
  function finish(score: number, total: number) {
    setTotalCompleted(total);
    setFinished(true);
    if (total && !saved.current) {
      try {
        const success = onComplete({
          id: crypto.randomUUID(),
          materialId: material.id,
          mode: flash ? "Flashcards" : quiz ? "15-Minute Quiz" : "Self-Test",
          correct: score,
          total,
          date: new Date().toISOString(),
        });
        if (success) saved.current = true;
        else
          setError(
            "This session could not be saved. Export your existing data and check browser storage.",
          );
      } catch {
        setError(
          "This session could not be saved. Your results are shown below.",
        );
      }
    }
  }
  function mark(known: boolean) {
    if (lock.current || !revealed) return;
    lock.current = true;
    const score = correct + (known ? 1 : 0);
    setCorrect(score);
    if (
      index + 1 >= deck.length ||
      (quiz && remainingSeconds(start.current, Date.now()) === 0)
    ) {
      finish(score, index + 1);
    } else {
      setIndex(index + 1);
      setRevealed(false);
      setAnswer("");
    }
    lock.current = false;
  }
  if (!material.cards.length)
    return (
      <section className="empty-state panel">
        <h2>Your notes are here. Now give them a question.</h2>
        <p>
          This material has no question-and-answer pairs yet. Add a new material
          using “Question :: Answer” on each line to create a study set.
        </p>
        <Link href="/upload" className="button primary">
          Add a card set <Plus size={18} />
        </Link>
      </section>
    );
  if (finished)
    return (
      <section className="study-result panel">
        <span className="empty-symbol">
          <Check size={36} />
        </span>
        <span className="eyebrow">SESSION COMPLETE</span>
        <h2>Session results</h2>
        <p>
          You completed {totalCompleted} of {deck.length} cards in this set.
        </p>
        <div className="result-number">
          {correct}
          <span> self-marked correct</span>
        </div>
        <p>
          Your checks help you reflect. They aren’t a prediction of your exam
          score.
        </p>
        {error && <p role="alert">{error}</p>}
        <div className="actions">
          <button className="button primary" onClick={begin}>
            Practise again <ArrowRight size={18} />
          </button>
          <Link className="button secondary" href="/progress">
            View progress
          </Link>
        </div>
      </section>
    );
  if (!started)
    return (
      <section className="session-intro panel">
        <div>
          <span className="mode-icon">
            {quiz ? (
              <Clock3 size={29} />
            ) : flash ? (
              <Layers3 size={29} />
            ) : (
              <Target size={29} />
            )}
          </span>
          <h2>
            {quiz
              ? "Your 15-minute session"
              : flash
                ? "Practise your cards"
                : "Test your recall"}
          </h2>
          <p>
            {material.title}
            {material.sample ? " · Sample material" : ""}
          </p>
          <ul>
            <li>{material.cards.length} cards from your material</li>
            <li>
              {flash
                ? "Think of your answer before revealing it."
                : "Write your answer, then compare and mark it yourself."}
            </li>
            <li>
              {quiz
                ? "New shuffle each session. A small set can finish early."
                : "Your completed session is saved on this device."}
            </li>
          </ul>
          {!quiz && !flash && (
            <label>
              Number of questions
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              >
                {Array.from(
                  new Set([
                    Math.min(5, material.cards.length),
                    Math.min(10, material.cards.length),
                    Math.min(20, material.cards.length),
                    material.cards.length,
                  ]),
                ).map((n) => (
                  <option key={n} value={n}>
                    {n} questions
                  </option>
                ))}
              </select>
            </label>
          )}
          <button className="button primary" onClick={begin}>
            Start {quiz ? "15-Minute Quiz" : flash ? "flashcards" : "Self-Test"}
            <ArrowRight size={18} />
          </button>
          <p className="subtle">
            Leaving or reloading ends an unfinished session. Only completed
            answers are saved when you finish or stop.
          </p>
        </div>
        <div className="session-art" aria-hidden="true">
          <span>{quiz ? "15" : flash ? "Aa" : "?"}</span>
          <small>
            {quiz
              ? "MINUTES OF FOCUS"
              : flash
                ? "THINK · RECALL · GROW"
                : "CURIOSITY COMES FIRST"}
          </small>
        </div>
      </section>
    );
  const card = deck[index];
  return (
    <section className="study-active">
      <div className="section-heading">
        <span className="pill">
          {material.sample ? "SAMPLE · " : ""}
          {index + 1} / {deck.length}
        </span>
        {quiz && (
          <span className="timer" role="timer">
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
          </span>
        )}
        <button className="text-button" onClick={() => finish(correct, index)}>
          Finish session
        </button>
      </div>
      <progress value={index} max={deck.length} aria-label="Session progress" />
      {quiz && seconds === 0 && (
        <p role="status" className="notice">
          Time’s up. Finish this card; no new question will start.
        </p>
      )}
      <div className="study-card">
        <span className="eyebrow">
          {revealed ? "CHECK YOUR ANSWER" : "QUESTION"}
        </span>
        <h2>{card.question}</h2>
        {!flash && !revealed && (
          <label className="answer-input">
            Your answer
            <textarea
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write what you remember…"
            />
          </label>
        )}
        {revealed ? (
          <div className="revealed-answer">
            <span className="eyebrow">ANSWER FROM YOUR MATERIAL</span>
            <p>{card.answer}</p>
            {answer && <small>Your answer: {answer}</small>}
          </div>
        ) : (
          <button
            className="button secondary"
            disabled={!flash && !answer.trim()}
            onClick={() => setRevealed(true)}
          >
            Reveal answer <ArrowRight size={17} />
          </button>
        )}
      </div>
      {revealed && (
        <div className="self-mark">
          <p>
            {flash
              ? "How did that feel?"
              : "Compare with the answer above. How did you do?"}
          </p>
          <div className="actions">
            <button className="button secondary" onClick={() => mark(false)}>
              Still learning
            </button>
            <button className="button primary" onClick={() => mark(true)}>
              I knew this <Check size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
