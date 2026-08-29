"use client";

import { THESIS_ROWS } from "@/lib/content/thesis-data";
import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import { buildBipartiteScene } from "./scenes/bipartiteScene";

export function ThesisBipartiteDiagram() {
  // Several claims land on the same mechanism, which is why the two rows
  // are different widths.
  const anchors = useMemo(
    () => Array.from(new Set(THESIS_ROWS.map((r) => r.anchor))),
    [],
  );

  const build = useMemo(
    () =>
      buildBipartiteScene({
        pairs: THESIS_ROWS.map((row, i) => ({
          claim: i,
          mechanism: anchors.indexOf(row.anchor),
        })),
      }),
    [anchors],
  );

  return (
    <DiagramFigure
      build={build}
      height={300}
      caption="Published claim above, working mechanism below"
      description={`The upper row is the ${THESIS_ROWS.length} published claims this instrument is built on, each quoted and dated further down the page. The lower row is the ${anchors.length} places in the instrument where those claims actually run. Every line is a claim being operationalised. No node in the lower row is without a line reaching it, which is the point of this page: nothing here is a new theory.`}
      readout={[
        { label: "Claims", value: String(THESIS_ROWS.length) },
        { label: "Mechanisms", value: String(anchors.length) },
        { label: "Unsourced", value: "0" },
        {
          label: "Claims per mechanism",
          value: (THESIS_ROWS.length / anchors.length).toFixed(1),
        },
      ]}
    />
  );
}
