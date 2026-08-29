"use client";

import type { Layer } from "@/lib/engines/progress-engine";
import { D, MONO, T, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: a claim inherits the weakest evidence beneath it.
 *
 * Seven links descending. The lit rail on the left is how far the evidence
 * actually carries, and it stops at the first link nobody measured. Below
 * that break the rail is drawn faint, because those links may well be fine
 * and none of them can be relied on.
 */

const TONE = {
  proven: D.ok,
  adverse: D.crit,
  unknown: D.warn,
} as const;

const WORD = {
  proven: "measured, holds",
  adverse: "measured, against you",
  unknown: "never measured",
} as const;

const ROW = 30;
const TOP = 22;

export function ChainFigure({ layers }: { layers: Layer[] }) {
  const reduced = useReducedMotion();
  const firstGap = layers.findIndex((l) => l.state === "unknown");
  const carries = firstGap === -1 ? layers.length : firstGap;
  const height = TOP + layers.length * ROW + 14;

  return (
    <svg
      viewBox={`0 0 440 ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Evidence chain of ${layers.length} links. The evidence carries to link ${carries} of ${layers.length}.`}
    >
      <text x={26} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        THE CHAIN, TOP TO BOTTOM
      </text>
      <text x={434} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO} textAnchor="end">
        CARRIES TO {carries} OF {layers.length}
      </text>

      {/* the rail: lit as far as the evidence goes, faint after */}
      <line x1={12} x2={12} y1={TOP} y2={TOP + carries * ROW} stroke={D.value} strokeWidth="2.5" />
      {carries < layers.length && (
        <line
          x1={12}
          x2={12}
          y1={TOP + carries * ROW}
          y2={TOP + layers.length * ROW}
          stroke={D.warn}
          strokeOpacity="0.28"
          strokeWidth="2.5"
          strokeDasharray="3 4"
        />
      )}

      {layers.map((layer, i) => {
        const y = TOP + i * ROW;
        const tone = TONE[layer.state];
        const ghost = layer.state === "unknown";
        return (
          <motion.g key={layer.id} {...reveal(0.06 + i * 0.07, reduced)}>
            <rect
              x={26}
              y={y + 3}
              width={408}
              height={ROW - 8}
              rx="2"
              fill={tone}
              fillOpacity={ghost ? 0.05 : 0.1}
              stroke={tone}
              strokeOpacity={ghost ? 0.5 : 0.65}
              strokeWidth="0.75"
              strokeDasharray={ghost ? "4 3" : undefined}
            />
            <circle cx={12} cy={y + ROW / 2 - 1} r="3.6" fill={tone} />
            <text x={36} y={y + ROW / 2 + 2} fontSize={T.body} fill={D.value} fontWeight="600">
              {layer.name}
            </text>
            <text x={196} y={y + ROW / 2 + 2} fontSize={T.body} fill={tone} fontFamily={MONO}>
              {layer.metric.before ? `${layer.metric.before} → ` : ""}
              {layer.metric.after}
            </text>
            <text
              x={428}
              y={y + ROW / 2 + 2}
              fontSize={T.micro}
              fill={D.label}
              textAnchor="end"
              fontFamily={MONO}
            >
              {WORD[layer.state].toUpperCase()}
            </text>
          </motion.g>
        );
      })}

      <text x={26} y={height - 3} fontSize={T.micro} fill={D.label}>
        an unmeasured link does not pass, it blocks
      </text>
    </svg>
  );
}
