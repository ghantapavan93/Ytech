import { describe, expect, it } from "vitest";
import { ATLAS_BASELINE, NAIVE_DEPLOYMENT, runEngine, type Levers } from "./engine";
import { computeIndexLens, stageFor } from "./index-lens";

const GOVERNED: Levers = {
  aiEnabled: true,
  aiSpeedupPct: 0.42,
  pricingModel: "FIXED_FEE",
  backlogRedeploymentPct: 1,
  reviewArchitecture: "TIERED_DELTA_GATE",
  apprenticeshipSafeguard: "BLIND_AUDIT_20_PCT",
};

describe("index lens, YegaTech's published structure", () => {
  it("uses their weights, summing to exactly 1", () => {
    const lens = computeIndexLens(
      runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT),
      NAIVE_DEPLOYMENT);
    const total = lens.dimensions.reduce((s, d) => s + d.weight, 0);
    expect(total).toBeCloseTo(1, 10);
    expect(lens.dimensions.find((d) => d.name === "Operating Model")?.weight).toBe(0.35);
    expect(lens.dimensions.find((d) => d.name === "Business Model")?.weight).toBe(0.3);
  });

  it("uses their stage bands", () => {
    expect(stageFor(10)).toBe("Exploring");
    expect(stageFor(25)).toBe("Adopting");
    expect(stageFor(50)).toBe("Transforming");
    expect(stageFor(75)).toBe("Leading");
  });
});

describe("index lens, the two canonical states", () => {
  const naive = computeIndexLens(
    runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT),
    NAIVE_DEPLOYMENT);
  const governed = computeIndexLens(runEngine(ATLAS_BASELINE, GOVERNED), GOVERNED);

  it("scores the naive deployment as Adopting (~40%)", () => {
    expect(naive.scorePct).toBeCloseTo(40.5, 1);
    expect(naive.stage).toBe("Adopting");
  });

  it("scores the governed re-tune as high Transforming (~74%)", () => {
    expect(governed.scorePct).toBeCloseTo(74.5, 1);
    expect(governed.stage).toBe("Transforming");
  });

  it("moves a full stage without touching culture", () => {
    const cultureNaive = naive.dimensions.find((d) => d.name === "Culture of Innovation");
    const cultureGoverned = governed.dimensions.find(
      (d) => d.name === "Culture of Innovation");
    expect(cultureNaive?.rating).toBe(cultureGoverned?.rating);
    expect(governed.scorePct).toBeGreaterThan(naive.scorePct);
    expect(naive.stage).toBe("Adopting");
    expect(governed.stage).toBe("Transforming");
  });

  it("never rates culture from economics, the refusal holds", () => {
    for (const lens of [naive, governed]) {
      const culture = lens.dimensions.find((d) => d.name === "Culture of Innovation");
      expect(culture?.rating).toBe(3);
      expect(culture?.rationale).toContain("refuses");
    }
  });
});
