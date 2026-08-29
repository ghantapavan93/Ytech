"use client";

import { D, MONO, T, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: a refusal is a category, not a weaker answer.
 *
 * The jobs the agent runs sit inside the frame. The calls it hands back sit
 * outside it, rather than dimmed inside, because the frame is the product. A
 * tool that quietly moved a red item in would be a worse tool wearing the
 * same name.
 */

const FRAME_X = 96;
const FRAME_W = 250;
const FRAME_Y = 30;

export function BoundaryFigure({
  plays,
  refusals,
}: {
  plays: string[];
  refusals: string[];
}) {
  const reduced = useReducedMotion();
  const rowH = 22;
  const frameH = plays.length * rowH + 16;
  const height = Math.max(frameH + FRAME_Y + 34, refusals.length * rowH + 76);

  return (
    <svg
      viewBox={`0 0 440 ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Inside the boundary: ${plays.join(", ")}. Outside it, refused on every run: ${refusals.join(", ")}.`}
    >
      <text x={FRAME_X} y={14} fontSize={T.label} fill={D.ok} fontFamily={MONO}>
        IT RUNS THESE ON ITS OWN
      </text>
      <text x={434} y={14} fontSize={T.label} fill={D.crit} fontFamily={MONO} textAnchor="end">
        IT HANDS THESE BACK, EVERY RUN
      </text>

      <motion.rect
        x={FRAME_X}
        y={FRAME_Y}
        width={FRAME_W}
        height={frameH}
        rx="4"
        fill={D.live}
        fillOpacity="0.04"
        stroke={D.live}
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeDasharray="5 4"
        {...reveal(0.05, reduced)}
      />

      {plays.map((p, i) => (
        <motion.g key={p} {...reveal(0.12 + i * 0.07, reduced)}>
          <rect
            x={FRAME_X + 10}
            y={FRAME_Y + 8 + i * rowH}
            width={FRAME_W - 20}
            height={rowH - 6}
            rx="2"
            fill={D.ok}
            fillOpacity="0.14"
            stroke={D.ok}
            strokeOpacity="0.6"
            strokeWidth="0.75"
          />
          <text
            x={FRAME_X + 18}
            y={FRAME_Y + 8 + i * rowH + 11}
            fontSize={T.micro}
            fill={D.value}
          >
            {p}
          </text>
        </motion.g>
      ))}

      {refusals.map((r, i) => (
        <motion.g key={r} {...reveal(0.4 + i * 0.07, reduced)}>
          <rect
            x={FRAME_X + FRAME_W + 14}
            y={FRAME_Y + 8 + i * rowH}
            width={72}
            height={rowH - 6}
            rx="2"
            fill={D.crit}
            fillOpacity="0.12"
            stroke={D.crit}
            strokeOpacity="0.55"
            strokeWidth="0.75"
          />
          <text
            x={FRAME_X + FRAME_W + 20}
            y={FRAME_Y + 8 + i * rowH + 11}
            fontSize={T.micro}
            fill={D.crit}
          >
            {r}
          </text>
        </motion.g>
      ))}

      <text x={FRAME_X} y={height - 6} fontSize={T.micro} fill={D.label}>
        the frame is the product · no model in the decision path
      </text>
    </svg>
  );
}
