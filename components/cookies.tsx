"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, ShieldCheck } from "lucide-react";
type Consent = {
  version: 1;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};
const KEY = "lernzi.consent.v1";
export default function Cookies() {
  const [banner, setBanner] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      const c = JSON.parse(
        localStorage.getItem(KEY) || "null",
      ) as Consent | null;
      if (
        !c ||
        c.version !== 1 ||
        !Number.isFinite(Date.parse(c.updatedAt)) ||
        Date.parse(c.updatedAt) > Date.now() ||
        Date.now() - Date.parse(c.updatedAt) > 180 * 86400000
      )
        setBanner(true);
      else {
        setAnalytics(c.analytics === true);
        setMarketing(c.marketing === true);
      }
    } catch {
      setBanner(true);
    }
    const open = () => dialog.current?.showModal();
    window.addEventListener("lernzi:cookies", open);
    return () => window.removeEventListener("lernzi:cookies", open);
  }, []);
  function save(a: boolean, m: boolean) {
    setAnalytics(a);
    setMarketing(m);
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          version: 1,
          analytics: a,
          marketing: m,
          updatedAt: new Date().toISOString(),
        }),
      );
      setError("");
    } catch {
      setError(
        "Your browser could not save this choice. Optional cookies remain off.",
      );
      setAnalytics(false);
      setMarketing(false);
      return;
    }
    setBanner(false);
    dialog.current?.close();
  }
  return (
    <>
      {banner && (
        <aside className="cookie-banner" aria-label="Cookie choices">
          <ShieldCheck size={23} />
          <div>
            <strong>Cookie preferences</strong>
            <p>
              We use local storage to remember your study material and
              preferences. No analytics or advertising tools are active.{" "}
              <Link href="/cookies">Cookie Policy</Link>
            </p>
            {error && <p role="alert">{error}</p>}
          </div>
          <div className="cookie-actions">
            <button
              onClick={() => save(false, false)}
              className="button secondary"
            >
              Reject optional
            </button>
            <button
              onClick={() => save(true, true)}
              className="button secondary"
            >
              Accept optional
            </button>
            <button
              className="text-button"
              onClick={() => dialog.current?.showModal()}
            >
              Manage preferences
            </button>
          </div>
        </aside>
      )}
      <dialog ref={dialog} className="modal">
        <div className="modal-heading">
          <span className="eyebrow">YOUR PRIVACY</span>
          <button
            className="icon-button"
            aria-label="Close cookie settings"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <h2>Cookie preferences</h2>
        <p>
          Choose what you’re comfortable with. You can change your choice at any
          time.
        </p>
        <div className="preference">
          <div>
            <strong>Necessary storage</strong>
            <p>
              Remembers your privacy choice and saves the study material you add
              on this device.
            </p>
          </div>
          <span className="pill">Always on</span>
        </div>
        <label className="preference">
          <div>
            <strong>Analytics</strong>
            <p>
              Not currently used. If enabled later, helps us understand use of
              Lernzi. We will ask again before activating a new provider.
            </p>
          </div>
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
          />
        </label>
        <label className="preference">
          <div>
            <strong>Marketing</strong>
            <p>
              Not currently used. No advertising or cross-site tracking is
              installed.
            </p>
          </div>
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <div className="actions">
          <button
            className="button secondary"
            onClick={() => save(false, false)}
          >
            Reject optional
          </button>
          <button
            className="button primary"
            onClick={() => save(analytics, marketing)}
          >
            Save preferences
          </button>
        </div>
        <Link href="/cookies">Read the Cookie Policy</Link>
      </dialog>
    </>
  );
}
