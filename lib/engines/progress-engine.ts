/**
 * Proof of Progress.
 *
 * A dashboard reports that AI is growing. It counts runs, adoption, hours
 * saved. Every one of those is activity, and activity is what a firm has
 * when it cannot yet say whether the business moved.
 *
 * So this traces one claim down a chain. The agent ran. Draft time fell.
 * Then the questions get harder, and the chain stops being flattering
 * around the third link: what did licensed review cost, was the output
 * quality ever measured, where did the freed capacity go, what happened
 * to the people who used to do the work, and does the fee model let the
 * firm keep any of it.
 *
 * The rule the whole file obeys: an unmeasured link is not a passing link.
 * It blocks. A claim inherits the weakest evidence beneath it, never the
 * strongest, which is the opposite of how a dashboard aggregates.
 */

import { ATLAS_BASELINE } from "./engine";

/**
 * The one scenario, sized once.
 *
 * These were hardcoded, and drifted: the wind tunnel described the same
 * workflow as 20 hours a package across 20 packages while this file called
 * it 192 hours a month. Two baselines for one firm is the kind of thing the
 * instrument exists to catch, so the figures are now derived from the
 * engine's own baseline and cannot separate again.
 */
const PACKAGES_PER_MONTH = ATLAS_BASELINE.monthlyPackageVolume;
const BASELINE_HOURS = PACKAGES_PER_MONTH * ATLAS_BASELINE.baseJrHoursPerPkg;
const HEADLINE_PCT = 42;
const RELEASED_HOURS = Math.round(BASELINE_HOURS * (HEADLINE_PCT / 100));
const AFTER_HOURS = BASELINE_HOURS - RELEASED_HOURS;
/** Of the released hours, what the day-30 remedy actually redeploys. */
const REDEPLOYED_HOURS = Math.round(RELEASED_HOURS * 0.92);

export type LayerState = "proven" | "adverse" | "unknown";

/**
 * The reading behind a link, in the form an executive already recognises:
 * what it was, what it is, and which direction that is.
 *
 * `before` is absent where there is nothing to compare against, and `after`
 * is the reading itself. A link that was never measured still carries one,
 * because "0 of 500" is a more useful answer than a blank cell.
 */
export interface LayerMetric {
  label: string;
  before?: string;
  after: string;
  /** The movement, already signed and formatted. */
  delta?: string;
  /** Which way the movement runs for the firm. */
  direction: "good" | "bad" | "none";
}

export type LayerId =
  | "activity"
  | "technical"
  | "review"
  | "quality"
  | "financial"
  | "organizational"
  | "commercial";

export interface Layer {
  id: LayerId;
  name: string;
  /** The question this link answers, in the executive's words. */
  question: string;
  /** What the dashboard already tells you. */
  dashboard: string;
  /** What the chain finds when it looks underneath. */
  finding: string;
  state: LayerState;
  /** Why an unknown here blocks the conclusion above it. */
  blocks: string;
  metric: LayerMetric;
}

/**
 * The headline claim, exactly as the pilot report puts it. Every number in
 * the chain below reconciles to these three.
 */
export const CLAIM = {
  headlineValue: HEADLINE_PCT,
  headlineUnit: "%",
  headlineLabel: "less drafting time",
  baselineHours: BASELINE_HOURS,
  afterHours: AFTER_HOURS,
  releasedHours: RELEASED_HOURS,
  runs: 500,
  adoptionPct: 80,
  packagesPerMonth: PACKAGES_PER_MONTH,
} as const;

/** The opening state: a pilot that looks like a success. */
export const BASE_LAYERS: Layer[] = [
  {
    id: "activity",
    name: "Activity",
    question: "Did people use it?",
    dashboard: "500 AI-assisted reviews, 80 percent adoption",
    finding: "The agent ran 500 times. This is the only thing on the dashboard that is certainly true.",
    state: "proven",
    blocks: "Usage is the easiest thing to measure and the least informative. It is where most reporting stops.",
    metric: {
      label: "Runs completed",
      after: "500",
      direction: "none",
    },
  },
  {
    id: "technical",
    name: "Technical result",
    question: "Did the tool do its job?",
    dashboard: "42 percent less task time",
    finding: "Draft specification-QA time fell as claimed. The technology works.",
    state: "proven",
    blocks: "A working tool is a precondition for value, not evidence of it.",
    metric: {
      label: "Drafting hours a month, all packages",
      before: `${BASELINE_HOURS}h`,
      after: `${AFTER_HOURS}h`,
      delta: `${RELEASED_HOURS}h released`,
      direction: "good",
    },
  },
  {
    id: "review",
    name: "Professional workload",
    question: "What did it cost the people who check the work?",
    dashboard: "Not reported",
    finding: "Licensed review rose from 18 to 45.6 hours a month. The saving moved onto the one desk that cannot absorb it.",
    state: "adverse",
    blocks: "Time removed from an unlicensed step and added to a licensed one is not a saving. It is a transfer, in the wrong direction.",
    metric: {
      label: "Licensed review hours a month",
      before: "18h",
      after: "45.6h",
      delta: "+27.6h onto the scarce desk",
      direction: "bad",
    },
  },
  {
    id: "quality",
    name: "Accepted outcome",
    question: "Was the output any good?",
    dashboard: "Not measured",
    finding: "Accepted-output quality was never measured, so nobody can say whether the faster work was also correct work.",
    state: "unknown",
    blocks: "Without this, every downstream number is a speed measurement wearing a value label.",
    metric: {
      label: "Runs audited for accepted quality",
      after: "0 of 500",
      delta: "no reading exists",
      direction: "bad",
    },
  },
  {
    id: "financial",
    name: "Financial result",
    question: "Did any money move?",
    dashboard: "Implied by hours saved",
    finding: "Saved capacity was not redeployed. The hours were freed and then absorbed, so no revenue or margin followed them.",
    state: "unknown",
    blocks: "An hour saved becomes money only when something else is done with it. Nobody checked.",
    metric: {
      label: "Released hours redeployed",
      after: `0 of ${RELEASED_HOURS}h`,
      delta: "no reading exists",
      direction: "bad",
    },
  },
  {
    id: "organizational",
    name: "Organizational effect",
    question: "What happened to the people?",
    dashboard: "Not reported",
    finding: "Junior specification exposure fell. The work that produces future reviewers is the work that was automated.",
    state: "adverse",
    blocks: "This cost lands in three years and never appears in a quarterly report, which is why it is usually discovered late.",
    metric: {
      label: "Packages a junior still authors",
      before: "20 of 20",
      after: "0 of 20",
      delta: "the training set is the thing automated",
      direction: "bad",
    },
  },
  {
    id: "commercial",
    name: "Commercial effect",
    question: "Can the firm keep the value?",
    dashboard: "Not reported",
    finding: "Under the current fee model, time saved reduces billable hours. The client keeps the improvement.",
    state: "adverse",
    blocks: "A firm can be more efficient and less profitable at the same time. The fee model decides which.",
    metric: {
      label: "Revenue on a fee model that keeps the saving",
      after: "0%",
      delta: "every released hour is an un-billed hour",
      direction: "bad",
    },
  },
];

export type Decision = "scale" | "bounded" | "redesign" | "stop";

export const DECISION_LABEL: Record<Decision, string> = {
  scale: "Scale it",
  bounded: "Continue as a bounded experiment",
  redesign: "Redesign before continuing",
  stop: "Stop",
};

/**
 * Evidence that can arrive after thirty days. Each item resolves one link,
 * for better or worse. This is the part that makes the decision move.
 */
export interface Evidence {
  id: string;
  label: string;
  detail: string;
  layer: LayerId;
  resolvesTo: LayerState;
  good: boolean;
  /** The reading this evidence puts in place of the opening one. */
  metric: LayerMetric;
}

export const EVIDENCE: Evidence[] = [
  {
    id: "quality-good",
    label: "Quality was measured, and it held",
    detail: "A blind audit of 100 packages found no material misses the agent introduced.",
    layer: "quality",
    resolvesTo: "proven",
    good: true,
    metric: {
      label: "Runs audited for accepted quality",
      before: "0 of 500",
      after: "100 of 500",
      delta: "0 material misses",
      direction: "good",
    },
  },
  {
    id: "quality-bad",
    label: "Quality was measured, and it slipped",
    detail: "The same audit found three material omissions that reached a reviewer unflagged.",
    layer: "quality",
    resolvesTo: "adverse",
    good: false,
    metric: {
      label: "Runs audited for accepted quality",
      before: "0 of 500",
      after: "100 of 500",
      delta: "3 material misses reached a reviewer",
      direction: "bad",
    },
  },
  {
    id: "review-good",
    label: "Review burden came back down",
    detail: "A risk-tiered gate cut licensed review from 45.6 to 21 hours a month.",
    layer: "review",
    resolvesTo: "proven",
    good: true,
    metric: {
      label: "Licensed review hours a month",
      before: "45.6h",
      after: "21h",
      delta: "back inside a 22h budget",
      direction: "good",
    },
  },
  {
    id: "review-bad",
    label: "Review burden stayed where it was",
    detail: "Reviewers continued re-reading whole packages. The 45.6 hours held for a second month.",
    layer: "review",
    resolvesTo: "adverse",
    good: false,
    metric: {
      label: "Licensed review hours a month",
      before: "45.6h",
      after: "45.6h",
      delta: "held for a second month",
      direction: "bad",
    },
  },
  {
    id: "financial-good",
    label: "The freed capacity went somewhere",
    detail: `${REDEPLOYED_HOURS} of the ${RELEASED_HOURS} released hours were redeployed to backlog and billed, which is where the margin finally appears.`,
    layer: "financial",
    resolvesTo: "proven",
    good: true,
    metric: {
      label: "Released hours redeployed",
      before: `0 of ${RELEASED_HOURS}h`,
      after: `${REDEPLOYED_HOURS} of ${RELEASED_HOURS}h`,
      delta: "billed to backlog",
      direction: "good",
    },
  },
  {
    id: "financial-bad",
    label: "The freed capacity went nowhere",
    detail: "Hours were absorbed as slack. Utilization fell and the saving never converted.",
    layer: "financial",
    resolvesTo: "adverse",
    good: false,
    metric: {
      label: "Released hours redeployed",
      before: `0 of ${RELEASED_HOURS}h`,
      after: `0 of ${RELEASED_HOURS}h`,
      delta: "absorbed as slack, utilization fell",
      direction: "bad",
    },
  },
  {
    id: "commercial-good",
    label: "The fee model changed",
    detail: "This service line moved to a fixed fee, so the firm now keeps the time it saves.",
    layer: "commercial",
    resolvesTo: "proven",
    good: true,
    metric: {
      label: "Revenue on a fee model that keeps the saving",
      before: "0%",
      after: "100%",
      delta: "this line moved to fixed fee",
      direction: "good",
    },
  },
  {
    id: "organizational-good",
    label: "Junior exposure was protected",
    detail: "A manual first pass was reinstated on 4 packages a month, with juniors reviewing their own delta against the agent.",
    layer: "organizational",
    resolvesTo: "proven",
    good: true,
    metric: {
      label: "Packages a junior still authors",
      before: "0 of 20",
      after: "4 of 20",
      delta: "manual first pass, delta reviewed",
      direction: "good",
    },
  },
];

export interface ProgressResult {
  layers: Layer[];
  proven: number;
  adverse: number;
  unknown: number;
  decision: Decision;
  /** The sentence the screen leads with. */
  headline: string;
  /** Why the decision is what it is. */
  because: string;
  /** What would have to be true to move up a level. */
  toScale: string[];
}

export function evaluateProgress(applied: string[]): ProgressResult {
  const layers = BASE_LAYERS.map((l) => {
    // Later evidence on the same link supersedes earlier evidence.
    const hit = [...applied]
      .reverse()
      .map((id) => EVIDENCE.find((e) => e.id === id))
      .find((e) => e?.layer === l.id);
    if (!hit) return l;
    return {
      ...l,
      state: hit.resolvesTo,
      finding: hit.detail,
      dashboard: hit.label,
      metric: hit.metric,
    };
  });

  const proven = layers.filter((l) => l.state === "proven").length;
  const adverse = layers.filter((l) => l.state === "adverse").length;
  const unknown = layers.filter((l) => l.state === "unknown").length;

  // Quality is the one link that cannot be waived. An unmeasured or failing
  // quality result makes every efficiency number downstream meaningless,
  // and in licensed work it is also the one that carries liability.
  const quality = layers.find((l) => l.id === "quality")!;

  let decision: Decision;
  let headline: string;
  let because: string;

  if (quality.state === "adverse") {
    // The one conclusion an unmeasured chain can still support, because a
    // measured miss in licensed work is sufficient on its own.
    decision = "stop";
    headline = "The agent is fast, and it is letting things through.";
    because =
      "A measured quality failure in licensed work ends the question. Speed is not a defence, and no amount of margin recovers a missed provision.";
  } else if (unknown > 0) {
    // Redesign is a conclusion too, and it needs evidence. While links are
    // unmeasured the only defensible move is a bound tight enough to
    // produce the missing readings.
    decision = "bounded";
    headline = "The agent worked. Business progress remains unproven.";
    because = `${unknown} link${unknown === 1 ? " in the chain has" : "s in the chain have"} never been measured, so the claim above ${unknown === 1 ? "it" : "them"} cannot be checked. An unmeasured link does not pass. It blocks.`;
  } else if (adverse >= 3) {
    decision = "redesign";
    headline = "The agent worked. The way it was deployed did not.";
    because =
      "Every link is measured now, and three or more are running against the firm. That is a design problem in the surrounding workflow rather than a problem with the tool, and another month of the same will not fix it.";
  } else if (adverse > 0) {
    decision = "bounded";
    headline = "The agent worked. Some of the value is still leaking.";
    because =
      "Nothing is unmeasured now, but not everything is going the firm's way. That is worth continuing under a bound rather than scaling.";
  } else {
    decision = "scale";
    headline = "The business moved, and the evidence says so.";
    because =
      "Every link is measured and every link holds. Quality was checked, review stayed inside its budget, freed capacity was redeployed, the fee model lets the firm keep it, and the talent pipeline was protected.";
  }

  const toScale: string[] = layers
    .filter((l) => l.state !== "proven")
    .map((l) =>
      l.state === "unknown"
        ? `Measure ${l.name.toLowerCase()}. ${l.question}`
        : `Fix ${l.name.toLowerCase()}. ${l.finding}`,
    );

  return { layers, proven, adverse, unknown, decision, headline, because, toScale };
}

export interface CharterField {
  label: string;
  value: string;
}

/** The bounded experiment, derived rather than written. */
export function buildCharter(result: ProgressResult): CharterField[] {
  const unmeasured = result.layers.filter((l) => l.state === "unknown");
  const failing = result.layers.filter((l) => l.state === "adverse");

  return [
    { label: "Business owner", value: "Structural practice leader, named and accountable" },
    { label: "The original claim", value: "42 percent less task time on specification QA" },
    { label: "Baseline", value: "20 packages a month, 18 hours licensed review, no quality measurement" },
    {
      label: "Accepted-output quality",
      value: unmeasured.some((l) => l.id === "quality")
        ? "Blind audit of 100 packages. Currently unmeasured, which is why this cannot scale."
        : "Measured and holding. Keep the audit running.",
    },
    { label: "Rework and exception rate", value: "Counted per package, reported weekly" },
    {
      label: "Licensed-review burden",
      value: failing.some((l) => l.id === "review")
        ? "Currently 45.6 hours a month against a 22-hour budget. Cap and report."
        : "Inside the 22-hour budget. Hold the cap.",
    },
    {
      label: "Saved-capacity destination",
      value: failing.some((l) => l.id === "financial") || unmeasured.some((l) => l.id === "financial")
        ? "Not yet decided. Name the destination before the next package runs."
        : "Redeployed to billable backlog and tracked.",
    },
    {
      label: "Fee-model exposure",
      value: failing.some((l) => l.id === "commercial")
        ? "Hourly. Every saved hour is currently an un-billed hour."
        : "Fixed fee. The firm keeps what it saves.",
    },
    {
      label: "Junior learning protection",
      value: failing.some((l) => l.id === "organizational")
        ? "None in place. Reinstate a manual first pass on a sample."
        : "20 percent manual first pass, with delta review.",
    },
    { label: "Success condition", value: "Every link measured, quality holding, review inside budget, capacity landed" },
    { label: "Stop condition", value: "Any material miss found by audit, or review above 30 hours for two consecutive weeks" },
    { label: "Evidence required to reopen", value: "A measured result on each link that is currently unknown" },
  ];
}
