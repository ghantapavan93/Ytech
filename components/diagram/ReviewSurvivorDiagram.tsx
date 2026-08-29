"use client";

import { GRAVEYARD } from "@/lib/content/review-data";
import { useMemo } from "react";
import { SurvivorFigure } from "./SurvivorFigure";
import { SvgFigure } from "./svg-kit";

export function ReviewSurvivorDiagram() {
  const concepts = useMemo(
    () =>
      GRAVEYARD.map((g) => ({
        label: g.concept,
        verdict: g.verdict,
        survived: g.verdict === "BUILD",
      })),
    [],
  );
  const survivors = concepts.filter((c) => c.survived).length;

  return (
    <SvgFigure
      caption="Every concept that went into the review"
      description={`${concepts.length} ideas entered the adversarial teardown and ${survivors} came out standing. The ones lying flat were killed, parked, narrowed or deferred, and they are kept rather than deleted because the reasons they failed are the reasons the survivor is shaped the way it is. The upright one is deliberately only a little taller: surviving a review is not the same as being proven right.`}
    >
      <SurvivorFigure concepts={concepts} />
    </SvgFigure>
  );
}
