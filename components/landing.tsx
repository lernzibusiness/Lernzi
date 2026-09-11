import Link from "next/link";
import { ArrowRight, Layers3, TrendingUp } from "lucide-react";
import Brand from "./brand";
import FeatureFigure, { type FeatureKind } from "./feature-figure";

const tools: { name: string; text: string; href: string; figure: FeatureKind }[] = [
  { name: "Upload Your Material", text: "Give your notes a place to live.", href: "/upload", figure: "upload" },
  { name: "Flashcards", text: "Build recall, one card at a time.", href: "/flashcards", figure: "cards" },
  { name: "Self-Test", text: "Find out what you remember.", href: "/self-test", figure: "test" },
  { name: "15-Min Quiz", text: "Make a little time for focus.", href: "/quiz", figure: "timer" },
  { name: "Track Progress", text: "See the practice you put in.", href: "/progress", figure: "progress" },
];
export default function Landing() {
  return <div className="landing">
    <header className="landing-nav"><Brand /><nav aria-label="Main navigation"><Link href="/">Home</Link><a href="#features">Features</a><a href="#about">About</a><a href="#contact">Contact</a></nav><div className="landing-account-actions"><Link href="/login" className="text-button">Log in</Link><Link href="/signup" className="button primary">Get Started <ArrowRight size={17}/></Link></div></header>
    <main id="main">
      <section className="landing-hero">
        <div><span className="eyebrow">YOUR DAILY STUDY SPACE</span><h1>Learn Everyday.</h1><p>Turn your notes into terms you understand. Review them, practise with flashcards, and see what sticks.</p><Link href="/signup" className="button primary">Get Started <ArrowRight size={18}/></Link><small>Try the app preview. Your notes stay on this device.</small></div>
        <div className="hero-preview" aria-label="Example study card"><div className="preview-label"><Layers3 size={20}/> A moment of focus <span>EXAMPLE</span></div><div className="preview-paper"><span className="eyebrow">A QUESTION FOR YOU</span><h2>What helps new knowledge stick?</h2><p>Recall it. Practise it. Come back to it.</p></div><div className="preview-label"><span>One card. One small step.</span><TrendingUp size={20}/></div></div>
      </section>
      <section id="features" className="landing-section"><span className="eyebrow">YOUR STUDY TOOLKIT</span><h2>Less friction. More learning.</h2><div className="landing-tools">{tools.map(t=><Link href={`/login?next=${encodeURIComponent(t.href)}`} className="mode-card" key={t.href}><FeatureFigure kind={t.figure}/><h3>{t.name}</h3><p>{t.text}</p><ArrowRight size={20}/></Link>)}</div></section>
      <section id="about" className="landing-about"><div><span className="eyebrow">AT YOUR OWN PACE</span><h2>A clearer next step.</h2></div><p>Upload a PDF or text file, check the suggested terms, and start practising. Install Lernzi to keep your study space close, even offline.</p></section>
      <section id="contact" className="landing-contact"><h3>Stay connected</h3><p>Support is coming at launch. Your privacy matters today.</p><Link href="/privacy">Privacy information <ArrowRight size={16}/></Link></section>
    </main>
    <footer className="landing-footer"><Brand/><div><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link></div></footer>
  </div>;
}
