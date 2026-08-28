import { describe, expect, it } from "vitest";
import {
  advance,
  canEmitPattern,
  headline,
  portfolioStats,
  retire,
  SEED_RECORDS,
  type DecisionRecord,
} from "./record-engine";

const rec = (over: Partial<DecisionRecord> = {}): DecisionRecord => ({
  id: "t-1",
  workflow: "Test workflow",
  archetype: "25 to 75 staff, civil",
  pricing: "hourly",
  belief: "It will save time.",
  contradiction: "Nobody owns the measurement.",
  decision: "run-experiment",
  owner: "Someone",
  evidenceRequired: "Hours against a baseline",
  state: "claimed",
  month: "Jan",
  ...over,
});

describe("the evidence ladder", () => {
  it("climbs one rung at a time", () => {
    let r = rec({ state: "claimed" });
    r = advance(r);
    expect(r.state).toBe("observed");
    r = advance(r);
    expect(r.state).toBe("verified");
    r = advance(r);
    expect(r.state).toBe("sustained");
  });

  it("stops at the top rather than falling off it", () => {
    const r = advance(rec({ state: "sustained" }));
    expect(r.state).toBe("sustained");
  });

  it("never revives a retired decision by advancing it", () => {
    const r = advance(rec({ state: "retired" }));
    expect(r.state).toBe("retired");
  });

  it("lets anything be retired, because stopping is a result", () => {
    expect(retire(rec({ state: "claimed" })).state).toBe("retired");
    expect(retire(rec({ state: "sustained" })).state).toBe("retired");
  });
});

describe("pattern eligibility is gated on proof", () => {
  it("refuses claimed and observed records", () => {
    expect(canEmitPattern(rec({ state: "claimed" }))).toBe(false);
    expect(canEmitPattern(rec({ state: "observed" }))).toBe(false);
  });

  it("admits verified and sustained records", () => {
    expect(canEmitPattern(rec({ state: "verified" }))).toBe(true);
    expect(canEmitPattern(rec({ state: "sustained" }))).toBe(true);
  });

  it("refuses retired records, which teach in a different way", () => {
    expect(canEmitPattern(rec({ state: "retired" }))).toBe(false);
  });
});

describe("portfolio arithmetic", () => {
  it("counts every record exactly once", () => {
    const s = portfolioStats(SEED_RECORDS);
    const summed = Object.values(s.byState).reduce((a, b) => a + b, 0);
    expect(summed).toBe(SEED_RECORDS.length);
    expect(s.total).toBe(12);
  });

  it("excludes retired records from the active count", () => {
    const s = portfolioStats(SEED_RECORDS);
    expect(s.active).toBe(s.total - s.retired);
    expect(s.retired).toBeGreaterThan(0);
  });

  it("measures the stuck share against active work only", () => {
    const s = portfolioStats([
      rec({ id: "a", state: "claimed" }),
      rec({ id: "b", state: "claimed" }),
      rec({ id: "c", state: "verified" }),
      rec({ id: "d", state: "retired" }),
    ]);
    expect(s.active).toBe(3);
    expect(s.stuckAtClaimedPct).toBeCloseTo(66.67, 1);
  });

  it("handles an empty portfolio without dividing by zero", () => {
    const s = portfolioStats([]);
    expect(s.stuckAtClaimedPct).toBe(0);
    expect(headline(s)).toContain("Nothing active");
  });
});

describe("the seeded portfolio makes the uncomfortable point", () => {
  const s = portfolioStats(SEED_RECORDS);

  it("has more unmeasured decisions than proven ones", () => {
    expect(s.byState.claimed).toBeGreaterThan(s.patternEligible);
  });

  it("leaves only a minority eligible for the pattern library", () => {
    expect(s.patternEligible).toBeLessThan(s.active / 2);
  });

  it("leads with the count that has not been measured", () => {
    expect(headline(s)).toContain("never been measured");
  });
});

describe("no record names a firm", () => {
  it("keeps archetypes coarse", () => {
    for (const r of SEED_RECORDS) {
      expect(r.archetype).toMatch(/staff/);
      expect(r.archetype).not.toMatch(/Inc\.|LLC|Group|Associates/);
    }
  });

  it("always states what evidence would settle the question", () => {
    for (const r of SEED_RECORDS) {
      expect(r.evidenceRequired.length).toBeGreaterThan(15);
    }
  });
});
