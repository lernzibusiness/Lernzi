"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  FolderOpen,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  Leaf,
  Menu,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UploadCloud,
  X,
} from "lucide-react";
import Brand from "./brand";
import { PageHeading } from "./page-heading";
import Upload from "./upload";
import StudySession from "./study-session";
import Cookies from "./cookies";
import Auth from "./auth";
import Legal from "./legal";
import {
  emptyState,
  parseCards,
  remainingSeconds,
  sampleMaterial,
  shuffle,
  type Card,
  type Material,
  type Result,
  type StudyState,
} from "@/lib/study";
import { readStudy, saveStudy } from "@/lib/storage";

const navigation = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/materials", label: "Study materials", icon: FolderOpen },
  { href: "/flashcards", label: "Flashcards", icon: Layers3 },
  { href: "/self-test", label: "Self-Test", icon: Target },
  { href: "/quiz", label: "15-Minute Quiz", icon: Clock3 },
  { href: "/progress", label: "My progress", icon: TrendingUp },
];
const modes = [
  {
    href: "/flashcards",
    label: "Flashcards",
    description: "Recall, reveal, repeat.",
    icon: Layers3,
  },
  {
    href: "/self-test",
    label: "Self-Test",
    description: "Answer in your own words.",
    icon: Target,
  },
  {
    href: "/quiz",
    label: "15-Minute Quiz",
    description: "A timed mix of your cards.",
    icon: Clock3,
  },
];
export default function Lernzi() {
  const path = usePathname();
  const router = useRouter();
  const [state, setState] = useState<StudyState>(emptyState);
  const [ready, setReady] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState("");
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const deletion = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      const s = readStudy();
      setState(s);
      setSelected(new URLSearchParams(window.location.search).get("material") || s.materials[0]?.id || "");
    } catch (e) {
      setStorageFailed(true);
      setNotice(e instanceof Error ? e.message : "Storage is unavailable.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    setMenu(false);
  }, [path]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === "lernzi.study.v1") {
        try {
          setState(readStudy());
          setNotice("Study material updated from another tab.");
        } catch {
          setNotice("Could not read the latest saved material.");
        }
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function update(next: StudyState) {
    try {
      saveStudy(next);
      setState(next);
      setStorageFailed(false);
      return true;
    } catch {
      setNotice(
        "Could not save. Your browser may have blocked storage or run out of space. Nothing was replaced.",
      );
      return false;
    }
  }
  function add(material: Material) {
    if (state.materials.length >= 20) {
      setNotice(
        "Your local library can hold 20 materials. Remove one before adding another.",
      );
      return;
    }
    if (update({ ...state, materials: [material, ...state.materials] })) {
      setSelected(material.id);
      router.push("/materials");
      setNotice("Added to this browser. Your material stays on this device.");
    }
  }
  function demo() {
    const existing = state.materials.find((m) => m.id === "sample-learning");
    if (existing) {
      setSelected(existing.id);
      router.push('/flashcards?material=sample-learning');
    } else {
      const sample = sampleMaterial();
      add(sample);
      router.push('/flashcards?material=sample-learning');
    }
  }
  const material =
    state.materials.find((m) => m.id === selected) || state.materials[0];
  const completed = state.results.reduce((s, r) => s + r.total, 0);
  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lernzi-study-export.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const legal = ["/privacy", "/cookies", "/terms"].includes(path);
  const auth = ["/login", "/signup", "/forgot-password"].includes(path);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {auth ? (
        <Auth path={path} />
      ) : legal ? (
        <Legal path={path} />
      ) : (
        <div className="app-shell">
          <aside className={`sidebar ${menu ? "is-open" : ""}`}>
            <div className="sidebar-brand">
              <Brand />
              <button
                className="icon-button mobile-only"
                aria-label="Close navigation"
                onClick={() => setMenu(false)}
              >
                <X />
              </button>
            </div>
            <div className="workspace-label">
              <span className="workspace-icon">
                <GraduationCap size={19} />
              </span>
              <div>
                Personal workspace<small>Local library</small>
              </div>
            </div>
            <nav aria-label="Main navigation">
              {navigation.map((n) => (
                <Link
                  key={n.href}
                  href={material && ['/flashcards','/self-test','/quiz'].includes(n.href) ? `${n.href}?material=${encodeURIComponent(material.id)}` : n.href}
                  className={`nav-link ${path === n.href ? "active" : ""}`}
                  aria-current={path === n.href ? "page" : undefined}
                >
                  <n.icon size={20} />
                  {n.label}
                  {path === n.href && <span className="nav-dot" />}
                </Link>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="local-note">
                <ShieldCheck size={20} />
                <div>
                  Stored on this device
                  <small>Your material stays on this device.</small>
                </div>
              </div>
              <Link href="/login" className="profile-link">
                <span className="avatar">
                  <GraduationCap size={19} />
                </span>
                <div>
                  Your workspace<small>Sign in when accounts launch</small>
                </div>
                <ChevronRight size={16} />
              </Link>
              <div className="sidebar-legal">
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
                <button
                  onClick={() =>
                    window.dispatchEvent(new Event("lernzi:cookies"))
                  }
                >
                  Cookies
                </button>
              </div>
            </div>
          </aside>
          {menu && (
            <button
              className="nav-backdrop"
              aria-label="Close navigation"
              onClick={() => setMenu(false)}
            />
          )}
          <div className="app-content">
            <header className="topbar">
              <button
                className="icon-button mobile-only"
                aria-label="Open navigation"
                aria-expanded={menu}
                onClick={() => setMenu(true)}
              >
                <Menu />
              </button>
              <div className="mobile-brand">
                <Brand />
              </div>
              <span className="breadcrumb">
                My workspace <ChevronRight size={14} />{" "}
                <span>
                  {navigation.find((n) => n.href === path)?.label ||
                    (path === "/upload" ? "Add material" : "Lernzi")}
                </span>
              </span>
              <div className="topbar-right">
                <span className="device-status">
                  <span /> On this device
                </span>
                <Link href="/upload" className="button small secondary">
                  <Plus size={17} /> Add material
                </Link>
              </div>
            </header>
            <main id="main" className="main-content">
              {notice && (
                <div className="notice" role="status">
                  <span>{notice}</span>
                  <button
                    className="icon-button"
                    aria-label="Dismiss notification"
                    onClick={() => setNotice("")}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              {!ready ? (
                <div className="empty-state">
                  <span className="eyebrow">YOUR STUDY SPACE</span>
                  <h1>Getting things ready…</h1>
                </div>
              ) : path === "/" ? (
                <>
                  <div className="page-heading">
                    <div>
                      <span className="eyebrow">YOUR WORKSPACE</span>
                      <h1>What are we studying?</h1>
                      <p>Pick up your notes or start with something new.</p>
                    </div>
                  </div>
                  <section className="focus-card">
                    <div className="focus-copy">
                      <span className="pill mint">
                        <span className="tiny-dot" />
                        {material ? "CURRENT MATERIAL" : "START YOUR LIBRARY"}
                      </span>
                      <h2>
                        {material
                          ? material.title
                          : "Your notes, ready to study."}
                      </h2>
                      <p>
                        {material
                          ? `${material.cards.length} cards in this set. Choose a study mode and work through them at your own pace.`
                          : "Add a set of notes, then practise with flashcards, a self-test or a 15-minute quiz."}
                      </p>
                      <div className="actions">
                        <Link
                          className="button primary"
                          href={material ? `/flashcards?material=${encodeURIComponent(material.id)}` : "/upload"}
                        >
                          {material
                            ? "Continue studying"
                            : "Add your first material"}
                          <ArrowRight size={18} />
                        </Link>
                        {!material && (
                          <button className="text-button" onClick={demo}>
                            Try a sample <ArrowUpRight size={16} />
                          </button>
                        )}
                      </div>
                      <span className="focus-footnote">
                        <ShieldCheck size={15} />
                        {material
                          ? `${material.cards.length} cards · saved in this browser`
                          : "Private by default. No account needed to explore."}
                      </span>
                    </div>
                    <div className="material-preview">
                      <span className="preview-heading"><FileText size={16}/>{material ? 'FROM YOUR NOTES' : 'HOW IT WORKS'}</span>
                      {material ? <><strong>{material.cards[0]?.question || material.title}</strong><span className="preview-bottom">{material.sample ? 'Sample set' : 'Your material'} <span>{material.cards.length} cards</span></span></> : <ol><li><span>01</span> Add your material</li><li><span>02</span> Review your card pairs</li><li><span>03</span> Choose how to practise</li></ol>}
                    </div>
                  </section>
                  <section className="section">
                    <div className="section-heading">
                      <h2>Choose a study mode</h2>
                      <span>Use your own material</span>
                    </div>
                    <div className="mode-grid">
                      {modes.map((m, i) => (
                        <Link
                          key={m.href}
                          href={material ? `${m.href}?material=${encodeURIComponent(material.id)}` : m.href}
                          className={`mode-card mode-${i}`}
                        >
                          <span className="mode-icon">
                            <m.icon size={24} />
                          </span>
                          <h3>{m.label}</h3>
                          <p>{m.description}</p>
                          <ArrowUpRight className="mode-arrow" size={19} />
                        </Link>
                      ))}
                    </div>
                  </section>
                  <section className="section">
                    <div className="section-heading">
                      <h2>Recent material</h2>
                      <Link href="/materials">
                        View all <ArrowRight size={15} />
                      </Link>
                    </div>
                    {state.materials.length ? (
                      <div className="material-list">
                        {state.materials.slice(0, 2).map((m) => (
                          <button
                            key={m.id}
                            className="material-row"
                            onClick={() => {
                              setSelected(m.id);
                              router.push("/materials");
                            }}
                          >
                            <span className="file-icon">
                              <FileText />
                            </span>
                            <div>
                              <strong>{m.title}</strong>
                              <small>
                                {m.sample ? "Sample material · " : ""}
                                {m.cards.length} cards ·{" "}
                                {new Date(m.createdAt).toLocaleDateString(
                                  "en-GB",
                                  { day: "numeric", month: "short" },
                                )}
                              </small>
                            </div>
                            <ChevronRight size={19} />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="shelf-empty">
                        <span className="file-icon">
                          <FolderOpen size={25} />
                        </span>
                        <div>
                          <h3>Your notes will appear here.</h3>
                          <p>Your notes and study sets will be right here.</p>
                        </div>
                        <Link className="text-button" href="/upload">
                          Add material <Plus size={17} />
                        </Link>
                      </div>
                    )}
                  </section>
                  <div className="quiet-footer">
                    <span>
                      <Leaf size={16} /> Your local study library
                    </span>
                    <span>
                      {completed
                        ? `${completed} cards practised so far.`
                        : "Saved in this browser."}
                    </span>
                  </div>
                </>
              ) : path === "/materials" ? (
                <>
                  <PageHeading
                    eyebrow="YOUR PERSONAL LIBRARY"
                    title="Study materials"
                    text="Your notes, card sets and source material."
                  />
                  <div className="toolbar">
                    <label className="search">
                      <Search size={19} />
                      <input
                        aria-label="Search study materials"
                        placeholder="Find your material…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </label>
                    <Link className="button primary" href="/upload">
                      <Plus size={18} /> Add material
                    </Link>
                  </div>
                  <p className="subtle">
                    {state.materials.length} of 20 materials · Stored in this
                    browser
                  </p>
                  {state.materials.length === 0 ? (
                    <Empty
                      title="Your library is empty."
                      text="Add notes or explore a sample to see how Lernzi feels."
                      action={demo}
                    />
                  ) : (
                    <div className="library-grid">
                      {state.materials
                        .filter((m) =>
                          m.title.toLowerCase().includes(search.toLowerCase()),
                        )
                        .map((m) => (
                          <article
                            className={`library-card ${material?.id === m.id ? "selected" : ""}`}
                            key={m.id}
                          >
                            <div className="section-heading">
                              <span className="file-icon">
                                <FileText />
                              </span>
                              <button
                                className="icon-button"
                                aria-label={`Delete ${m.title}`}
                                onClick={() => {
                                  setDeleteId(m.id);
                                  deletion.current?.showModal();
                                }}
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                            {m.sample && (
                              <span className="eyebrow">SAMPLE MATERIAL</span>
                            )}
                            <h2>{m.title}</h2>
                            <p>
                              {m.cards.length} cards · Added{" "}
                              {new Date(m.createdAt).toLocaleDateString(
                                "en-GB",
                              )}
                            </p>
                            <button
                              className="button secondary"
                              onClick={() => {
                                setSelected(m.id);
                                router.push(`/flashcards?material=${encodeURIComponent(m.id)}`);
                              }}
                            >
                              Study this material <ArrowRight size={17} />
                            </button>
                            <details>
                              <summary>View source notes</summary>
                              <pre>{m.text}</pre>
                            </details>
                          </article>
                        ))}
                    </div>
                  )}
                  {state.materials.length > 0 &&
                    !state.materials.some((m) =>
                      m.title.toLowerCase().includes(search.toLowerCase()),
                    ) && (
                      <p>No material matches “{search}”. Try another name.</p>
                    )}
                  <div className="local-explainer">
                    <ShieldCheck size={21} />
                    <p>
                      Saved on this device, in this browser. Original files are
                      not kept. Clearing browser data removes your library, so
                      keep an export of your work.
                    </p>
                    <button
                      className="text-button"
                      onClick={exportData}
                      disabled={!state.materials.length}
                    >
                      <ArrowDownToLine size={18} /> Export data
                    </button>
                  </div>
                </>
              ) : path === "/upload" ? (
                <Upload onAdd={add} disabled={storageFailed} />
              ) : ["/flashcards", "/self-test", "/quiz"].includes(path) ? (
                <>
                  <PageHeading
                    eyebrow={
                      path === "/quiz" ? "MAKE A LITTLE TIME" : "MAKE IT STICK"
                    }
                    title={
                      path === "/flashcards"
                        ? "Flashcards"
                        : path === "/self-test"
                          ? "Self-Test"
                          : "15-Minute Quiz"
                    }
                    text={
                      path === "/flashcards"
                        ? "Recall first. Reveal when you’re ready."
                        : path === "/self-test"
                          ? "Put your memory to work, then check your own answer."
                          : "A fresh shuffle of your cards. A little focus. Real progress."
                    }
                  />
                  {material ? (
                    <>
                      <label className="material-select">
                        Study material
                        <select
                          value={material.id}
                          onChange={(e) => setSelected(e.target.value)}
                        >
                          {state.materials.map((m) => (
                            <option value={m.id} key={m.id}>
                              {m.title}
                              {m.sample ? " (sample)" : ""}
                            </option>
                          ))}
                        </select>
                      </label>
                      <StudySession
                        key={`${path}-${material.id}`}
                        mode={path}
                        material={material}
                        onComplete={(r) => {
                          const latest = readStudy();
                          return update({
                            ...latest,
                            results: [...latest.results, r],
                          });
                        }}
                      />
                    </>
                  ) : (
                    <Empty
                      title="Give your curiosity something to work with."
                      text="Add your study material first, or practise with a clearly labelled sample set."
                      action={demo}
                    />
                  )}
                </>
              ) : path === "/progress" ? (
                <>
                  <PageHeading
                    eyebrow="YOUR LEARNING JOURNEY"
                    title="Study progress"
                    text="An honest look at the practice you’ve put in."
                  />
                  <div className="progress-summary">
                    <div>
                      <span className="eyebrow">CARDS PRACTISED</span>
                      <strong>{completed}</strong>
                      <p>Every attempt is a step forward.</p>
                    </div>
                    <div>
                      <span className="eyebrow">COMPLETED SESSIONS</span>
                      <strong>{state.results.length}</strong>
                      <p>Based on your own answer checks.</p>
                    </div>
                  </div>
                  <section className="panel plan">
                    <span className="mode-icon">
                      <Leaf />
                    </span>
                    <div>
                      <h2>Your last seven days</h2>
                      <p>
                        Try one focused session on a day that works for you.
                        These are your last seven calendar days, not a streak to
                        chase.
                      </p>
                      <div className="week">
                        {Array.from({ length: 7 }, (_, i) => {
                          const d = new Date();
                          d.setDate(d.getDate() - 6 + i);
                          const active = state.results.some(
                            (r) =>
                              new Date(r.date).toDateString() ===
                              d.toDateString(),
                          );
                          return (
                            <div key={i}>
                              <span>
                                {d.toLocaleDateString("en-GB", {
                                  weekday: "short",
                                })}
                              </span>
                              <span className={active ? "day done" : "day"}>
                                {active ? <Check size={18} /> : d.getDate()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <Link className="button primary" href="/quiz">
                        Make time for 15 minutes <ArrowRight size={18} />
                      </Link>
                    </div>
                  </section>
                  <section className="section">
                    <div className="section-heading">
                      <h2>Recent sessions</h2>
                      <button className="text-button" onClick={exportData}>
                        <ArrowDownToLine size={16} /> Export data
                      </button>
                    </div>
                    {state.results.length ? (
                      <div className="material-list">
                        {[...state.results]
                          .reverse()
                          .slice(0, 10)
                          .map((r) => (
                            <div className="material-row" key={r.id}>
                              <span className="file-icon">
                                <Check />
                              </span>
                              <div>
                                <strong>
                                  {state.materials.find(
                                    (m) => m.id === r.materialId,
                                  )?.title || "Study session"}
                                </strong>
                                <small>
                                  {r.mode} ·{" "}
                                  {new Date(r.date).toLocaleDateString("en-GB")}
                                </small>
                              </div>
                              <span>
                                {r.correct}/{r.total} self-marked correct
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="shelf-empty">
                        <TrendingUp />
                        <div>
                          <h3>No completed sessions yet.</h3>
                          <p>
                            Complete a session to see it here. No made-up
                            scores.
                          </p>
                        </div>
                      </div>
                    )}
                  </section>
                </>
              ) : (
                <Empty
                  title="That page isn’t here."
                  text="Return to your workspace to keep learning."
                />
              )}
            </main>
            <footer className="page-footer">
              <span>© {new Date().getFullYear()} Lernzi</span>
              <div>
                <Link href="/privacy">Privacy</Link>
                <Link href="/cookies">Cookies</Link>
                <Link href="/terms">Terms</Link>
                <button
                  onClick={() =>
                    window.dispatchEvent(new Event("lernzi:cookies"))
                  }
                >
                  Cookie settings
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
      <dialog ref={deletion} className="modal">
        <h2>Remove this material?</h2>
        <p>
          Its cards and study results will be removed from this browser. This
          cannot be undone.
        </p>
        <div className="actions">
          <button
            className="button secondary"
            onClick={() => deletion.current?.close()}
          >
            Keep material
          </button>
          <button
            className="button danger"
            onClick={() => {
              if (
                update({
                  ...state,
                  materials: state.materials.filter((m) => m.id !== deleteId),
                  results: state.results.filter(
                    (r) => r.materialId !== deleteId,
                  ),
                })
              )
                deletion.current?.close();
            }}
          >
            Delete material
          </button>
        </div>
      </dialog>
      <Cookies />
    </>
  );
}
function Empty({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: () => void;
}) {
  return (
    <section className="empty-state panel">
      <span className="empty-symbol">
        <BookOpen size={34} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      <div className="actions">
        <Link href="/upload" className="button primary">
          Add material <Plus size={18} />
        </Link>
        {action && (
          <button className="button secondary" onClick={action}>
            Explore a sample
          </button>
        )}
      </div>
    </section>
  );
}
