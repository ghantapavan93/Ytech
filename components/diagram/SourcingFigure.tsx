"use client";

import { OPERATING_SWING } from "@/components/sourcing/sourcing-data";
import { D, MONO, T, grow, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: the two decisions are not the same size.
 *
 * Both bars are drawn on one scale, which is the only thing that makes this
 * a figure rather than two numbers. Given separate axes they would look
 * comparable, and the whole point is that they are not. The short bar is the
 * one that gets the meeting.
 *
 * This is not an argument that sourcing does not matter. It is an argument
 * that cost is the wrong instrument for it, which the page says in words
 * directly underneath.
 */

/*
 * Sized so the value labels land inside the first 344 viewBox units, which
 * is all a 375px phone shows before the figure has to be panned. The first
 * pass put the $31,290 at x=374, which is to say it put the number the whole
 * figure is about in the part you have to scroll to.
 */
const LEFT = 96;
const TRACK = 180;
const money = (n: number) =>
  `$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

export function SourcingFigure({ gap }: { gap: number }) {
  const reduced = useReducedMotion();
  const span = Math.max(OPERATING_SWING, gap, 1);
  const w = (v: number) => Math.max((v / span) * TRACK, 2);

  const pct = (gap / OPERATING_SWING) * 100;

  return (
    <svg
      viewBox="0 0 440 132"
      className="h-auto w-full"
      role="img"
      aria-label={`Changing the operating model is worth ${money(OPERATING_SWING)} a month. Choosing between building and buying is worth ${money(gap)}, which is ${pct.toFixed(1)} percent of it.`}
    >
      <text x={8} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        WHAT EACH DECISION IS WORTH, A MONTH, ON ONE SCALE
      </text>

      <motion.g {...reveal(0.06, reduced)}>
        <text
          x={LEFT - 8}
          y={38}
          fontSize={T.micro}
          fill={D.ok}
          fontFamily={MONO}
          fontWeight="700"
          textAnchor="end"
        >
          THE OPERATING MODEL
        </text>
        <motion.rect
          x={LEFT}
          y={28}
          height={14}
          rx="2"
          fill={D.ok}
          fillOpacity="0.28"
          stroke={D.ok}
          strokeWidth="1"
          {...grow(w(OPERATING_SWING), 0.14, reduced)}
        />
        <text
          x={LEFT + w(OPERATING_SWING) + 8}
          y={38}
          fontSize={T.body}
          fontWeight="700"
          fill={D.ok}
          fontFamily={MONO}
        >
          {money(OPERATING_SWING)}
        </text>
        <text x={8} y={52} fontSize={T.micro} fill={D.label}>
          fee model, routing, review gate, practice floor
        </text>
      </motion.g>

      <motion.g {...reveal(0.24, reduced)}>
        <text
          x={LEFT - 8}
          y={82}
          fontSize={T.micro}
          fill={D.claim}
          fontFamily={MONO}
          fontWeight="700"
          textAnchor="end"
        >
          BUILD IT OR BUY IT
        </text>
        <motion.rect
          x={LEFT}
          y={72}
          height={14}
          rx="2"
          fill={D.claim}
          fillOpacity="0.28"
          stroke={D.claim}
          strokeWidth="1"
          {...grow(w(gap), 0.32, reduced)}
        />
        <text
          x={LEFT + w(gap) + 8}
          y={82}
          fontSize={T.body}
          fontWeight="700"
          fill={D.claim}
          fontFamily={MONO}
        >
          {money(gap)}
          <tspan fill={D.label} fontWeight="400">
            {"  "}
            {pct < 0.1 ? "under 0.1" : pct.toFixed(1)}% of it
          </tspan>
        </text>
        <text x={8} y={96} fontSize={T.micro} fill={D.label}>
          one line of the cost side, and nothing on the value side
        </text>
      </motion.g>

      <text x={8} y={120} fontSize={T.micro} fill={D.label}>
        the short bar is the one that gets the meeting, which is the argument for deciding
      </text>
      <text x={8} y={129} fontSize={T.micro} fill={D.label}>
        it on what it does to the firm rather than on what it costs
      </text>
    </svg>
  );
}
