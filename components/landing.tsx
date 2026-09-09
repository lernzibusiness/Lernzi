import Link from "next/link";
import { ArrowRight, UploadCloud, Layers3, Target, Clock3, TrendingUp } from "lucide-react";
import Brand from "./brand";

const tools = [
  { name: "Upload Your Material", text: "Give your notes a place to live.", href: "/upload", icon: UploadCloud },
  { name: "Flashcards", text: "Build recall, one card at a time.", href: "/flashcards", icon: Layers3 },
  { name: "Self-Test", text: "Find out what you remember.", href: "/self-test", icon: Target },
  { name: "15-Min Quiz", text: "Make a little time for focus.", href: "/quiz", icon: Clock3 },
  { name: "Track Progress", text: "See the practice you put in.", href: "/progress", icon: TrendingUp },
];
export default function Landing() {
  return <div className="landing">
    <header className="landing-nav"><Brand /><nav aria-label="Main navigation"><Link href="/">Home</Link><a href="#features">Features</a><a href="#about">About</a><a href="#contact">Contact</a></nav><Link href="/dashboard" className="button primary">Get Started <ArrowRight size={17}/></Link></header>
    <main id="main">
      <section className="landing-hero">
        <div><span className="eyebrow">A LITTLE CLARITY. A LOT MORE CONFIDENCE.</span><h1>Learn smarter,<br/><span>Stress less.</span></h1><p>Turn your study material into flashcards, self-tests and focused quizzes. Find your rhythm with Lernzi.</p><Link href="/dashboard" className="button primary">Get Started <ArrowRight size={18}/></Link><small>No account needed to explore. Your notes stay on this device.</small></div>
        <div className="hero-preview" aria-label="Example study card"><div className="preview-label"><Layers3 size={20}/> A moment of focus <span>EXAMPLE</span></div><div className="preview-paper"><span className="eyebrow">A QUESTION FOR YOU</span><h2>What helps new knowledge stick?</h2><p>Recall it. Practise it. Come back to it.</p></div><div className="preview-label"><span>One card. One small step.</span><TrendingUp size={20}/></div></div>
      </section>
      <section id="features" className="landing-section"><span className="eyebrow">YOUR STUDY TOOLKIT</span><h2>Less friction. More learning.</h2><div className="landing-tools">{tools.map(t=><Link href={t.href} className="mode-card" key={t.href}><t.icon size={26}/><h3>{t.name}</h3><p>{t.text}</p><ArrowRight size={20}/></Link>)}</div></section>
      <section id="about" className="landing-about"><div><span className="eyebrow">MADE FOR YOUR WAY OF LEARNING</span><h2>A clearer next step.</h2></div><p>Lernzi brings your notes and study sessions into one calm space. Add text or Markdown notes with question-and-answer pairs, choose a study method, and practise at your own pace. PDF processing and cloud accounts are planned for a later release.</p></section>
      <section id="contact" className="landing-contact"><h3>Stay connected</h3><p>A direct support channel will be published when Lernzi launches. For now, explore the workspace and review our privacy information.</p><Link href="/privacy">Privacy information <ArrowRight size={16}/></Link></section>
    </main>
    <footer className="landing-footer"><Brand/><div><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link></div></footer>
  </div>;
}
