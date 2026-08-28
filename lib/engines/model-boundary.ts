/**
 * The model boundary.
 *
 * Everything in this project runs today with no model attached. That is a
 * deliberate property, not a limitation, and this file is what keeps it
 * true when a model does arrive.
 *
 * The seam exists now because retrofitting one later does not work. A
 * degraded mode bolted on after the fact is always half-wired, and the
 * first thing to quietly stop working is the part that refuses.
 *
 * The contract is narrow on purpose. A model may be handed a slot and
 * asked to write prose into it. It may never touch:
 *
 *   - a refusal
 *   - a source attribution
 *   - a number
 *   - a decision
 *
 * Those four are computed, cited, or handed to a human, and a language
 * model has no standing to alter any of them. `sealed` carries them
 * through untouched, and `assertSealIntact` checks on the way out.
 */

export type DrafterMode = "deterministic" | "assisted";

/** A place where prose could help, with the facts it must not contradict. */
export interface DraftSlot {
  id: string;
  /** What this slot is for, in plain language. */
  purpose: string;
  /** The structural answer, always present, always usable on its own. */
  fallback: string;
  /** Facts the slot must respect. Never rewritten. */
  given: string[];
}

export interface DraftRequest {
  slots: DraftSlot[];
  /** Refusals, sources, numbers, decisions. Passed through untouched. */
  sealed: Record<string, string>;
}

export interface DraftResult {
  mode: DrafterMode;
  filled: Record<string, string>;
  sealed: Record<string, string>;
  /** True when every slot fell back to its structural answer. */
  usedFallbackOnly: boolean;
}

export interface Drafter {
  readonly mode: DrafterMode;
  draft(request: DraftRequest): Promise<DraftResult>;
}

/**
 * The implementation that ships today. It returns each slot's structural
 * answer, which is the same text a reader sees now. Nothing is invented,
 * so nothing has to be checked.
 */
export class DeterministicDrafter implements Drafter {
  readonly mode: DrafterMode = "deterministic";

  async draft(request: DraftRequest): Promise<DraftResult> {
    const filled: Record<string, string> = {};
    for (const slot of request.slots) filled[slot.id] = slot.fallback;
    return {
      mode: this.mode,
      filled,
      sealed: { ...request.sealed },
      usedFallbackOnly: true,
    };
  }
}

/**
 * Guard for the assisted path. Any drafter that returns altered sealed
 * values has broken the contract, and the run should fail loudly rather
 * than ship prose that contradicts its own evidence.
 */
export function assertSealIntact(
  before: Record<string, string>,
  after: Record<string, string>,
): void {
  const beforeKeys = Object.keys(before).sort();
  const afterKeys = Object.keys(after).sort();

  if (beforeKeys.length !== afterKeys.length) {
    throw new Error(
      `Model boundary violated: sealed field count changed from ${beforeKeys.length} to ${afterKeys.length}.`,
    );
  }
  for (const key of beforeKeys) {
    if (!(key in after)) {
      throw new Error(`Model boundary violated: sealed field "${key}" was dropped.`);
    }
    if (after[key] !== before[key]) {
      throw new Error(`Model boundary violated: sealed field "${key}" was rewritten.`);
    }
  }
}

/**
 * Wraps any drafter so the seal is enforced regardless of what the
 * underlying implementation does. An assisted drafter that misbehaves
 * fails here rather than downstream.
 */
export class SealedDrafter implements Drafter {
  constructor(private readonly inner: Drafter) {}

  get mode(): DrafterMode {
    return this.inner.mode;
  }

  async draft(request: DraftRequest): Promise<DraftResult> {
    const result = await this.inner.draft(request);
    assertSealIntact(request.sealed, result.sealed);

    // A slot the drafter ignored falls back rather than going empty.
    const filled: Record<string, string> = {};
    for (const slot of request.slots) {
      const value = result.filled[slot.id];
      filled[slot.id] = value && value.trim().length > 0 ? value : slot.fallback;
    }

    return { ...result, filled };
  }
}

/**
 * The single place the app decides whether a model is involved.
 *
 * Today it always returns the deterministic drafter. When a key exists,
 * an assisted drafter built on the Vercel AI SDK slots in behind the same
 * interface, wrapped in SealedDrafter so the four protected categories
 * stay protected. Callers never change.
 */
export function getDrafter(): Drafter {
  return new SealedDrafter(new DeterministicDrafter());
}

/** What the interface tells a reader about the current mode. */
export const MODE_NOTE: Record<DrafterMode, string> = {
  deterministic:
    "No model attached. Every line is assembled from published sources or computed by the engines.",
  assisted:
    "A model is drafting prose into named slots. Refusals, sources, numbers, and decisions are sealed and cannot be altered by it.",
};
