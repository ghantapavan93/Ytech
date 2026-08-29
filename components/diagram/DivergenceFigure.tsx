"use client";

import { D, MONO, T, motion, draw, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: a working agent and a valid authorization are
 * separate facts.
 *
 * Two tracks over the same three readings. The agent's line holds its height
 * the whole way. The authorization's drops at week six and, once every
 * broken condition is repaired, returns part of the way and no further. The
 * height it never regains is the one-way door.
 */

export interface TrackNode {
  /** 0 to 1, how much of the original standing this reading holds. */
  level: number;
  tone: "ok" | "warn" | "crit" | "idle";
  label: string;
}

const TONE = { ok: D.ok, warn: D.warn, crit: D.crit, idle: D.dim } as const;

const LEFT = 96;
const SPAN = 330;
const BASE = 132;
const RISE = 78;

export function DivergenceFigure({
  weeks,
  agent,
  authorization,
}: {
  weeks: string[];
  agent: TrackNode[];
  authorization: TrackNode[];
}) {
  const reduced = useReducedMotion();
  const x = (i: number) => LEFT + (i / (weeks.length - 1)) * SPAN;
  const y = (n: TrackNode) => BASE - n.level * RISE;
  const path = (nodes: TrackNode[]) =>
    nodes.map((n, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(n)}`).join(" ");

  const track = (nodes: TrackNode[], name: string, delay: number) => (
    <>
      <text x={8} y={y(nodes[0]) + 3} fontSize={T.body} fill={D.value} fontWeight="600">
        {name}
      </text>
      <motion.path
        d={path(nodes)}
        fill="none"
        stroke={TONE[nodes[nodes.length - 1].tone]}
        strokeWidth="2"
        strokeLinecap="round"
        {...draw(delay, reduced)}
      />
      {nodes.map((n, i) => (
        <motion.g key={`${name}-${i}`} {...reveal(delay + 0.12 + i * 0.1, reduced)}>
          <circle cx={x(i)} cy={y(n)} r="5" fill={TONE[n.tone]} />
          <text
            x={x(i)}
            y={y(n) - 11}
            fontSize={T.micro}
            fill={TONE[n.tone]}
            textAnchor="middle"
            fontFamily={MONO}
          >
            {n.label.toUpperCase()}
          </text>
        </motion.g>
      ))}
    </>
  );

  return (
    <svg
      viewBox="0 0 440 176"
      className="h-auto w-full"
      role="img"
      aria-label={`The agent reads ${agent.map((a) => a.label).join(", ")}. The authorization reads ${authorization.map((a) => a.label).join(", ")}.`}
    >
      <text x={8} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        TWO FACTS MOST SYSTEMS REPORT AS ONE
      </text>

      {weeks.map((w, i) => (
        <g key={w}>
          <line
            x1={x(i)}
            x2={x(i)}
            y1={26}
            y2={BASE + 8}
            stroke={D.trackLine}
            strokeDasharray="2 4"
            strokeWidth="0.75"
          />
          <text
            x={x(i)}
            y={BASE + 22}
            fontSize={T.micro}
            fill={D.label}
            textAnchor="middle"
            fontFamily={MONO}
          >
            {w.toUpperCase()}
          </text>
        </g>
      ))}

      {track(agent, "The agent", 0.1)}
      {track(authorization, "Authorization", 0.35)}

      <text x={8} y={168} fontSize={T.micro} fill={D.label}>
        repairing every condition earns a bounded retest, never the clearance it started with
      </text>
    </svg>
  );
}
