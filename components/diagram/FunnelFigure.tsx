"use client";

import { D, MONO, T, grow, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: almost nothing survives to the bottom rung.
 *
 * Four stages descending, each drawn against the width it would have had if
 * nothing were lost. The gap between the solid bar and its dashed track is
 * evidence that never arrived, which is the part a count alone hides.
 */

export interface FunnelStage {
  label: string;
  count: number;
  meaning: string;
  color: string;
}

const LEFT = 92;
const TRACK = 268;
const ROW = 38;
const TOP = 24;

export function FunnelFigure({ stages }: { stages: FunnelStage[] }) {
  const reduced = useReducedMotion();
  const entering = Math.max(...stages.map((s) => s.count), 1);
  const height = TOP + stages.length * ROW + 16;

  return (
    <svg
      viewBox={`0 0 440 ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={stages.map((s) => `${s.label} ${s.count}`).join(", ")}
    >
      <text x={8} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        THE EVIDENCE LADDER
      </text>
      <text x={434} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO} textAnchor="end">
        DASHED = WHAT IT COULD HAVE CARRIED
      </text>

      {stages.map((s, i) => {
        const y = TOP + i * ROW;
        const w = Math.max((s.count / entering) * TRACK, 3);
        return (
          <motion.g key={s.label} {...reveal(0.08 + i * 0.1, reduced)}>
            <text
              x={84}
              y={y + 16}
              fontSize={T.body}
              fill={s.color}
              fontWeight="600"
              textAnchor="end"
              fontFamily={MONO}
            >
              {s.label.toUpperCase()}
            </text>

            <rect
              x={LEFT}
              y={y + 4}
              width={TRACK}
              height={20}
              rx="2"
              fill={D.track}
              stroke={D.trackLine}
              strokeDasharray="3 3"
              strokeWidth="0.75"
            />
            <motion.rect
              x={LEFT}
              y={y + 4}
              height={20}
              rx="2"
              fill={s.color}
              fillOpacity="0.3"
              stroke={s.color}
              strokeWidth="1"
              {...grow(w, 0.18 + i * 0.1, reduced)}
            />
            <text
              x={LEFT + 8}
              y={y + 18}
              fontSize={T.figure}
              fontWeight="700"
              fill={s.color}
              fontFamily={MONO}
            >
              {s.count}
            </text>
            <text x={LEFT + TRACK + 8} y={y + 18} fontSize={T.micro} fill={D.label}>
              {s.meaning}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
