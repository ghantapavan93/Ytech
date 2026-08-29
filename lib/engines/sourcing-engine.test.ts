import { describe, expect, it } from "vitest";
import {
  SPEC_QA_SOURCING,
  sourcing,
  type Answer,
  type SourcingInputs,
} from "./sourcing-engine";

const base: SourcingInputs = { ...SPEC_QA_SOURCING };
const with_ = (o: Partial<SourcingInputs>) => sourcing({ ...base, ...o });

describe("the two questions that decide it", () => {
  it("refuses when it cannot tell a commodity from a moat", () => {
    for (const key of ["commonProblem", "firmSpecificJudgment"] as const) {
      const r = with_({ [key]: "unknown" as Answer });
      expect(r.verdict, key).toBe("not-yet");
      expect(r.unknowns.length).toBeGreaterThan(0);
    }
  });

  it("does not treat the other questions as deciding ones", () => {
    // A missing answer here shades the reasoning. It does not block, because
    // the commodity-or-moat question is already settled without it.
    expect(with_({ clientVisible: "unknown" }).verdict).not.toBe("not-yet");
    expect(with_({ toolExists: "unknown" }).verdict).not.toBe("not-yet");
  });
});

describe("market size decides it, not price", () => {
  it("buys a common problem somebody already sells the answer to", () => {
    const r = with_({ firmSpecificJudgment: "no" });
    expect(r.verdict).toBe("buy");
    expect(r.because.join(" ")).toMatch(/re-solving a solved problem/i);
  });

  it("waits rather than building a product a vendor is about to ship", () => {
    // Nothing firm-specific and no tool yet is not an opportunity. It is a
    // description of somebody else's roadmap.
    const r = with_({ firmSpecificJudgment: "no", toolExists: "no" });
    expect(r.verdict).toBe("wait");
  });

  it("builds where the market is one firm wide", () => {
    const r = with_({ commonProblem: "no" });
    expect(r.verdict).toBe("build");
    expect(r.because.join(" ")).toMatch(/nothing to buy|market for a product is too small/i);
  });

  it("splits it when the problem is shared and the judgment is not", () => {
    // The case the site's own workflow lands in, and the one a binary
    // question cannot express.
    expect(sourcing(SPEC_QA_SOURCING).verdict).toBe("buy-base-build-edge");
  });

  it("does not argue for building on cost", () => {
    const r = with_({ commonProblem: "no" });
    expect(r.because.join(" ")).toMatch(/not a cost argument/i);
  });
});

describe("maintenance gates the build, not the buy", () => {
  it("refuses to build what the firm cannot keep running", () => {
    const r = with_({ commonProblem: "no", canMaintain: "no" });
    expect(r.verdict).toBe("buy");
    expect(r.because.join(" ")).toMatch(/after it has stopped being right/i);
  });

  it("blocks on an unknown only once building is on the table", () => {
    expect(with_({ commonProblem: "no", canMaintain: "unknown" }).verdict).toBe(
      "not-yet",
    );
    // Same unknown, but the verdict was going to be buy anyway, so it is not
    // a question anybody needs to go and answer first.
    expect(
      with_({ firmSpecificJudgment: "no", canMaintain: "unknown" }).verdict,
    ).toBe("buy");
  });
});

describe("every answer carries its reasoning", () => {
  it("gives a reason for each of the sixteen resolvable combinations", () => {
    const answers: Answer[] = ["yes", "no"];
    for (const commonProblem of answers)
      for (const toolExists of answers)
        for (const firmSpecificJudgment of answers)
          for (const canMaintain of answers) {
            const r = sourcing({
              commonProblem,
              toolExists,
              firmSpecificJudgment,
              canMaintain,
              clientVisible: "no",
            });
            expect(r.verdict).not.toBe("not-yet");
            expect(r.because.length).toBeGreaterThan(0);
            expect(r.headline.length).toBeGreaterThan(20);
          }
  });
});
