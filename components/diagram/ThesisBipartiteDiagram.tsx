"use client";

import { THESIS_ROWS } from "@/lib/content/thesis-data";
import { useMemo } from "react";
import { BipartiteFigure } from "./BipartiteFigure";
import { SvgFigure } from "./svg-kit";

const NAME: Record<string, string> = {
  "/": "the run",
  "/engine": "wind tunnel",
  "/progress": "the chain",
  "/proof": "expiry",
  "/record": "records",
  "/prep": "prep",
  "/agent": "agent",
  "/vision": "vision",
  "/stack": "stack",
  "/review": "review",
};

export function ThesisBipartiteDiagram() {
  const anchors = useMemo(
    () => Array.from(new Set(THESIS_ROWS.map((r) => r.anchor))),
    [],
  );
  const pairs = useMemo(
    () =>
      THESIS_ROWS.map((row, i) => ({
        claim: i,
        mechanism: anchors.indexOf(row.anchor),
      })),
    [anchors],
  );

  return (
    <SvgFigure
      caption="Published claim above, working mechanism below"
      description={`The ${THESIS_ROWS.length} claims this instrument rests on, each quoted and dated further down the page, connected to the ${anchors.length} places they actually run. Every line is a claim being operationalised, and no mechanism sits without one reaching it. A mechanism with no line above it would be an invention.`}
    >
      <BipartiteFigure
        claimCount={THESIS_ROWS.length}
        mechanisms={anchors.map((a) => NAME[a] ?? a.replace("/", ""))}
        pairs={pairs}
      />
    </SvgFigure>
  );
}
