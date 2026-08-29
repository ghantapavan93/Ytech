import {
  ATLAS_BASELINE,
  LEGACY_BASELINE_LEVERS,
  NAIVE_DEPLOYMENT,
  runEngine,
  type Levers,
  type PricingModel,
} from "@/lib/engines/engine";

/**
 * The same firm, the same agent, swept across how much of its freed capacity
 * the market will actually buy.
 *
 * Everything else is held still on purpose. Review is on the tiered gate and
 * the firm routes every freed hour it can, which is the most favourable
 * operating model the run ever reaches. Only the fee model and the market
 * move, so anything that changes is one of those two.
 */

/** Pre-AI, legacy operating model. The line every reading is measured against. */
export const LEGACY = runEngine(ATLAS_BASELINE, LEGACY_BASELINE_LEVERS);

const TUNED: Levers = {
  ...NAIVE_DEPLOYMENT,
  backlogRedeploymentPct: 1,
  reviewArchitecture: "TIERED_DELTA_GATE",
};

export const FEE_MODELS: { id: PricingModel; name: string; short: string }[] = [
  { id: "TM_100", name: "Billed hourly", short: "HOURLY" },
  { id: "FIXED_FEE", name: "Fixed fee per package", short: "FIXED FEE" },
];

export function at(pricingModel: PricingModel, demandAbsorption: number) {
  return runEngine(
    ATLAS_BASELINE,
    { ...TUNED, pricingModel },
    { demandAbsorption },
  );
}

/** Position against the pre-AI baseline, which is the only comparison that matters. */
export const positionAt = (pricingModel: PricingModel, absorption: number) =>
  at(pricingModel, absorption).margin - LEGACY.margin;

/** The sweep, at a resolution the eye reads as continuous. */
export const STEPS = 21;

export const CURVES = FEE_MODELS.map((m) => ({
  ...m,
  points: Array.from({ length: STEPS }, (_, i) => {
    const absorption = i / (STEPS - 1);
    return { absorption, position: positionAt(m.id, absorption) };
  }),
}));

/**
 * What the market is worth, per fee model.
 *
 * Written expecting the hourly firm to be more exposed. It is not: a
 * redeployed hour bills at the junior rate whatever the packages are priced
 * at, so the number is identical. What the subsidy is holding up is not.
 */
export const SUBSIDY = FEE_MODELS.map((m) => ({
  ...m,
  best: positionAt(m.id, 1),
  worst: positionAt(m.id, 0),
  worth: positionAt(m.id, 1) - positionAt(m.id, 0),
}));

export const SUBSIDY_WORTH = SUBSIDY[0].worth;
