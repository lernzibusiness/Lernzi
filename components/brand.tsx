import Link from "next/link";
export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Lernzi home">
      <span className="brand-symbol">
        <img src="/logo-reference.svg" alt="" />
      </span>
      <span>
        Lernzi<span className="brand-dot">.</span>
      </span>
    </Link>
  );
}
