import {
  ATLAS_BASELINE,
  NAIVE_DEPLOYMENT,
  runEngine,
  type ApprenticeshipSafeguard,
  type EngineOutput,
  type Levers,
  type PricingModel,
  type Recommendation,
  type ReviewArchitecture,
} from "./engine";

/**
 * Every operating model this firm could choose, ranked by the number a
 * dashboard would put on the wall.
 *
 * This exists to answer one objection, which is the sharpest one anybody
 * brings to an instrument like this: that it is a new metric, and a metric
 * is a thing people learn to manage rather than a thing that changes what
 * they do. The answer cannot be a promise. It has to be the ranking.
 *
 * Ordered by margin, the top of this list is a liability breach and the
 * second is a firm that has stopped training anybody. The best configuration
 * the instrument will actually sign sits fourth and is worth measurably less
 * than the one it refuses. A reader who optimises the headline arrives
 * somewhere the instrument will not follow them, which is the only useful
 * property a number like this can have.
 *
 * Redeployment is held at full throughout, so every row is being shown in
 * the most favourable market it will ever see.
 */

const PRICING: PricingModel[] = ["FIXED_FEE", "BLENDED_50", "TM_100"];
const REVIEW: ReviewArchitecture[] = [
  "TIERED_DELTA_GATE",
  "FULL_MANUAL",
  "RAW_AI_UNGOVERNED",
];
const PRACTICE: ApprenticeshipSafeguard[] = ["BLIND_AUDIT_20_PCT", "NONE"];

export const PRICING_LABEL: Record<PricingModel, string> = {
  FIXED_FEE: "Fixed fee",
  BLENDED_50: "Half fixed",
  TM_100: "Hourly",
};

export const REVIEW_LABEL: Record<ReviewArchitecture, string> = {
  TIERED_DELTA_GATE: "Tiered gate",
  FULL_MANUAL: "Full manual review",
  RAW_AI_UNGOVERNED: "Raw AI accepted",
};

export const PRACTICE_LABEL: Record<ApprenticeshipSafeguard, string> = {
  BLIND_AUDIT_20_PCT: "20% blind audit",
  NONE: "No safeguard",
};

export const VERDICT_LABEL: Record<Recommendation, string> = {
  RUN_30_DAY_EXPERIMENT: "Will sign",
  REDESIGN_BEFORE_PILOT: "Redesign first",
  DO_NOT_DEPLOY: "Refused",
};

export interface Configuration {
  levers: Levers;
  out: EngineOutput;
  /** Monthly position against the firm before the agent. */
  position: number;
  signed: boolean;
  label: string;
  /** Why the instrument will not sign it, when it will not. */
  refusal: string | null;
}

function refusalFor(out: EngineOutput): string | null {
  if (out.liabilityBreach) {
    return "Unreviewed AI output ships under a licensed stamp. Professional responsibility is not delegable, so no margin makes this signable.";
  }
  if (out.recommendation === "REDESIGN_BEFORE_PILOT") {
    return out.learningIndexPct === 0
      ? "Every deep-practice hour is gone. The firm is more profitable this month and has stopped producing the engineers who will hold the licence."
      : "A condition around the workflow has to change before a live test would mean anything.";
  }
  if (out.recommendation === "DO_NOT_DEPLOY") {
    return "The review gate is past what the licensed desk can carry, so the result depends on someone working beyond capacity.";
  }
  return null;
}

export const CONFIGURATIONS: Configuration[] = PRICING.flatMap((pricingModel) =>
  REVIEW.flatMap((reviewArchitecture) =>
    PRACTICE.map((apprenticeshipSafeguard) => {
      const levers: Levers = {
        ...NAIVE_DEPLOYMENT,
        pricingModel,
        reviewArchitecture,
        apprenticeshipSafeguard,
        backlogRedeploymentPct: 1,
      };
      const out = runEngine(ATLAS_BASELINE, levers);
      return {
        levers,
        out,
        position: out.deltaMargin,
        signed: out.recommendation === "RUN_30_DAY_EXPERIMENT",
        label: `${PRICING_LABEL[pricingModel]} · ${REVIEW_LABEL[reviewArchitecture]} · ${PRACTICE_LABEL[apprenticeshipSafeguard]}`,
        refusal: refusalFor(out),
      };
    }),
  ),
).sort((a, b) => b.position - a.position);

/** The number a dashboard would celebrate. */
export const BEST = CONFIGURATIONS[0];

/** The best one the instrument will actually sign. */
export const BEST_SIGNED = CONFIGURATIONS.find((c) => c.signed)!;

export const BEST_SIGNED_RANK = CONFIGURATIONS.indexOf(BEST_SIGNED) + 1;

/** What refusing the top of the ranking costs, every month. */
export const COST_OF_REFUSING = BEST.position - BEST_SIGNED.position;
