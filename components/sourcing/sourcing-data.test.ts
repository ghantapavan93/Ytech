import { describe, expect, it } from "vitest";
import { ATLAS_BASELINE, NAIVE_DEPLOYMENT, runEngine } from "@/lib/engines/engine";
import {
  AMORTISATION_MONTHS,
  DEFAULT_COSTS,
  OPERATING_SWING,
  compare,
} from "./sourcing-data";

/**
 * The claim the page rests on, checked rather than asserted.
 *
 * The page says that where a tool comes from changes one line of the model
 * and nothing else. If that were ever untrue the whole framing would be
 * dishonest, so it is checked directly: run the same levers with a different
 * tool cost and everything on the value side has to be identical.
 */

describe("sourcing touches the cost line and nothing else", () => {
  it("frees the same hours whatever the tool costs", () => {
    const dear = runEngine(
      { ...ATLAS_BASELINE, aiToolCostPerMonth: 9_000 },
      NAIVE_DEPLOYMENT,
    );
    const free = runEngine(
      { ...ATLAS_BASELINE, aiToolCostPerMonth: 0 },
      NAIVE_DEPLOYMENT,
    );

    expect(free.jrRedeployedHours).toBe(dear.jrRedeployedHours);
    expect(free.jrSavedHoursUnused).toBe(dear.jrSavedHoursUnused);
    expect(free.peHoursPerWeek).toBe(dear.peHoursPerWeek);
    expect(free.learningIndexPct).toBe(dear.learningIndexPct);
    expect(free.revenue).toBe(dear.revenue);
  });

  it("moves the margin by exactly the difference in what the tool costs", () => {
    const dear = runEngine(
      { ...ATLAS_BASELINE, aiToolCostPerMonth: 9_000 },
      NAIVE_DEPLOYMENT,
    );
    const free = runEngine(
      { ...ATLAS_BASELINE, aiToolCostPerMonth: 0 },
      NAIVE_DEPLOYMENT,
    );
    expect(free.margin - dear.margin).toBeCloseTo(9_000, 6);
  });
});

describe("the size of the two questions", () => {
  it("puts the operating model far above any plausible sourcing gap", () => {
    expect(OPERATING_SWING).toBeGreaterThan(0);

    // The widest gap the page's own controls can produce: a free vendor
    // against the most expensive build, which is nobody's real situation.
    const extreme = compare({
      subscription: 0,
      buildCost: 200_000,
      maintenance: 2_000,
    });
    expect(extreme.shareOfOperating).toBeLessThan(1);
  });

  it("keeps the default case a small fraction of it", () => {
    const c = compare(DEFAULT_COSTS);
    expect(c.shareOfOperating).toBeLessThan(0.1);
    expect(c.gap).toBeGreaterThan(0);
  });

  it("amortises a build rather than comparing it to a monthly fee directly", () => {
    // Comparing a one-off number to a recurring one is the arithmetic error
    // that makes buying look expensive. The window is stated, not hidden.
    const c = compare({ subscription: 1_000, buildCost: 36_000, maintenance: 0 });
    expect(c.build).toBeCloseTo(36_000 / AMORTISATION_MONTHS, 6);
    expect(c.build).toBeCloseTo(c.buy, 6);
    expect(c.gap).toBeCloseTo(0, 6);
  });

  it("names which one is cheaper without implying it is the answer", () => {
    expect(compare({ subscription: 5_000, buildCost: 0, maintenance: 0 }).cheaper).toBe(
      "build",
    );
    expect(
      compare({ subscription: 10, buildCost: 200_000, maintenance: 0 }).cheaper,
    ).toBe("buy");
  });
});
