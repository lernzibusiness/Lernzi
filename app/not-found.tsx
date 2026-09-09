import Link from "next/link";
export default function NotFound() {
  return (
    <main className="empty-state" id="main">
      <span className="eyebrow">LERNZI</span>
      <h1>Let’s find your way back.</h1>
      <p>This page isn’t here. Your study space is one step away.</p>
      <Link href="/" className="button primary">
        Back to Lernzi
      </Link>
    </main>
  );
}
