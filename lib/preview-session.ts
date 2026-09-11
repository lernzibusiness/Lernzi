export const PREVIEW_SESSION_KEY = "lernzi.preview-session.v1";
const appRoutes = new Set(["/dashboard", "/materials", "/upload", "/review", "/flashcards", "/self-test", "/quiz", "/progress", "/settings"]);

export function isAppRoute(path: string) { return appRoutes.has(path); }
export function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/dashboard";
  try {
    const url = new URL(value, "https://lernzi.invalid");
    return url.origin === "https://lernzi.invalid" && isAppRoute(url.pathname) ? `${url.pathname}${url.search}` : "/dashboard";
  } catch { return "/dashboard"; }
}

/** Navigation preview only. This is not authentication or an account credential. */
export function beginPreview() { sessionStorage.setItem(PREVIEW_SESSION_KEY, "active"); }
export function hasPreview() { try { return sessionStorage.getItem(PREVIEW_SESSION_KEY) === "active"; } catch { return false; } }
export function endPreview() { sessionStorage.removeItem(PREVIEW_SESSION_KEY); }
