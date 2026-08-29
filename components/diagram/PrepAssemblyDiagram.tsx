"use client";

import { AssemblyFigure } from "./AssemblyFigure";
import { SvgFigure } from "./svg-kit";

const SECTION_NAMES = [
  "open with",
  "contradiction",
  "do not build",
  "guardrails",
  "experiment",
  "watch for",
];

export function PrepAssemblyDiagram({
  sections,
  kept,
}: {
  sections: number;
  kept: number;
}) {
  const names = SECTION_NAMES.slice(0, sections);

  return (
    <SvgFigure
      caption="A sheet assembled from sources, not written"
      description={`Each of the ${sections} sections is built from a published source, drawn as the line running down into the sheet. Nothing lands on the sheet without one. ${kept} are still on it; the hollow ones were set aside, because keeping a line and dropping a line are both decisions the reader makes and the sheet records which.`}
    >
      <AssemblyFigure sections={names} kept={kept} />
    </SvgFigure>
  );
}
