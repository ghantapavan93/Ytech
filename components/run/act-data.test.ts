import { describe, expect, it } from "vitest";
import { ATLAS_BASELINE, NAIVE_DEPLOYMENT, runEngine } from "@/lib/engines/engine";
import { ACTS, BEFORE, FULLY_RETUNED, GOVERNED_LEVERS } from "./act-data";

describe("the run changes one thing at a time", () => {
  it("moves the structure through at least six distinct states", () => {
    // The first version of this test banned any repeat between consecutive
    // acts, which is the wrong rule: act three names the verdict and is
    // meant to hold state while it does. What matters is that the run is
    // not narration over a static picture, so count distinct states rather
    // than forbidding a pause.
    const distinct = new Set(ACTS.map((a) => JSON.stringify(a.levers)));
    expect(distinct.size).toBeGreaterThanOrEqual(6);
  });

  it("starts somewhere different from where it ends", () => {
    expect(ACTS[0].levers).not.toEqual(ACTS[ACTS.length - 1].levers);
  });

  it("changes exactly one lever per retuning act", () => {
    // Acts four through seven are the re-tuning. Each is one decision.
    const diff = (a: object, b: object) =>
      Object.keys(a).filter(
        (k) => (a as Record<string, unknown>)[k] !== (b as Record<string, unknown>)[k],
      );
    for (const i of [3, 4, 5, 6]) {
      expect(diff(ACTS[i].levers, ACTS[i - 1].levers)).toHaveLength(1);
    }
  });

  it("lands exactly on the governed preset once all four have been applied", () => {
    expect(FULLY_RETUNED).toEqual(GOVERNED_LEVERS);
  });
});

describe("the structure actually moves", () => {
  it("starts at rest, with review inside what the desk can carry", () => {
    const before = runEngine(ATLAS_BASELINE, BEFORE);
    expect(before.peHoursPerWeek).toBeLessThanOrEqual(
      ATLAS_BASELINE.pePillarSustainableHrsPerWeek,
    );
    expect(before.jrRedeployedHours + before.jrSavedHoursUnused).toBe(0);
  });

  it("buckles the review member when the agent goes in, and straightens it later", () => {
    const sustainable = ATLAS_BASELINE.pePillarSustainableHrsPerWeek;
    const naive = runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT);
    const retuned = runEngine(ATLAS_BASELINE, FULLY_RETUNED);

    expect(naive.peHoursPerWeek).toBeGreaterThan(sustainable);
    expect(retuned.peHoursPerWeek).toBeLessThanOrEqual(sustainable);
  });

  it("protects the practice floor at the cost of released hours", () => {
    // The trade the drawing is there to show: governing releases less and
    // is worth more. If this ever inverts, the argument changes.
    const unprotected = runEngine(ATLAS_BASELINE, ACTS[5].levers);
    const protectedRun = runEngine(ATLAS_BASELINE, ACTS[6].levers);

    const rel = (o: typeof unprotected) =>
      o.jrRedeployedHours + o.jrSavedHoursUnused;

    expect(rel(protectedRun)).toBeLessThan(rel(unprotected));
    expect(protectedRun.learningIndexPct).toBeGreaterThan(
      unprotected.learningIndexPct,
    );
  });
});
