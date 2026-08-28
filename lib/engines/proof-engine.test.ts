import { describe, expect, it } from "vitest";
import {
  CONDITIONS,
  evaluate,
  REMEDIES,
  SPEC_QA_DECISION,
  type EvidenceEvent,
  type LivingDecision,
} from "./proof-engine";

const at = (weeks: number): LivingDecision => ({
  ...SPEC_QA_DECISION,
  events: SPEC_QA_DECISION.events.filter((e) => e.week <= weeks),
});

/** Apply remedies as restoring events in a later week. */
function withRemedies(decision: LivingDecision, ids: string[]): LivingDecision {
  const events: EvidenceEvent[] = ids.map((id) => {
    const r = REMEDIES.find((x) => x.id === id)!;
    return {
      id: `remedy-${r.id}`,
      week: 8,
      headline: r.label,
      detail: r.detail,
      breaks: [],
      restores: r.restores,
    };
  });
  return { ...decision, events: [...decision.events, ...events] };
}

describe("at authorization", () => {
  const result = evaluate(at(0));

  it("holds every condition", () => {
    expect(result.broken).toHaveLength(0);
    expect(result.holding).toHaveLength(CONDITIONS.length);
  });

  it("keeps the status it was authorized with", () => {
    expect(result.status).toBe("test");
    expect(result.expired).toBe(false);
  });

  it("says so plainly", () => {
    expect(result.headline).toContain("still holding");
  });
});

describe("six weeks later", () => {
  const result = evaluate(at(6));

  it("expires the decision", () => {
    expect(result.expired).toBe(true);
    expect(result.status).toBe("recommission");
  });

  it("separates the agent from the authorization", () => {
    expect(SPEC_QA_DECISION.agentStillPerforming).toBe(true);
    expect(result.headline).toBe("The agent did not fail. The decision expired.");
  });

  it("names exactly which conditions broke and what broke them", () => {
    const ids = result.broken.map((b) => b.condition.id).sort();
    expect(ids).toEqual(["data-boundary", "owner", "review-budget"]);
    const reviewBreak = result.broken.find((b) => b.condition.id === "review-budget");
    expect(reviewBreak?.event.headline).toContain("45.6 hours");
  });

  it("leaves the untouched conditions alone", () => {
    const holdingIds = result.holding.map((c) => c.id);
    expect(holdingIds).toContain("fee-model");
    expect(holdingIds).toContain("practice-floor");
  });

  it("requires re-earning rather than just repairing", () => {
    expect(result.required.some((r) => r.includes("Re-earn the authorization"))).toBe(
      true,
    );
  });
});

describe("a single critical break is enough", () => {
  it("expires on the owner alone", () => {
    const onlyOwner: LivingDecision = {
      ...SPEC_QA_DECISION,
      events: SPEC_QA_DECISION.events.filter(
        (e) => e.week === 0 || e.id === "e-owner",
      ),
    };
    const r = evaluate(onlyOwner);
    expect(r.expired).toBe(true);
    expect(r.broken).toHaveLength(1);
  });

  it("does not expire on a non-critical break", () => {
    const softBreak: LivingDecision = {
      ...SPEC_QA_DECISION,
      events: [
        SPEC_QA_DECISION.events[0],
        {
          id: "e-soft",
          week: 4,
          headline: "Freed hours sat idle",
          detail: "Nobody routed the capacity anywhere.",
          breaks: ["capacity-routing"],
        },
      ],
    };
    const r = evaluate(softBreak);
    expect(r.expired).toBe(false);
    expect(r.status).toBe("redesign");
    expect(r.headline).toContain("conditions it assumed have moved");
  });
});

describe("remedies repair conditions without restoring clearance", () => {
  it("repairs the conditions but does not hand back the old clearance", () => {
    const repaired = withRemedies(at(6), [
      "new-owner",
      "tiered-review",
      "project-boundary",
    ]);
    const r = evaluate(repaired);
    expect(r.broken).toHaveLength(0);
    expect(r.expired).toBe(false);
    // Expiry is a one-way door: a repaired decision earns a bounded retest.
    expect(r.status).toBe("test");
    expect(r.status).not.toBe("scale");
    expect(r.headline).toContain("not the clearance you had before");
    expect(r.required.some((x) => x.includes("bounded retest"))).toBe(true);
  });

  it("never treats a repaired expiry as if nothing had happened", () => {
    const cleared: LivingDecision = { ...SPEC_QA_DECISION, authorized: "scale" };
    const repaired = withRemedies(
      { ...cleared, events: cleared.events.filter((e) => e.week <= 6) },
      ["new-owner", "tiered-review", "project-boundary"],
    );
    const r = evaluate(repaired);
    // Even though this decision was authorized to scale, the expiry
    // downgrades it. Restoring conditions must not restore scale.
    expect(r.status).toBe("test");
  });

  it("repairs only what the remedy names", () => {
    const partial = withRemedies(at(6), ["new-owner"]);
    const r = evaluate(partial);
    const ids = r.broken.map((b) => b.condition.id).sort();
    expect(ids).toEqual(["data-boundary", "review-budget"]);
    expect(r.expired).toBe(true);
  });

  it("covers every remedy with a real condition", () => {
    const known = new Set(CONDITIONS.map((c) => c.id));
    for (const r of REMEDIES) {
      expect(r.restores.length).toBeGreaterThan(0);
      for (const id of r.restores) expect(known.has(id)).toBe(true);
    }
  });
});

describe("every condition can explain itself", () => {
  it("states what it was approved on and why breaking it voids the decision", () => {
    for (const c of CONDITIONS) {
      expect(c.approvedOn.length).toBeGreaterThan(10);
      expect(c.whyItVoids.length).toBeGreaterThan(40);
    }
  });

  it("keeps critical conditions to the ones that genuinely void", () => {
    const critical = CONDITIONS.filter((c) => c.critical).map((c) => c.id).sort();
    expect(critical).toEqual(["data-boundary", "owner", "review-budget"]);
  });
});
