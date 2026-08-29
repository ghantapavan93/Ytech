"use client";

import {
  BEST,
  BEST_SIGNED,
  BEST_SIGNED_RANK,
  CONFIGURATIONS,
} from "@/lib/engines/configurations";
import { D, MONO, T, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: the top of this ranking is refused.
 *
 * Eighteen operating models, ordered by the number a dashboard would put on
 * the wall, coloured by what the instrument says about each. A reader
 * following the bars down from the best number reaches three refusals before
 * the first one it will sign. Nothing has to be read for that to land, which
 * is why it is a drawing rather than a table.
 */

/*
 * Sized so the two labels that carry the argument sit inside the first 344
 * viewBox units, which is all a 375px phone shows before the figure has to
 * be panned. A drawing whose headline number is in the part you have to
 * scroll to is a drawing that does not work.
 */
const LEFT = 92;
const TRACK = 150;
const ROW = 7.4;
const TOP = 26;

const money = (n: number) =>
  `${n < 0 ? "−" : "+"}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

export function RefusalFigure() {
  const reduced = useReducedMotion();
  // Domain from the data rather than symmetric around zero: the losses here
  // are a third of the size of the gains, and mirroring them threw away half
  // the track.
  const hi = Math.max(...CONFIGURATIONS.map((c) => c.position), 0);
  const lo = Math.min(...CONFIGURATIONS.map((c) => c.position), 0);
  const span = hi - lo;
  const width = (v: number) => (Math.abs(v) / span) * TRACK;
  const zero = LEFT + (-lo / span) * TRACK;

  const y = (i: number) => TOP + i * ROW;
  const bestY = y(0);
  const signedY = y(BEST_SIGNED_RANK - 1);

  return (
    <svg
      viewBox={`0 0 440 ${TOP + CONFIGURATIONS.length * ROW + 34}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Eighteen operating models ranked by monthly position. The best is ${money(BEST.position)} and the instrument refuses it. The first one it will sign is ranked ${BEST_SIGNED_RANK} at ${money(BEST_SIGNED.position)}.`}
    >
      <text x={8} y={11} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        EVERY OPERATING MODEL, BEST MONTHLY NUMBER FIRST
      </text>

      <line
        x1={zero}
        x2={zero}
        y1={TOP - 4}
        y2={y(CONFIGURATIONS.length) + 1}
        stroke={D.trackLine}
        strokeWidth="0.75"
      />

      {CONFIGURATIONS.map((c, i) => {
        const tone = c.signed
          ? D.ok
          : c.out.recommendation === "REDESIGN_BEFORE_PILOT"
            ? D.warn
            : D.crit;
        const w = width(c.position);
        const negative = c.position < 0;
        return (
          <motion.g key={c.label} {...reveal(0.04 + i * 0.022, reduced)}>
            <motion.rect
              y={y(i)}
              height={5}
              rx="1"
              fill={tone}
              fillOpacity={c.signed ? 0.55 : 0.26}
              stroke={tone}
              strokeWidth="0.75"
              initial={reduced ? false : { width: 0, x: zero }}
              {...(reduced
                ? { animate: { width: w, x: negative ? zero - w : zero } }
                : {
                    whileInView: { width: w, x: negative ? zero - w : zero },
                    viewport: { once: true, margin: "-40px" },
                    transition: {
                      delay: 0.1 + i * 0.022,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  })}
            />
          </motion.g>
        );
      })}

      {/* Only the two rows that carry the argument are named. */}
      <motion.g {...reveal(0.5, reduced)}>
        <text
          x={LEFT - 8}
          y={bestY + 5}
          fontSize={T.micro}
          fill={D.crit}
          fontFamily={MONO}
          fontWeight="700"
          textAnchor="end"
        >
          BEST NUMBER
        </text>
        <text
          x={zero + width(BEST.position) + 6}
          y={bestY + 5}
          fontSize={T.micro}
          fill={D.crit}
          fontFamily={MONO}
        >
          {money(BEST.position)} · REFUSED
        </text>

        <text
          x={LEFT - 8}
          y={signedY + 5}
          fontSize={T.micro}
          fill={D.ok}
          fontFamily={MONO}
          fontWeight="700"
          textAnchor="end"
        >
          IT WILL SIGN
        </text>
        <text
          x={zero + width(BEST_SIGNED.position) + 6}
          y={signedY + 5}
          fontSize={T.micro}
          fill={D.ok}
          fontFamily={MONO}
        >
          {money(BEST_SIGNED.position)} · No. {BEST_SIGNED_RANK}
        </text>

        {/* The distance between the two, which is what refusing costs. */}
        <path
          d={`M${LEFT - 74},${bestY + 7} L${LEFT - 78},${bestY + 7} L${LEFT - 78},${signedY + 2} L${LEFT - 74},${signedY + 2}`}
          fill="none"
          stroke={D.value}
          strokeOpacity="0.4"
          strokeWidth="0.75"
        />
      </motion.g>

      <text
        x={8}
        y={TOP + CONFIGURATIONS.length * ROW + 16}
        fontSize={T.micro}
        fill={D.label}
      >
        red is refused outright, amber needs a condition changed first, green is signable: the
      </text>
      <text
        x={8}
        y={TOP + CONFIGURATIONS.length * ROW + 26}
        fontSize={T.micro}
        fill={D.label}
      >
        three best months on this chart are all ones the instrument will not put its name to
      </text>
    </svg>
  );
}
