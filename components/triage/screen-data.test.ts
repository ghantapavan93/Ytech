import { describe, expect, it } from "vitest";
import {
  BAR,
  CARRIED_ANNUAL,
  GAP,
  GROSS_ANNUAL,
  GROSS_AT_COST,
  GROSS_PASSES_UNDER,
  screen,
} from "./screen-data";

/**
 * A threshold applied to the wrong quantity.
 *
 * The claim the page makes is stronger than "the screen overstates it". It
 * is that no build cost tells these two apart, because they differ in sign
 * and dividing by a positive number never moves a value across zero. That is
 * only worth saying on a page if it is actually true at every cost, so it is
 * checked at every cost the control can produce.
 */

const COSTS = [0, 1, 5_000, 35_280, 60_000, 200_000, 5_000_000];

describe("the screen and the outcome", () => {
  it("land on opposite sides of zero", () => {
    expect(GROSS_ANNUAL).toBeGreaterThan(0);
    expect(CARRIED_ANNUAL).toBeLessThan(0);
    expect(GAP).toBeCloseTo(GROSS_ANNUAL - CARRIED_ANNUAL, 6);
  });

  it("survives the less generous pricing of the freed hours", () => {
    // Costing the hours at loaded cost rather than billing rate is the
    // obvious objection to the figure. It shrinks it and does not move it.
    expect(GROSS_AT_COST).toBeLessThan(GROSS_ANNUAL);
    expect(GROSS_AT_COST).toBeGreaterThan(0);
  });

  it("never lets the outcome reach the bar, at any build cost including free", () => {
    for (const cost of COSTS) {
      expect(screen(cost).carriedPasses, `build cost ${cost}`).toBe(false);
    }
  });

  it("lets the screen pass wherever the cost is under a tenth of the gross", () => {
    expect(GROSS_PASSES_UNDER).toBeCloseTo(GROSS_ANNUAL / BAR, 6);
    expect(screen(GROSS_PASSES_UNDER * 0.9).grossPasses).toBe(true);
    expect(screen(GROSS_PASSES_UNDER * 1.1).grossPasses).toBe(false);
  });

  it("divides by zero on purpose, and gets the right answer", () => {
    // Clamping the divisor showed a multiple of 352,800 at the free end of
    // the control. The unclamped arithmetic is both correct and sharper: a
    // free agent clears any threshold on gross and still fails on outcome.
    const free = screen(0);
    expect(free.grossMultiple).toBe(Infinity);
    expect(free.carriedMultiple).toBe(-Infinity);
    expect(free.grossPasses).toBe(true);
    expect(free.carriedPasses).toBe(false);
  });
});
