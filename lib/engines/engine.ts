/**
 * Value Shift, deterministic causal engine.
 *
 * Every number produced here is pure arithmetic over explicit, synthetic,
 * editable assumptions. No LLM touches this module. The engine models one
 * workflow (specification QA & submittal compliance review) inside one
 * synthetic firm (Atlas Structural & Civil) and propagates an AI speedup
 * through four organizational pillars:
 *
 *   1. Revenue       , fee structure decides who captures saved time.
 *   2. Review gate   , licensed-PE verification capacity.
 *   3. Incentives    , junior utilization, which PMs are rated on.
 *   4. Apprenticeship, deep-practice hours that grow future PEs.
 *
 * Costing convention: direct labor is costed on worked hours (job-cost
 * view). Idle capacity is not a direct cost; it surfaces as the
 * utilization pillar, which is exactly where AEC incentive systems feel it.
 */

export type PricingModel = "TM_100" | "BLENDED_50" | "FIXED_FEE";

export type ReviewArchitecture =
  | "FULL_MANUAL" // PE re-verifies raw AI output line-by-line: hours surge
  | "RAW_AI_UNGOVERNED" // AI output passes with a spot check: liability breach
  | "TIERED_DELTA_GATE"; // AI flags only delta/high-risk clauses for the PE

export type ApprenticeshipSafeguard =
  | "NONE" // juniors only shepherd AI output; deep practice disappears
  | "BLIND_AUDIT_20_PCT"; // juniors run a blind manual pass on a 20% sample

export type PillarStatus = "OK" | "WARN" | "CRITICAL";

export type SystemStatus =
  | "OPTIMAL_GOVERNANCE"
  | "WARNING_FRICTION"
  | "CRITICAL_REJECTION";

export type Recommendation =
  | "RUN_30_DAY_EXPERIMENT"
  | "REDESIGN_BEFORE_PILOT"
  | "DO_NOT_DEPLOY";

export interface FirmBaseline {
  /** Spec packages reviewed per month. */
  monthlyPackageVolume: number;
  /** Hours per package before AI, by role. */
  baseJrHoursPerPkg: number;
  basePmHoursPerPkg: number;
  basePeHoursPerPkg: number;
  /** Billing rates ($/hr) under time-and-materials. */
  jrBillRate: number;
  pmBillRate: number;
  peBillRate: number;
  /** Loaded cost rates ($/hr). */
  jrCostRate: number;
  pmCostRate: number;
  peCostRate: number;
  /** Junior billable utilization before AI (0–1). Sets junior capacity. */
  baselineJrUtilization: number;
  /** Flat monthly AI tooling + token spend when the agent is on. */
  aiToolCostPerMonth: number;
  /** Fee per package if the firm converts this service to fixed fee. */
  fixedFeePerPackage: number;
  /** Working weeks per month, for PE load display. */
  weeksPerMonth: number;
  /** Weekly PE review hours considered sustainable. */
  pePillarSustainableHrsPerWeek: number;
  /** Weekly PE review hours considered a hard bottleneck. */
  pePillarCriticalHrsPerWeek: number;
}

export interface Levers {
  /** Whether the spec-QA agent is deployed at all. */
  aiEnabled: boolean;
  /** Fraction of junior production time the agent removes (0–1). */
  aiSpeedupPct: number;
  pricingModel: PricingModel;
  /** Fraction of freed junior hours redeployed to billable backlog (0–1). */
  backlogRedeploymentPct: number;
  reviewArchitecture: ReviewArchitecture;
  apprenticeshipSafeguard: ApprenticeshipSafeguard;
}

export interface PillarResult {
  status: PillarStatus;
  /** Headline value for the pillar card (already formatted units decided by UI). */
  headline: number;
  /** One-sentence explanation of what happened to this pillar. */
  narrative: string;
}

export interface EngineOutput {
  // Monthly totals, current lever state
  revenue: number;
  cost: number;
  margin: number;
  marginPct: number;
  // Baseline (pre-AI, legacy operating model) for comparison
  baselineRevenue: number;
  baselineCost: number;
  baselineMargin: number;
  baselineMarginPct: number;
  deltaMargin: number;
  deltaRevenue: number;
  // Pillar detail
  jrPackageHours: number;
  jrRedeployedHours: number;
  jrSavedHoursUnused: number;
  /**
   * The two reasons a freed hour goes unused, kept apart.
   *
   * They sum to jrSavedHoursUnused and they are not the same problem. Hours
   * nobody routed are a leadership decision and the whole argument of this
   * instrument is that those are fixable. Hours nobody could sell are a
   * market condition, and no amount of operating-model design recovers them.
   * Reporting one number for both let a market condition read as a
   * management failure, and let a management failure hide behind the market.
   */
  jrHoursUnrouted: number;
  jrHoursUnsold: number;
  jrUtilizationPct: number; // 0–100
  baselineJrUtilizationPct: number; // 0–100
  peHoursPerPkg: number;
  peHoursPerWeek: number;
  baselinePeHoursPerWeek: number;
  deepPracticeHours: number;
  learningIndexPct: number; // 0–100, share of baseline deep-practice hours kept
  liabilityBreach: boolean;
  pillars: {
    revenue: PillarResult;
    reviewGate: PillarResult;
    incentives: PillarResult;
    apprenticeship: PillarResult;
  };
  systemStatus: SystemStatus;
  recommendation: Recommendation;
  primaryBreakdownReason: string;
}

/**
 * Atlas Structural & Civil, the synthetic 45-person firm. All values editable.
 *
 * The hour split is calibrated against published state DOT consultant fee
 * guidance, which is the only non-vendor source that breaks staff hours out
 * by class. Across nine Ohio DOT packages the preparer share averages 72.8
 * percent and total oversight averages 27.2 percent. This model sits at
 * 76.9 and 23.1, inside both ranges.
 *
 * The licensed share was raised from an earlier draft after that check.
 * Two PE hours per package put the licensed share at 7.7 percent against a
 * DOT senior-share mean near 21, which was the softest number here. Three
 * hours is still conservative and it makes the review gate bind earlier,
 * which is the honest direction: the earlier draft was arguing against its
 * own thesis.
 *
 * There is no published per-submittal labor-hour standard from CSI, ASCE,
 * AIA, or the DoD. Those bodies publish calendar durations, not hours.
 * Every per-submittal hour figure in circulation is vendor-published, so
 * the DOT calibration above is the honest anchor.
 *
 * The unit here is a specification-section review or a bundled structural
 * submittal package, not a single submittal. A single submittal is a very
 * different job.
 */
export const ATLAS_BASELINE: FirmBaseline = {
  monthlyPackageVolume: 20,
  baseJrHoursPerPkg: 20,
  basePmHoursPerPkg: 3,
  basePeHoursPerPkg: 3,
  jrBillRate: 175,
  pmBillRate: 240,
  peBillRate: 310,
  jrCostRate: 85,
  pmCostRate: 130,
  peCostRate: 160,
  baselineJrUtilization: 0.92,
  aiToolCostPerMonth: 800,
  fixedFeePerPackage: 4800,
  weeksPerMonth: 4,
  pePillarSustainableHrsPerWeek: 15,
  pePillarCriticalHrsPerWeek: 22,
};

/** Lever state the firm starts from: agent shipped into an untouched operating model. */
export const NAIVE_DEPLOYMENT: Levers = {
  aiEnabled: true,
  aiSpeedupPct: 0.42,
  pricingModel: "TM_100",
  backlogRedeploymentPct: 0,
  reviewArchitecture: "FULL_MANUAL",
  apprenticeshipSafeguard: "NONE",
};

/** Lever state before any AI exists, used to compute the comparison baseline. */
export const LEGACY_BASELINE_LEVERS: Levers = {
  aiEnabled: false,
  aiSpeedupPct: 0,
  pricingModel: "TM_100",
  backlogRedeploymentPct: 0,
  reviewArchitecture: "FULL_MANUAL",
  apprenticeshipSafeguard: "NONE",
};

/** Share of packages billed at a fixed fee under each pricing model. */
function fixedFeeShare(model: PricingModel): number {
  switch (model) {
    case "TM_100":
      return 0;
    case "BLENDED_50":
      return 0.5;
    case "FIXED_FEE":
      return 1;
  }
}

/**
 * PE verification hours per package once the agent is in the loop.
 *
 * FULL_MANUAL models the observed failure mode: juniors forward raw
 * 50-page AI redline matrices upstream, so the PE re-verifies everything
 * and per-package review time surges 75% above baseline.
 */
function peHoursPerPkg(base: FirmBaseline, levers: Levers): number {
  if (!levers.aiEnabled) return base.basePeHoursPerPkg;
  switch (levers.reviewArchitecture) {
    case "FULL_MANUAL":
      return base.basePeHoursPerPkg * 1.75;
    case "RAW_AI_UNGOVERNED":
      return 0.25;
    case "TIERED_DELTA_GATE":
      return 1.0;
  }
}

/**
 * Conditions outside the firm's control, as distinct from levers inside it.
 *
 * Everything in Levers is something a principal can decide on a Monday.
 * This is not. It is here because leaving it out was quietly asserting the
 * most generous version of it: that every hour the agent frees can be sold
 * to somebody, which is true in the labour market of 2026 and is not a law.
 */
export interface Conditions {
  /**
   * Share of freed junior hours for which billable work actually exists
   * (0–1). One is the shortage every firm is currently operating in, where
   * roughly a third of practices are turning work away, so redeployment is
   * capped by intent alone. It is a market reading, not a firm property, and
   * it is the assumption a pilot run today is silently making.
   */
  demandAbsorption: number;
}

/** What the model assumed before the condition was named. */
export const ABUNDANT: Conditions = { demandAbsorption: 1 };

/** Keeps a hand-entered condition inside the range the arithmetic assumes. */
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function runEngine(
  base: FirmBaseline,
  levers: Levers,
  conditions: Conditions = ABUNDANT,
): EngineOutput {
  const V = base.monthlyPackageVolume;

  // ---- Junior production hours -------------------------------------------
  const jrBaseTotal = V * base.baseJrHoursPerPkg;
  const aiJrHoursPerPkg = base.baseJrHoursPerPkg * (1 - levers.aiSpeedupPct);

  let jrPackageHours: number;
  if (!levers.aiEnabled) {
    jrPackageHours = jrBaseTotal;
  } else if (levers.apprenticeshipSafeguard === "BLIND_AUDIT_20_PCT") {
    // 20% of packages get a full blind manual pass (deliberate practice),
    // the rest run AI-assisted. Protecting judgment costs real hours.
    jrPackageHours = V * (0.2 * base.baseJrHoursPerPkg + 0.8 * aiJrHoursPerPkg);
  } else {
    jrPackageHours = V * aiJrHoursPerPkg;
  }

  /*
   * Redeployment is the smaller of what the firm routes and what the market
   * will buy. Intent alone used to decide it, which made a full backlog an
   * unstated premise of every result the instrument produced.
   */
  const jrSavedPool = jrBaseTotal - jrPackageHours;
  const intendedRedeploy = jrSavedPool * levers.backlogRedeploymentPct;
  const absorbableHours = jrSavedPool * clamp01(conditions.demandAbsorption);
  const jrRedeployedHours = Math.min(intendedRedeploy, absorbableHours);
  const jrSavedHoursUnused = jrSavedPool - jrRedeployedHours;
  const jrHoursUnrouted = jrSavedPool - intendedRedeploy;
  const jrHoursUnsold = jrSavedHoursUnused - jrHoursUnrouted;

  // Junior capacity is fixed by headcount: baseline hours at baseline utilization.
  const jrCapacityHours = jrBaseTotal / base.baselineJrUtilization;
  const jrUtilization = (jrPackageHours + jrRedeployedHours) / jrCapacityHours;

  // ---- Other roles --------------------------------------------------------
  const pmHours = V * base.basePmHoursPerPkg;
  const pePerPkg = peHoursPerPkg(base, levers);
  const peHours = V * pePerPkg;
  const peHoursPerWeek = peHours / base.weeksPerMonth;

  // ---- Revenue ------------------------------------------------------------
  const f = fixedFeeShare(levers.pricingModel);
  const tmPackageRevenue =
    (1 - f) *
    (jrPackageHours * base.jrBillRate +
      pmHours * base.pmBillRate +
      peHours * base.peBillRate);
  const fixedPackageRevenue = f * V * base.fixedFeePerPackage;
  const backlogRevenue = jrRedeployedHours * base.jrBillRate;
  const revenue = tmPackageRevenue + fixedPackageRevenue + backlogRevenue;

  // ---- Cost ---------------------------------------------------------------
  const jrWorkedHours = jrPackageHours + jrRedeployedHours;
  const cost =
    jrWorkedHours * base.jrCostRate +
    pmHours * base.pmCostRate +
    peHours * base.peCostRate +
    (levers.aiEnabled ? base.aiToolCostPerMonth : 0);

  const margin = revenue - cost;

  // ---- Baseline for comparison (legacy model, no AI) ----------------------
  const baselineRevenue =
    jrBaseTotal * base.jrBillRate +
    pmHours * base.pmBillRate +
    V * base.basePeHoursPerPkg * base.peBillRate;
  const baselineCost =
    jrBaseTotal * base.jrCostRate +
    pmHours * base.pmCostRate +
    V * base.basePeHoursPerPkg * base.peCostRate;
  const baselineMargin = baselineRevenue - baselineCost;
  const baselinePeHoursPerWeek = (V * base.basePeHoursPerPkg) / base.weeksPerMonth;

  // ---- Apprenticeship -----------------------------------------------------
  const deepPracticeHours = !levers.aiEnabled
    ? jrBaseTotal
    : levers.apprenticeshipSafeguard === "BLIND_AUDIT_20_PCT"
      ? 0.2 * jrBaseTotal
      : 0;
  const learningIndexPct = (deepPracticeHours / jrBaseTotal) * 100;

  // ---- Liability ----------------------------------------------------------
  // Unreviewed AI output still ships under the PE's stamp. Professional
  // responsibility is non-delegable (ASCE Policy 573, NSPE BER guidance).
  const liabilityBreach =
    levers.aiEnabled && levers.reviewArchitecture === "RAW_AI_UNGOVERNED";

  // ---- Pillars ------------------------------------------------------------
  const deltaRevenue = revenue - baselineRevenue;
  const deltaMargin = margin - baselineMargin;

  const revenuePillar: PillarResult = {
    headline: deltaRevenue,
    status:
      deltaRevenue < -0.02 * baselineRevenue
        ? "CRITICAL"
        : deltaRevenue < 0
          ? "WARN"
          : "OK",
    narrative:
      deltaRevenue < 0
        ? levers.pricingModel === "TM_100"
          ? "Under time-and-materials, every saved hour is un-billed revenue. The client keeps the speedup; the firm books the loss."
          : "Fee structure is not yet capturing the time the agent saves."
        : levers.pricingModel === "TM_100"
          ? "Hourly billing is holding revenue only because saved hours are being re-billed elsewhere."
          : "Fixed pricing decouples fees from hours, the firm now keeps the value the agent creates.",
  };

  const reviewGatePillar: PillarResult = {
    headline: peHoursPerWeek,
    status: liabilityBreach
      ? "CRITICAL"
      : peHoursPerWeek > base.pePillarCriticalHrsPerWeek
        ? "CRITICAL"
        : peHoursPerWeek > base.pePillarSustainableHrsPerWeek
          ? "WARN"
          : "OK",
    narrative: liabilityBreach
      ? "AI output is shipping on the PE's stamp without verification. Professional responsibility is non-delegable. This is a liability breach, not a saving."
      : peHoursPerWeek > base.pePillarSustainableHrsPerWeek
        ? "Juniors forward raw AI redline matrices upstream, so the licensed PE re-verifies everything. Review became the new bottleneck."
        : "Risk-tiered delta review: the PE sees only flagged clauses. The gate holds without burning out the license that signs the drawings.",
  };

  const utilizationPct = jrUtilization * 100;
  const incentivesPillar: PillarResult = {
    headline: utilizationPct,
    status: utilizationPct < 60 ? "CRITICAL" : utilizationPct < 85 ? "WARN" : "OK",
    narrative:
      utilizationPct < 85
        ? "Saved junior hours sit idle because nobody is incentivized to redeploy them. The PM's utilization score, the number they are rated on, is collapsing."
        : "Freed capacity is flowing into backlog. Utilization holds, so the incentive system stops fighting the agent.",
  };

  const apprenticeshipPillar: PillarResult = {
    headline: learningIndexPct,
    status:
      learningIndexPct >= 20 ? "OK" : learningIndexPct > 0 ? "WARN" : levers.aiEnabled ? "CRITICAL" : "OK",
    narrative:
      learningIndexPct >= 100
        ? "Full manual practice, the traditional (slow) apprenticeship pipeline."
        : learningIndexPct >= 20
          ? "A blind 20% manual audit preserves deliberate practice, then juniors study the delta against the agent. Judgment keeps compounding."
          : "Line-by-line spec reading is how junior engineers become the PEs who can catch AI mistakes. That pipeline just went dark.",
  };

  // ---- System verdict -----------------------------------------------------
  let systemStatus: SystemStatus;
  let primaryBreakdownReason: string;

  if (liabilityBreach) {
    systemStatus = "CRITICAL_REJECTION";
    primaryBreakdownReason =
      "Unreviewed AI output carries the PE's stamp. No margin number survives a licensure breach.";
  } else if (deltaMargin < 0) {
    systemStatus = "CRITICAL_REJECTION";
    primaryBreakdownReason =
      levers.pricingModel === "TM_100"
        ? "Time-and-materials billing converts the agent's speed into a revenue loss the operating model cannot absorb."
        : "The current configuration destroys margin versus the pre-AI baseline.";
  } else if (peHoursPerWeek > base.pePillarCriticalHrsPerWeek) {
    systemStatus = "CRITICAL_REJECTION";
    primaryBreakdownReason =
      "PE review demand exceeds sustainable capacity, delivery now queues behind one overloaded license.";
  } else {
    const pillarStatuses = [
      revenuePillar.status,
      reviewGatePillar.status,
      incentivesPillar.status,
      apprenticeshipPillar.status,
    ];
    if (pillarStatuses.some((s) => s !== "OK")) {
      systemStatus = "WARNING_FRICTION";
      primaryBreakdownReason =
        apprenticeshipPillar.status !== "OK"
          ? "Economics hold, but the firm is consuming its apprenticeship pipeline. The margin is borrowed from future PEs."
          : incentivesPillar.status !== "OK"
            ? "Economics hold, but idle capacity and utilization penalties will make the org quietly kill this agent."
            : "Economics hold with friction, review or fee structure still needs tuning.";
    } else {
      systemStatus = "OPTIMAL_GOVERNANCE";
      primaryBreakdownReason =
        "Fee model, review gate, incentives, and apprenticeship all accept the change. The operating system now permits the value to exist.";
    }
  }

  const recommendation: Recommendation =
    systemStatus === "OPTIMAL_GOVERNANCE"
      ? "RUN_30_DAY_EXPERIMENT"
      : systemStatus === "WARNING_FRICTION"
        ? "REDESIGN_BEFORE_PILOT"
        : "DO_NOT_DEPLOY";

  return {
    revenue,
    cost,
    margin,
    marginPct: revenue > 0 ? (margin / revenue) * 100 : 0,
    baselineRevenue,
    baselineCost,
    baselineMargin,
    baselineMarginPct:
      baselineRevenue > 0 ? (baselineMargin / baselineRevenue) * 100 : 0,
    deltaMargin,
    deltaRevenue,
    jrPackageHours,
    jrRedeployedHours,
    jrSavedHoursUnused,
    jrHoursUnrouted,
    jrHoursUnsold,
    jrUtilizationPct: utilizationPct,
    baselineJrUtilizationPct: base.baselineJrUtilization * 100,
    peHoursPerPkg: pePerPkg,
    peHoursPerWeek,
    baselinePeHoursPerWeek,
    deepPracticeHours,
    learningIndexPct,
    liabilityBreach,
    pillars: {
      revenue: revenuePillar,
      reviewGate: reviewGatePillar,
      incentives: incentivesPillar,
      apprenticeship: apprenticeshipPillar,
    },
    systemStatus,
    recommendation,
    primaryBreakdownReason,
  };
}
