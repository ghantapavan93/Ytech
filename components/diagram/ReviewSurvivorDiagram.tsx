"use client";

import { GRAVEYARD } from "@/lib/content/review-data";
import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import { buildSurvivorScene } from "./scenes/survivorScene";

export function ReviewSurvivorDiagram() {
  const concepts = useMemo(
    () =>
      GRAVEYARD.map((g) => ({
        label: g.concept,
        survived: g.verdict === "BUILD",
      })),
    [],
  );

  const build = useMemo(() => buildSurvivorScene(concepts), [concepts]);
  const survivors = concepts.filter((c) => c.survived).length;

  return (
    <DiagramFigure
      build={build}
      height={300}
      caption="Every concept that went into the review"
      description={`${concepts.length} ideas entered the adversarial review and ${survivors} came out standing. The forms lying on their side were killed, parked, narrowed or deferred, drawn where they fell rather than deleted, because the reasons they failed are the reason the survivor is shaped the way it is. The upright form is deliberately not much taller than the rest: surviving a review is not the same as being proven right.`}
      readout={[
        { label: "Concepts", value: String(concepts.length) },
        { label: "Still standing", value: String(survivors) },
        { label: "Did not survive", value: String(concepts.length - survivors) },
        {
          label: "Survival rate",
          value: `${Math.round((survivors / concepts.length) * 100)}%`,
        },
      ]}
    />
  );
}
