import type { EngineOutput, Levers } from "./engine";

/**
 * The Index Lens, the wind tunnel scored through the lens of YegaTech's
 * AI Transformation Index.
 *
 * What is theirs: the four dimensions, their weights (Culture 0.20,
 * AI Adoption 0.15, Operating Model 0.35, Business Model 0.30) and the
 * stage bands (Exploring 0–24, Adopting 25–49, Transforming 50–74,
 * Leading 75+), all read from the Index page's published client-side
 * scoring script at yegatech.com/ai-readiness/.
 *
 * What is ours: the mapping from wind-tunnel outputs to a 1–5 rating per
 * dimension. It is deterministic, documented below, and deliberately
 * conservative, Culture is held constant because this instrument
 * measures economics, not culture, and refuses to pretend otherwise.
 */

export type IndexStage = "Exploring" | "Adopting" | "Transforming" | "Leading";

export interface DimensionScore {
  name: string;
  /** YegaTech's published weight for this dimension (sums to 1). */
  weight: number;
  /** Our mapped rating on their 1–5 scale. */
  rating: number;
  /** Why the rating is what it is, in wind-tunnel terms. */
  rationale: string;
}

export interface IndexLensResult {
  dimensions: DimensionScore[];
  /** Weighted score as a percentage of the maximum (their formula shape). */
  scorePct: number;
  stage: IndexStage;
}

/** YegaTech's published stage bands. */
export function stageFor(scorePct: number): IndexStage {
  if (scorePct >= 75) return "Leading";
  if (scorePct >= 50) return "Transforming";
  if (scorePct >= 25) return "Adopting";
  return "Exploring";
}

export function computeIndexLens(
  out: EngineOutput,
  levers: Levers): IndexLensResult {
  // Operating Model (their weight: 0.35), is the workflow actually
  // redesigned, with ownership, inside sustainable capacity?
  let opModel = 1.5;
  let opWhy =
    "AI dropped into an unchanged workflow: no redesigned roles, review queues at one overloaded license.";
  if (levers.reviewArchitecture === "TIERED_DELTA_GATE") {
    opModel += 1.5;
    opWhy =
      "Review architecture redesigned around the agent with clear PE ownership";
    if (out.peHoursPerWeek <= 10) {
      opModel += 0.5;
      opWhy += ", running inside sustainable capacity";
    }
    if (levers.backlogRedeploymentPct >= 0.5) {
      opModel += 0.5;
      opWhy += ", with freed capacity deliberately re-routed";
    }
    opWhy += ".";
  }

  // Business Model (their weight: 0.30), does the fee structure let the
  // firm keep the value the agent creates?
  let bizModel = 1.5;
  let bizWhy =
    "Time-and-materials billing hands the agent's value to the client and books the loss.";
  if (levers.pricingModel === "FIXED_FEE") {
    bizModel += 1.5;
    bizWhy = "Fixed-fee pricing decouples revenue from hours";
  } else if (levers.pricingModel === "BLENDED_50") {
    bizModel += 0.75;
    bizWhy = "Blended pricing captures part of the saved time";
  }
  if (levers.pricingModel !== "TM_100") {
    if (out.deltaMargin > 0) {
      bizModel += 1;
      bizWhy += ", and the margin delta proves the firm now keeps the value.";
    } else {
      bizWhy += ", though the configuration is not yet margin-positive.";
    }
  }

  // AI Adoption (their weight: 0.15), the agent runs inside a core
  // workflow either way; full integration credit only when the whole
  // system accepts it.
  let adoption = levers.aiEnabled ? 3 : 1;
  let adoptWhy = levers.aiEnabled
    ? "The agent runs inside a core production workflow."
    : "No agent deployed.";
  if (levers.aiEnabled && out.systemStatus === "OPTIMAL_GOVERNANCE") {
    adoption += 0.5;
    adoptWhy =
      "The agent runs inside a core workflow and the surrounding system now supports it.";
  }

  // Culture (their weight: 0.20), outside this instrument's scope, held
  // constant on purpose.
  const culture = 3;
  const cultureWhy =
    "Held constant: the wind tunnel measures economics, not culture, and refuses to score what it cannot see.";

  const dimensions: DimensionScore[] = [
    { name: "Operating Model", weight: 0.35, rating: Math.min(opModel, 5), rationale: opWhy },
    { name: "Business Model", weight: 0.3, rating: Math.min(bizModel, 5), rationale: bizWhy },
    { name: "Culture of Innovation", weight: 0.2, rating: culture, rationale: cultureWhy },
    { name: "AI Adoption", weight: 0.15, rating: Math.min(adoption, 5), rationale: adoptWhy },
  ];

  const weighted = dimensions.reduce((s, d) => s + d.rating * d.weight, 0);
  const scorePct = Math.round((weighted / 5) * 1000) / 10;

  return { dimensions, scorePct, stage: stageFor(scorePct) };
}
