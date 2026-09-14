import Link from "next/link";
import { ArrowRight, Layers3, TrendingUp } from "lucide-react";
import Brand from "./brand";
import GrowingPlant from "./growing-plant";
import FeatureFigure, { type FeatureKind } from "./feature-figure";

const tools: { name: string; text: string; href: string; figure: FeatureKind }[] = [
  { name: "Upload Your Material", text: "Plant your notes. Give new ideas room to grow.", href: "/upload", figure: "upload" },
  { name: "Flashcards", text: "Grow stronger roots, one card at a time.", href: "/flashcards", figure: "cards" },
  { name: "Self-Test", text: "See which ideas have taken root.", href: "/self-test", figure: "test" },
  { name: "15-Min Quiz", text: "Tend your knowledge with 15 minutes of practice.", href: "/quiz", figure: "timer" },
  { name: "Track Progress", text: "Watch your study habits grow over time.", href: "/progress", figure: "progress" },
];
export default function Landing() {
  return <div className="landing">
    <header className="landing-nav"><Brand /><nav aria-label="Main navigation"><Link href="/">Home</Link><a href="#features">Features</a><a href="#about">About</a><a href="#contact">Contact</a></nav><div className="landing-account-actions"><Link href="/login" className="text-button">Log in</Link><Link href="/signup" className="button primary">Start Growing <ArrowRight size={17}/></Link></div></header>
    <main id="main">
      <section className="landing-hero">
        <div><span className="eyebrow">A LITTLE LEARNING. A LITTLE GROWTH.</span><h1>Let your knowledge grow.</h1><p>Every note is a seed. Turn yours into study terms, nurture them with practice, and help your understanding take root.</p><Link href="/signup" className="button primary">Start Growing <ArrowRight size={18}/></Link><small>Explore your study garden in the app preview. Your notes stay on this device.</small></div>
        <div className="hero-preview" aria-label="Example study card"><div className="preview-label"><Layers3 size={20}/> A moment to grow <span>EXAMPLE</span></div><div className="preview-paper"><span className="eyebrow">PLANT A LITTLE CURIOSITY</span><h2>What helps knowledge take root?</h2><p>Feed it with curiosity. Tend it with practice. Give it time.</p></div><div className="preview-label"><span>One card. Stronger roots.</span><TrendingUp size={20}/></div><GrowingPlant className="hero-plant" /></div>
      </section>
      <section id="features" className="landing-section"><span className="eyebrow">TOOLS FOR YOUR STUDY GARDEN</span><h2>From small seeds to stronger understanding.</h2><div className="landing-tools">{tools.map(t=><Link href={`/login?next=${encodeURIComponent(t.href)}`} className="mode-card" key={t.href}><FeatureFigure kind={t.figure}/><h3>{t.name}</h3><p>{t.text}</p><ArrowRight size={20}/></Link>)}</div></section>
      <section id="about" className="landing-about"><div><span className="eyebrow">GROW AT YOUR OWN PACE</span><h2>Give your ideas room to bloom.</h2><GrowingPlant className="about-plant" small /></div><p>Plant the first seeds with a PDF or text file. Review the suggested terms, then nurture your recall with practice. Install Lernzi to keep growing, even offline.</p></section>
      <section id="contact" className="landing-contact"><h3>Stay rooted in Lernzi</h3><p>Lernzi is still growing. Support is coming at launch; privacy information is available now.</p><Link href="/privacy">Privacy information <ArrowRight size={16}/></Link></section>
    </main>
    <footer className="landing-footer"><Brand/><div><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/terms">Terms</Link></div></footer>
  </div>;
}
