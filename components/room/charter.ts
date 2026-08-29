import {
  ATLAS_BASELINE as B,
  type EngineOutput,
  type Levers,
} from "@/lib/engines/engine";

/**
 * The charter for the configuration the room actually arrived at.
 *
 * The room used to close on a charter built from the evidence chain's own
 * frame, which described a firm with 18 hours of licensed review against a
 * 22-hour budget. The drawing three feet above it said 26.3 against 15, and
 * the fee line read "hourly" directly after somebody in the room had just
 * switched the firm to a fixed fee.
 *
 * Two framings of one firm is the exact failure this project has already
 * corrected twice. So the closing document is derived from the same run as
 * everything the room has just watched: change a lever and the charter
 * changes with it, because a charter that does not follow the decision is
 * not a record of the decision.
 *
 * What does not move is the quality line. Accepted-output quality is
 * unmeasured whatever the levers say, which is the whole reason the answer
 * is an experiment rather than a deployment.
 */

export interface CharterField {
  label: string;
  value: string;
}

const hrs = (n: number) => `${Math.round(n)} hours`;

export function roomCharter(out: EngineOutput, levers: Levers): CharterField[] {
  const sustainable = B.pePillarSustainableHrsPerWeek;
  const overReview = out.peHoursPerWeek > sustainable;
  const fixedFee = levers.pricingModel !== "TM_100";
  const routed = levers.backlogRedeploymentPct > 0;
  const guarded = levers.apprenticeshipSafeguard === "BLIND_AUDIT_20_PCT";
  const released = out.jrRedeployedHours + out.jrSavedHoursUnused;

  return [
    {
      label: "Business owner",
      value: "Structural practice leader, named and accountable",
    },
    {
      label: "The original claim",
      value: `${Math.round(levers.aiSpeedupPct * 100)} percent less task time on specification QA`,
    },
    {
      label: "Baseline",
      value: `${B.monthlyPackageVolume} packages a month, ${out.baselinePeHoursPerWeek.toFixed(1)} hours a week of licensed review, no quality measurement`,
    },
    {
      label: "Accepted-output quality",
      value:
        "Unmeasured. A blind audit has to run before any of the rest of this can be read as a result.",
    },
    {
      label: "Rework and exception rate",
      value: "Counted per package, reported weekly",
    },
    {
      label: "Licensed-review burden",
      value: overReview
        ? `${out.peHoursPerWeek.toFixed(1)} hours a week against the ${sustainable} this desk can carry. Cap it and report weekly.`
        : `${out.peHoursPerWeek.toFixed(1)} hours a week, inside the ${sustainable} this desk can carry. Hold the cap.`,
    },
    {
      label: "Saved-capacity destination",
      value: routed
        ? `All ${hrs(released)} routed to billable backlog and tracked against it.`
        : `Not decided. ${hrs(released)} are being freed with nowhere named to send them.`,
    },
    {
      label: "Fee-model exposure",
      value: fixedFee
        ? "Fixed fee per package. The firm keeps what the agent saves."
        : "Hourly. Every saved hour is an hour not invoiced.",
    },
    {
      label: "Junior learning protection",
      value: guarded
        ? `A 20 percent manual first pass, holding ${Math.round(out.learningIndexPct)} percent of baseline deep-practice hours.`
        : "None. Deep-practice hours are at zero and no junior is learning this work.",
    },
    {
      label: "Market assumption",
      value:
        "Every freed hour finds billable work. True in this labour market and not a law. Re-read this the month it stops.",
    },
    {
      label: "Success condition",
      value:
        "Quality measured and holding, review inside its cap, capacity landed somewhere named",
    },
    {
      label: "Stop condition",
      value: `Any material miss found by audit, or review above ${Math.round(sustainable * 1.3)} hours a week for two consecutive weeks`,
    },
    {
      label: "Evidence required to reopen",
      value: "A measured result on every link currently carrying an assumption",
    },
  ];
}
