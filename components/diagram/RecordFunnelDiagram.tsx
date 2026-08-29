"use client";

import {
  STATE_LABEL,
  STATE_ORDER,
  type DecisionRecord,
  type EvidenceState,
} from "@/lib/engines/record-engine";
import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import { buildFunnelScene } from "./scenes/funnelScene";
import { DIAGRAM_COLOR } from "./theme";

const RUNG_COLOR: Record<EvidenceState, number> = {
  claimed: DIAGRAM_COLOR.crit,
  observed: DIAGRAM_COLOR.warn,
  verified: DIAGRAM_COLOR.live,
  sustained: DIAGRAM_COLOR.ok,
  // Retired is a real state but not a rung: a decision stopped on purpose
  // never enters the funnel, so this colour is never drawn.
  retired: DIAGRAM_COLOR.zinc700,
};

export function RecordFunnelDiagram({ records }: { records: DecisionRecord[] }) {
  const stages = useMemo(
    () =>
      STATE_ORDER.map((state) => ({
        label: STATE_LABEL[state],
        count: records.filter((r) => r.state === state).length,
        color: RUNG_COLOR[state],
      })),
    [records],
  );

  const build = useMemo(() => buildFunnelScene(stages), [stages]);
  const entering = Math.max(...stages.map((s) => s.count), 0);
  const surviving = stages[stages.length - 1].count;

  return (
    <DiagramFigure
      build={build}
      height={330}
      caption="The evidence ladder, drawn as the funnel it is"
      description={`Four plates descending, one per rung. The width of each is how many decisions reached it, and the outline around each is the width it would have had if nothing were lost on the way down. ${entering} are claimed and ${surviving} ${surviving === 1 ? "is" : "are"} still true a quarter later. The gap between a solid plate and its outline is evidence that never arrived.`}
      readout={stages.map((s) => ({ label: s.label, value: String(s.count) }))}
    />
  );
}
