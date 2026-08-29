"use client";

import { BASE_LAYERS } from "@/lib/engines/progress-engine";
import { ChainFigure } from "./ChainFigure";
import { SvgFigure } from "./svg-kit";

export function ProgressChainDiagram() {
  const unmeasured = BASE_LAYERS.filter((l) => l.state === "unknown").length;
  const first = BASE_LAYERS.findIndex((l) => l.state === "unknown");
  const carries = first === -1 ? BASE_LAYERS.length : first;

  return (
    <SvgFigure
      caption="The chain, and where it stops carrying weight"
      description={`Seven links, one per question the claim has to answer. The lit rail on the left is how far the evidence actually carries: it stops at link ${carries + 1}, the first of ${unmeasured} nobody measured, and runs faint below that. Everything under the break may well be fine, and none of it can be relied on.`}
    >
      <ChainFigure layers={BASE_LAYERS} />
    </SvgFigure>
  );
}
