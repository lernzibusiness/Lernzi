export type Card = { id: string; question: string; answer: string };
export type Material = {
  id: string;
  title: string;
  createdAt: string;
  text: string;
  cards: Card[];
  sample?: boolean;
};
export type Result = {
  id: string;
  materialId: string;
  mode: string;
  correct: number;
  total: number;
  date: string;
};
export type StudyState = {
  version: 1;
  materials: Material[];
  results: Result[];
};
export const emptyState: StudyState = {
  version: 1,
  materials: [],
  results: [],
};
export function parseCards(text: string): Card[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line, i) => {
      const at = line.indexOf("::");
      if (at < 1) return [];
      const question = line.slice(0, at).trim();
      const answer = line.slice(at + 2).trim();
      return question && answer ? [{ id: `card-${i}`, question, answer }] : [];
    })
    .slice(0, 300);
}
export function shuffle<T>(
  items: T[],
  random: () => number = Math.random,
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function remainingSeconds(start: number, now: number) {
  return Math.max(0, Math.ceil((15 * 60 * 1000 - (now - start)) / 1000));
}
export function isStudyState(value: unknown): value is StudyState {
  if (!value || typeof value !== "object") return false;
  const v = value as StudyState;
  return (
    v.version === 1 &&
    Array.isArray(v.materials) &&
    v.materials.length <= 20 &&
    Array.isArray(v.results) &&
    v.results.every(
      (r) =>
        !!r &&
        typeof r.id === "string" &&
        typeof r.materialId === "string" &&
        typeof r.date === "string" &&
        Number.isInteger(r.total) &&
        Number.isInteger(r.correct) &&
        r.correct >= 0 &&
        r.correct <= r.total,
    ) &&
    v.materials.every(
      (m) =>
        !!m &&
        typeof m.id === "string" &&
        typeof m.title === "string" &&
        typeof m.text === "string" &&
        m.text.length <= 500000 &&
        typeof m.createdAt === "string" &&
        Array.isArray(m.cards) &&
        m.cards.length <= 300 &&
        m.cards.every(
          (c) =>
            !!c &&
            typeof c.id === "string" &&
            typeof c.question === "string" &&
            typeof c.answer === "string",
        ),
    )
  );
}
export function sampleMaterial(): Material {
  const text =
    "What is active recall? :: Retrieving information from memory rather than rereading it.\nWhat is spaced repetition? :: Revisiting material at intervals over time.\nWhat is interleaving? :: Mixing related topics or problem types during practice.\nWhy take study breaks? :: To rest and return to studying with renewed attention.\nWhat is a useful next step after a mistake? :: Review the explanation, then try recalling it again later.\nWhat is a study goal? :: A specific task you intend to complete in a study session.";
  return {
    id: "sample-learning",
    title: "The art of learning",
    createdAt: new Date().toISOString(),
    text,
    cards: parseCards(text),
    sample: true,
  };
}
