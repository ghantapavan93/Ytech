"use client";

import { CURVES } from "@/components/demand/demand-data";
import { D, MONO, T, draw, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: the market moves you along a line, the fee model
 * decides which line you are on.
 *
 * Both relationships are straight, and the two lines come out parallel,
 * which is the finding rather than a coincidence of drawing. A redeployed
 * hour bills at the junior rate however the packages are priced, so a
 * thinning market costs an hourly firm and a fixed-fee firm exactly the same
 * amount. Neither line crosses the other and neither crosses zero. No
 * market this firm can be handed turns the hourly result positive, and none
 * turns the fixed-fee result negative.
 */

const LEFT = 58;
const RIGHT = 404;
const TOP = 34;
const BOTTOM = 150;

const money = (n: number) =>
  `${n < 0 ? "−" : "+"}$${Math.abs(Math.round(n / 1000))}k`;

export function DemandFigure({ absorption }: { absorption: number }) {
  const reduced = useReducedMotion();

  const values = CURVES.flatMap((c) => c.points.map((p) => p.position));
  const lo = Math.min(...values, 0);
  const hi = Math.max(...values, 0);
  const pad = (hi - lo) * 0.12;

  const x = (a: number) => LEFT + a * (RIGHT - LEFT);
  const y = (v: number) =>
    BOTTOM - ((v - (lo - pad)) / (hi - lo + pad * 2)) * (BOTTOM - TOP);

  const zero = y(0);
  const marker = x(absorption);

  return (
    <svg
      viewBox="0 0 440 200"
      className="h-auto w-full"
      role="img"
      aria-label={CURVES.map(
        (c) =>
          `${c.name}: ${money(c.points[0].position)} a month with no freed hour finding work, ${money(c.points[c.points.length - 1].position)} with every freed hour finding work.`,
      ).join(" ")}
    >
      <text x={8} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        MONTHLY POSITION AGAINST THE FIRM BEFORE THE AGENT
      </text>

      {/* The line the whole page is measured against. */}
      <motion.g {...reveal(0.05, reduced)}>
        <line
          x1={LEFT}
          x2={RIGHT}
          y1={zero}
          y2={zero}
          stroke={D.trackLine}
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text x={8} y={zero + 3} fontSize={T.micro} fill={D.label} fontFamily={MONO}>
          NO CHANGE
        </text>
      </motion.g>

      {CURVES.map((c, i) => {
        const tone = c.id === "FIXED_FEE" ? D.ok : D.crit;
        const path = c.points
          .map((p, j) => `${j === 0 ? "M" : "L"}${x(p.absorption).toFixed(1)},${y(p.position).toFixed(1)}`)
          .join(" ");
        const first = c.points[0];
        const last = c.points[c.points.length - 1];
        const above = c.id === "FIXED_FEE";
        return (
          <motion.g key={c.id} {...reveal(0.12 + i * 0.1, reduced)}>
            <motion.path
              d={path}
              fill="none"
              stroke={tone}
              strokeWidth="2"
              strokeLinecap="round"
              {...draw(0.2 + i * 0.12, reduced)}
            />
            <text
              x={LEFT + 8}
              y={y(first.position) + (above ? -8 : 15)}
              fontSize={T.micro}
              fill={tone}
              fontFamily={MONO}
              fontWeight="700"
            >
              {c.short}
            </text>
            <text
              x={LEFT - 4}
              y={y(first.position) + 3}
              fontSize={T.micro}
              fill={tone}
              fontFamily={MONO}
              textAnchor="end"
            >
              {money(first.position)}
            </text>
            <text
              x={RIGHT + 4}
              y={y(last.position) + 3}
              fontSize={T.micro}
              fill={tone}
              fontFamily={MONO}
            >
              {money(last.position)}
            </text>
          </motion.g>
        );
      })}

      {/* Where the reader has set the market. */}
      <motion.g {...reveal(0.4, reduced)}>
        <line
          x1={marker}
          x2={marker}
          y1={TOP - 6}
          y2={BOTTOM + 6}
          stroke={D.value}
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        {CURVES.map((c) => {
          const v = c.points.reduce((best, p) =>
            Math.abs(p.absorption - absorption) < Math.abs(best.absorption - absorption) ? p : best,
          );
          return (
            <circle
              key={c.id}
              cx={marker}
              cy={y(v.position)}
              r="3"
              fill={c.id === "FIXED_FEE" ? D.ok : D.crit}
              stroke="#0b0c10"
              strokeWidth="1.2"
            />
          );
        })}
      </motion.g>

      <text x={LEFT} y={BOTTOM + 22} fontSize={T.micro} fill={D.label} fontFamily={MONO}>
        NONE OF THE FREED HOURS SELL
      </text>
      <text
        x={RIGHT}
        y={BOTTOM + 22}
        fontSize={T.micro}
        fill={D.label}
        fontFamily={MONO}
        textAnchor="end"
      >
        ALL OF THEM DO
      </text>

      <text x={8} y={192} fontSize={T.micro} fill={D.label}>
        the lines are parallel: a thinner market costs both fee models the same amount, and
        neither one of them ever crosses over to the other side of no change
      </text>
    </svg>
  );
}
