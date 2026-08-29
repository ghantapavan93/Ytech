"use client";

import {
  CARRIED_ANNUAL,
  GAP,
  GROSS_ANNUAL,
} from "@/components/triage/screen-data";
import { EASE, D, MONO, T, grow, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: the number that approves the project and the number
 * the firm ends up with are on opposite sides of zero.
 *
 * Both bars start at the same zero and run in opposite directions, which is
 * the only honest way to draw two quantities that differ in sign. A chart
 * that put them side by side as heights would make this look like a matter
 * of degree.
 */

const ZERO = 150;
const TOP = 34;
const BOTTOM = 128;
const H = 22;

const money = (n: number) =>
  `${n < 0 ? "−" : "+"}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

export function ScreenFigure() {
  const reduced = useReducedMotion();
  const span = Math.max(GROSS_ANNUAL, Math.abs(CARRIED_ANNUAL));
  const scale = 250 / span;

  const grossW = GROSS_ANNUAL * scale;
  const carriedW = Math.abs(CARRIED_ANNUAL) * scale;

  return (
    <svg
      viewBox="0 0 440 200"
      className="h-auto w-full"
      role="img"
      aria-label={`The screen values this workflow at ${money(GROSS_ANNUAL)} a year. The same workflow returns ${money(CARRIED_ANNUAL)} once the operating model has taken its share. The two are ${money(GAP)} apart and on opposite sides of zero.`}
    >
      <text x={8} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        THE SAME WORKFLOW, VALUED TWICE, A YEAR
      </text>

      {/* Zero, which both bars start from and only one stays above. */}
      <line
        x1={ZERO}
        x2={ZERO}
        y1={TOP - 8}
        y2={BOTTOM + H + 8}
        stroke={D.trackLine}
        strokeWidth="1"
      />
      <text
        x={ZERO}
        y={BOTTOM + H + 20}
        fontSize={T.micro}
        fill={D.label}
        fontFamily={MONO}
        textAnchor="middle"
      >
        ZERO
      </text>

      <motion.g {...reveal(0.06, reduced)}>
        <text x={8} y={TOP - 4} fontSize={T.micro} fill={D.claim} fontFamily={MONO} fontWeight="700">
          WHAT THE SCREEN COUNTS
        </text>
        <motion.rect
          x={ZERO}
          y={TOP}
          height={H}
          rx="2"
          fill={D.claim}
          fillOpacity="0.3"
          stroke={D.claim}
          strokeWidth="1"
          {...grow(grossW, 0.14, reduced)}
        />
        <text
          x={ZERO + grossW + 8}
          y={TOP + 15}
          fontSize={T.body}
          fontWeight="700"
          fill={D.claim}
          fontFamily={MONO}
        >
          {money(GROSS_ANNUAL)}
        </text>
        <text x={8} y={TOP + 15} fontSize={T.micro} fill={D.label}>
          freed hours, priced
        </text>
      </motion.g>

      <motion.g {...reveal(0.22, reduced)}>
        <text x={8} y={BOTTOM - 4} fontSize={T.micro} fill={D.crit} fontFamily={MONO} fontWeight="700">
          WHAT THE FIRM IS LEFT WITH
        </text>
        <motion.rect
          y={BOTTOM}
          height={H}
          rx="2"
          fill={D.crit}
          fillOpacity="0.3"
          stroke={D.crit}
          strokeWidth="1"
          initial={reduced ? false : { width: 0, x: ZERO }}
          {...(reduced
            ? { animate: { width: carriedW, x: ZERO - carriedW } }
            : {
                whileInView: { width: carriedW, x: ZERO - carriedW },
                viewport: { once: true, margin: "-40px" },
                transition: { delay: 0.3, duration: 0.7, ease: EASE },
              })}
        />
        <text
          x={ZERO - carriedW - 8}
          y={BOTTOM + 15}
          fontSize={T.body}
          fontWeight="700"
          fill={D.crit}
          fontFamily={MONO}
          textAnchor="end"
        >
          {money(CARRIED_ANNUAL)}
        </text>
        <text x={8} y={BOTTOM + 15} fontSize={T.micro} fill={D.label}>
          after the operating model
        </text>
      </motion.g>

      <motion.g {...reveal(0.44, reduced)}>
        <line
          x1={ZERO - carriedW}
          x2={ZERO + grossW}
          y1={BOTTOM - 16}
          y2={BOTTOM - 16}
          stroke={D.value}
          strokeWidth="1"
          strokeOpacity="0.35"
          strokeDasharray="2 3"
        />
        <text
          x={ZERO + (grossW - carriedW) / 2}
          y={BOTTOM - 20}
          fontSize={T.micro}
          fill={D.value}
          fillOpacity="0.75"
          fontFamily={MONO}
          textAnchor="middle"
        >
          {money(GAP).replace("+", "")} APART
        </text>
      </motion.g>

      <text x={8} y={192} fontSize={T.micro} fill={D.label}>
        no build cost separates these two, because they differ in sign: a free agent still lands
        on the left of the line
      </text>
    </svg>
  );
}
