"use client";

import { PLAYS } from "@/lib/engines/agent-engine";
import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import { buildBoundaryScene } from "./scenes/boundaryScene";

/** Calls the agent hands back on every run, without exception. */
const REFUSALS = 4;

export function AgentBoundaryDiagram() {
  const build = useMemo(
    () => buildBoundaryScene({ plays: PLAYS.length, refusals: REFUSALS }),
    [],
  );

  return (
    <DiagramFigure
      build={build}
      height={300}
      caption="What it runs, and what it hands back"
      description={`The frame is the boundary. The ${PLAYS.length} green forms inside are the jobs the agent will run on its own: diagnosing a firm, preparing for a talk, advising on what to build, reviewing what was decided, and following up afterwards. The red forms outside are the calls it refuses on every run. They sit outside the frame rather than dimmed inside it, because a refusal is not a weaker version of doing the work. The frame is the product, and a tool that quietly moved a red form inside it would be a worse tool wearing the same name.`}
      readout={[
        { label: "Jobs it runs", value: String(PLAYS.length) },
        { label: "Calls it refuses", value: String(REFUSALS) },
        { label: "Model in the path", value: "None" },
        { label: "Runs with no refusal", value: "0" },
      ]}
    />
  );
}
