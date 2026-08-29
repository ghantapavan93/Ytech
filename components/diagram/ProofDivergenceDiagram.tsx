"use client";

import {
  TIMELINE_WEEKS,
  buildDecisionAt,
  evaluate,
} from "@/lib/engines/proof-engine";
import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import {
  buildDivergenceScene,
  type DivergenceNode,
} from "./scenes/divergenceScene";

export function ProofDivergenceDiagram({ applied }: { applied: string[] }) {
  const { agent, authorization, build } = useMemo(() => {
    const agentTrack: DivergenceNode[] = [];
    const authTrack: DivergenceNode[] = [];

    for (const week of TIMELINE_WEEKS) {
      const reached = week !== 8 || applied.length > 0;
      const decision = buildDecisionAt(week, applied);
      const result = evaluate(decision);

      agentTrack.push({
        level: !reached ? 0.1 : decision.agentStillPerforming ? 1 : 0.2,
        tone: !reached ? "idle" : decision.agentStillPerforming ? "ok" : "crit",
      });

      authTrack.push({
        // A repaired authorization comes back part of the way, never all.
        level: !reached
          ? 0.1
          : result.expired
            ? 0.16
            : result.everExpired
              ? 0.55
              : 1,
        tone: !reached
          ? "idle"
          : result.expired
            ? "crit"
            : result.everExpired
              ? "warn"
              : "ok",
      });
    }

    return {
      agent: agentTrack,
      authorization: authTrack,
      build: buildDivergenceScene(agentTrack, authTrack),
    };
  }, [applied]);

  const pct = (n: DivergenceNode) => `${Math.round(n.level * 100)}%`;

  return (
    <DiagramFigure
      build={build}
      height={330}
      caption="Two facts most systems report as one"
      description="Time runs left to right across three readings: day thirty, week six, and after every broken condition has been repaired. The front track is the agent, the back track is the authorization it runs under. The agent holds full height the whole way, because nothing about the tool changed. The authorization collapses at week six and, once repaired, returns only part of the way. The height it never regains is the point: evidence gathered under conditions that no longer hold cannot be spent again."
      readout={[
        { label: "Agent, day 30", value: pct(agent[0]) },
        { label: "Agent, week 6", value: pct(agent[1]) },
        { label: "Authorization, week 6", value: pct(authorization[1]) },
        { label: "Authorization, repaired", value: pct(authorization[2]) },
      ]}
    />
  );
}
