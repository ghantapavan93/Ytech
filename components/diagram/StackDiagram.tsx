"use client";

import { LAYERS } from "@/lib/content/stack-data";
import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import { buildStackScene } from "./scenes/stackScene";

/**
 * A scene builder is a function, and functions do not cross the server
 * boundary, so every diagram gets a thin client wrapper that reads its own
 * data and constructs its own builder.
 */
export function StackDiagram() {
  const build = useMemo(() => buildStackScene(LAYERS), []);

  const owned = LAYERS.filter((l) => l.standing === "owned").length;
  const partial = LAYERS.filter((l) => l.standing === "partial").length;
  const needsScale = LAYERS.filter((l) => l.needsScale).length;

  return (
    <DiagramFigure
      build={build}
      height={340}
      caption={`The ${LAYERS.length} layers, drawn as the assembly they are`}
      description={`Each plate is one layer of the stack, layer one at the base. Green plates are layers this practice already holds, amber are partly there, grey are open. The ${needsScale} plates drawn as outlines rather than solids are the layers that only exist at a scale a two-person practice does not have, which is why they are shown as present in the design and absent in the building.`}
      readout={[
        { label: "Layers", value: String(LAYERS.length) },
        { label: "Already strong", value: String(owned) },
        { label: "Partly there", value: String(partial) },
        { label: "Need scale", value: String(needsScale) },
      ]}
    />
  );
}
