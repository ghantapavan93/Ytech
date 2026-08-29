"use client";

import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import { buildAssemblyScene } from "./scenes/assemblyScene";

export function PrepAssemblyDiagram({
  sections,
  kept,
}: {
  sections: number;
  kept: number;
}) {
  const build = useMemo(
    () => buildAssemblyScene({ sections, kept }),
    [sections, kept],
  );

  return (
    <DiagramFigure
      build={build}
      height={300}
      caption="A sheet assembled from sources, not written"
      description={`The plate at the base is the sheet you carry into the call. The ${sections} forms above it are its sections, and the line running down from each is the published source that section was built on. Nothing lands on the sheet without a line above it. Sections drawn as outlines are the ones set aside, which is why the board is editable: keeping a line and dropping a line are both decisions the reader makes, and the sheet records which.`}
      readout={[
        { label: "Sections", value: String(sections) },
        { label: "Kept", value: String(kept) },
        { label: "Set aside", value: String(Math.max(0, sections - kept)) },
        { label: "Unsourced lines", value: "0" },
      ]}
    />
  );
}
