import { describe, expect, it } from "vitest";
import {
  parseDiscipline,
  parsePricing,
  parseSize,
  routeTask,
  runAgent,
} from "./agent-engine";

describe("reading the task", () => {
  it("finds a staff count and bands it", () => {
    expect(parseSize("a 60 person civil firm")).toBe("25-75");
    expect(parseSize("12 staff architecture practice")).toBe("under-25");
    expect(parseSize("400 employee multi-discipline group")).toBe("over-250");
    expect(parseSize("no numbers here")).toBeNull();
  });

  it("finds how they bill", () => {
    expect(parsePricing("they bill hourly")).toBe("hourly");
    expect(parsePricing("mostly lump sum work")).toBe("fixed");
    expect(parsePricing("time and materials contracts")).toBe("hourly");
    expect(parsePricing("nothing stated")).toBeNull();
  });

  it("finds the discipline", () => {
    expect(parseDiscipline("structural engineers")).toBe("structural");
    expect(parseDiscipline("an MEP shop")).toBe("mep");
    expect(parseDiscipline("unspecified")).toBeNull();
  });
});

describe("routing is inspectable", () => {
  it("sends a call prep task to the firm play", () => {
    const run = runAgent("Prep me for a call with a 60 person civil firm");
    expect(run?.play.id).toBe("firm-call");
  });

  it("sends a keynote task to the talk play", () => {
    const run = runAgent("Outline my keynote for a room of CEOs");
    expect(run?.play.id).toBe("talk-outline");
  });

  it("sends a build request to triage", () => {
    const run = runAgent("A firm wants to build an agent for proposal drafting");
    expect(run?.play.id).toBe("triage-request");
  });

  it("sends a portfolio question to the review play", () => {
    const run = runAgent("What in the portfolio needs evidence");
    expect(run?.play.id).toBe("portfolio-review");
  });

  it("shows the runner up scores rather than hiding them", () => {
    const ranked = routeTask("prepare for a client meeting about building an agent");
    expect(ranked.length).toBeGreaterThan(1);
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
  });

  it("returns nothing rather than guessing on an unmatched task", () => {
    expect(runAgent("xyzzy")).toBeNull();
    expect(runAgent("hi")).toBeNull();
  });
});

describe("every run refuses something and hands work back", () => {
  const tasks = [
    "Prep me for a call with a 60 person civil firm that bills hourly",
    "Outline my opening for a room of CEOs",
    "A firm wants to build an agent for proposal drafting",
    "Review the portfolio and tell me what stalled",
    "Turn my workshop notes into a record",
  ];

  it("always includes at least one refusal step", () => {
    for (const t of tasks) {
      const run = runAgent(t);
      expect(run).not.toBeNull();
      expect(run!.steps.some((s) => s.kind === "refuse")).toBe(true);
    }
  });

  it("always hands at least one judgment back", () => {
    for (const t of tasks) {
      const run = runAgent(t);
      expect(run!.handBack.length).toBeGreaterThan(0);
    }
  });

  it("attributes every step to an instrument or source", () => {
    for (const t of tasks) {
      const run = runAgent(t);
      for (const step of run!.steps) {
        expect(step.via.length).toBeGreaterThan(3);
      }
    }
  });

  it("produces a usable artifact every time", () => {
    for (const t of tasks) {
      const run = runAgent(t);
      expect(run!.artifact.lines.length).toBeGreaterThan(2);
      expect(run!.artifact.title.length).toBeGreaterThan(5);
    }
  });
});

describe("it declares what it assumed", () => {
  it("lists assumptions when the task is vague", () => {
    const run = runAgent("prep me for a client call");
    expect(run!.assumed.length).toBeGreaterThan(1);
  });

  it("assumes less when the task is specific", () => {
    const vague = runAgent("prep me for a client call")!;
    const specific = runAgent(
      "prep me for a call with a 60 person structural firm that bills hourly",
    )!;
    expect(specific.assumed.length).toBeLessThan(vague.assumed.length);
  });
});

describe("the follow-up play refuses to invent content", () => {
  it("returns questions, never answers", () => {
    const run = runAgent("turn my workshop notes into a decision record")!;
    expect(run.artifact.lines.every((l) => l.trim().endsWith("?"))).toBe(true);
    expect(run.handBack[0]).toContain("none of the content");
  });
});

describe("triage applies the buy or build rule honestly", () => {
  it("says buy when the problem is a commodity", () => {
    const run = runAgent("a firm wants to build a proposal drafting agent")!;
    const text = run.steps.map((s) => s.detail).join(" ");
    expect(text).toContain("vendor will do it better");
  });

  it("never approves a build", () => {
    const run = runAgent("a firm wants to build something unusual for their niche")!;
    expect(run.steps.some((s) => s.kind === "refuse")).toBe(true);
    const text = run.steps.map((s) => s.detail).join(" ");
    expect(text).toContain("No agent gets a yes");
  });
});
