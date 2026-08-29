"use client";

import {
  TIMELINE_WEEKS,
  WEEK_LABEL,
  buildDecisionAt,
  evaluate,
} from "@/lib/engines/proof-engine";
import { useMemo } from "react";
import { DivergenceFigure, type TrackNode } from "./DivergenceFigure";
import { SvgFigure } from "./svg-kit";

export function ProofDivergenceDiagram({ applied }: { applied: string[] }) {
  const { agent, authorization } = useMemo(() => {
    const a: TrackNode[] = [];
    const b: TrackNode[] = [];
    for (const week of TIMELINE_WEEKS) {
      const reached = week !== 8 || applied.length > 0;
      const decision = buildDecisionAt(week, applied);
      const r = evaluate(decision);

      a.push({
        level: !reached ? 0.25 : decision.agentStillPerforming ? 1 : 0.2,
        tone: !reached ? "idle" : decision.agentStillPerforming ? "ok" : "crit",
        label: !reached ? "not reached" : decision.agentStillPerforming ? "performing" : "degraded",
      });

      b.push({
        level: !reached ? 0.25 : r.expired ? 0.14 : r.everExpired ? 0.55 : 1,
        tone: !reached ? "idle" : r.expired ? "crit" : r.everExpired ? "warn" : "ok",
        label: !reached
          ? "not reached"
          : r.expired
            ? "void"
            : r.everExpired
              ? "bounded retest"
              : "bounded test",
      });
    }
    return { agent: a, authorization: b };
  }, [applied]);

  return (
    <SvgFigure
      caption="Two facts most systems report as one"
      description="Three readings across the same record. The agent holds its height throughout, because nothing about the tool changed. The authorization collapses at week six and, once every broken condition is repaired, returns only part of the way. The height it never regains is evidence gathered under conditions that no longer hold."
    >
      <DivergenceFigure
        weeks={TIMELINE_WEEKS.map((w) => WEEK_LABEL[w])}
        agent={agent}
        authorization={authorization}
      />
    </SvgFigure>
  );
}
