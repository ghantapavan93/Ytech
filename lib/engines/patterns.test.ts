import { describe, expect, it } from "vitest";
import { ATLAS_BASELINE, NAIVE_DEPLOYMENT, runEngine } from "./engine";
import {
  ATLAS_FACETS,
  compilePatternNode,
  libraryFindings,
  SYNTHETIC_LIBRARY,
} from "./patterns";

describe("evidence node, anonymized by construction", () => {
  const out = runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT);
  const node = compilePatternNode(ATLAS_BASELINE, NAIVE_DEPLOYMENT, out, ATLAS_FACETS);
  const json = JSON.stringify(node);

  it("contains no firm name and no absolute dollar figures", () => {
    expect(json).not.toMatch(/atlas/i);
    // Every revenue/cost/margin magnitude in the engine is 4+ digit dollars;
    // the node must only carry ratios, percentages, and coarse bands.
    expect(json).not.toContain("103000");
    expect(json).not.toContain("51400");
    expect(json).not.toContain("9170");
    expect(json).not.toMatch(/"revenue|"cost|"margin[^D]/);
  });

  it("carries normalized outcomes instead", () => {
    // −$9,170 on a $51,600 baseline margin = −17.8%
    expect(node.outcomes.marginDeltaPctOfBaseline).toBeCloseTo(-17.8, 1);
    // 26.25 h/wk against a 15 h/wk sustainable gate = 1.75×
    expect(node.outcomes.peLoadVsSustainable).toBeCloseTo(1.75, 2);
    expect(node.outcomes.verdict).toBe("CRITICAL_REJECTION");
  });

  it("is deterministic: same inputs, same node, same hash", () => {
    const again = compilePatternNode(
      ATLAS_BASELINE,
      NAIVE_DEPLOYMENT,
      runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT),
      ATLAS_FACETS);
    expect(again).toEqual(node);
    expect(again.assumptionHash).toBe(node.assumptionHash);
  });
});

describe("synthetic pattern library", () => {
  it("computes every node through the real engine", () => {
    expect(SYNTHETIC_LIBRARY).toHaveLength(5);
    for (const entry of SYNTHETIC_LIBRARY) {
      expect(entry.node.schema).toBe("valueshift.pattern/v1");
      expect(entry.node.assumptionHash).toMatch(/^[0-9A-F]{8}$/);
    }
  });

  it("rejects the naive T&M archetype and the ungoverned archetype", () => {
    const syn1 = SYNTHETIC_LIBRARY[0].node;
    expect(syn1.outcomes.verdict).toBe("CRITICAL_REJECTION");
    const syn3 = SYNTHETIC_LIBRARY[2].node;
    expect(syn3.outcomes.liabilityBreach).toBe(true);
    expect(syn3.outcomes.verdict).toBe("CRITICAL_REJECTION");
  });

  it("passes only the fully governed archetype", () => {
    const verdicts = SYNTHETIC_LIBRARY.map((e) => e.node.outcomes.verdict);
    expect(verdicts.filter((v) => v === "OPTIMAL_GOVERNANCE")).toHaveLength(1);
    expect(SYNTHETIC_LIBRARY[4].node.outcomes.verdict).toBe("OPTIMAL_GOVERNANCE");
  });

  it("derives findings by scanning nodes, never asserting them", () => {
    const findings = libraryFindings(SYNTHETIC_LIBRARY);
    expect(findings.length).toBeGreaterThanOrEqual(3);
    expect(findings[0]).toContain("time-and-materials");
    // The liability finding must reflect that ungoverned always fails.
    expect(findings.join(" ")).toContain("professional-liability");
  });
});
