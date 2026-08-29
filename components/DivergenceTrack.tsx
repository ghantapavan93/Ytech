"use client";

import {
  TIMELINE_WEEKS,
  WEEK_LABEL,
  buildDecisionAt,
  evaluate,
} from "@/lib/engines/proof-engine";
import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * The divergence, as a shape rather than two cards.
 *
 * This page argues that a working agent and a valid authorization are
 * separate facts. That argument was previously carried by two status cards
 * which, on the opening state, were both green and therefore said nothing.
 * The point only appears across time: run both tracks over the same three
 * weeks and the agent's line never moves while the authorization's does.
 *
 * The third node matters most. Repairing every broken condition returns the
 * authorization to amber, not to green, because the evidence behind the
 * original decision was gathered under conditions that no longer exist. The
 * track refuses to draw a return to where it started.
 */

const TONE = {
  ok: { hex: "#10b981", text: "text-ok", ring: "ring-ok/25" },
  warn: { hex: "#f59e0b", text: "text-warn", ring: "ring-warn/25" },
  crit: { hex: "#f43f5e", text: "text-crit", ring: "ring-crit/25" },
  idle: { hex: "#3f3f46", text: "text-ink-4", ring: "ring-white/5" },
} as const;

type ToneKey = keyof typeof TONE;

interface Node {
  week: number;
  label: string;
  tone: ToneKey;
  reached: boolean;
}

export function DivergenceTrack({
  applied,
  week,
}: {
  applied: string[];
  week: number;
}) {
  const { agent, authorization } = useMemo(() => {
    const agentNodes: Node[] = [];
    const authNodes: Node[] = [];

    for (const w of TIMELINE_WEEKS) {
      // Week 8 only exists once a remedy has actually been applied.
      const reached = w !== 8 || applied.length > 0;
      const decision = buildDecisionAt(w, applied);
      const r = evaluate(decision);

      agentNodes.push({
        week: w,
        label: !reached
          ? "Not reached"
          : decision.agentStillPerforming
            ? "Performing"
            : "Degraded",
        tone: !reached ? "idle" : decision.agentStillPerforming ? "ok" : "crit",
        reached,
      });

      authNodes.push({
        week: w,
        label: !reached
          ? "Not reached"
          : r.expired
            ? "Void"
            : r.everExpired
              ? "Bounded retest"
              : "Bounded test",
        tone: !reached ? "idle" : r.expired ? "crit" : r.everExpired ? "warn" : "ok",
        reached,
      });
    }

    return { agent: agentNodes, authorization: authNodes };
  }, [applied]);

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="micro-label">The agent and the authorization, over time</p>
        <p className="text-[11.5px] text-ink-4">
          Two facts most systems report as one
        </p>
      </div>

      {/* column headers */}
      <div className="mt-5 grid grid-cols-3 gap-2 pl-0 sm:pl-[136px]">
        {TIMELINE_WEEKS.map((w) => (
          <p
            key={w}
            className={`text-center text-[10px] uppercase tracking-[0.12em] ${
              w === week ? "text-ink-1" : "text-ink-4"
            }`}
          >
            {WEEK_LABEL[w]}
          </p>
        ))}
      </div>

      <Track label="The agent" nodes={agent} current={week} />
      <Track label="The authorization" nodes={authorization} current={week} />

      <p className="mt-6 border-l-2 border-line-strong pl-4 text-[13px] leading-relaxed text-ink-3">
        Six weeks apart, the tool is unchanged and the authorization is gone.
        Repairing every broken condition earns a bounded retest, never the
        clearance it started with, because the evidence behind that clearance
        was gathered under conditions that no longer hold.
      </p>
    </div>
  );
}

function Track({
  label,
  nodes,
  current,
}: {
  label: string;
  nodes: Node[];
  current: number;
}) {
  // One gradient across the whole rail, with a stop at each node, so a
  // change of state reads as the line itself turning rather than as three
  // unrelated dots.
  const rail = `linear-gradient(to right, ${nodes
    .map((n, i) => `${TONE[n.tone].hex} ${(i / (nodes.length - 1)) * 100}%`)
    .join(", ")})`;

  return (
    <div className="mt-5 sm:flex sm:items-center sm:gap-4">
      <p className="w-[120px] shrink-0 text-[13px] font-semibold text-ink-1">
        {label}
      </p>

      <div className="relative mt-3 flex-1 sm:mt-0">
        <div
          className="absolute left-[16.6%] right-[16.6%] top-[9px] h-[3px] rounded-full"
          style={{ background: rail }}
          aria-hidden
        />
        <div className="relative grid grid-cols-3 gap-2">
          {nodes.map((n, i) => (
            <div key={n.week} className="flex flex-col items-center">
              <motion.span
                initial={false}
                animate={{ scale: n.week === current ? 1.25 : 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`h-[21px] w-[21px] rounded-full ring-4 ring-canvas`}
                style={{ background: TONE[n.tone].hex }}
              />
              <span
                className={`mt-2 text-center text-[13px] font-medium ${TONE[n.tone].text}`}
              >
                {n.label}
              </span>
              {i === 0 && (
                <span className="sr-only">authorized state at day thirty</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
