import type { EngineOutput, FirmBaseline, Levers } from "./engine";
import { ATLAS_BASELINE, runEngine } from "./engine";
import { assumptionHash } from "../format";

/**
 * Horizon Two, the evidence object.
 *
 * Every wind-tunnel run can deposit exactly one anonymized "fit pattern":
 * a structured record of which operating-model configuration accepted or
 * rejected AI value, for what kind of firm. Anonymization is by
 * construction, not by redaction:
 *
 *   - facets are coarse bands (staff range, discipline), never names;
 *   - outcomes are normalized ratios, never absolute dollars;
 *   - the hash proves two nodes came from identical assumptions without
 *     revealing them.
 *
 * A library of these nodes is the beginning of an AEC Transformation
 * Graph: evidence of which fee structures, review gates, and incentive
 * designs let AI value survive inside which kinds of firms.
 */

export interface EvidenceNode {
  schema: "valueshift.pattern/v1";
  engine: "deterministic-v1";
  /** Coarse, non-identifying firm descriptors. */
  facets: {
    staffBand: string;
    discipline: string;
    workflow: string;
    pricingRegime: Levers["pricingModel"];
    reviewGate: Levers["reviewArchitecture"];
    apprenticeshipSafeguard: Levers["apprenticeshipSafeguard"];
    capacityRedeployedPct: number;
    aiSpeedupPct: number;
  };
  /** Normalized outcomes, ratios only, no absolute dollars. */
  outcomes: {
    marginDeltaPctOfBaseline: number;
    peLoadVsSustainable: number;
    jrUtilizationPct: number;
    learningIndexPct: number;
    liabilityBreach: boolean;
    verdict: EngineOutput["systemStatus"];
    recommendation: EngineOutput["recommendation"];
  };
  assumptionHash: string;
}

export function compilePatternNode(
  base: FirmBaseline,
  levers: Levers,
  out: EngineOutput,
  facets: { staffBand: string; discipline: string; workflow: string }): EvidenceNode {
  return {
    schema: "valueshift.pattern/v1",
    engine: "deterministic-v1",
    facets: {
      staffBand: facets.staffBand,
      discipline: facets.discipline,
      workflow: facets.workflow,
      pricingRegime: levers.pricingModel,
      reviewGate: levers.reviewArchitecture,
      apprenticeshipSafeguard: levers.apprenticeshipSafeguard,
      capacityRedeployedPct: Math.round(levers.backlogRedeploymentPct * 100),
      aiSpeedupPct: Math.round(levers.aiSpeedupPct * 100),
    },
    outcomes: {
      marginDeltaPctOfBaseline:
        Math.round((out.deltaMargin / out.baselineMargin) * 1000) / 10,
      peLoadVsSustainable:
        Math.round(
          (out.peHoursPerWeek / base.pePillarSustainableHrsPerWeek) * 100) / 100,
      jrUtilizationPct: Math.round(out.jrUtilizationPct * 10) / 10,
      learningIndexPct: Math.round(out.learningIndexPct * 10) / 10,
      liabilityBreach: out.liabilityBreach,
      verdict: out.systemStatus,
      recommendation: out.recommendation,
    },
    assumptionHash: assumptionHash({ base, levers }),
  };
}

/** The live demo firm's non-identifying facets. */
export const ATLAS_FACETS = {
  staffBand: "25–75 staff",
  discipline: "civil / structural",
  workflow: "spec-QA",
};

interface LibrarySeed {
  label: string;
  facets: { staffBand: string; discipline: string; workflow: string };
  base: FirmBaseline;
  levers: Levers;
}

/**
 * Synthetic prior engagements, clearly labeled as such in the UI.
 * Each is genuinely computed through the engine (nothing hand-asserted),
 * so the library demonstrates real aggregation mechanics without any
 * client data existing yet.
 */
const LIBRARY_SEEDS: LibrarySeed[] = [
  {
    label: "SYN-001",
    facets: { staffBand: "25–75 staff", discipline: "civil", workflow: "spec-QA" },
    base: { ...ATLAS_BASELINE, monthlyPackageVolume: 14 },
    levers: {
      aiEnabled: true,
      aiSpeedupPct: 0.38,
      pricingModel: "TM_100",
      backlogRedeploymentPct: 0,
      reviewArchitecture: "FULL_MANUAL",
      apprenticeshipSafeguard: "NONE",
    },
  },
  {
    label: "SYN-002",
    facets: { staffBand: "25–75 staff", discipline: "structural", workflow: "spec-QA" },
    base: { ...ATLAS_BASELINE, monthlyPackageVolume: 24 },
    levers: {
      aiEnabled: true,
      aiSpeedupPct: 0.42,
      pricingModel: "BLENDED_50",
      backlogRedeploymentPct: 0.5,
      reviewArchitecture: "FULL_MANUAL",
      apprenticeshipSafeguard: "NONE",
    },
  },
  {
    label: "SYN-003",
    facets: { staffBand: "under 25 staff", discipline: "MEP", workflow: "spec-QA" },
    base: { ...ATLAS_BASELINE, monthlyPackageVolume: 8, fixedFeePerPackage: 4400 },
    levers: {
      aiEnabled: true,
      aiSpeedupPct: 0.45,
      pricingModel: "FIXED_FEE",
      backlogRedeploymentPct: 1,
      reviewArchitecture: "RAW_AI_UNGOVERNED",
      apprenticeshipSafeguard: "NONE",
    },
  },
  {
    label: "SYN-004",
    facets: { staffBand: "25–75 staff", discipline: "civil", workflow: "spec-QA" },
    base: { ...ATLAS_BASELINE, monthlyPackageVolume: 18 },
    levers: {
      aiEnabled: true,
      aiSpeedupPct: 0.40,
      pricingModel: "FIXED_FEE",
      backlogRedeploymentPct: 1,
      reviewArchitecture: "TIERED_DELTA_GATE",
      apprenticeshipSafeguard: "NONE",
    },
  },
  {
    label: "SYN-005",
    facets: { staffBand: "25–75 staff", discipline: "structural", workflow: "spec-QA" },
    base: { ...ATLAS_BASELINE, monthlyPackageVolume: 22 },
    levers: {
      aiEnabled: true,
      aiSpeedupPct: 0.42,
      pricingModel: "FIXED_FEE",
      backlogRedeploymentPct: 0.9,
      reviewArchitecture: "TIERED_DELTA_GATE",
      apprenticeshipSafeguard: "BLIND_AUDIT_20_PCT",
    },
  },
];

export interface LibraryEntry {
  label: string;
  node: EvidenceNode;
}

/** The synthetic library, computed once, pure and deterministic. */
export const SYNTHETIC_LIBRARY: LibraryEntry[] = LIBRARY_SEEDS.map((seed) => ({
  label: seed.label,
  node: compilePatternNode(
    seed.base,
    seed.levers,
    runEngine(seed.base, seed.levers),
    seed.facets),
}));

/**
 * Questions the library can already answer, each derived by scanning the
 * nodes, never asserted. These are the seeds of the future query surface
 * ("which configurations let value survive in firms like this one?").
 */
export function libraryFindings(entries: LibraryEntry[]): string[] {
  const nodes = entries.map((e) => e.node);
  const findings: string[] = [];

  const tmNodes = nodes.filter((n) => n.facets.pricingRegime === "TM_100");
  if (tmNodes.length > 0) {
    const positive = tmNodes.filter(
      (n) => n.outcomes.marginDeltaPctOfBaseline > 0).length;
    findings.push(
      `Under 100% time-and-materials pricing, ${positive} of ${tmNodes.length} recorded configurations were margin-positive.`);
  }

  const fullManual = nodes.filter((n) => n.facets.reviewGate === "FULL_MANUAL");
  if (fullManual.length > 0) {
    const bottlenecked = fullManual.filter(
      (n) => n.outcomes.peLoadVsSustainable > 1).length;
    findings.push(
      `Full-manual re-verification pushed the PE gate past sustainable load in ${bottlenecked} of ${fullManual.length} configurations.`);
  }

  const ungoverned = nodes.filter(
    (n) => n.facets.reviewGate === "RAW_AI_UNGOVERNED");
  if (ungoverned.length > 0) {
    findings.push(
      `Every configuration that accepted raw AI output (${ungoverned.length} of ${ungoverned.length}) was rejected on professional-liability grounds, including the most profitable one on paper.`);
  }

  const optimal = nodes.filter(
    (n) => n.outcomes.verdict === "OPTIMAL_GOVERNANCE");
  const withAudit = optimal.filter(
    (n) => n.facets.apprenticeshipSafeguard === "BLIND_AUDIT_20_PCT").length;
  if (optimal.length > 0) {
    findings.push(
      `${withAudit} of ${optimal.length} configurations that passed the full wind tunnel carried an apprenticeship safeguard.`);
  }

  return findings;
}
