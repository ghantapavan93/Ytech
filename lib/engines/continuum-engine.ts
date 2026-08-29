/**
 * Continuum: the layer between what somebody said and what they now think.
 *
 * Any system built on a body of published work — a retrieval index, a course,
 * a cohort handbook, an assistant trained on a back catalogue — answers from
 * whatever it was given. It has no way to know that its author's emphasis
 * moved, because a document does not carry the fact of having been
 * superseded. The newest source and the oldest one look identical to a
 * similarity search.
 *
 * The missing object is not a better retriever. It is a Position: a claim
 * with a version, a date it took effect, the audience it applies to, the
 * evidence under it, and an approval. Positions supersede each other, and
 * nothing supersedes anything without a human saying so.
 *
 * That last rule is the whole product. Detecting that an emphasis has shifted
 * is inference and can be automated. Deciding that the shift is a change of
 * judgment rather than an added nuance is not inference, and a system that
 * quietly rewrites somebody's stated position has not helped them, it has
 * impersonated a version of them that never existed.
 */

export type Approval =
  | "unapproved"
  | "approved"
  | "qualified"
  | "superseded"
  | "rejected"
  | "deferred";

export type Decision = "supersede" | "qualify" | "keep-both" | "reject" | "defer";

export const DECISION_LABEL: Record<Decision, string> = {
  supersede: "Supersede the old position",
  qualify: "Qualify it by firm maturity",
  "keep-both": "Keep both, for different audiences",
  reject: "Reject the proposed change",
  defer: "Defer, and go and find out",
};

export interface Evidence {
  id: string;
  /** What was actually said or written. Quoted, never paraphrased into a claim. */
  quote: string;
  source: string;
  /** ISO date. Everything here is ordered by it. */
  date: string;
  /** Whether the words are verbatim or a fair summary of a longer passage. */
  verbatim: boolean;
}

export interface Position {
  id: string;
  topic: string;
  /** The claim, in the author's register rather than a summary of it. */
  claim: string;
  version: number;
  effectiveFrom: string;
  /** Who this was said to. A position is rarely universal and usually reads as if it were. */
  audience: string;
  /** The conditions under which it holds. */
  applicability: string;
  evidence: Evidence[];
  approval: Approval;
  /** The version this replaced, if any. */
  supersedes?: number;
  /** What this position does not claim, kept explicit so it cannot be stretched. */
  boundaries: string[];
}

/**
 * A proposed change, which is all this system is ever allowed to produce on
 * its own.
 */
export interface PositionDelta {
  topic: string;
  previous: Position;
  proposed: Position;
  /** The observable difference, stated without asserting a contradiction. */
  whatChanged: string;
  /** Said out loud, because most apparent reversals are additions. */
  whatDidNot: string;
  /** The reading that requires the fewest assumptions. */
  likeliestExplanation: string;
  /** 0–1. Confidence that an emphasis moved, never that the author agrees. */
  confidence: number;
  /** What this cannot tell from the evidence alone. */
  uncertainty: string[];
  /** Answers that would change if this were approved. */
  affects: string[];
}

export type ContinuumEvent =
  | { type: "NewEvidenceObserved"; evidence: Evidence }
  | { type: "PositionDeltaProposed"; topic: string; confidence: number }
  | { type: "ConflictDetected"; topic: string; detail: string }
  | { type: "AnswerBlocked"; question: string; because: string }
  | { type: "PositionQualified"; topic: string; version: number }
  | { type: "PositionSuperseded"; topic: string; version: number }
  | { type: "PositionApproved"; topic: string; version: number; by: string }
  | { type: "AnswerUpdated"; question: string; version: number };

/**
 * What the system is willing to say when asked a question it holds an
 * unapproved delta on.
 *
 * Answering from the old position is wrong and answering from the new one is
 * worse, because nobody agreed to the new one. So it answers from the
 * approved position and says a change is pending. Silence would also be a
 * kind of lie: the author did say the older thing.
 */
export type AnswerMode = "answer" | "answer-with-caveat" | "abstain";

export interface Answer {
  mode: AnswerMode;
  text: string;
  /** Shown under the answer. Never optional. */
  provenance: {
    version: number;
    effectiveFrom: string;
    approval: Approval;
    audience: string;
    applicability: string;
    supersedes?: number;
    pendingDelta: boolean;
  };
  /** Why this is qualified or refused, when it is. */
  note?: string;
}

/** Positions are only ever spoken from once a person has approved them. */
const SPEAKABLE: Approval[] = ["approved", "qualified"];

export function answerFrom(
  question: string,
  positions: Position[],
  delta: PositionDelta | null,
): Answer {
  const speakable = positions
    .filter((p) => SPEAKABLE.includes(p.approval))
    .sort((a, b) => b.version - a.version);

  const current = speakable[0];
  const pending = Boolean(delta && delta.proposed.approval === "unapproved");

  if (!current) {
    return {
      mode: "abstain",
      text: "There is no approved position on this yet, so there is nothing here that should be spoken in somebody else's voice.",
      provenance: {
        version: 0,
        effectiveFrom: "—",
        approval: "unapproved",
        audience: "—",
        applicability: "—",
        pendingDelta: pending,
      },
      note: "Abstaining is the only honest option when the only available answer is unapproved.",
    };
  }

  return {
    mode: pending ? "answer-with-caveat" : "answer",
    text: current.claim,
    provenance: {
      version: current.version,
      effectiveFrom: current.effectiveFrom,
      approval: current.approval,
      audience: current.audience,
      applicability: current.applicability,
      supersedes: current.supersedes,
      pendingDelta: pending,
    },
    note: pending
      ? "Newer material suggests this emphasis has moved. The change has not been approved, so this still answers from the approved position and says so."
      : undefined,
  };
}

/**
 * Applies a human decision. This is the only function that changes anything,
 * and it will not run without one.
 */
export function decide(
  delta: PositionDelta,
  decision: Decision,
  by: string,
  on: string,
): { positions: Position[]; events: ContinuumEvent[] } {
  const previous = delta.previous;
  const proposed = delta.proposed;
  const events: ContinuumEvent[] = [];

  switch (decision) {
    case "supersede": {
      events.push(
        { type: "PositionSuperseded", topic: delta.topic, version: previous.version },
        { type: "PositionApproved", topic: delta.topic, version: proposed.version, by },
        { type: "AnswerUpdated", question: delta.affects[0] ?? delta.topic, version: proposed.version },
      );
      return {
        positions: [
          { ...previous, approval: "superseded" },
          { ...proposed, approval: "approved", effectiveFrom: on, supersedes: previous.version },
        ],
        events,
      };
    }

    case "qualify":
    case "keep-both": {
      /*
       * The interesting case, and the one an automatic system gets wrong.
       * The old position is not retired: it keeps its own audience and the
       * new one narrows to the conditions where it applies. Two true things
       * about different firms, rather than one replacing the other.
       */
      const kind = decision === "qualify" ? "PositionQualified" : "PositionApproved";
      events.push(
        { type: kind, topic: delta.topic, version: proposed.version } as ContinuumEvent,
        { type: "PositionApproved", topic: delta.topic, version: proposed.version, by },
        { type: "AnswerUpdated", question: delta.affects[0] ?? delta.topic, version: proposed.version },
      );
      return {
        positions: [
          { ...previous, approval: "qualified" },
          { ...proposed, approval: "approved", effectiveFrom: on, supersedes: undefined },
        ],
        events,
      };
    }

    case "reject":
      return {
        positions: [previous, { ...proposed, approval: "rejected" }],
        events: [
          { type: "ConflictDetected", topic: delta.topic, detail: "Change rejected by the author. The earlier position stands." },
        ],
      };

    case "defer":
      return {
        positions: [previous, { ...proposed, approval: "deferred" }],
        events: [
          { type: "AnswerBlocked", question: delta.affects[0] ?? delta.topic, because: "The author deferred the decision, so neither position can be spoken as current." },
        ],
      };
  }
}

/** Nothing here proposes a change without saying how sure it is not. */
export function isWellFormed(delta: PositionDelta): boolean {
  return (
    delta.confidence > 0 &&
    delta.confidence < 1 &&
    delta.uncertainty.length > 0 &&
    delta.whatDidNot.length > 0 &&
    delta.proposed.approval === "unapproved" &&
    delta.proposed.evidence.length > 0 &&
    delta.previous.evidence.length > 0
  );
}
