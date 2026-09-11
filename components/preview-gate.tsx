"use client";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasPreview, isAppRoute } from "@/lib/preview-session";

export default function PreviewGate({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const active = hasPreview();
    setAllowed(active); setReady(true);
    if (isAppRoute(path) && !active) router.replace(`/login?next=${encodeURIComponent(path + window.location.search)}`);
  }, [path, router]);
  if (isAppRoute(path) && (!ready || !allowed)) return <main className="preview-loading" id="main"><p role="status">Opening Lernzi…</p></main>;
  return children;
}
