"use client";

/**
 * The value load path, drawn.
 *
 * This replaces a WebGL version of the same idea. The 3D scene was correct
 * and hard to read, and the reason was structural rather than a matter of
 * polish: a canvas cannot carry text without a lot of extra machinery, so
 * every label had to live in a strip underneath the picture. A reader had to
 * hold the drawing and its legend in their head at the same time.
 *
 * Here the labels are inside the drawing. Each member states its own hours,
 * the review column carries its own capacity line, and the whole figure is
 * readable standing still. The viewBox is fixed, so the composition is
 * authored rather than negotiated with a camera.
 *
 * Reduced motion renders the finished state, not a frozen first frame.
 */

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const C = {
  claim: "#cdf94a",
  ok: "#10b981",
  warn: "#f59e0b",
  crit: "#f43f5e",
  track: "rgba(255,255,255,0.07)",
  trackLine: "rgba(255,255,255,0.16)",
  label: "rgba(255,255,255,0.42)",
  value: "rgba(255,255,255,0.92)",
};

const MONO = "var(--font-geist-mono), ui-monospace, monospace";

export interface LoadPathFigureData {
  releasedHours: number;
  redeployedHours: number;
  unusedHours: number;
  peHoursPerWeek: number;
  peSustainablePerWeek: number;
  practiceRetained: number;
  keepsTheSaving: boolean;
}

const FLOW_X = 18;
const FLOW_W = 268;
const BAR_H = 26;

export function LoadPathFigure({ data }: { data: LoadPathFigureData }) {
  const reduced = useReducedMotion();
  const {
    releasedHours,
    redeployedHours,
    unusedHours,
    peHoursPerWeek,
    peSustainablePerWeek,
    practiceRetained,
    keepsTheSaving,
  } = data;

  const scale = Math.max(releasedHours, 1);
  const carriedW = (redeployedHours / scale) * FLOW_W;
  const lostW = (unusedHours / scale) * FLOW_W;
  const arrived = keepsTheSaving ? redeployedHours : 0;
  const arrivedW = (arrived / scale) * FLOW_W;

  const overload = peHoursPerWeek / peSustainablePerWeek;
  const reviewTone = overload > 1.3 ? C.crit : overload > 1.02 ? C.warn : C.ok;
  // The bow is the overload, so a member inside capacity is drawn straight.
  const bow = Math.min(Math.max(overload - 1, 0), 1.5) * 34;

  const h = (n: number) => `${Math.round(n)}h`;
  const reveal = (delay: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 6 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { delay, duration: 0.5, ease: EASE },
        };

  const grow = (w: number, delay: number) =>
    reduced
      ? { initial: false as const, animate: { width: w } }
      : {
          initial: { width: 0 },
          whileInView: { width: w },
          viewport: { once: true, margin: "-40px" },
          transition: { delay, duration: 0.7, ease: EASE },
        };

  return (
    <svg
      viewBox="0 0 440 232"
      className="h-auto w-full"
      role="img"
      aria-label={`Load path. ${h(releasedHours)} released, ${h(redeployedHours)} carried to backlog, ${h(unusedHours)} run to ground, ${h(arrived)} reached business value. Licensed review at ${peHoursPerWeek.toFixed(1)} hours a week against ${peSustainablePerWeek} sustainable.`}
    >
      {/* ── the released load ─────────────────────────────────────────── */}
      <motion.g {...reveal(0.05)}>
        <text x={FLOW_X} y={12} fontSize="8" fill={C.label} fontFamily={MONO}>
          RELEASED CAPACITY
        </text>
        <rect
          x={FLOW_X}
          y={18}
          width={FLOW_W}
          height={BAR_H}
          rx="2"
          fill={C.claim}
          fillOpacity="0.22"
          stroke={C.claim}
          strokeWidth="1"
        />
        <text
          x={FLOW_X + 8}
          y={36}
          fontSize="13"
          fontWeight="600"
          fill={C.claim}
          fontFamily={MONO}
        >
          {h(releasedHours)}
        </text>
        <text x={FLOW_X + FLOW_W - 6} y={36} fontSize="8" fill={C.label} textAnchor="end">
          a month, freed by the agent
        </text>
      </motion.g>

      {/* ── the split: carried, and run to ground ─────────────────────── */}
      <text x={FLOW_X} y={62} fontSize="8" fill={C.label} fontFamily={MONO}>
        WHERE IT GOES
      </text>
      <rect
        x={FLOW_X}
        y={68}
        width={FLOW_W}
        height={BAR_H}
        rx="2"
        fill={C.track}
        stroke={C.trackLine}
        strokeDasharray="3 3"
        strokeWidth="0.75"
      />
      <motion.rect
        x={FLOW_X}
        y={68}
        height={BAR_H}
        rx="2"
        fill={C.ok}
        fillOpacity="0.3"
        stroke={C.ok}
        strokeWidth="1"
        {...grow(carriedW, 0.25)}
      />
      <motion.rect
        y={68}
        height={BAR_H}
        rx="2"
        fill="rgba(255,255,255,0.05)"
        stroke={C.trackLine}
        strokeWidth="1"
        x={FLOW_X + carriedW}
        {...grow(lostW, 0.35)}
      />
      <motion.g {...reveal(0.5)}>
        {carriedW > 42 && (
          <text x={FLOW_X + 7} y={85} fontSize="10" fontWeight="600" fill={C.ok} fontFamily={MONO}>
            {h(redeployedHours)} carried
          </text>
        )}
        {lostW > 52 && (
          <text
            x={FLOW_X + carriedW + 7}
            y={85}
            fontSize="10"
            fontWeight="600"
            fill={C.label}
            fontFamily={MONO}
          >
            {h(unusedHours)} to ground
          </text>
        )}
      </motion.g>

      {/* ── the fee gate ──────────────────────────────────────────────── */}
      <motion.g {...reveal(0.6)}>
        <text x={FLOW_X} y={112} fontSize="8" fill={C.label} fontFamily={MONO}>
          FEE GATE
        </text>
        <rect
          x={FLOW_X}
          y={118}
          width={FLOW_W}
          height={20}
          rx="2"
          fill={keepsTheSaving ? C.ok : C.crit}
          fillOpacity="0.14"
          stroke={keepsTheSaving ? C.ok : C.crit}
          strokeWidth="1"
          strokeDasharray={keepsTheSaving ? undefined : "4 3"}
        />
        <text
          x={FLOW_X + 8}
          y={132}
          fontSize="9"
          fill={keepsTheSaving ? C.ok : C.crit}
          fontFamily={MONO}
        >
          {keepsTheSaving
            ? "FIXED FEE · the firm keeps what it saves"
            : "HOURLY · an hour not billed is an hour the client keeps"}
        </text>
      </motion.g>

      {/* ── what actually arrived ─────────────────────────────────────── */}
      <text x={FLOW_X} y={162} fontSize="8" fill={C.label} fontFamily={MONO}>
        REACHED BUSINESS VALUE
      </text>
      <rect
        x={FLOW_X}
        y={168}
        width={FLOW_W}
        height={BAR_H + 4}
        rx="2"
        fill={C.track}
        stroke={C.trackLine}
        strokeDasharray="3 3"
        strokeWidth="0.75"
      />
      <motion.rect
        x={FLOW_X}
        y={168}
        height={BAR_H + 4}
        rx="2"
        fill={arrivedW > 2 ? C.ok : C.crit}
        fillOpacity="0.34"
        stroke={arrivedW > 2 ? C.ok : C.crit}
        strokeWidth="1"
        {...grow(Math.max(arrivedW, 2), 0.75)}
      />
      <motion.text
        x={arrivedW > 60 ? FLOW_X + 8 : FLOW_X + 12}
        y={188}
        fontSize="14"
        fontWeight="700"
        fill={arrivedW > 60 ? C.ok : C.crit}
        fontFamily={MONO}
        {...reveal(0.95)}
      >
        {h(arrived)}
      </motion.text>
      <motion.text
        x={FLOW_X}
        y={210}
        fontSize="8"
        fill={C.label}
        {...reveal(1.0)}
      >
        {arrived > 0
          ? "carried the whole way to the foundation"
          : "nothing reached the foundation"}
      </motion.text>

      {/* ── the induced member: licensed review ───────────────────────── */}
      <motion.g {...reveal(0.4)}>
        <text x={318} y={12} fontSize="8" fill={C.label} fontFamily={MONO}>
          LICENSED REVIEW
        </text>

        {/* capacity, drawn where it ends */}
        <line
          x1={310}
          x2={430}
          y1={196 - (peSustainablePerWeek / Math.max(peHoursPerWeek, peSustainablePerWeek)) * 150}
          y2={196 - (peSustainablePerWeek / Math.max(peHoursPerWeek, peSustainablePerWeek)) * 150}
          stroke={C.trackLine}
          strokeDasharray="4 3"
          strokeWidth="1"
        />
        <text
          x={430}
          y={190 - (peSustainablePerWeek / Math.max(peHoursPerWeek, peSustainablePerWeek)) * 150}
          fontSize="7.5"
          fill={C.label}
          textAnchor="end"
          fontFamily={MONO}
        >
          {peSustainablePerWeek}h sustainable
        </text>

        {/* the member, bowing by exactly its overload */}
        <motion.path
          d={`M 356 196 Q ${356 + bow} 120 356 46`}
          fill="none"
          stroke={reviewTone}
          strokeWidth="11"
          strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.45, duration: 0.8, ease: EASE }}
        />
        <text
          x={356}
          y={216}
          fontSize="12"
          fontWeight="700"
          fill={reviewTone}
          textAnchor="middle"
          fontFamily={MONO}
        >
          {peHoursPerWeek.toFixed(1)}h
        </text>
        <text x={356} y={228} fontSize="7.5" fill={C.label} textAnchor="middle">
          {overload > 1.02 ? "past capacity, bowing" : "inside capacity"}
        </text>
      </motion.g>

      {/* ── the talent pipeline, losing section ───────────────────────── */}
      <motion.g {...reveal(0.7)}>
        <rect x={300} y={46} width={9} height={150} rx="2" fill={C.track} />
        <motion.rect
          x={300}
          width={9}
          rx="2"
          fill={practiceRetained > 0.5 ? C.ok : practiceRetained > 0.05 ? C.warn : C.crit}
          fillOpacity="0.75"
          initial={reduced ? false : { height: 0, y: 196 }}
          whileInView={{
            height: Math.max(practiceRetained * 150, 2),
            y: 196 - Math.max(practiceRetained * 150, 2),
          }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
        />
        <text x={304} y={216} fontSize="9" fontWeight="600" fill={C.value} textAnchor="middle" fontFamily={MONO}>
          {Math.round(practiceRetained * 100)}%
        </text>
        <text x={304} y={228} fontSize="7.5" fill={C.label} textAnchor="middle">
          practice
        </text>
      </motion.g>
    </svg>
  );
}
