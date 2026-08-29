"use client";

import {
  STATE_LABEL,
  STATE_ORDER,
  type DecisionRecord,
  type EvidenceState,
} from "@/lib/engines/record-engine";
import { useMemo } from "react";
import { FunnelFigure } from "./FunnelFigure";
import { D, SvgFigure } from "./svg-kit";

const TONE: Record<EvidenceState, string> = {
  claimed: D.crit,
  observed: D.warn,
  verified: D.live,
  sustained: D.ok,
  retired: D.dim,
};

const MEANING: Record<EvidenceState, string> = {
  claimed: "somebody said it worked",
  observed: "measured once, against no baseline",
  verified: "held against a baseline and a stop condition",
  sustained: "still true a quarter later",
  retired: "stopped on purpose",
};

export function RecordFunnelDiagram({ records }: { records: DecisionRecord[] }) {
  const stages = useMemo(
    () =>
      STATE_ORDER.map((state) => ({
        label: STATE_LABEL[state],
        count: records.filter((r) => r.state === state).length,
        meaning: MEANING[state],
        color: TONE[state],
      })),
    [records],
  );

  const entering = Math.max(...stages.map((s) => s.count), 0);
  const surviving = stages[stages.length - 1].count;

  return (
    <SvgFigure
      caption="The evidence ladder, drawn as the funnel it is"
      description={`Each bar is how many decisions reached that rung, against the dashed width it would have had if nothing were lost. ${entering} are claimed and ${surviving} ${surviving === 1 ? "is" : "are"} still true a quarter later. The gap between a bar and its track is evidence that never arrived.`}
    >
      <FunnelFigure stages={stages} />
    </SvgFigure>
  );
}
