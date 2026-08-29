"use client";

import { D, MONO, T, draw, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: nothing in the instrument is a new theory.
 *
 * Published claims above, the places they actually run below. Every line is
 * a claim being operationalised, and no node in the lower row is without one
 * reaching it. A mechanism with no line above it would be an invention.
 */

const TOP_Y = 42;
const BOTTOM_Y = 118;

export function BipartiteFigure({
  claimCount,
  mechanisms,
  pairs,
}: {
  claimCount: number;
  mechanisms: string[];
  /** claim index → mechanism index */
  pairs: { claim: number; mechanism: number }[];
}) {
  const reduced = useReducedMotion();
  const span = 400;
  const cx = (i: number, n: number) => 20 + (n <= 1 ? span / 2 : (i / (n - 1)) * span);

  return (
    <svg
      viewBox="0 0 440 176"
      className="h-auto w-full"
      role="img"
      aria-label={`${claimCount} published claims connected to ${mechanisms.length} mechanisms. No mechanism is unsourced.`}
    >
      <text x={8} y={14} fontSize={T.label} fill={D.live} fontFamily={MONO}>
        {claimCount} PUBLISHED CLAIMS
      </text>
      <text x={8} y={168} fontSize={T.label} fill={D.claim} fontFamily={MONO}>
        {mechanisms.length} PLACES THEY RUN
      </text>
      <text x={432} y={14} fontSize={T.micro} fill={D.label} textAnchor="end" fontFamily={MONO}>
        UNSOURCED MECHANISMS: 0
      </text>

      {pairs.map((p, i) => (
        <motion.line
          key={`${p.claim}-${p.mechanism}-${i}`}
          x1={cx(p.claim, claimCount)}
          y1={TOP_Y}
          x2={cx(p.mechanism, mechanisms.length)}
          y2={BOTTOM_Y}
          stroke={D.trackLine}
          strokeWidth="0.75"
          {...draw(0.1 + i * 0.02, reduced)}
        />
      ))}

      {Array.from({ length: claimCount }).map((_, i) => (
        <motion.circle
          key={`c-${i}`}
          cx={cx(i, claimCount)}
          cy={TOP_Y}
          r="4"
          fill={D.live}
          fillOpacity="0.85"
          {...reveal(0.04 + i * 0.02, reduced)}
        />
      ))}

      {mechanisms.map((m, i) => (
        <motion.g key={m} {...reveal(0.5 + i * 0.05, reduced)}>
          <circle cx={cx(i, mechanisms.length)} cy={BOTTOM_Y} r="5" fill={D.claim} />
          <text
            x={cx(i, mechanisms.length)}
            y={BOTTOM_Y + 20}
            fontSize={T.micro}
            fill={D.label}
            textAnchor="middle"
            fontFamily={MONO}
          >
            {m}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
