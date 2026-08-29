"use client";

import type { TriageResult, Verdict } from "@/lib/engines/triage-engine";
import { D, MONO, T, grow, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: the biggest workflow is usually not the one to test.
 *
 * Bars are hours a month, so size is honest and comparable. Colour is the
 * verdict, so the eye lands on the mismatch: the longest bar on the chart is
 * not the one marked ready. That mismatch is the entire reason a triage step
 * exists, and a chart that only ranked by size would hide it.
 */

const TONE: Record<Verdict, string> = {
  test: D.ok,
  "redesign-first": D.warn,
  "not-yet": D.live,
  leave: D.dim,
};

const SHORT: Record<Verdict, string> = {
  test: "TEST",
  "redesign-first": "REDESIGN FIRST",
  "not-yet": "CANNOT JUDGE",
  leave: "LEAVE",
};

const LEFT = 8;
const TRACK = 250;
const ROW = 30;
const TOP = 24;

export function TriageFigure({ results }: { results: TriageResult[] }) {
  const reduced = useReducedMotion();
  const max = Math.max(...results.map((r) => r.exposureHours), 1);
  const height = TOP + results.length * ROW + 18;

  return (
    <svg
      viewBox={`0 0 440 ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={results
        .map((r) => `${r.candidate.name}, ${Math.round(r.exposureHours)} hours a month, ${SHORT[r.verdict]}`)
        .join(". ")}
    >
      <text x={LEFT} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        HOURS A MONTH, AND WHAT TO DO ABOUT THEM
      </text>

      {results.map((r, i) => {
        const y = TOP + i * ROW;
        const tone = TONE[r.verdict];
        const w = Math.max((r.exposureHours / max) * TRACK, 3);
        return (
          <motion.g key={r.candidate.id} {...reveal(0.06 + i * 0.08, reduced)}>
            <motion.rect
              x={LEFT}
              y={y + 4}
              height={16}
              rx="2"
              fill={tone}
              fillOpacity="0.28"
              stroke={tone}
              strokeWidth="1"
              {...grow(w, 0.14 + i * 0.08, reduced)}
            />
            <text
              x={LEFT + 6}
              y={y + 16}
              fontSize={T.body}
              fontWeight="700"
              fill={tone}
              fontFamily={MONO}
            >
              {Math.round(r.exposureHours)}h
            </text>
            <text x={LEFT + TRACK + 10} y={y + 11} fontSize={T.micro} fill={tone} fontFamily={MONO}>
              {SHORT[r.verdict]}
            </text>
            <text x={LEFT + TRACK + 10} y={y + 21} fontSize={T.micro} fill={D.label}>
              {r.candidate.name.length > 30
                ? `${r.candidate.name.slice(0, 29)}…`
                : r.candidate.name}
            </text>
          </motion.g>
        );
      })}

      <text x={LEFT} y={height - 4} fontSize={T.micro} fill={D.label}>
        the longest bar is not the one marked ready, which is the whole point of asking first
      </text>
    </svg>
  );
}
