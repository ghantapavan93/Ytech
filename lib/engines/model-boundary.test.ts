import { describe, expect, it } from "vitest";
import {
  assertSealIntact,
  DeterministicDrafter,
  getDrafter,
  SealedDrafter,
  type DraftRequest,
  type Drafter,
  type DraftResult,
} from "./model-boundary";

const request: DraftRequest = {
  slots: [
    {
      id: "opening",
      purpose: "How to open the conversation",
      fallback: "Ask what breaks first on a normal Tuesday.",
      given: ["The firm bills hourly."],
    },
    {
      id: "closing",
      purpose: "How to close",
      fallback: "Write the stop condition before anything runs.",
      given: [],
    },
  ],
  sealed: {
    refusal: "Did not diagnose the firm.",
    source: "STRUCTURE Magazine, June 2025",
    number: "-11420",
    decision: "redesign-first",
  },
};

describe("the deterministic drafter", () => {
  it("returns the structural answer for every slot", async () => {
    const result = await new DeterministicDrafter().draft(request);
    expect(result.filled.opening).toBe(request.slots[0].fallback);
    expect(result.filled.closing).toBe(request.slots[1].fallback);
    expect(result.usedFallbackOnly).toBe(true);
    expect(result.mode).toBe("deterministic");
  });

  it("passes sealed values through unchanged", async () => {
    const result = await new DeterministicDrafter().draft(request);
    expect(result.sealed).toEqual(request.sealed);
  });
});

describe("the seal", () => {
  it("accepts an untouched seal", () => {
    expect(() => assertSealIntact(request.sealed, { ...request.sealed })).not.toThrow();
  });

  it("catches a rewritten number", () => {
    expect(() =>
      assertSealIntact(request.sealed, { ...request.sealed, number: "-9000" }),
    ).toThrow(/rewritten/);
  });

  it("catches a softened refusal", () => {
    expect(() =>
      assertSealIntact(request.sealed, {
        ...request.sealed,
        refusal: "Diagnosed the firm as ready.",
      }),
    ).toThrow(/rewritten/);
  });

  it("catches a dropped source", () => {
    const { source, ...missing } = request.sealed;
    expect(() => assertSealIntact(request.sealed, missing)).toThrow(/count changed/);
  });

  it("catches a smuggled extra field", () => {
    expect(() =>
      assertSealIntact(request.sealed, { ...request.sealed, extra: "invented" }),
    ).toThrow(/count changed/);
  });
});

/** Stands in for a future assisted drafter that misbehaves. */
class RogueDrafter implements Drafter {
  readonly mode = "assisted" as const;
  constructor(private readonly mutate: (r: DraftRequest) => DraftResult) {}
  async draft(request: DraftRequest): Promise<DraftResult> {
    return this.mutate(request);
  }
}

describe("SealedDrafter defends the boundary", () => {
  it("fails loudly when a drafter edits a sealed number", async () => {
    const rogue = new SealedDrafter(
      new RogueDrafter((r) => ({
        mode: "assisted",
        filled: { opening: "Rewritten opening.", closing: "Rewritten closing." },
        sealed: { ...r.sealed, number: "+50000" },
        usedFallbackOnly: false,
      })),
    );
    await expect(rogue.draft(request)).rejects.toThrow(/Model boundary violated/);
  });

  it("fails loudly when a drafter deletes a refusal", async () => {
    const rogue = new SealedDrafter(
      new RogueDrafter((r) => {
        const { refusal, ...rest } = r.sealed;
        return {
          mode: "assisted",
          filled: {},
          sealed: rest,
          usedFallbackOnly: false,
        };
      }),
    );
    await expect(rogue.draft(request)).rejects.toThrow(/Model boundary violated/);
  });

  it("falls back rather than shipping an empty slot", async () => {
    const lazy = new SealedDrafter(
      new RogueDrafter((r) => ({
        mode: "assisted",
        filled: { opening: "   " },
        sealed: { ...r.sealed },
        usedFallbackOnly: false,
      })),
    );
    const result = await lazy.draft(request);
    expect(result.filled.opening).toBe(request.slots[0].fallback);
    expect(result.filled.closing).toBe(request.slots[1].fallback);
  });

  it("lets a well-behaved assisted drafter through", async () => {
    const good = new SealedDrafter(
      new RogueDrafter((r) => ({
        mode: "assisted",
        filled: { opening: "A better opening line.", closing: "A better closing line." },
        sealed: { ...r.sealed },
        usedFallbackOnly: false,
      })),
    );
    const result = await good.draft(request);
    expect(result.filled.opening).toBe("A better opening line.");
    expect(result.sealed).toEqual(request.sealed);
  });
});

describe("the app default", () => {
  it("ships with no model attached", async () => {
    const drafter = getDrafter();
    expect(drafter.mode).toBe("deterministic");
    const result = await drafter.draft(request);
    expect(result.usedFallbackOnly).toBe(true);
  });
});
