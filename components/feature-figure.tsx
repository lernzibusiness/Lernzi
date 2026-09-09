import { ArrowUp, Check, Layers3 } from "lucide-react";

export type FeatureKind = "upload" | "cards" | "test" | "timer" | "progress";

// Decorative, CSS-built objects: no canvas, animation library or image downloads.
export default function FeatureFigure({ kind }: { kind: FeatureKind }) {
  return (
    <span className={`feature-figure figure-${kind}`} aria-hidden="true">
      <span className="figure-object">
        {kind === "upload" && <>
          <span className="figure-sheet"><i /><i /><i /></span>
          <span className="figure-badge"><ArrowUp size={34} strokeWidth={2.5} /></span>
        </>}
        {kind === "cards" && <>
          <span className="figure-card card-bottom" />
          <span className="figure-card card-middle" />
          <span className="figure-card card-top"><Layers3 size={38} /><i /></span>
        </>}
        {kind === "test" && <span className="figure-sheet checklist">
          <span><Check size={20} /><i /></span>
          <span><Check size={20} /><i /></span>
          <span><span className="empty-check" /><i /></span>
        </span>}
        {kind === "timer" && <>
          <span className="timer-crown" />
          <span className="figure-clock"><span className="clock-dial"><strong>15</strong><span className="clock-hand" /></span></span>
        </>}
        {kind === "progress" && <span className="figure-chart"><i /><i /><i /><span className="chart-check"><Check size={22} /></span></span>}
      </span>
    </span>
  );
}
