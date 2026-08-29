"use client";

import type { EngineOutput } from "@/lib/engines/engine";
import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import { buildWindTunnelScene, pillarHealth } from "./scenes/windTunnelScene";

const PILLAR_NAMES = [
  "fee structure",
  "review gate",
  "utilization",
  "practice floor",
];

export function WindTunnelDiagram({ out }: { out: EngineOutput }) {
  const build = useMemo(() => buildWindTunnelScene(), []);

  const health = pillarHealth(out);
  const weakest = health.indexOf(Math.min(...health));
  const holding = health.filter((h) => h >= 0.98).length;

  return (
    <DiagramFigure
      build={build}
      data={out}
      height={330}
      caption="Where the saved hour lands"
      description={`The bar across the top is the production time the agent frees. It does not disappear, it lands in the four columns below: the fee structure, which decides who keeps the money, the licensed review gate, which absorbs the verification, junior utilization, which records whether the freed capacity was used, and the practice floor, which pays for it three years later. Each column stands at its own baseline, so a full column is a pillar holding and a stub is one that has collapsed. Right now ${holding} of the four are holding and the ${PILLAR_NAMES[weakest]} is furthest below its baseline. Move any lever on this page and the columns follow.`}
      readout={[
        { label: "Fee structure", value: `${Math.round(health[0] * 100)}%` },
        { label: "Review gate", value: `${Math.round(health[1] * 100)}%` },
        { label: "Utilization", value: `${Math.round(health[2] * 100)}%` },
        { label: "Practice floor", value: `${Math.round(health[3] * 100)}%` },
      ]}
    />
  );
}
