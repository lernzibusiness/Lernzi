import test from "node:test";
import assert from "node:assert/strict";
import {
  parseCards,
  shuffle,
  remainingSeconds,
  isStudyState,
  sampleMaterial,
} from "../lib/study.ts";
test("only explicit question and answer pairs become cards", () => {
  assert.deepEqual(
    parseCards(
      "Some ordinary notes\n :: no question\nQuestion :: \nWhat is recall? :: Retrieving a memory.",
    ).map(({ question, answer }) => ({ question, answer })),
    [{ question: "What is recall?", answer: "Retrieving a memory." }],
  );
});
test("shuffle preserves cards without duplicates or mutating the source", () => {
  const original = Array.from({ length: 50 }, (_, i) => i);
  const result = shuffle(original, () => 0.37);
  assert.equal(new Set(result).size, 50);
  assert.deepEqual(
    [...result].sort((a, b) => a - b),
    original,
  );
  assert.deepEqual(
    original,
    Array.from({ length: 50 }, (_, i) => i),
  );
  assert.notDeepEqual(result, original);
});
test("timer uses elapsed wall time including background time and clamps at zero", () => {
  assert.equal(remainingSeconds(1000, 1000), 900);
  assert.equal(remainingSeconds(1000, 61000), 840);
  assert.equal(remainingSeconds(1000, 901000), 0);
  assert.equal(remainingSeconds(1000, 1801000), 0);
});
test("invalid storage is rejected while valid sample data is accepted", () => {
  assert.equal(
    isStudyState({ version: 1, materials: [sampleMaterial()], results: [] }),
    true,
  );
  assert.equal(isStudyState({ version: 2, materials: [], results: [] }), false);
  assert.equal(
    isStudyState({ version: 1, materials: [{ cards: "bad" }], results: [] }),
    false,
  );
  assert.equal(
    isStudyState({
      version: 1,
      materials: [],
      results: [
        { id: "x", materialId: "x", date: "2026-09-09", total: 2, correct: 8 },
      ],
    }),
    false,
  );
});
