import Link from "next/link";
export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Lernzi home">
      <span className="brand-symbol">
        <img src="/logo-mark.svg" alt="" width="36" height="35" />
      </span>
      <span>
        Lernzi<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
