import {
  ATLAS_BASELINE as B,
  LEGACY_BASELINE_LEVERS,
  NAIVE_DEPLOYMENT,
  runEngine,
} from "@/lib/engines/engine";

/**
 * The 10X screen, run twice on the same workflow.
 *
 * Problem selection in this industry is taught as a return threshold: pick
 * problems worth at least ten times what they cost to build. It is good
 * discipline and this is not an argument against it. It is an argument that
 * the threshold is applied to the wrong quantity.
 *
 * A screen values the hours the agent frees. The instrument values what
 * reaches the firm after the fee model, the routing decision, the review
 * gate and the practice floor have each taken their share. On the workflow
 * the wind tunnel models, those two numbers are not merely different sizes.
 * They are on opposite sides of zero, which means no build cost separates
 * them: the screen passes at any price under a tenth of the gross, and the
 * outcome fails at every price including nothing at all.
 */

const LEGACY = runEngine(B, LEGACY_BASELINE_LEVERS);
const NAIVE = runEngine(B, NAIVE_DEPLOYMENT);

const MONTHS = 12;

/** Hours the agent frees each month, whether or not anything catches them. */
export const FREED_HOURS = NAIVE.jrRedeployedHours + NAIVE.jrSavedHoursUnused;

/**
 * What a screen counts: freed hours priced at what the firm bills for them.
 *
 * The generous reading on purpose, because it is the one a business case
 * uses. The conclusion does not depend on it. Priced at loaded cost instead
 * of billing rate the gross figure falls to GROSS_AT_COST and stays firmly
 * on the far side of zero from the outcome.
 */
export const GROSS_ANNUAL = FREED_HOURS * B.jrBillRate * MONTHS;
export const GROSS_AT_COST = FREED_HOURS * B.jrCostRate * MONTHS;

/** What the firm is actually left with, same workflow, operating model untouched. */
export const CARRIED_ANNUAL = (NAIVE.margin - LEGACY.margin) * MONTHS;

/** The distance between the number that gets a project approved and the result. */
export const GAP = GROSS_ANNUAL - CARRIED_ANNUAL;

/** Mehdi Nourbakhsh's stated bar for problem selection. */
export const BAR = 10;

/** Highest build cost at which the gross screen still clears the bar. */
export const GROSS_PASSES_UNDER = GROSS_ANNUAL / BAR;

/**
 * Deliberately not guarded against a zero build cost.
 *
 * Clamping the divisor to one produced a multiple of 352,800 at the free end
 * of the control, which is arithmetic nobody should be shown. Dividing by
 * zero is the correct answer here and the language already has it: a free
 * agent clears any threshold on gross, so the gross multiple is positive
 * infinity, and the carried multiple is negative infinity, which still does
 * not reach the bar. Only the formatting needed care.
 */
export function screen(buildCost: number) {
  const grossMultiple = GROSS_ANNUAL / buildCost;
  const carriedMultiple = CARRIED_ANNUAL / buildCost;
  return {
    free: buildCost <= 0,
    grossMultiple,
    carriedMultiple,
    grossPasses: grossMultiple >= BAR,
    /** Never true. Kept as a computation rather than as a claim. */
    carriedPasses: carriedMultiple >= BAR,
  };
}
