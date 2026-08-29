import { describe, expect, it } from "vitest";
import {
  BEST,
  BEST_SIGNED,
  BEST_SIGNED_RANK,
  CONFIGURATIONS,
  COST_OF_REFUSING,
} from "./configurations";

/**
 * The property that makes this an instrument rather than a dashboard.
 *
 * A number people can manage is a number they will manage. The defence is
 * not a promise in the copy, it is that optimising this one walks you into a
 * refusal. These tests hold that shape: the best margin available is one the
 * engine will not sign, and the one it signs is measurably worse.
 *
 * If a future change to the engine ever makes the best-margin configuration
 * signable, the page built on this stops being true and these fail. That is
 * the point of writing them down.
 */

describe("the ranking", () => {
  it("covers every operating model the levers can express", () => {
    expect(CONFIGURATIONS).toHaveLength(3 * 3 * 2);
    const distinct = new Set(CONFIGURATIONS.map((c) => c.label));
    expect(distinct.size).toBe(CONFIGURATIONS.length);
  });

  it("is ordered by the number a dashboard would show", () => {
    for (let i = 1; i < CONFIGURATIONS.length; i++) {
      expect(CONFIGURATIONS[i - 1].position).toBeGreaterThanOrEqual(
        CONFIGURATIONS[i].position,
      );
    }
  });
});

describe("optimising the headline walks into a refusal", () => {
  it("will not sign the best margin available", () => {
    expect(BEST.signed).toBe(false);
    expect(BEST.refusal).toBeTruthy();
  });

  it("refuses the top of the ranking on liability, not on arithmetic", () => {
    expect(BEST.out.liabilityBreach).toBe(true);
    expect(BEST.position).toBeGreaterThan(0);
  });

  it("puts the first signable configuration below the top", () => {
    expect(BEST_SIGNED_RANK).toBeGreaterThan(1);
    expect(BEST_SIGNED.position).toBeLessThan(BEST.position);
    expect(COST_OF_REFUSING).toBeGreaterThan(0);
  });

  it("signs almost nothing", () => {
    // Two of eighteen. A gate that passes most of what it sees is a
    // formality, and the copy on the page says as much.
    const signed = CONFIGURATIONS.filter((c) => c.signed);
    expect(signed.length).toBeLessThan(CONFIGURATIONS.length / 4);
    expect(signed.length).toBeGreaterThan(0);
  });

  it("gives every refusal a reason a principal could argue with", () => {
    for (const c of CONFIGURATIONS) {
      if (c.signed) expect(c.refusal).toBeNull();
      else expect(c.refusal?.length ?? 0).toBeGreaterThan(40);
    }
  });

  it("never signs a configuration that has stopped training anybody", () => {
    for (const c of CONFIGURATIONS) {
      if (c.out.learningIndexPct === 0) expect(c.signed).toBe(false);
    }
  });
});
