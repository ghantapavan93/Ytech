import { describe, expect, it } from "vitest";
import { START_DELTA, QUESTION } from "@/lib/content/positions-data";
import {
  answerFrom,
  decide,
  isWellFormed,
  type Decision,
  type Position,
} from "./continuum-engine";

/**
 * The one rule that makes this a product rather than a retriever.
 *
 * Detecting that an emphasis moved is inference. Deciding that the move is a
 * change of judgment rather than an added nuance is not, and a system that
 * rewrites somebody's stated position without asking has not helped them, it
 * has impersonated a version of them that never existed. Every test here
 * exists to make that failure impossible rather than unlikely.
 */

const ALL: Decision[] = ["supersede", "qualify", "keep-both", "reject", "defer"];
const ON = "2026-08-29";

describe("nothing changes without a person", () => {
  it("starts with the newer position unapproved", () => {
    expect(START_DELTA.proposed.approval).toBe("unapproved");
    expect(START_DELTA.previous.approval).toBe("approved");
  });

  it("answers from the approved position while a delta is pending", () => {
    const a = answerFrom(QUESTION, [START_DELTA.previous, START_DELTA.proposed], START_DELTA);
    expect(a.text).toBe(START_DELTA.previous.claim);
    expect(a.mode).toBe("answer-with-caveat");
    expect(a.provenance.pendingDelta).toBe(true);
  });

  it("never speaks an unapproved position, under any decision but approval", () => {
    for (const d of ["reject", "defer"] as Decision[]) {
      const { positions } = decide(START_DELTA, d, "Author", ON);
      const a = answerFrom(QUESTION, positions, null);
      expect(a.text, d).not.toBe(START_DELTA.proposed.claim);
    }
  });

  it("abstains rather than guessing when nothing is approved", () => {
    const none: Position[] = [{ ...START_DELTA.previous, approval: "unapproved" }];
    const a = answerFrom(QUESTION, none, null);
    expect(a.mode).toBe("abstain");
    expect(a.text).toMatch(/nothing here that should be spoken/i);
  });
});

describe("the decision is not a switch", () => {
  it("retires the old position only when told to supersede", () => {
    const sup = decide(START_DELTA, "supersede", "Author", ON);
    expect(sup.positions.find((p) => p.version === 1)?.approval).toBe("superseded");

    const both = decide(START_DELTA, "keep-both", "Author", ON);
    expect(both.positions.find((p) => p.version === 1)?.approval).toBe("qualified");
  });

  it("keeps both positions speakable when the audiences differ", () => {
    const { positions } = decide(START_DELTA, "keep-both", "Author", ON);
    const a = answerFrom(QUESTION, positions, null);
    expect(a.text).toBe(START_DELTA.proposed.claim);
    // The earlier one is qualified rather than deleted: still true of firms at zero.
    expect(positions.find((p) => p.version === 1)?.audience).toMatch(/had not yet started/);
  });

  it("stamps the approval date the person acted, not the date of the evidence", () => {
    const { positions } = decide(START_DELTA, "supersede", "Author", ON);
    expect(positions.find((p) => p.version === 2)?.effectiveFrom).toBe(ON);
  });

  it("records who approved it, for every decision that changes anything", () => {
    for (const d of ["supersede", "qualify", "keep-both"] as Decision[]) {
      const { events } = decide(START_DELTA, d, "Author", ON);
      expect(events.some((e) => e.type === "PositionApproved" && e.by === "Author"), d).toBe(true);
    }
  });

  it("blocks the answer entirely when the person defers", () => {
    const { events } = decide(START_DELTA, "defer", "Author", ON);
    expect(events.some((e) => e.type === "AnswerBlocked")).toBe(true);
  });

  it("produces an event for every decision, so nothing happens silently", () => {
    for (const d of ALL) {
      expect(decide(START_DELTA, d, "Author", ON).events.length, d).toBeGreaterThan(0);
    }
  });
});

describe("a proposal has to admit what it does not know", () => {
  it("is never certain, and never claims a contradiction outright", () => {
    expect(isWellFormed(START_DELTA)).toBe(true);
    expect(START_DELTA.confidence).toBeLessThan(1);
    expect(START_DELTA.whatDidNot.length).toBeGreaterThan(40);
    expect(START_DELTA.uncertainty.length).toBeGreaterThanOrEqual(2);
  });

  it("carries dated evidence on both sides", () => {
    for (const p of [START_DELTA.previous, START_DELTA.proposed]) {
      expect(p.evidence.length).toBeGreaterThan(0);
      for (const e of p.evidence) {
        expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(e.source.length).toBeGreaterThan(8);
      }
    }
  });

  it("puts the newer evidence after the older evidence", () => {
    const newest = (p: Position) => p.evidence.map((e) => e.date).sort().at(-1)!;
    expect(newest(START_DELTA.proposed) > newest(START_DELTA.previous)).toBe(true);
  });

  it("marks every quote as verbatim or not, so nothing is over-claimed", () => {
    for (const p of [START_DELTA.previous, START_DELTA.proposed]) {
      for (const e of p.evidence) expect(typeof e.verbatim).toBe("boolean");
    }
  });

  it("states what each position does not cover", () => {
    for (const p of [START_DELTA.previous, START_DELTA.proposed]) {
      expect(p.boundaries.length).toBeGreaterThanOrEqual(2);
    }
  });
});
