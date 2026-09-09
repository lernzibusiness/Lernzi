import { emptyState, isStudyState, type StudyState } from "./study";
const KEY = "lernzi.study.v1";
export function readStudy(): StudyState {
  const raw = localStorage.getItem(KEY);
  if (!raw) return emptyState;
  const parsed: unknown = JSON.parse(raw);
  if (!isStudyState(parsed))
    throw new Error(
      "Saved study data could not be read. Export a browser backup before clearing storage.",
    );
  return parsed;
}
export function saveStudy(state: StudyState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
// This small first-stage adapter stores text, cards and completed sessions locally.
// Replace it with IndexedDB for larger files; do not change the public study model.
