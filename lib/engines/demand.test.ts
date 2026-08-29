import { describe, expect, it } from "vitest";
import {
  ABUNDANT,
  ATLAS_BASELINE as B,
  LEGACY_BASELINE_LEVERS,
  NAIVE_DEPLOYMENT,
  runEngine,
  type Levers,
} from "./engine";

/**
 * What the labour shortage is paying for.
 *
 * Until demandAbsorption existed, the engine assumed every hour the agent
 * freed could be sold to somebody. That is true in the market of 2026, where
 * roughly a third of firms are turning work away, and it is the unstated
 * premise under every pilot result anyone is currently publishing. These
 * tests hold the two things apart: what the firm decides, and what the market
 * allows.
 */

const at = (l: Partial<Levers>, absorption = 1) =>
  runEngine(B, { ...NAIVE_DEPLOYMENT, ...l }, { demandAbsorption: absorption });

const BASE = runEngine(B, LEGACY_BASELINE_LEVERS);

/** Everything fixed except pricing, so pricing is the only thing being read. */
const TUNED: Partial<Levers> = {
  backlogRedeploymentPct: 1,
  reviewArchitecture: "TIERED_DELTA_GATE",
};

describe("the condition is not a lever", () => {
  it("changes nothing until it is named", () => {
    const named = runEngine(B, NAIVE_DEPLOYMENT, ABUNDANT);
    const unnamed = runEngine(B, NAIVE_DEPLOYMENT);
    expect(named).toEqual(unnamed);
  });

  it("keeps the two reasons an hour goes unused apart", () => {
    for (const absorption of [1, 0.6, 0.25, 0]) {
      for (const intent of [1, 0.5, 0]) {
        const o = at({ ...TUNED, backlogRedeploymentPct: intent }, absorption);
        expect(o.jrHoursUnrouted + o.jrHoursUnsold).toBeCloseTo(
          o.jrSavedHoursUnused,
          6,
        );
        expect(o.jrHoursUnrouted).toBeGreaterThanOrEqual(0);
        expect(o.jrHoursUnsold).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("cannot fail to sell an hour it never offered", () => {
    // A firm that routes nothing is not being failed by the market. Blaming
    // demand for hours nobody tried to place is the confusion this split
    // exists to prevent.
    const o = at({ ...TUNED, backlogRedeploymentPct: 0 }, 0);
    expect(o.jrHoursUnsold).toBe(0);
    expect(o.jrHoursUnrouted).toBeCloseTo(o.jrSavedHoursUnused, 6);
  });

  it("never rewards a thinner market", () => {
    let previous = Infinity;
    for (const absorption of [1, 0.75, 0.5, 0.25, 0]) {
      const m = at({ ...TUNED, pricingModel: "FIXED_FEE" }, absorption).margin;
      expect(m).toBeLessThanOrEqual(previous + 1e-9);
      previous = m;
    }
  });
});

describe("what the shortage is worth", () => {
  it("bills hourly into a race to the bottom at every demand level", () => {
    /*
     * The ACEC Research Institute's published position, derived rather than
     * quoted: a firm delivering the same work substantially more efficiently
     * while still charging by the hour is in a race to the bottom. Under
     * time-and-materials this agent loses money even with the market
     * absorbing every hour it frees, and the loss deepens from there.
     */
    for (const absorption of [1, 0.5, 0]) {
      const o = at({ ...TUNED, pricingModel: "TM_100" }, absorption);
      expect(o.margin).toBeLessThan(BASE.margin);
    }
  });

  it("holds under a fixed fee at every demand level", () => {
    for (const absorption of [1, 0.5, 0]) {
      const o = at({ ...TUNED, pricingModel: "FIXED_FEE" }, absorption);
      expect(o.margin).toBeGreaterThan(BASE.margin);
    }
  });

  it("is worth the same to both, which is the part that surprises", () => {
    /*
     * Written expecting the hourly firm to be more exposed. It is not. A
     * redeployed hour is billed at the junior rate whatever the packages are
     * priced at, so the market is worth an identical amount to both.
     *
     * What differs is what that amount is holding up, and that is the whole
     * finding: the same subsidy is a bonus on one operating model and life
     * support on the other.
     */
    const swing = (pricingModel: Levers["pricingModel"]) =>
      at({ ...TUNED, pricingModel }, 1).margin -
      at({ ...TUNED, pricingModel }, 0).margin;

    expect(swing("TM_100")).toBeCloseTo(swing("FIXED_FEE"), 6);
    expect(swing("TM_100")).toBeGreaterThan(0);
  });

  it("cannot make the hourly firm whole even at full absorption", () => {
    // The shortage is worth more than the programme is. Take it away and the
    // hourly loss roughly triples, but it was a loss with the shortage too,
    // so no amount of market rescues the fee model.
    const best = at({ ...TUNED, pricingModel: "TM_100" }, 1);
    const worst = at({ ...TUNED, pricingModel: "TM_100" }, 0);
    const subsidy = best.margin - worst.margin;

    expect(best.margin).toBeLessThan(BASE.margin);
    expect(subsidy).toBeGreaterThan(BASE.margin - best.margin);
  });

  it("leaves the fixed-fee firm standing without the market at all", () => {
    const worst = at({ ...TUNED, pricingModel: "FIXED_FEE" }, 0);
    expect(worst.margin).toBeGreaterThan(BASE.margin);
  });

  it("does not let a good market rescue an ungoverned review gate", () => {
    // Demand is not a fifth lever. The liability breach is unconditional.
    const o = at(
      { ...TUNED, pricingModel: "FIXED_FEE", reviewArchitecture: "RAW_AI_UNGOVERNED" },
      1,
    );
    expect(o.liabilityBreach).toBe(true);
    expect(o.recommendation).toBe("DO_NOT_DEPLOY");
  });
});
