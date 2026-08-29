"use client";

import { D, MONO, T, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: surviving a review is not the same as being right.
 *
 * Every idea that entered the teardown, drawn where it ended. The fallen are
 * kept rather than deleted, because the reasons they failed are the reasons
 * the survivor is shaped the way it is. The survivor is deliberately only a
 * little taller than the rest.
 */

export interface Concept {
  label: string;
  verdict: string;
  survived: boolean;
}

const BASE = 118;
const TOP = 30;

export function SurvivorFigure({ concepts }: { concepts: Concept[] }) {
  const reduced = useReducedMotion();
  const slot = 424 / concepts.length;
  const survivors = concepts.filter((c) => c.survived).length;

  return (
    <svg
      viewBox="0 0 440 172"
      className="h-auto w-full"
      role="img"
      aria-label={`${concepts.length} concepts entered the review, ${survivors} still standing.`}
    >
      <text x={8} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        EVERY CONCEPT THAT ENTERED THE TEARDOWN
      </text>
      <text x={432} y={12} fontSize={T.label} fill={D.ok} fontFamily={MONO} textAnchor="end">
        {survivors} STILL STANDING
      </text>

      <line x1={8} x2={432} y1={BASE} y2={BASE} stroke={D.trackLine} strokeWidth="1" />

      {concepts.map((c, i) => {
        const x = 8 + i * slot + slot / 2;
        const w = Math.min(slot - 10, 42);
        const tone = c.survived ? D.ok : D.dim;
        return (
          <motion.g key={c.label} {...reveal(0.06 + i * 0.08, reduced)}>
            {c.survived ? (
              <rect
                x={x - w / 2}
                y={TOP}
                width={w}
                height={BASE - TOP}
                rx="2"
                fill={tone}
                fillOpacity="0.22"
                stroke={tone}
                strokeWidth="1"
              />
            ) : (
              // Laid on its side, where it fell.
              <rect
                x={x - w / 2}
                y={BASE - 14}
                width={w}
                height={12}
                rx="2"
                fill="transparent"
                stroke={tone}
                strokeWidth="1"
                strokeDasharray="4 3"
              />
            )}
            <text
              x={x}
              y={c.survived ? TOP - 6 : BASE - 20}
              fontSize={T.micro}
              fill={c.survived ? D.ok : D.label}
              textAnchor="middle"
              fontFamily={MONO}
            >
              {c.verdict.toUpperCase()}
            </text>
            <text
              x={x}
              y={BASE + 14}
              fontSize={T.micro}
              fill={c.survived ? D.value : D.label}
              textAnchor="middle"
            >
              {c.label.length > 16 ? `${c.label.slice(0, 15)}…` : c.label}
            </text>
          </motion.g>
        );
      })}

      <text x={8} y={164} fontSize={T.micro} fill={D.label}>
        the fallen are kept because their reasons shaped the one that stands
      </text>
    </svg>
  );
}
