import type { LayerMetric } from "@/lib/engines/progress-engine";
import { ArrowRight } from "lucide-react";

/** A numbered rail, so the argument reads as a sequence rather than a page. */
export function SectionRail({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="mono-num text-[11.5px] font-semibold text-ink-4">{n}</span>
      <span className="h-px w-6 bg-line-strong" />
      <span className="micro-label">{title}</span>
    </div>
  );
}

/**
 * The reading behind a link: what it was, what it is, and the movement.
 *
 * A single number tells you nothing about direction, which is how a report
 * can put "45.6 hours of licensed review" on a slide and have it read as
 * diligence rather than as the cost it is.
 */
export function Reading({ metric }: { metric: LayerMetric }) {
  const tone =
    metric.direction === "good"
      ? "text-ok"
      : metric.direction === "bad"
        ? "text-crit"
        : "text-ink-2";

  return (
    <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-y border-line py-2.5">
      <span className="text-[11.5px] uppercase tracking-[0.13em] text-ink-4">
        {metric.label}
      </span>
      <span className="flex items-baseline gap-2">
        {metric.before && (
          <>
            <span className="mono-num reading-before text-[15px] text-ink-4">
              {metric.before}
            </span>
            <ArrowRight size={11} className="text-ink-4" />
          </>
        )}
        <span className={`mono-num text-[19px] font-semibold ${tone}`}>
          {metric.after}
        </span>
      </span>
      {metric.delta && (
        <span className="text-[13px] text-ink-4">{metric.delta}</span>
      )}
    </div>
  );
}

export function Tally({
  n,
  label,
  tone,
}: {
  n: number;
  label: string;
  tone: string;
}) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-lg border border-line bg-canvas/40 px-2.5 py-1.5">
      <span
        className={`mono-num text-[15px] font-semibold ${n === 0 ? "text-ink-4" : tone}`}
      >
        {n}
      </span>
      <span className="text-[11.5px] text-ink-4">{label}</span>
    </span>
  );
}
