"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, WifiOff, RefreshCw } from "lucide-react";
import { isAppRoute } from "@/lib/preview-session";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
export default function PwaRuntime() {
  const path = usePathname();
  const [install, setInstall] = useState<InstallEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [offline, setOffline] = useState(false);
  const [help, setHelp] = useState(false);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [cached, setCached] = useState(false);
  const [message, setMessage] = useState("");
  const disconnected = useRef(false);
  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const updateStandalone = () => setStandalone(media.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const markConnection = (down: boolean) => { disconnected.current = down; setOffline(down); };
    const online = () => {
      markConnection(!navigator.onLine);
      if (navigator.onLine) {
        // navigator.onLine may stay true with no reachable network after an offline reload.
        void fetch("/manifest.webmanifest", { method: "HEAD", cache: "no-store", signal: AbortSignal.timeout(5000) }).then(response => markConnection(!response.ok)).catch(() => markConnection(true));
      }
    };
    const prompt = (event: Event) => { event.preventDefault(); setInstall(event as InstallEvent); };
    const installed = () => { setStandalone(true); setInstall(null); };
    const offlineLinks = (event: MouseEvent) => {
      if (!disconnected.current || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element)?.closest?.("a");
      if (!anchor || anchor.target || anchor.download || !anchor.href) return;
      const url = new URL(anchor.href);
      if (url.origin === location.origin && url.pathname !== location.pathname) { event.preventDefault(); event.stopPropagation(); location.assign(url.href); }
    };
    online(); updateStandalone();
    window.addEventListener("online", online); window.addEventListener("offline", online);
    window.addEventListener("beforeinstallprompt", prompt); window.addEventListener("appinstalled", installed);
    media.addEventListener("change", updateStandalone);
    document.addEventListener("click", offlineLinks, true);
    return () => { window.removeEventListener("online", online); window.removeEventListener("offline", online); window.removeEventListener("beforeinstallprompt", prompt); window.removeEventListener("appinstalled", installed); media.removeEventListener("change", updateStandalone); document.removeEventListener("click", offlineLinks, true); };
  }, []);
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    let stopped = false;
    let reload = false;
    const controller = () => { if (reload) location.reload(); };
    navigator.serviceWorker.addEventListener("controllerchange", controller);
    void navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then(registration => {
      if (stopped) return;
      const check = () => { if (registration.waiting) setWaiting(registration.waiting); };
      check();
      registration.addEventListener("updatefound", () => registration.installing?.addEventListener("statechange", check));
      void navigator.serviceWorker.ready.then(() => { if (!stopped) setCached(true); });
      const refresh = () => { reload = true; };
      window.addEventListener("lernzi:apply-update", refresh, { once: true });
    }).catch(() => { if (!stopped) setMessage("Offline setup couldn’t finish. Keep a connection and reload to try again."); });
    return () => { stopped = true; navigator.serviceWorker.removeEventListener("controllerchange", controller); };
  }, []);
  if (!isAppRoute(path)) return null;
  return <aside className="pwa-bar" aria-label="Lernzi app status">
    <div><strong>Lernzi app</strong><span>{offline ? <><WifiOff size={15} /> Offline · your local library is available</> : cached ? "Ready for offline study" : "Your study space, on this device"}</span></div>
    <div className="pwa-actions">{waiting && <button className="text-button" onClick={() => { window.dispatchEvent(new Event("lernzi:apply-update")); waiting.postMessage({ type: "SKIP_WAITING" }); }}><RefreshCw size={16} />Update ready · reload app</button>}
      {!standalone && <button className="button secondary small" onClick={async () => {
        if (!install) { setHelp(v => !v); return; }
        try { await install.prompt(); await install.userChoice; setInstall(null); } catch { setHelp(true); }
      }}><Download size={16} />Install Lernzi</button>}
    </div>
    {help && <p className="pwa-help">On iPhone or iPad: open in Safari, tap Share, then Add to Home Screen. On Chrome or Edge: use the browser menu’s Install app option. Installation needs HTTPS or localhost.</p>}
    {message && <p className="pwa-help" role="status">{message}</p>}
  </aside>;
}
