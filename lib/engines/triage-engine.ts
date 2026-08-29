/**
 * Workflow triage: which candidate is worth putting through the wind tunnel.
 *
 * The instrument downstream of this assumes the workflow has already been
 * chosen. A real engagement does not start there. Someone sits with a
 * principal, lists the things the firm does over and over, and works out
 * which one is worth the cost of a bounded experiment.
 *
 * This is that step, and it is deliberately not a dashboard. A dashboard
 * would summarise what the firm already knows; the whole argument of this
 * project is that summarising activity is what nobody needs. What a
 * principal needs is a selection and an honest account of what could not be
 * judged.
 *
 * So every input may be "unknown", and unknowns do not average away. The
 * rule from the evidence chain holds here too: a missing answer blocks
 * rather than passes. A workflow whose output quality nobody measures
 * cannot be ranked ready, however good the arithmetic above it looks.
 */

export type Answer = "yes" | "no" | "unknown";

export interface WorkflowCandidate {
  id: string;
  name: string;
  /** Times the workflow runs in a month. */
  runsPerMonth: number;
  /** Hours one run currently takes. */
  hoursPerRun: number;
  /** Is the output substantially the same shape every time? */
  standardised: Answer;
  /** Must a licensed professional sign off on the output? */
  licensedReview: Answer;
  /** Is this work billed hourly, so saved time is unbilled time? */
  billedHourly: Answer;
  /** Is this one of the ways junior staff learn the craft? */
  teachesJuniors: Answer;
  /** Can the firm tell whether an output was correct? */
  qualityMeasured: Answer;
}

export type Verdict = "test" | "redesign-first" | "not-yet" | "leave";

export const VERDICT_LABEL: Record<Verdict, string> = {
  test: "Worth a bounded test",
  "redesign-first": "Redesign the conditions first",
  "not-yet": "Cannot judge it yet",
  leave: "Leave it alone",
};

export interface TriageResult {
  candidate: WorkflowCandidate;
  /** Hours a month currently spent on this workflow. */
  exposureHours: number;
  verdict: Verdict;
  /** The single sentence a principal would repeat. */
  headline: string;
  /** Why it landed where it landed. */
  because: string[];
  /** What nobody could answer, and so what has to be found out. */
  unknowns: string[];
}

const MATERIAL_HOURS = 60;

/** Questions whose absence changes what can be concluded. */
const BLOCKING: {
  key: keyof WorkflowCandidate;
  missing: string;
}[] = [
  {
    key: "qualityMeasured",
    missing:
      "Whether anyone can tell a good output from a bad one. Without this, a speed result cannot be read as a quality-neutral result.",
  },
  {
    key: "licensedReview",
    missing:
      "Whether a licensed professional has to sign the output. This decides whether automating upstream removes work or moves it onto the one desk that cannot delegate.",
  },
];

export function triage(candidate: WorkflowCandidate): TriageResult {
  const exposureHours = candidate.runsPerMonth * candidate.hoursPerRun;

  const unknowns = BLOCKING.filter((b) => candidate[b.key] === "unknown").map(
    (b) => b.missing,
  );
  if (candidate.standardised === "unknown") {
    unknowns.push(
      "Whether the work is the same shape every time. Bespoke work resists the kind of automation being proposed.",
    );
  }

  const because: string[] = [];
  let verdict: Verdict;
  let headline: string;

  const thin = exposureHours < MATERIAL_HOURS;
  const blocked = BLOCKING.some((b) => candidate[b.key] === "unknown");
  /**
   * A flat "no" on quality is not a milder version of "don't know", it is a
   * harder one. "Don't know" means go and ask. "No" means the firm has
   * looked and there is nothing to read a result against, so the measurement
   * has to be built before any test of this workflow means anything.
   */
  const unmeasurable = candidate.qualityMeasured === "no";

  if (thin) {
    // Checked before the unknowns on purpose: there is no point sending
    // someone to measure a workflow that could not matter either way.
    verdict = "leave";
    headline = `${Math.round(exposureHours)} hours a month is too little to be worth the cost of finding out.`;
    because.push(
      `At ${candidate.runsPerMonth} runs of ${candidate.hoursPerRun} hours, the whole workflow is ${Math.round(exposureHours)} hours a month. A bounded experiment costs more attention than that.`,
    );
  } else if (blocked) {
    verdict = "not-yet";
    headline = "The exposure is real. The answer to whether it should be tested is not available yet.";
    because.push(
      `${Math.round(exposureHours)} hours a month is material, so this is worth an answer.`,
      "But a missing answer does not average away with the ones you have. It blocks.",
    );
  } else if (
    unmeasurable ||
    candidate.standardised === "no" ||
    (candidate.billedHourly === "yes" && candidate.teachesJuniors === "yes")
  ) {
    verdict = "redesign-first";
    headline = unmeasurable
      ? "There is nothing here to read a result against. Build the measurement first."
      : "Testing this before changing the conditions around it would fail for reasons the test cannot see.";
    if (unmeasurable) {
      because.push(
        "The firm cannot currently tell a good output from a bad one on this workflow. A speed result measured against nothing is a speed result, not a quality-neutral one, so the acceptance check has to exist before the experiment does.",
      );
    }
    if (candidate.standardised === "no") {
      because.push(
        "The work is bespoke each time, so a tool that assumes a shape will meet a case it was not built for.",
      );
    }
    if (candidate.billedHourly === "yes" && candidate.teachesJuniors === "yes") {
      because.push(
        "It is billed hourly and it is how juniors learn. Automating it removes revenue and the training set in one move, so the fee model and the practice floor have to change first.",
      );
    }
  } else {
    verdict = "test";
    headline = `${Math.round(exposureHours)} hours a month, measurable, and the conditions around it can hold a test.`;
    because.push(
      `${Math.round(exposureHours)} hours a month is enough for a result to be visible.`,
      "Output quality is measured, so a speed change can be read against something.",
    );
    if (candidate.licensedReview === "yes") {
      because.push(
        "It carries licensed review, so the experiment must cap reviewer hours rather than assume they fall.",
      );
    }
  }

  if (candidate.billedHourly === "yes" && verdict !== "leave") {
    because.push(
      "Billed hourly, so any hour saved is an hour not invoiced until the fee model changes.",
    );
  }

  return { candidate, exposureHours, verdict, headline, because, unknowns };
}

/**
 * Rank a set of candidates.
 *
 * Testable work sorts first and by exposure, because that is the order a
 * principal would actually spend attention in. Everything that cannot be
 * judged sorts above everything not worth judging, so the next question is
 * always visible.
 */
const ORDER: Record<Verdict, number> = {
  test: 0,
  "redesign-first": 1,
  "not-yet": 2,
  leave: 3,
};

export function rank(candidates: WorkflowCandidate[]): TriageResult[] {
  return candidates
    .map(triage)
    .sort(
      (a, b) =>
        ORDER[a.verdict] - ORDER[b.verdict] || b.exposureHours - a.exposureHours,
    );
}

/** A synthetic firm's candidate list, in the shape a principal would give it. */
export const CANDIDATES: WorkflowCandidate[] = [
  {
    id: "spec-qa",
    name: "Specification QA and submittal review",
    runsPerMonth: 20,
    hoursPerRun: 20,
    standardised: "yes",
    licensedReview: "yes",
    billedHourly: "yes",
    teachesJuniors: "yes",
    qualityMeasured: "yes",
  },
  {
    id: "rfi",
    name: "RFI drafting and response tracking",
    runsPerMonth: 60,
    hoursPerRun: 1.5,
    standardised: "yes",
    licensedReview: "no",
    billedHourly: "yes",
    teachesJuniors: "no",
    qualityMeasured: "unknown",
  },
  {
    id: "calcs",
    name: "Structural calculation packages",
    runsPerMonth: 12,
    hoursPerRun: 14,
    standardised: "no",
    licensedReview: "yes",
    billedHourly: "no",
    teachesJuniors: "yes",
    qualityMeasured: "yes",
  },
  {
    id: "proposals",
    name: "Proposal and fee-schedule assembly",
    runsPerMonth: 8,
    hoursPerRun: 9,
    standardised: "yes",
    licensedReview: "no",
    billedHourly: "no",
    teachesJuniors: "no",
    qualityMeasured: "yes",
  },
  {
    id: "minutes",
    name: "Site-visit note write-ups",
    runsPerMonth: 10,
    hoursPerRun: 0.75,
    standardised: "yes",
    licensedReview: "no",
    billedHourly: "no",
    teachesJuniors: "no",
    qualityMeasured: "no",
  },
];
