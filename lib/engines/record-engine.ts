/**
 * The Decision Record.
 *
 * Both instruments end in a decision. Neither one remembers what happened
 * next, and that gap is where the industry loses its evidence. A firm runs
 * twelve pilots, believes all twelve worked, and can prove nothing about
 * any of them.
 *
 * This file models the ladder a decision has to climb before it counts:
 *
 *   claimed    someone asserts it worked
 *   observed   somebody measured it once
 *   verified   it held against a baseline and a stop condition
 *   sustained  it was still true a quarter later
 *   retired    it was stopped, on purpose, with a reason
 *
 * Only verified and sustained records may contribute an anonymized
 * pattern. That rule is the whole point: the library learns from proof,
 * not from optimism. Retired records are kept because a decision that was
 * stopped for a stated reason teaches as much as one that worked.
 */

export type EvidenceState =
  | "claimed"
  | "observed"
  | "verified"
  | "sustained"
  | "retired";

export type Decision = "run-experiment" | "redesign-first" | "do-not-deploy";

export interface DecisionRecord {
  id: string;
  workflow: string;
  /** Coarse archetype only. No firm is ever named. */
  archetype: string;
  pricing: "hourly" | "mixed" | "fixed";
  /** What the firm believed before the instrument ran. */
  belief: string;
  /** What the instrument surfaced. */
  contradiction: string;
  decision: Decision;
  owner: string;
  /** The one measurable that would settle it. */
  evidenceRequired: string;
  state: EvidenceState;
  /** What actually happened, once anything actually happened. */
  outcome?: string;
  month: string;
}

export const STATE_ORDER: EvidenceState[] = [
  "claimed",
  "observed",
  "verified",
  "sustained",
];

export const STATE_LABEL: Record<EvidenceState, string> = {
  claimed: "Claimed",
  observed: "Observed",
  verified: "Verified",
  sustained: "Sustained",
  retired: "Retired",
};

export const STATE_MEANING: Record<EvidenceState, string> = {
  claimed: "Somebody says it worked. Nothing has been measured.",
  observed: "Measured once, against no baseline. Suggestive, not settled.",
  verified: "Held against a baseline and a stop condition that could have failed it.",
  sustained: "Still true a quarter later, after the novelty wore off.",
  retired: "Stopped on purpose, with a reason worth keeping.",
};

export const DECISION_LABEL: Record<Decision, string> = {
  "run-experiment": "Run the 30-day experiment",
  "redesign-first": "Redesign before piloting",
  "do-not-deploy": "Do not deploy",
};

/**
 * Twelve synthetic records, clearly labeled as synthetic in the interface.
 * The distribution is the argument: most decisions never leave "claimed."
 */
export const SEED_RECORDS: DecisionRecord[] = [
  {
    id: "r-01",
    workflow: "Specification QA and submittal review",
    archetype: "25 to 75 staff, civil and structural",
    pricing: "hourly",
    belief: "42% less drafting time would drop straight to the bottom line.",
    contradiction:
      "Under time and materials, the saved hours were unbilled revenue. Review load moved onto one licensed PE.",
    decision: "redesign-first",
    owner: "Structural practice leader",
    evidenceRequired: "Margin per package against a pre-AI baseline, with PE hours capped",
    state: "verified",
    outcome:
      "Fee model moved to fixed fee for this service before any package ran. Margin held above baseline for two months.",
    month: "Feb",
  },
  {
    id: "r-02",
    workflow: "Proposal and pursuit drafting",
    archetype: "75 to 250 staff, multi-discipline",
    pricing: "mixed",
    belief: "Faster proposals would lift the win rate.",
    contradiction:
      "Win rate is set by shortlist position, not draft speed. Nobody owned the measurement.",
    decision: "run-experiment",
    owner: "Marketing director",
    evidenceRequired: "Win rate on 20 pursuits against the prior 20",
    state: "observed",
    outcome: "Drafting time fell by a third. Win rate moved inside noise. Still running.",
    month: "Mar",
  },
  {
    id: "r-03",
    workflow: "Zoning and code pre-check",
    archetype: "Under 25 staff, architecture",
    pricing: "fixed",
    belief: "An agent could clear early feasibility in an afternoon.",
    contradiction:
      "Nobody could say who would carry responsibility for a missed provision.",
    decision: "do-not-deploy",
    owner: "Managing principal",
    evidenceRequired: "A named reviewer and a written scope of what the agent may not decide",
    state: "claimed",
    month: "Mar",
  },
  {
    id: "r-04",
    workflow: "Submittal log maintenance",
    archetype: "75 to 250 staff, civil",
    pricing: "mixed",
    belief: "Log upkeep was pure administrative drag.",
    contradiction:
      "None worth blocking on. Low professional risk, clear owner, measurable hours.",
    decision: "run-experiment",
    owner: "Project controls lead",
    evidenceRequired: "Admin hours per project per month",
    state: "sustained",
    outcome:
      "Held for two quarters. Roughly 30 admin hours a month returned, redeployed to backlog rather than absorbed.",
    month: "Jan",
  },
  {
    id: "r-05",
    workflow: "Drawing set QA",
    archetype: "25 to 75 staff, MEP",
    pricing: "hourly",
    belief: "Automated checks would catch coordination clashes earlier.",
    contradiction:
      "The agent flagged volume, not severity. Reviewers began skimming, which is worse than not running it.",
    decision: "run-experiment",
    owner: "MEP discipline lead",
    evidenceRequired: "Clashes caught before issue, and reviewer time per set",
    state: "retired",
    outcome:
      "Stopped at day 24 on its own stop condition. Reviewer trust was falling. Recorded as a real result, not a failure to hide.",
    month: "Feb",
  },
  {
    id: "r-06",
    workflow: "RFI response drafting",
    archetype: "Over 250 staff, multi-discipline",
    pricing: "mixed",
    belief: "Response turnaround was the bottleneck.",
    contradiction:
      "Turnaround was waiting on engineer availability, not on drafting. The draft was never the slow part.",
    decision: "redesign-first",
    owner: "Regional operations manager",
    evidenceRequired: "Median days from RFI receipt to issued response",
    state: "observed",
    outcome: "Triage rules changed first. Median dropped before any agent was deployed.",
    month: "Apr",
  },
  {
    id: "r-07",
    workflow: "Meeting minutes and action capture",
    archetype: "Under 25 staff, architecture",
    pricing: "fixed",
    belief: "Everyone wanted it. It felt like an obvious win.",
    contradiction:
      "No owner, no measurable, and client confidentiality terms had not been read.",
    decision: "redesign-first",
    owner: "Unassigned",
    evidenceRequired: "A data boundary in writing, then an owner",
    state: "claimed",
    month: "Apr",
  },
  {
    id: "r-08",
    workflow: "Calculation package checking",
    archetype: "25 to 75 staff, structural",
    pricing: "fixed",
    belief: "Checking could be halved without touching the stamp.",
    contradiction:
      "Halving the check also halved the junior exposure that produces future checkers.",
    decision: "run-experiment",
    owner: "Principal engineer",
    evidenceRequired: "Check hours, plus a floor on junior manual practice hours",
    state: "verified",
    outcome:
      "Ran with a 20% blind manual audit retained. Check hours down, practice floor held, no material misses.",
    month: "Feb",
  },
  {
    id: "r-09",
    workflow: "Site photo classification",
    archetype: "75 to 250 staff, civil",
    pricing: "mixed",
    belief: "Field teams would adopt it immediately.",
    contradiction: "Field teams were never asked. Adoption was assumed from the office.",
    decision: "redesign-first",
    owner: "Field operations",
    evidenceRequired: "Weekly active field users, not licences purchased",
    state: "claimed",
    month: "May",
  },
  {
    id: "r-10",
    workflow: "Client reporting summaries",
    archetype: "Over 250 staff, multi-discipline",
    pricing: "fixed",
    belief: "Clients would value faster monthly reporting.",
    contradiction:
      "Two clients had contract terms restricting third-party processing of project data.",
    decision: "do-not-deploy",
    owner: "Contracts counsel",
    evidenceRequired: "Contract review per client before any pilot",
    state: "retired",
    outcome: "Stopped before launch. The contract review became standard practice afterwards.",
    month: "Mar",
  },
  {
    id: "r-11",
    workflow: "Bid levelling and comparison",
    archetype: "25 to 75 staff, civil",
    pricing: "hourly",
    belief: "Levelling was repetitive enough to automate outright.",
    contradiction:
      "Repetitive in shape, not in judgment. Exceptions carried the risk and the exceptions were the work.",
    decision: "run-experiment",
    owner: "Preconstruction lead",
    evidenceRequired: "Exception rate and rework hours per bid package",
    state: "observed",
    month: "May",
  },
  {
    id: "r-12",
    workflow: "Internal knowledge search",
    archetype: "75 to 250 staff, multi-discipline",
    pricing: "mixed",
    belief: "A search agent would unlock decades of project knowledge.",
    contradiction:
      "The knowledge was in people and unindexed drives. The agent surfaced whatever was tidy, which was the newest and least valuable material.",
    decision: "redesign-first",
    owner: "Knowledge manager",
    evidenceRequired: "Share of answered queries traced to a source document",
    state: "claimed",
    month: "May",
  },
];

export interface PortfolioStats {
  total: number;
  active: number;
  byState: Record<EvidenceState, number>;
  /** Records that never left the first rung, as a share of non-retired work. */
  stuckAtClaimedPct: number;
  /** Records that may contribute an anonymized pattern. */
  patternEligible: number;
  /** Retired records still teach, so they are counted separately. */
  retired: number;
}

export function portfolioStats(records: DecisionRecord[]): PortfolioStats {
  const byState: Record<EvidenceState, number> = {
    claimed: 0,
    observed: 0,
    verified: 0,
    sustained: 0,
    retired: 0,
  };
  for (const r of records) byState[r.state]++;

  const retired = byState.retired;
  const active = records.length - retired;
  const patternEligible = byState.verified + byState.sustained;

  return {
    total: records.length,
    active,
    byState,
    stuckAtClaimedPct: active === 0 ? 0 : (byState.claimed / active) * 100,
    patternEligible,
    retired,
  };
}

/** A record earns a place in the pattern library only once it is proven. */
export function canEmitPattern(r: DecisionRecord): boolean {
  return r.state === "verified" || r.state === "sustained";
}

/** Move a record one rung up the ladder. Retired records do not move. */
export function advance(r: DecisionRecord): DecisionRecord {
  if (r.state === "retired" || r.state === "sustained") return r;
  const i = STATE_ORDER.indexOf(r.state);
  return { ...r, state: STATE_ORDER[i + 1] };
}

/** Stopping something on purpose is a result, so it is always allowed. */
export function retire(r: DecisionRecord): DecisionRecord {
  return { ...r, state: "retired" };
}

/**
 * The line the portfolio view leads with. It is computed, never asserted,
 * and it says the uncomfortable thing first.
 */
export function headline(stats: PortfolioStats): string {
  if (stats.active === 0) return "Nothing active. Every decision has been closed out.";
  const pct = Math.round(stats.stuckAtClaimedPct);
  if (pct === 0)
    return `All ${stats.active} active decisions have been measured at least once.`;
  return `${stats.byState.claimed} of ${stats.active} active decisions have never been measured.`;
}
