"use client";

import { ATLAS_BASELINE, type EngineOutput, type Levers } from "@/lib/engines/engine";
import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import { buildLoadPathScene, type LoadPathData } from "./scenes/loadPathScene";

const hrs = (n: number) => `${Math.round(n)}h`;

export function LoadPathDiagram({
  out,
  levers,
}: {
  out: EngineOutput;
  levers: Levers;
}) {
  const build = useMemo(() => buildLoadPathScene(), []);

  const released = out.jrRedeployedHours + out.jrSavedHoursUnused;
  // Blended billing keeps only part of the saving, so it is not a clean yes.
  const keepsTheSaving = levers.pricingModel === "FIXED_FEE";

  const data: LoadPathData = {
    releasedHours: released,
    redeployedHours: out.jrRedeployedHours,
    unusedHours: out.jrSavedHoursUnused,
    peHoursPerWeek: out.peHoursPerWeek,
    peSustainablePerWeek: ATLAS_BASELINE.pePillarSustainableHrsPerWeek,
    practiceRetained: out.learningIndexPct / 100,
    keepsTheSaving,
  };

  const overload = out.peHoursPerWeek / ATLAS_BASELINE.pePillarSustainableHrsPerWeek;
  const arriving = keepsTheSaving ? out.jrRedeployedHours : 0;

  const reading = keepsTheSaving
    ? `${hrs(released)} released. ${hrs(out.jrRedeployedHours)} carried into billable backlog and ${hrs(out.jrSavedHoursUnused)} ran to ground as slack. The fee gate is fixed fee, so what is carried reaches the foundation.`
    : `${hrs(released)} released. ${hrs(out.jrRedeployedHours)} carried and ${hrs(out.jrSavedHoursUnused)} ran to ground as slack. The fee gate is hourly, so even the carried hours stop there: an hour not billed is an hour the client keeps.`;

  const reviewReading =
    overload > 1
      ? `The review member is at ${out.peHoursPerWeek.toFixed(1)} hours a week against ${ATLAS_BASELINE.pePillarSustainableHrsPerWeek} it can sustain, which is why it is bowing. Automating the drafting did not move work onto that desk from the released pool, it created new verification work, so review carries its own induced load and fails first.`
      : `The review member is at ${out.peHoursPerWeek.toFixed(1)} hours a week against ${ATLAS_BASELINE.pePillarSustainableHrsPerWeek} it can sustain, so it stands straight.`;

  return (
    <DiagramFigure
      build={build}
      data={data}
      height={380}
      caption="The value load path"
      description={`Released capacity enters at the top and travels down through the firm the way a load travels through a structure. ${reading} ${reviewReading} The column on the left is the talent pipeline, which loses section rather than bending: it is holding ${Math.round(out.learningIndexPct)}% of its baseline deep-practice hours. The plate at the bottom is what actually reached business value.`}
      readout={[
        { label: "Released", value: hrs(released) },
        { label: "Carried to backlog", value: hrs(out.jrRedeployedHours) },
        { label: "Ran to ground", value: hrs(out.jrSavedHoursUnused) },
        { label: "Reached value", value: hrs(arriving) },
      ]}
    />
  );
}
