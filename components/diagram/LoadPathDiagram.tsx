"use client";

import { ATLAS_BASELINE, type EngineOutput, type Levers } from "@/lib/engines/engine";
import { LoadPathFigure, type LoadPathFigureData } from "./LoadPathFigure";

const hrs = (n: number) => `${Math.round(n)}h`;

/**
 * The load path figure, and the reading of it in words.
 *
 * The readout strip that used to sit under this is gone. It existed because
 * the WebGL version could not render text, so every number had to live
 * outside the picture; the drawing now states its own figures and repeating
 * them underneath would just be a second legend.
 *
 * The written description stays. It is what a screen reader and a printed
 * page receive, and the rule has not changed: if a fact only exists in the
 * drawing, it is not on the page.
 */
export function LoadPathDiagram({
  out,
  levers,
}: {
  out: EngineOutput;
  levers: Levers;
}) {
  const released = out.jrRedeployedHours + out.jrSavedHoursUnused;
  const keepsTheSaving = levers.pricingModel === "FIXED_FEE";

  const data: LoadPathFigureData = {
    releasedHours: released,
    redeployedHours: out.jrRedeployedHours,
    unusedHours: out.jrSavedHoursUnused,
    peHoursPerWeek: out.peHoursPerWeek,
    peSustainablePerWeek: ATLAS_BASELINE.pePillarSustainableHrsPerWeek,
    practiceRetained: out.learningIndexPct / 100,
    keepsTheSaving,
  };

  const arriving = keepsTheSaving ? out.jrRedeployedHours : 0;
  const overloaded = out.peHoursPerWeek > ATLAS_BASELINE.pePillarSustainableHrsPerWeek;

  return (
    <figure className="card overflow-hidden">
      <div className="figure-pan px-4 pt-5 sm:px-6">
        <LoadPathFigure data={data} />
      </div>

      <figcaption className="mt-2 border-t border-line px-5 py-4">
        <p className="text-[13px] font-medium text-ink-2">
          The value load path
        </p>
        <p className="diagram-reading mt-1.5 text-[13px] leading-relaxed text-ink-4">
          {hrs(released)} of released capacity enters at the top.{" "}
          {hrs(out.jrRedeployedHours)} is carried into billable backlog and{" "}
          {hrs(out.jrSavedHoursUnused)} runs to ground as slack. The fee gate is{" "}
          {keepsTheSaving
            ? "a fixed fee, so what is carried reaches the foundation"
            : "hourly, so even the carried hours stop there"}
          , leaving {hrs(arriving)} at business value. Licensed review is a
          separate member carrying induced work rather than a share of the
          released pool: it sits at {out.peHoursPerWeek.toFixed(1)} hours a week
          against {ATLAS_BASELINE.pePillarSustainableHrsPerWeek} it can sustain,
          so it {overloaded ? "bows" : "stands straight"}. The narrow column is
          the talent pipeline, holding {Math.round(out.learningIndexPct)}% of its
          baseline deep-practice hours.
        </p>
      </figcaption>
    </figure>
  );
}
