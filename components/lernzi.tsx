"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
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
  Target,
  Trash2,
  TrendingUp,
  UploadCloud,
  X,
} from "lucide-react";
import Brand from "./brand";
import PwaRuntime from "./pwa-runtime";
import { endPreview } from "@/lib/preview-session";
import Landing from "./landing";
import TermReview from "./term-review";
import TermLearner from "./term-learner";
import { extractTerms, termsToCards } from "@/lib/terms";
import { PageHeading } from "./page-heading";
import Upload from "./upload";
import StudySession from "./study-session";
import Cookies from "./cookies";
import Auth from "./auth";
import Legal from "./legal";
import {
  emptyState,
  sampleMaterial,
  type Material,
  type StudyState,
} from "@/lib/study";
import { readStudy, saveStudy } from "@/lib/storage";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/materials", label: "My Materials", icon: FolderOpen },
  { href: "/flashcards", label: "Flashcards", icon: Layers3 },
  { href: "/self-test", label: "Self-Tests", icon: Target },
  { href: "/quiz", label: "15-Min Quiz", icon: Clock3 },
  { href: "/progress", label: "Progress", icon: TrendingUp },
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
    label: "15-Min Quiz",
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
    state.materials.find((m) => m.id === (path === "/dashboard" ? state.results.at(-1)?.materialId || selected : selected)) || state.materials[0];
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
      {path === "/" ? <Landing /> : auth ? (
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
            <div className="sidebar-bottom"><Link href="/settings" className="nav-link">Settings</Link><button className="nav-link" onClick={() => { endPreview(); window.location.assign("/login"); }}>Exit app preview</button>
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
                  App preview<small>Local study library</small>
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
              <PwaRuntime />
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
              ) : path === "/dashboard" ? (
                <>
                  <PageHeading eyebrow="YOUR WORKSPACE" title="Welcome back!" text="Ready to keep learning?" />
                  <section className="upload-focus"><div><span className="eyebrow">UPLOAD NEW MATERIAL</span><h2>Start with your notes.</h2><p>Turn your notes into flashcards, self-tests and more.</p></div><Link href="/upload" className="button primary"><UploadCloud size={20}/> Upload material</Link></section>
                  <section className="section"><div className="section-heading"><h2>Continue studying</h2>{state.materials.length>1 && <Link href="/materials">See all <ArrowRight size={16}/></Link>}</div>
                  {material ? <div className="continue-card"><span className="file-icon"><FileText/></span><div><h3>{material.title}</h3><p>{material.cards.length} cards{material.sample ? " · Sample material" : ""}</p>{(()=>{const last=[...state.results].reverse().find(r=>r.materialId===material.id);return last ? <small>Last studied {new Date(last.date).toLocaleDateString("en-GB")} · {last.correct}/{last.total} self-marked correct</small> : <small>Ready for your first session</small>;})()}</div><Link href={`/flashcards?material=${encodeURIComponent(material.id)}`} className="button secondary">Continue <ArrowRight size={18}/></Link></div> : <div className="shelf-empty"><FolderOpen/><div><h3>Your study space starts here.</h3><p>Add your notes above, or explore a sample set.</p></div><button className="text-button" onClick={demo}>Try a sample <ArrowRight size={16}/></button></div>}</section>
                  <section className="section"><div className="section-heading"><h2>Your study tools</h2></div><div className="mode-grid">{[...modes,{href:"/progress",label:"Progress",description:"See your practice over time.",icon:TrendingUp}].map(m=><Link className="mode-card" key={m.href} href={material && m.href!=="/progress" ? `${m.href}?material=${encodeURIComponent(material.id)}` : m.href}><span className="mode-icon"><m.icon size={24}/></span><h3>{m.label}</h3><p>{m.description}</p><ArrowRight className="mode-arrow" size={18}/></Link>)}</div></section>
                </>
              ) : path === "/settings" ? (
                <><PageHeading eyebrow="YOUR WORKSPACE" title="Settings" text="Your data and preferences, in one place."/><section className="panel settings-panel"><h2>On this device</h2><p>Your study library is saved in this browser. Export a copy to keep it safe.</p><button className="button secondary" onClick={exportData}><ArrowDownToLine size={18}/> Export study data</button><h2>Privacy preferences</h2><p>Review your optional cookie choices at any time.</p><button className="button secondary" onClick={()=>window.dispatchEvent(new Event("lernzi:cookies"))}>Cookie preferences</button><h2>Account</h2><p>This is an app preview. Login details are not saved, and no account or cloud backup has been created. Your study library stays in this browser.</p><Link href="/login" className="text-button">View account preview <ArrowRight size={16}/></Link></section></>
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
                            <Link className="text-button" href={`/review?material=${encodeURIComponent(m.id)}`}>{m.terms ? "Review / edit study terms" : "Find study terms"}</Link>
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
              ) : path === "/review" && material ? (
                <TermReview key={material.id} initial={material.terms || extractTerms(material.text,material.sourceFile || material.title)} source={material.sourceFile || material.title} onSave={terms=>{
                  const latest=readStudy();
                  if(update({...latest,materials:latest.materials.map(m=>m.id===material.id?{...m,terms,cards:termsToCards(terms)}:m)})) router.push(`/flashcards?material=${encodeURIComponent(material.id)}`);
                }}/>
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
                          : "15-Min Quiz"
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
                      {path === "/flashcards" && material.terms?.some(t=>t.approved) ? <TermLearner key={material.id} material={material} onMark={(id,status)=>{
                        const latest=readStudy();
                        return update({...latest,materials:latest.materials.map(m=>m.id===material.id?{...m,terms:m.terms?.map(t=>t.id===id?{...t,status}:t)}:m)});
                      }}/> : <StudySession
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
                      />}
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
                  {state.materials.some(m=>m.terms?.some(t=>t.approved)) && <section className="panel term-progress"><h2>Study terms</h2>{state.materials.filter(m=>m.terms?.some(t=>t.approved)).map(m=><p key={m.id}><Link href={`/flashcards?material=${encodeURIComponent(m.id)}`}>{m.title}</Link> · {m.terms!.filter(t=>t.approved && t.status==="known").length} known · {m.terms!.filter(t=>t.approved && t.status==="learning").length} learning · {m.terms!.filter(t=>t.approved && t.status==="unseen").length} unseen</p>)}</section>}
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
                                  {r.mode === "15-Minute Quiz" || r.mode === "Quizzes" ? "15-Min Quiz" : r.mode} ·{" "}
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
