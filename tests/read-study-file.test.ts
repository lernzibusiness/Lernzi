import test from "node:test";
import assert from "node:assert/strict";
import { readStudyFile } from "../lib/read-study-file.ts";

test("imports UTF-8 notes and Markdown without changing card delimiters", async () => {
  const text = "What is recall? :: Retrieving a memory.\nCafé";
  for (const name of ["notes.txt", "notes.MD"]) {
    assert.equal(await readStudyFile(new File([text], name)), text);
  }
});

test("rejects unsupported, oversized, empty and invalid text files", async () => {
  await assert.rejects(readStudyFile(new File(["notes"], "notes.docx")), /Choose a PDF/);
  await assert.rejects(readStudyFile(new File([new Uint8Array(10 * 1024 * 1024 + 1)], "notes.pdf")), /10 MB/);
  await assert.rejects(readStudyFile(new File(["  "], "notes.txt")), /empty/);
  await assert.rejects(readStudyFile(new File(["x".repeat(500001)], "notes.md")), /500,000/);
  await assert.rejects(readStudyFile(new File([new Uint8Array([0xff])], "notes.txt")), /UTF-8/);
});
