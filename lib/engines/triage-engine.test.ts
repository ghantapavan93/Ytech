import { describe, expect, it } from "vitest";
import { ATLAS_BASELINE } from "./engine";
import {
  CANDIDATES,
  rank,
  triage,
  type WorkflowCandidate,
} from "./triage-engine";

const base: WorkflowCandidate = {
  id: "w",
  name: "A workflow",
  runsPerMonth: 20,
  hoursPerRun: 20,
  standardised: "yes",
  licensedReview: "yes",
  billedHourly: "no",
  teachesJuniors: "no",
  qualityMeasured: "yes",
};

describe("a missing answer blocks rather than averages away", () => {
  it("will not call a workflow testable when quality is unmeasured", () => {
    const r = triage({ ...base, qualityMeasured: "unknown" });
    expect(r.verdict).toBe("not-yet");
    expect(r.unknowns.length).toBeGreaterThan(0);
  });

  it("will not call it testable when nobody knows who signs it off", () => {
    expect(triage({ ...base, licensedReview: "unknown" }).verdict).toBe("not-yet");
  });

  it("names what has to be found out rather than just refusing", () => {
    const r = triage({ ...base, qualityMeasured: "unknown" });
    expect(r.unknowns.join(" ")).toMatch(/good output from a bad one/i);
  });
});

describe("it does not send anyone to measure something that cannot matter", () => {
  it("leaves a thin workflow alone even when answers are missing", () => {
    const thin = {
      ...base,
      runsPerMonth: 4,
      hoursPerRun: 1,
      qualityMeasured: "unknown" as const,
    };
    expect(triage(thin).verdict).toBe("leave");
  });

  it("treats a material workflow as worth an answer", () => {
    expect(triage({ ...base, runsPerMonth: 20, hoursPerRun: 20 }).exposureHours).toBe(400);
    expect(triage(base).verdict).toBe("test");
  });
});

describe("some workflows need the firm changed before a test means anything", () => {
  it("holds back bespoke work", () => {
    expect(triage({ ...base, standardised: "no" }).verdict).toBe("redesign-first");
  });

  it("holds back hourly work that is also how juniors learn", () => {
    const r = triage({ ...base, billedHourly: "yes", teachesJuniors: "yes" });
    expect(r.verdict).toBe("redesign-first");
    expect(r.because.join(" ")).toMatch(/fee model and the practice floor/i);
  });
});

describe("the ranking puts the next question first", () => {
  const ranked = rank(CANDIDATES);

  it("sorts testable work above everything else", () => {
    const order = ranked.map((r) => r.verdict);
    expect(order.indexOf("test")).toBeLessThan(order.lastIndexOf("leave"));
    expect(order.indexOf("not-yet")).toBeLessThan(order.lastIndexOf("leave"));
  });

  it("does not put the biggest workflow first", () => {
    // The unglamorous answer, and the one a vendor never gives. Spec QA is
    // the largest exposure on the list by a wide margin and it is still not
    // the thing to test first, because it is billed hourly and it is how
    // juniors learn. The safe, smaller workflow goes first.
    const biggest = [...rank(CANDIDATES)].sort(
      (a, b) => b.exposureHours - a.exposureHours,
    )[0];
    expect(biggest.candidate.id).toBe("spec-qa");
    expect(ranked[0].candidate.id).not.toBe("spec-qa");
    expect(ranked[0].verdict).toBe("test");
  });

  it("sends spec QA to redesign, which is what the wind tunnel then shows", () => {
    const specQa = ranked.find((r) => r.candidate.id === "spec-qa")!;
    expect(specQa.verdict).toBe("redesign-first");
    expect(specQa.because.join(" ")).toMatch(/fee model and the practice floor/i);
  });

  it("sizes that workflow exactly as the wind tunnel does", () => {
    const specQa = CANDIDATES.find((c) => c.id === "spec-qa")!;
    expect(specQa.runsPerMonth).toBe(ATLAS_BASELINE.monthlyPackageVolume);
    expect(specQa.hoursPerRun).toBe(ATLAS_BASELINE.baseJrHoursPerPkg);
  });
});

describe("a known no is harder than a don't know", () => {
  it("will not test a workflow the firm cannot judge the output of", () => {
    // Caught by clicking the toggle rather than by reading the code: the
    // blocking check only looked for "unknown", so a firm that had already
    // established it cannot tell good from bad was still told to run a test.
    const r = triage({ ...base, qualityMeasured: "no" });
    expect(r.verdict).toBe("redesign-first");
    expect(r.because.join(" ")).toMatch(/acceptance check has to exist/i);
  });

  it("separates go and ask from go and build", () => {
    expect(triage({ ...base, qualityMeasured: "unknown" }).verdict).toBe("not-yet");
    expect(triage({ ...base, qualityMeasured: "no" }).verdict).toBe("redesign-first");
  });
});
