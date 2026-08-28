import { describe, expect, it } from "vitest";
import {
  BASE_LAYERS,
  CLAIM,
  EVIDENCE,
  buildCharter,
  evaluateProgress,
  type LayerId,
} from "./progress-engine";

const ids = (l: LayerId[]) => l;

describe("the opening state", () => {
  const base = evaluateProgress([]);

  it("refuses to call a green pilot a success", () => {
    expect(base.decision).toBe("bounded");
    expect(base.headline).toBe(
      "The agent worked. Business progress remains unproven.",
    );
  });

  it("agrees the agent did its job", () => {
    const tech = base.layers.filter((l) =>
      ids(["activity", "technical"]).includes(l.id),
    );
    expect(tech.every((l) => l.state === "proven")).toBe(true);
  });

  it("finds the review burden the dashboard did not report", () => {
    const review = base.layers.find((l) => l.id === "review")!;
    expect(review.state).toBe("adverse");
    expect(review.finding).toContain("45.6");
  });

  it("counts two unmeasured links, not zero", () => {
    expect(base.unknown).toBe(2);
  });
});

describe("an unmeasured link blocks rather than passes", () => {
  it("cannot reach scale while quality is unmeasured, however good the rest is", () => {
    // Everything a firm could fix in thirty days, except the measurement.
    const result = evaluateProgress([
      "review-good",
      "financial-good",
      "commercial-good",
      "organizational-good",
    ]);
    expect(result.unknown).toBe(1);
    expect(result.decision).not.toBe("scale");
    expect(result.decision).toBe("bounded");
    expect(result.because).toContain("does not pass");
  });

  it("names the measurement it is waiting on", () => {
    const result = evaluateProgress(["review-good", "commercial-good"]);
    expect(result.toScale.some((s) => s.startsWith("Measure accepted outcome"))).toBe(
      true,
    );
  });
});

describe("the decision moves when the evidence moves", () => {
  it("scales only when every link is measured and holds", () => {
    const result = evaluateProgress([
      "quality-good",
      "review-good",
      "financial-good",
      "commercial-good",
      "organizational-good",
    ]);
    expect(result.decision).toBe("scale");
    expect(result.unknown).toBe(0);
    expect(result.adverse).toBe(0);
    expect(result.toScale).toHaveLength(0);
  });

  it("stops outright on a measured quality failure, whatever the economics say", () => {
    const result = evaluateProgress([
      "review-good",
      "financial-good",
      "commercial-good",
      "organizational-good",
      "quality-bad",
    ]);
    expect(result.decision).toBe("stop");
    // Five of seven links are green. The one that failed still ends it.
    expect(result.proven).toBe(6);
  });

  it("calls for redesign when the tool works and the deployment does not", () => {
    const result = evaluateProgress(["quality-good", "financial-bad"]);
    // review, organizational, commercial, financial all adverse.
    expect(result.adverse).toBeGreaterThanOrEqual(3);
    expect(result.decision).toBe("redesign");
    expect(result.headline).toContain("The way it was deployed did not");
  });

  it("distinguishes leaking value from unmeasured value", () => {
    const result = evaluateProgress([
      "quality-good",
      "financial-good",
      "review-good",
      "organizational-good",
    ]);
    // Only the fee model is left, and it is measured, not unknown.
    expect(result.unknown).toBe(0);
    expect(result.decision).toBe("bounded");
    expect(result.headline).toContain("still leaking");
  });
});

describe("evidence can be revised", () => {
  it("lets a later reading supersede an earlier one on the same link", () => {
    const good = evaluateProgress(["quality-bad", "quality-good"]);
    expect(good.layers.find((l) => l.id === "quality")!.state).toBe("proven");

    const bad = evaluateProgress(["quality-good", "quality-bad"]);
    expect(bad.decision).toBe("stop");
  });

  it("offers a reading for every link that starts unresolved", () => {
    const unresolved = BASE_LAYERS.filter((l) => l.state !== "proven").map((l) => l.id);
    for (const id of unresolved) {
      expect(EVIDENCE.some((e) => e.layer === id)).toBe(true);
    }
  });
});

describe("the charter is derived, not written", () => {
  it("carries the twelve fields a bounded experiment needs", () => {
    expect(buildCharter(evaluateProgress([]))).toHaveLength(12);
  });

  it("says the fee model is hourly while the fee model is hourly", () => {
    const before = buildCharter(evaluateProgress([]));
    expect(
      before.find((f) => f.label === "Fee-model exposure")!.value,
    ).toContain("un-billed");

    const after = buildCharter(evaluateProgress(["commercial-good"]));
    expect(
      after.find((f) => f.label === "Fee-model exposure")!.value,
    ).toContain("keeps what it saves");
  });

  it("stops asking for a measurement once it has been taken", () => {
    const after = buildCharter(evaluateProgress(["quality-good"]));
    expect(
      after.find((f) => f.label === "Accepted-output quality")!.value,
    ).not.toContain("cannot scale");
  });
});

describe("the readings reconcile with the claim", () => {
  it("releases exactly the hours the headline percentage implies", () => {
    const implied = CLAIM.baselineHours * (CLAIM.headlineValue / 100);
    expect(implied).toBeCloseTo(CLAIM.releasedHours, 1);
    expect(CLAIM.baselineHours - CLAIM.releasedHours).toBeCloseTo(
      CLAIM.afterHours,
      1,
    );
  });

  it("never redeploys more hours than were released", () => {
    // An earlier draft claimed 134 redeployed hours against 80.6 released,
    // which is the kind of number a dashboard would happily print.
    const redeploy = EVIDENCE.filter((e) => e.layer === "financial");
    for (const e of redeploy) {
      const claimed = Number(e.metric.after.split(" ")[0]);
      expect(claimed).toBeLessThanOrEqual(CLAIM.releasedHours);
    }
  });

  it("gives every link a reading, including the ones nobody took", () => {
    for (const l of BASE_LAYERS) {
      expect(l.metric.after.length).toBeGreaterThan(0);
      // An unmeasured link still reports a count, never a blank.
      if (l.state === "unknown") {
        expect(l.metric.delta).toBe("no reading exists");
      }
    }
  });

  it("keeps the reading in step with the state when evidence lands", () => {
    const before = evaluateProgress([]).layers.find((l) => l.id === "review")!;
    expect(before.metric.after).toBe("45.6h");

    const after = evaluateProgress(["review-good"]).layers.find(
      (l) => l.id === "review",
    )!;
    expect(after.metric.after).toBe("21h");
    expect(after.metric.direction).toBe("good");
  });
});

describe("the charter agrees with the readings", () => {
  it("uses one review budget everywhere, and the repair lands inside it", () => {
    const repaired = evaluateProgress(["review-good"]);
    const hours = Number(
      repaired.layers.find((l) => l.id === "review")!.metric.after.replace("h", ""),
    );
    const field = buildCharter(repaired).find(
      (f) => f.label === "Licensed-review burden",
    )!.value;
    // The charter called it a 20-hour budget while the repair reported 21h
    // and described itself as inside budget. Both now say 22.
    expect(field).toContain("22-hour");
    expect(hours).toBeLessThanOrEqual(22);

    const failing = buildCharter(evaluateProgress([])).find(
      (f) => f.label === "Licensed-review burden",
    )!.value;
    expect(failing).toContain("22-hour");
  });
});
