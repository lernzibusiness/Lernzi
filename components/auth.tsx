"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { beginPreview, safeNextPath } from "@/lib/preview-session";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import Brand from "./brand";
export default function Auth({ path }: { path: string }) {
  const signup = path === "/signup",
    reset = path === "/forgot-password";
  const router = useRouter();
  const [next, setNext] = useState("/dashboard");
  useEffect(() => { setNext(safeNextPath(new URLSearchParams(window.location.search).get("next"))); setMessage(""); }, [path]);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (signup && data.get("password") !== data.get("confirm")) {
      setMessage("Your passwords don’t match. Please check them.");
      return;
    }
    if (reset) { setMessage("Password reset will be available when accounts are connected. No email has been sent."); return; }
    try {
      beginPreview();
      e.currentTarget.reset();
      router.push(next);
    } catch { setMessage("Your browser blocked temporary storage. Allow site storage to open the app preview."); }
  }
  return (
    <div className="auth-layout">
      <aside className="auth-story">
        <Brand />
        <div className="auth-story-content">
          <span className="eyebrow">A CLEARER WAY TO LEARN</span>
          <h1>
            Your notes.
            <br />Your study space.
            <br />
            <span>Lernzi.</span>
          </h1>
          <p>
            Bring your notes, find your rhythm, and give your next chapter a
            little room.
          </p>
          <div className="auth-emblem">
            <Leaf size={66} />
          </div>
        </div>
        <span className="auth-story-footer">
          Your material. Your pace. Your Lernzi.
        </span>
      </aside>
      <main id="main" className="auth-main">
        <Link className="text-button back-link" href="/">
          <ArrowLeft size={16} /> Back to the website
        </Link>
        <div className="auth-form-wrap">
          <span className="eyebrow">
            {reset
              ? "LET’S FIND YOUR WAY BACK"
              : signup
                ? "YOUR NEXT CHAPTER"
                : "WELCOME BACK"}
          </span>
          <h1>
            {reset
              ? "Forgot your password?"
              : signup
                ? "Create your account"
                : "Log in to Lernzi"}
          </h1>
          <p>
            {reset
              ? "Account recovery is not connected in this preview."
              : signup
                ? "Save your place and keep your study material together."
                : "Pick up your learning, right where you left it."}
          </p>
          <div className="availability-note">
            <ShieldCheck size={18} />
            <span>
              Account-screen preview. Use example details: they are not sent or saved.
              Continuing opens the local app without creating an account.
            </span>
          </div>
          <form onSubmit={submit}>
            {signup && (
              <label>
                Name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Your name"
                />
              </label>
            )}
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </label>
            {!reset && (
              <>
                <label>
                  Password
                  <div className="password-field">
                    <input
                      name="password"
                      type={show ? "text" : "password"}
                      autoComplete={
                        signup ? "new-password" : "current-password"
                      }
                      minLength={signup ? 12 : undefined}
                      required
                      placeholder={
                        signup ? "At least 12 characters" : "Your password"
                      }
                    />
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={show ? "Hide password" : "Show password"}
                      onClick={() => setShow(!show)}
                    >
                      {show ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
                {signup ? (
                  <label>
                    Confirm password
                    <input
                      name="confirm"
                      type={show ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={12}
                      required
                      placeholder="Repeat your password"
                    />
                  </label>
                ) : (
                  <Link href={`/forgot-password?next=${encodeURIComponent(next)}`} className="forgot-link">
                    Forgot password?
                  </Link>
                )}
              </>
            )}
            {signup && (
              <p className="legal-agreement">
                This is an account-screen preview. Read the{" "}
                <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>. See our{" "}
                <Link href="/cookies">Cookie Policy</Link>.
              </p>
            )}
            {message && (
              <p role="status" className="form-message">
                {message}
              </p>
            )}
            <button className="button primary full-width" type="submit">
              {reset
                ? "Request password reset"
                : signup
                  ? "Continue to app preview"
                  : "Continue to app preview"}
              <ArrowRight size={18} />
            </button>
          </form>
          <p className="auth-switch">
            {reset ? (
              <Link href={`/login?next=${encodeURIComponent(next)}`}>Back to log in</Link>
            ) : signup ? (
              <>
                Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`}>Log in</Link>
              </>
            ) : (
              <>
                New to Lernzi? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Create an account</Link>
              </>
            )}
          </p>

        </div>
        <footer className="auth-footer">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/cookies">Cookie Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <button
            onClick={() => window.dispatchEvent(new Event("lernzi:cookies"))}
          >
            Cookie settings
          </button>
        </footer>
      </main>
    </div>
  );
}
