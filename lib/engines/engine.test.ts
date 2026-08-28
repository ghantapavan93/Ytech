import { describe, expect, it } from "vitest";
import {
  ATLAS_BASELINE,
  LEGACY_BASELINE_LEVERS,
  NAIVE_DEPLOYMENT,
  runEngine,
  type Levers,
} from "./engine";

const GOVERNED: Levers = {
  aiEnabled: true,
  aiSpeedupPct: 0.42,
  pricingModel: "FIXED_FEE",
  backlogRedeploymentPct: 1,
  reviewArchitecture: "TIERED_DELTA_GATE",
  apprenticeshipSafeguard: "BLIND_AUDIT_20_PCT",
};

describe("legacy baseline (no AI, 100% T&M)", () => {
  const out = runEngine(ATLAS_BASELINE, LEGACY_BASELINE_LEVERS);

  it("reproduces Atlas Civil's canonical monthly numbers", () => {
    expect(out.revenue).toBeCloseTo(103_000, 5);
    expect(out.cost).toBeCloseTo(51_400, 5);
    expect(out.margin).toBeCloseTo(51_600, 5);
    expect(out.marginPct).toBeCloseTo(50.1, 1);
  });

  it("has a sustainable PE gate and healthy utilization", () => {
    expect(out.peHoursPerWeek).toBeCloseTo(15, 5);
    expect(out.jrUtilizationPct).toBeCloseTo(92, 5);
    expect(out.learningIndexPct).toBeCloseTo(100, 5);
  });

  it("matches its own baseline (delta zero)", () => {
    expect(out.deltaMargin).toBeCloseTo(0, 5);
    expect(out.deltaRevenue).toBeCloseTo(0, 5);
  });
});

describe("naive deployment (42% faster agent, untouched operating model)", () => {
  const out = runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT);

  it("destroys revenue under T&M", () => {
    // Jr 232h ×175 + PM 60h ×240 + PE 105h ×310 = 40,600 + 14,400 + 32,550
    expect(out.revenue).toBeCloseTo(87_550, 5);
  });

  it("erases margin despite the speedup", () => {
    // Jr 232×85 + PM 60×130 + PE 105×160 + $800 AI = 45,120
    expect(out.cost).toBeCloseTo(45_120, 5);
    expect(out.margin).toBeCloseTo(42_430, 5);
    expect(out.deltaMargin).toBeCloseTo(-9_170, 5);
  });

  it("overloads the PE gate by 75%", () => {
    expect(out.peHoursPerPkg).toBeCloseTo(5.25, 5);
    expect(out.peHoursPerWeek).toBeCloseTo(26.25, 5);
  });

  it("collapses junior utilization to ~53%", () => {
    expect(out.jrUtilizationPct).toBeGreaterThan(53);
    expect(out.jrUtilizationPct).toBeLessThan(54);
  });

  it("goes dark on apprenticeship and rejects the deployment", () => {
    expect(out.learningIndexPct).toBe(0);
    expect(out.systemStatus).toBe("CRITICAL_REJECTION");
    expect(out.recommendation).toBe("DO_NOT_DEPLOY");
  });
});

describe("governed re-tuning (fixed fee + redeploy + tiered gate + blind audit)", () => {
  const out = runEngine(ATLAS_BASELINE, GOVERNED);

  it("captures value: fixed fees + redeployed backlog hours", () => {
    // Fixed 20×4800 = 96,000; audit keeps Jr pkg hours at 265.6 → 134.4h
    // redeployed ×175 = 23,520
    expect(out.jrPackageHours).toBeCloseTo(265.6, 5);
    expect(out.jrRedeployedHours).toBeCloseTo(134.4, 5);
    expect(out.revenue).toBeCloseTo(119_520, 5);
  });

  it("lifts margin ~$22.1k/mo above the pre-AI baseline", () => {
    // Cost: Jr 400×85 + PM 60×130 + PE 20×160 + 800 = 45,800
    expect(out.cost).toBeCloseTo(45_800, 5);
    expect(out.margin).toBeCloseTo(73_720, 5);
    expect(out.deltaMargin).toBeCloseTo(22_120, 5);
  });

  it("restores the PE gate, utilization, and apprenticeship floor", () => {
    expect(out.peHoursPerWeek).toBeCloseTo(5, 5);
    expect(out.jrUtilizationPct).toBeCloseTo(92, 5);
    expect(out.learningIndexPct).toBeCloseTo(20, 5);
  });

  it("passes the wind tunnel", () => {
    expect(out.systemStatus).toBe("OPTIMAL_GOVERNANCE");
    expect(out.recommendation).toBe("RUN_30_DAY_EXPERIMENT");
  });
});

describe("governed without the apprenticeship safeguard", () => {
  const out = runEngine(ATLAS_BASELINE, {
    ...GOVERNED,
    apprenticeshipSafeguard: "NONE",
  });

  it("earns more this month ($28.0k) by consuming the talent pipeline", () => {
    expect(out.deltaMargin).toBeCloseTo(28_000, 5);
    expect(out.learningIndexPct).toBe(0);
  });

  it("is friction, not optimal, the extra $5,880/mo is borrowed from future PEs", () => {
    expect(out.systemStatus).toBe("WARNING_FRICTION");
    expect(out.recommendation).toBe("REDESIGN_BEFORE_PILOT");
  });
});

describe("raw ungoverned AI acceptance", () => {
  const out = runEngine(ATLAS_BASELINE, {
    ...GOVERNED,
    reviewArchitecture: "RAW_AI_UNGOVERNED",
  });

  it("looks profitable but is a liability breach, always rejected", () => {
    expect(out.deltaMargin).toBeGreaterThan(0);
    expect(out.liabilityBreach).toBe(true);
    expect(out.systemStatus).toBe("CRITICAL_REJECTION");
    expect(out.recommendation).toBe("DO_NOT_DEPLOY");
  });
});

describe("blended pricing", () => {
  it("lands between pure T&M and pure fixed fee", () => {
    const tm = runEngine(ATLAS_BASELINE, { ...GOVERNED, pricingModel: "TM_100" });
    const bl = runEngine(ATLAS_BASELINE, { ...GOVERNED, pricingModel: "BLENDED_50" });
    const ff = runEngine(ATLAS_BASELINE, GOVERNED);
    const lo = Math.min(tm.revenue, ff.revenue);
    const hi = Math.max(tm.revenue, ff.revenue);
    expect(bl.revenue).toBeGreaterThanOrEqual(lo);
    expect(bl.revenue).toBeLessThanOrEqual(hi);
  });
});

describe("redeployment slider", () => {
  it("monotonically increases revenue and utilization", () => {
    const at = (pct: number) =>
      runEngine(ATLAS_BASELINE, { ...GOVERNED, backlogRedeploymentPct: pct });
    const r0 = at(0);
    const r50 = at(0.5);
    const r100 = at(1);
    expect(r50.revenue).toBeGreaterThan(r0.revenue);
    expect(r100.revenue).toBeGreaterThan(r50.revenue);
    expect(r100.jrUtilizationPct).toBeGreaterThan(r0.jrUtilizationPct);
  });
});
