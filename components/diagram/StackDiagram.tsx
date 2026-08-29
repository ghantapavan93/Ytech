"use client";

import { LAYERS } from "@/lib/content/stack-data";
import { StackFigure } from "./StackFigure";
import { SvgFigure } from "./svg-kit";

export function StackDiagram() {
  const owned = LAYERS.filter((l) => l.standing === "owned").length;
  const partial = LAYERS.filter((l) => l.standing === "partial").length;
  const needsScale = LAYERS.filter((l) => l.needsScale).length;

  return (
    <SvgFigure
      caption={`The ${LAYERS.length} layers, named and placed`}
      description={`Layer one at the base. ${owned} are already held, ${partial} are partly there, and the rest are open. The ${needsScale} drawn as outlines only exist at a scale a two-person practice does not have, which is a different claim from calling them weak.`}
    >
      <StackFigure layers={LAYERS} />
    </SvgFigure>
  );
}
