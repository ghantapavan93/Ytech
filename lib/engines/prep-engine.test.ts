import { describe, expect, it } from "vitest";
import {
  buildPrepSheet,
  DEFAULT_FIRM,
  stageOf,
  type FirmInput,
} from "./prep-engine";

const firm = (over: Partial<FirmInput> = {}): FirmInput => ({
  ...DEFAULT_FIRM,
  ...over,
});

describe("stage banding follows their published weights", () => {
  it("weights operating model heaviest", () => {
    const opStrong = stageOf({ culture: 1, adoption: 1, operating: 5, business: 1 });
    const cultureStrong = stageOf({ culture: 5, adoption: 1, operating: 1, business: 1 });
    expect(opStrong.score).toBeGreaterThan(cultureStrong.score);
  });

  it("uses their four stage names", () => {
    expect(stageOf({ culture: 1, adoption: 1, operating: 1, business: 1 }).stage).toBe("Exploring");
    expect(stageOf({ culture: 3, adoption: 3, operating: 2, business: 2 }).stage).toBe("Adopting");
    expect(stageOf({ culture: 4, adoption: 4, operating: 3, business: 3 }).stage).toBe("Transforming");
    expect(stageOf({ culture: 5, adoption: 5, operating: 4, business: 4 }).stage).toBe("Leading");
  });
});

describe("every line carries a source", () => {
  it("attributes all output", () => {
    const sheet = buildPrepSheet(firm());
    const all = [
      ...sheet.openWith,
      ...sheet.contradiction,
      ...sheet.doNotBuild,
      ...sheet.guardrails,
      ...sheet.firstExperiment,
      ...sheet.watchFor,
    ];
    expect(all.length).toBeGreaterThan(8);
    for (const line of all) {
      expect(line.source.length).toBeGreaterThan(4);
      expect(line.text.length).toBeGreaterThan(20);
    }
  });
});

describe("the pricing contradiction", () => {
  it("names the hourly problem when they bill hourly", () => {
    const sheet = buildPrepSheet(firm({ pricing: "hourly" }));
    expect(sheet.contradiction.some((l) => l.id === "con-hourly")).toBe(true);
  });

  it("moves past pricing when the fee model already keeps savings", () => {
    const sheet = buildPrepSheet(firm({ pricing: "fixed" }));
    expect(sheet.contradiction.some((l) => l.id === "con-hourly")).toBe(false);
    expect(sheet.contradiction.some((l) => l.id === "con-fixed")).toBe(true);
  });
});

describe("advice adapts to the firm in front of her", () => {
  it("warns a small firm off building a platform", () => {
    const sheet = buildPrepSheet(firm({ size: "under-25" }));
    expect(sheet.doNotBuild.some((l) => l.id === "dnb-small")).toBe(true);
  });

  it("raises sprawl only once tools are already everywhere", () => {
    const quiet = buildPrepSheet(firm({ maturity: { culture: 3, adoption: 2, operating: 2, business: 2 } }));
    const busy = buildPrepSheet(firm({ maturity: { culture: 3, adoption: 5, operating: 2, business: 2 } }));
    expect(quiet.doNotBuild.some((l) => l.id === "dnb-sprawl")).toBe(false);
    expect(busy.doNotBuild.some((l) => l.id === "dnb-sprawl")).toBe(true);
  });

  it("sizes the experiment to the stage", () => {
    const early = buildPrepSheet(firm({ maturity: { culture: 1, adoption: 1, operating: 1, business: 1 } }));
    const late = buildPrepSheet(firm({ maturity: { culture: 5, adoption: 5, operating: 4, business: 4 } }));
    expect(early.firstExperiment.some((l) => l.id === "exp-explore")).toBe(true);
    expect(late.firstExperiment.some((l) => l.id === "exp-transform")).toBe(true);
  });

  it("always writes a stop condition into the experiment", () => {
    const sheet = buildPrepSheet(firm());
    expect(sheet.firstExperiment.some((l) => l.id === "exp-stop")).toBe(true);
  });
});

describe("triggers change the opening", () => {
  it("adds the RONI reframe only when the board is asking", () => {
    const withBoard = buildPrepSheet(firm({ triggers: ["board-roi"] }));
    const without = buildPrepSheet(firm({ triggers: [] }));
    expect(withBoard.openWith.some((l) => l.id === "open-roni")).toBe(true);
    expect(without.openWith.some((l) => l.id === "open-roni")).toBe(false);
  });

  it("keeps the inside-out opener no matter what", () => {
    const sheet = buildPrepSheet(firm({ triggers: [] }));
    expect(sheet.openWith.some((l) => l.id === "open-inside-out")).toBe(true);
  });
});

describe("the firm's own name is used, never invented", () => {
  it("falls back to a neutral phrase when no name is given", () => {
    const sheet = buildPrepSheet(firm({ name: "" }));
    expect(sheet.openWith[0].text).toContain("this firm");
  });

  it("uses the name she typed", () => {
    const sheet = buildPrepSheet(firm({ name: "Atlas Civil" }));
    expect(sheet.openWith[0].text).toContain("Atlas Civil");
  });
});
