"use client";

import { PLAYS } from "@/lib/engines/agent-engine";
import { BoundaryFigure } from "./BoundaryFigure";
import { SvgFigure } from "./svg-kit";

const REFUSALS = [
  "the decision",
  "the numbers",
  "the sources",
  "anyone's voice",
];

export function AgentBoundaryDiagram() {
  return (
    <SvgFigure
      caption="What it runs, and what it hands back"
      description={`The ${PLAYS.length} jobs inside the frame are the ones the agent runs on its own. The items outside it are handed back on every single run. They sit outside rather than dimmed inside because a refusal is not a weaker version of doing the work, and the frame is the product. A tool that quietly moved one of them inside would be a worse tool wearing the same name.`}
    >
      <BoundaryFigure plays={PLAYS.map((p) => p.name)} refusals={REFUSALS} />
    </SvgFigure>
  );
}
