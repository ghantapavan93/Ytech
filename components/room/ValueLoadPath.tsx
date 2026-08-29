"use client";

import { SETTLE } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import type { Member, MemberState } from "./load-path-state";

/**
 * The firm's operating model, drawn as a structural section.
 *
 * Six members carrying one load downward. Depth is isometric rather than
 * rendered, which is deliberate: a canvas cannot hold text without exiling
 * every label to a key underneath, and the labels being *inside* the drawing
 * is the whole reason this reads at a glance from the back of a room. It
 * also means the section prints, scales, and can be read by a screen reader.
 *
 * The load column between members is the hours travelling. Where a member
 * cannot pass what arrives, the column narrows and the difference leaves
 * sideways. Where a member is past what it can carry, it bows. Nobody has to
 * be told which part failed.
 */

const OK = "#10b981";
const WARN = "#f59e0b";
const CRIT = "#f43f5e";
const INERT = "rgba(255,255,255,0.20)";
const LABEL = "rgba(255,255,255,0.52)";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";

const TONE: Record<MemberState, string> = {
  ok: OK,
  strained: WARN,
  failing: CRIT,
  inert: INERT,
};

/** Isometric offset. Shallow, because a steep one starts to look like a toy. */
const DX = 30;
const DY = 16;

const X = 156;
const W = 236;
const H = 40;
const GAP = 56;
const TOP = 58;

const rowY = (i: number) => TOP + i * (H + GAP);

/** Column width for a share of the original load, never fully vanishing. */
const colW = (share: number) => Math.max(share * 46, share > 0.001 ? 3 : 0);

export function ValueLoadPath({
  members,
  className = "",
}: {
  members: Member[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const height = rowY(members.length - 1) + H + 46;
  const cx = X + W / 2;

  // Load remaining as it descends, so a leak upstream narrows everything
  // below it rather than only the segment it happened in.
  let carried = 1;
  const segments = members.slice(0, -1).map((m, i) => {
    const before = carried;
    carried = carried * m.passes;
    return { i, before, after: carried, leak: before - carried, member: m };
  });

  return (
    <svg
      viewBox={`0 0 560 ${height}`}
      className={`h-full w-auto max-w-full ${className}`}
      role="img"
      aria-label={members
        .map((m) => `${m.label}: ${m.value}, ${m.note}`)
        .join(". ")}
    >
      <defs>
        <linearGradient id="lp-flow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdf94a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#cdf94a" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      {/* The load travelling between members, and what leaves sideways. */}
      {segments.map((s) => {
        const y0 = rowY(s.i) + H;
        const y1 = rowY(s.i + 1);
        const wTop = colW(s.before);
        const wBot = colW(s.after);
        return (
          <g key={`seg-${s.i}`}>
            <motion.path
              d={`M${cx - wTop / 2},${y0} L${cx + wTop / 2},${y0} L${cx + wBot / 2},${y1} L${cx - wBot / 2},${y1} Z`}
              fill="url(#lp-flow)"
              initial={false}
              animate={{ opacity: s.before > 0.001 ? 1 : 0 }}
              transition={reduced ? { duration: 0 } : SETTLE}
            />
            {s.leak > 0.02 && (
              <g>
                <path
                  d={`M${cx + wTop / 2},${y0 + 12} L${cx + 96},${y0 + 30}`}
                  stroke={CRIT}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  fill="none"
                  opacity="0.75"
                />
                <text
                  x={cx + 102}
                  y={y0 + 33}
                  fontSize={9}
                  fill={CRIT}
                  fontFamily={MONO}
                >
                  {Math.round(s.leak * 100)}% LOST HERE
                </text>
              </g>
            )}
          </g>
        );
      })}

      {members.map((m, i) => {
        const y = rowY(i);
        const tone = TONE[m.state];
        const bow = m.overload * 16;
        const solid = m.state !== "inert";

        return (
          <motion.g
            key={m.id}
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { ...SETTLE, delay: i * 0.05 }}
          >
            {/* Top face, which is where the isometric depth comes from. */}
            <path
              d={`M${X},${y} L${X + DX},${y - DY} L${X + W + DX},${y - DY} L${X + W},${y} Z`}
              fill={tone}
              fillOpacity={solid ? 0.3 : 0.08}
              stroke={tone}
              strokeOpacity={solid ? 0.55 : 0.25}
              strokeWidth="1"
            />
            {/* Right face. */}
            <path
              d={`M${X + W},${y} L${X + W + DX},${y - DY} L${X + W + DX},${y + H - DY} L${X + W},${y + H} Z`}
              fill={tone}
              fillOpacity={solid ? 0.14 : 0.05}
              stroke={tone}
              strokeOpacity={solid ? 0.4 : 0.2}
              strokeWidth="1"
            />
            {/*
              Front face. Bows in the middle when the member is past what it
              can carry, which is the one place this drawing is allowed to
              deform. Everything else stays straight so the bend means
              something when it happens.
            */}
            <motion.path
              initial={false}
              animate={{
                d: `M${X},${y} Q${X + W / 2},${y + bow} ${X + W},${y} L${X + W},${y + H} Q${X + W / 2},${y + H + bow} ${X},${y + H} Z`,
              }}
              transition={reduced ? { duration: 0 } : SETTLE}
              fill={tone}
              fillOpacity={solid ? 0.2 : 0.06}
              stroke={tone}
              strokeOpacity={solid ? 0.9 : 0.3}
              strokeWidth={m.state === "failing" ? 2 : 1.25}
            />

            {/* The reading, inside the member. */}
            <text
              x={X + 14}
              y={y + H / 2 + bow / 2 + 6}
              fontSize={17}
              fontWeight="700"
              fill={solid ? tone : LABEL}
              fontFamily={MONO}
            >
              {m.value}
            </text>

            {/* Name and meaning, to the left, where the eye starts. */}
            <text
              x={X - 16}
              y={y + 14}
              fontSize={10}
              fill={solid ? "rgba(255,255,255,0.82)" : LABEL}
              fontFamily={MONO}
              textAnchor="end"
              letterSpacing="0.06em"
            >
              {m.label}
            </text>
            <text
              x={X - 16}
              y={y + 29}
              fontSize={9.5}
              fill={LABEL}
              textAnchor="end"
            >
              {m.note}
            </text>

            {m.state === "failing" && (
              <text
                x={X + W + DX + 12}
                y={y + H / 2 + 3}
                fontSize={9}
                fill={CRIT}
                fontFamily={MONO}
                fontWeight="700"
              >
                {m.overload > 0 ? "BUCKLING" : "NOT CARRYING"}
              </text>
            )}
          </motion.g>
        );
      })}

      {/* Ground line, so the foundation reads as one. */}
      <line
        x1={X - 8}
        x2={X + W + DX + 8}
        y1={rowY(members.length - 1) + H + 14}
        y2={rowY(members.length - 1) + H + 14}
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
      />
    </svg>
  );
}
