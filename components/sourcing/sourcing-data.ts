import {
  ATLAS_BASELINE,
  NAIVE_DEPLOYMENT,
  runEngine,
  type Levers,
} from "@/lib/engines/engine";

/**
 * What the sourcing decision is worth, measured against what it is usually
 * weighed instead of.
 *
 * The engine settles one thing here on its own. Where a tool came from does
 * not touch the value side of the model at all: the same hours come free,
 * the same review load arrives, the same fee gate decides who keeps it. A
 * bought tool and a built one differ on exactly one line, which is what the
 * tool costs. That is verified rather than asserted, in sourcing-data.test.
 *
 * So the whole sourcing question lives inside a single cost line, and the
 * operating model around it is worth OPERATING_SWING a month. That is the
 * ratio this page exists to show, and the conclusion it points at is not
 * that the question is unimportant. It is that a cost comparison is the
 * wrong instrument for it.
 */

const RETUNED: Levers = {
  ...NAIVE_DEPLOYMENT,
  pricingModel: "FIXED_FEE",
  backlogRedeploymentPct: 1,
  reviewArchitecture: "TIERED_DELTA_GATE",
  apprenticeshipSafeguard: "BLIND_AUDIT_20_PCT",
};

const NAIVE = runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT);
const TUNED = runEngine(ATLAS_BASELINE, RETUNED);

/** What changing the four conditions is worth a month, on the same workflow. */
export const OPERATING_SWING = TUNED.deltaMargin - NAIVE.deltaMargin;

/** The subscription the rest of the site already assumes. */
export const DEFAULT_SUBSCRIPTION = ATLAS_BASELINE.aiToolCostPerMonth;

/**
 * Three years, because it is the shortest window over which a firm would
 * expect to still be running the thing, and a shorter one flatters buying.
 */
export const AMORTISATION_MONTHS = 36;

export interface Costs {
  /** What a vendor charges each month. */
  subscription: number;
  /** One-off cost of building it. */
  buildCost: number;
  /** Keeping a built thing alive, each month. */
  maintenance: number;
}

export const DEFAULT_COSTS: Costs = {
  subscription: DEFAULT_SUBSCRIPTION,
  buildCost: 60_000,
  maintenance: 400,
};

export function compare(costs: Costs) {
  const buy = costs.subscription;
  const build = costs.buildCost / AMORTISATION_MONTHS + costs.maintenance;
  const gap = Math.abs(buy - build);
  return {
    buy,
    build,
    gap,
    cheaper: build < buy ? ("build" as const) : ("buy" as const),
    /** The sourcing decision as a share of the decision nobody is making. */
    shareOfOperating: gap / OPERATING_SWING,
  };
}
