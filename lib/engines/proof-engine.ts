/**
 * The Proof Office.
 *
 * Value Shift asks whether a workflow should be tested. The decision
 * record asks whether evidence arrived. Neither asks the question that
 * actually bites six weeks later:
 *
 *   is the original authorization still supported?
 *
 * A recommendation is written once and then treated as permanent, even
 * though every condition holding it up is temporary. The owner leaves. A
 * contract narrows the data environment. Review effort climbs past the
 * budget it was approved against. The model version moves underneath it.
 *
 * So a Living Decision here is not a verdict. It is a verdict plus the
 * conditions it depends on. When a condition breaks, the decision expires
 * and has to be re-earned.
 *
 * The distinction this file exists to make: the agent can be performing
 * exactly as well as the day it was approved, and the authorization can
 * still be void. Those are separate facts and most systems conflate them.
 */

export type DecisionStatus =
  | "explore"
  | "test"
  | "scale"
  | "redesign"
  | "pause"
  | "retire"
  | "recommission";

export const STATUS_LABEL: Record<DecisionStatus, string> = {
  explore: "Explore",
  test: "Bounded test",
  scale: "Cleared to scale",
  redesign: "Redesign first",
  pause: "Paused",
  retire: "Retired",
  recommission: "Recommissioning required",
};

/** What an authorization rests on. Break one and the decision is void. */
export type ConditionId =
  | "owner"
  | "review-budget"
  | "data-boundary"
  | "fee-model"
  | "model-version"
  | "capacity-routing"
  | "practice-floor"
  | "evidence-cadence";

export interface Condition {
  id: ConditionId;
  label: string;
  /** Stated at authorization time, in plain terms. */
  approvedOn: string;
  /** Why breaking it invalidates the decision rather than merely worrying us. */
  whyItVoids: string;
  /** Severity: a critical break voids on its own. */
  critical: boolean;
}

export const CONDITIONS: Condition[] = [
  {
    id: "owner",
    label: "A named accountable owner",
    approvedOn: "Structural practice leader, named and in post",
    whyItVoids:
      "An unowned workflow has nobody to stop it. Every other condition here is enforced by a person, so this one holds the rest up.",
    critical: true,
  },
  {
    id: "review-budget",
    label: "Review effort inside its budget",
    approvedOn: "20 hours per month of licensed review across the pilot",
    whyItVoids:
      "The economics were approved against a review cost. If verification effort climbs, the saving that justified the decision is gone even though the agent is unchanged.",
    critical: true,
  },
  {
    id: "data-boundary",
    label: "The data environment it was cleared for",
    approvedOn: "Standard commercial projects, no restricted client data",
    whyItVoids:
      "Clearance was granted for a data class. A contract that narrows that class withdraws the clearance, whatever the tool does.",
    critical: true,
  },
  {
    id: "fee-model",
    label: "The fee structure it was priced against",
    approvedOn: "Fixed fee per package for this service line",
    whyItVoids:
      "Under a different fee model the same hours produce a different result. The verdict was computed against one structure and does not transfer.",
    critical: false,
  },
  {
    id: "model-version",
    label: "The model version it was tested on",
    approvedOn: "The version present at acceptance testing",
    whyItVoids:
      "Acceptance cases were passed by a specific version. A silent upgrade means the tested thing and the running thing are no longer the same thing.",
    critical: false,
  },
  {
    id: "capacity-routing",
    label: "Freed capacity actually redeployed",
    approvedOn: "Freed junior hours routed to billable backlog",
    whyItVoids:
      "If the hours sit idle instead, the value never lands and the utilization metric turns the organisation against the workflow.",
    critical: false,
  },
  {
    id: "practice-floor",
    label: "The deliberate practice floor",
    approvedOn: "20 percent of packages reviewed manually by juniors",
    whyItVoids:
      "The floor was the price of keeping future reviewers. Quietly removing it borrows margin from people who are not in the room.",
    critical: false,
  },
  {
    id: "evidence-cadence",
    label: "Evidence arriving on schedule",
    approvedOn: "Monthly reporting of the four agreed measures",
    whyItVoids:
      "A decision that stops producing evidence stops being a decision and becomes a habit.",
    critical: false,
  },
];

export interface EvidenceEvent {
  id: string;
  week: number;
  headline: string;
  detail: string;
  /** Which conditions this breaks. Empty means it is reassuring news. */
  breaks: ConditionId[];
  /** Conditions this restores, used when remedies are applied. */
  restores?: ConditionId[];
}

export interface LivingDecision {
  workflow: string;
  question: string;
  /** The verdict at authorization. */
  authorized: DecisionStatus;
  /** Set at authorization and never edited by the system. */
  baseline: string;
  /** Does the agent itself still do what it did on day one? */
  agentStillPerforming: boolean;
  events: EvidenceEvent[];
}

export interface ProofResult {
  status: DecisionStatus;
  /** Conditions currently broken, in the order they broke. */
  broken: { condition: Condition; event: EvidenceEvent }[];
  holding: Condition[];
  /** True when the authorization is void regardless of agent performance. */
  expired: boolean;
  /**
   * True when a critical condition has broken at any point in the record,
   * even if it has since been repaired. A clean bounded test and a bounded
   * retest earned back after expiry are the same status but not the same
   * fact, and only this distinguishes them.
   */
  everExpired: boolean;
  /** The sentence the interface leads with. */
  headline: string;
  /** What has to happen before anything scales. */
  required: string[];
}

/**
 * Replay events in order and work out what the authorization still rests on.
 * Restores are applied after breaks within the same week, so a remedy in the
 * same week as a break repairs it.
 */
export function evaluate(decision: LivingDecision): ProofResult {
  const brokenBy = new Map<ConditionId, EvidenceEvent>();

  const ordered = [...decision.events].sort((a, b) => a.week - b.week);
  for (const event of ordered) {
    for (const id of event.breaks) brokenBy.set(id, event);
    for (const id of event.restores ?? []) brokenBy.delete(id);
  }

  const broken = CONDITIONS.filter((c) => brokenBy.has(c.id)).map((c) => ({
    condition: c,
    event: brokenBy.get(c.id)!,
  }));
  const holding = CONDITIONS.filter((c) => !brokenBy.has(c.id));

  const criticalBroken = broken.filter((b) => b.condition.critical);
  const expired = criticalBroken.length > 0;

  // Expiry is a one-way door. Once a critical condition has broken at any
  // point in the record, repairing it earns a bounded retest rather than
  // the clearance that existed before. The evidence behind the original
  // decision was gathered under conditions that no longer exist, so it
  // cannot be reused, and quietly restoring the old status would be the
  // exact mistake this whole model was built to prevent.
  const everExpired = ordered.some((e) =>
    e.breaks.some((id) => CONDITIONS.find((c) => c.id === id)?.critical),
  );

  let status: DecisionStatus;
  let headline: string;

  if (expired) {
    status = "recommission";
    headline = decision.agentStillPerforming
      ? "The agent did not fail. The decision expired."
      : "The decision expired, and the agent is also underperforming.";
  } else if (everExpired) {
    status = "test";
    headline =
      "Conditions are repaired. That earns one bounded retest, not the clearance you had before.";
  } else if (broken.length > 0) {
    status = "redesign";
    headline =
      "The authorization still stands, but conditions it assumed have moved.";
  } else {
    status = decision.authorized;
    headline = "Every condition the decision rested on is still holding.";
  }

  const required: string[] = [];
  for (const b of broken) {
    required.push(
      b.condition.critical
        ? `Restore: ${b.condition.label.toLowerCase()}. Broken by ${b.event.headline.toLowerCase()}.`
        : `Re-examine: ${b.condition.label.toLowerCase()}.`,
    );
  }
  if (expired) {
    required.push(
      "Re-earn the authorization through one bounded test. Restoring the conditions does not restore the clearance.",
    );
  } else if (everExpired) {
    required.push(
      "Run the bounded retest and gather fresh evidence. The measurements taken before the expiry were made under conditions that no longer hold.",
    );
  }

  return { status, broken, holding, expired, everExpired, headline, required };
}

/**
 * A remedy is a change the practice makes in response. It repairs a
 * condition but deliberately does not restore the authorization, which is
 * the point of the whole mechanic.
 */
export interface Remedy {
  id: string;
  label: string;
  detail: string;
  restores: ConditionId[];
}

export const REMEDIES: Remedy[] = [
  {
    id: "new-owner",
    label: "Name a replacement owner",
    detail:
      "A different structural practice leader accepts accountability in writing, with the stop authority that goes with it.",
    restores: ["owner"],
  },
  {
    id: "tiered-review",
    label: "Move to risk-tiered review",
    detail:
      "The agent flags only delta and high-risk clauses, bringing licensed review back inside its budget.",
    restores: ["review-budget"],
  },
  {
    id: "project-boundary",
    label: "Write a project-specific data boundary",
    detail:
      "The restricted project is carved out explicitly, so the clearance matches the contract rather than assuming it.",
    restores: ["data-boundary"],
  },
  {
    id: "new-threshold",
    label: "Set a review-effort stop threshold",
    detail:
      "A number that ends the test automatically next time, instead of relying on somebody noticing.",
    restores: ["evidence-cadence"],
  },
];

/** The canonical case: approved, then quietly invalidated six weeks later. */
export const SPEC_QA_DECISION: LivingDecision = {
  workflow: "Specification QA and submittal review",
  question: "Should this workflow run beyond the pilot?",
  authorized: "test",
  baseline:
    "20 packages a month, 20 hours of licensed review, fixed fee per package, 20 percent manual junior audit retained.",
  agentStillPerforming: true,
  events: [
    {
      id: "e-accept",
      week: 0,
      headline: "The 30-day test passed",
      detail:
        "Task time fell as expected and every acceptance case was met. Approved for bounded use, not general deployment.",
      breaks: [],
    },
    {
      id: "e-review",
      week: 6,
      headline: "Licensed review effort rose from 18 to 45.6 hours",
      detail:
        "Volume grew and reviewers stopped trusting the flags, so they began re-reading whole packages. The agent's output did not change.",
      breaks: ["review-budget"],
    },
    {
      id: "e-owner",
      week: 6,
      headline: "The accountable owner left the firm",
      detail:
        "The structural practice leader who signed the charter has gone. Nobody has formally accepted the stop authority.",
      breaks: ["owner"],
    },
    {
      id: "e-contract",
      week: 6,
      headline: "A new project contract restricted the data environment",
      detail:
        "Client terms for the new pursuit prohibit third-party processing of project documents. The workflow was never cleared for this data class.",
      breaks: ["data-boundary"],
    },
  ],
};

/** The three points on the record the interface lets you stand at. */
export const TIMELINE_WEEKS = [0, 6, 8] as const;

export const WEEK_LABEL: Record<number, string> = {
  0: "Day 30, test passed",
  6: "Week 6",
  8: "After remedies",
};

/**
 * The record as it stood in a given week, with any remedies applied.
 *
 * This used to live inside the page component, which meant nothing else
 * could ask what the authorization looked like at a week it was not
 * currently showing. Reading the divergence between the agent and the
 * authorization needs all three weeks at once, so the construction belongs
 * here beside the rules it obeys.
 *
 * Remedies only exist from week 8. Before then, applying one changes
 * nothing, which is the point: you cannot repair a condition in the past.
 */
export function buildDecisionAt(
  week: number,
  appliedRemedyIds: string[],
): LivingDecision {
  const history = SPEC_QA_DECISION.events.filter(
    (e) => e.week <= Math.min(week, 6),
  );

  const remedies: EvidenceEvent[] =
    week >= 8
      ? appliedRemedyIds
          .map((id) => REMEDIES.find((r) => r.id === id))
          .filter((r): r is Remedy => r !== undefined)
          .map((r) => ({
            id: `remedy-${r.id}`,
            week: 8,
            headline: r.label,
            detail: r.detail,
            breaks: [],
            restores: r.restores,
          }))
      : [];

  return { ...SPEC_QA_DECISION, events: [...history, ...remedies] };
}
