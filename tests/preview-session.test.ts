import test from "node:test";
import assert from "node:assert/strict";
import { safeNextPath, isAppRoute, beginPreview, hasPreview, endPreview, PREVIEW_SESSION_KEY } from "../lib/preview-session.ts";

test("return paths stay inside the app", () => {
  assert.equal(safeNextPath("/upload"), "/upload");
  assert.equal(safeNextPath("/flashcards?material=abc"), "/flashcards?material=abc");
  for (const value of [null, "https://example.com", "//example.com", "/\\example.com", "/login", "/unknown"]) assert.equal(safeNextPath(value), "/dashboard");
  assert.equal(isAppRoute("/materials"), true);
  assert.equal(isAppRoute("/"), false);
});
test("preview marker contains no credentials and can be ended", () => {
  const data = new Map<string, string>();
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: { getItem: (key: string) => data.get(key) || null, setItem: (key: string, value: string) => data.set(key, value), removeItem: (key: string) => data.delete(key) } });
  assert.equal(hasPreview(), false);
  beginPreview();
  assert.deepEqual([...data], [[PREVIEW_SESSION_KEY, "active"]]);
  assert.equal(hasPreview(), true);
  endPreview();
  assert.equal(hasPreview(), false);
});
