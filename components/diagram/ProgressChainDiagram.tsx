"use client";

import { BASE_LAYERS } from "@/lib/engines/progress-engine";
import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import { buildChainScene } from "./scenes/chainScene";

export function ProgressChainDiagram() {
  const build = useMemo(() => buildChainScene(BASE_LAYERS), []);

  const unmeasured = BASE_LAYERS.filter((l) => l.state === "unknown").length;
  const adverse = BASE_LAYERS.filter((l) => l.state === "adverse").length;
  const firstBlocking = BASE_LAYERS.findIndex((l) => l.state === "unknown");
  const carries = firstBlocking === -1 ? BASE_LAYERS.length : firstBlocking;

  return (
    <DiagramFigure
      build={build}
      height={340}
      caption="The chain, and where it stops carrying weight"
      description={`Seven plates descending, one for each question the claim has to answer, from whether the agent ran down to whether the firm could keep the value. Solid plates were measured. The ${unmeasured} drawn as outlines never were. The bright line down the left is how far the evidence actually carries: it stops at link ${carries + 1}, the first thing nobody measured, and the faint line below is the distance the claim would have to reach to be worth anything. Everything under the break may well be fine. None of it can be relied on.`}
      readout={[
        { label: "Links", value: String(BASE_LAYERS.length) },
        { label: "Carries to", value: `${carries} of ${BASE_LAYERS.length}` },
        { label: "Never measured", value: String(unmeasured) },
        { label: "Measured, adverse", value: String(adverse) },
      ]}
    />
  );
}
