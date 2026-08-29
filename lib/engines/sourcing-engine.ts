/**
 * Build it or buy it, decided the way the decision is actually shaped.
 *
 * The received framing is a cost comparison: price the subscription, price
 * the build, pick the smaller number. That framing is wrong twice. It is
 * wrong on its own terms, because the two costs sit on the same line of the
 * same model and the gap between them is small against everything else on
 * that model. And it is wrong about what the question is for.
 *
 * The useful version is a question about market size. A problem every firm
 * has is a problem some vendor is already being paid to solve, and solving
 * it again in-house spends scarce engineering on a solved thing. A problem
 * shaped by one firm's own judgment has a market of one, so no vendor will
 * ever build it, and that is precisely why building it is worth something:
 * not because it is cheaper, but because nobody can hand it to a competitor.
 *
 * So this asks about the problem rather than about the price, and like the
 * triage it refuses to answer when the answers that decide it are missing.
 * Two questions decide whether this is a commodity or a moat, and a missing
 * answer to either does not average away.
 */

export type Answer = "yes" | "no" | "unknown";

export type Sourcing =
  | "buy"
  | "buy-base-build-edge"
  | "build"
  | "wait"
  | "not-yet";

export const SOURCING_LABEL: Record<Sourcing, string> = {
  buy: "Buy it",
  "buy-base-build-edge": "Buy the base, build the edge",
  build: "Build it",
  wait: "Wait",
  "not-yet": "Cannot decide it yet",
};

export interface SourcingInputs {
  /** Do other firms in the same position have this problem in the same shape? */
  commonProblem: Answer;
  /** Does something already exist that does most of it? */
  toolExists: Answer;
  /** Does getting the output right depend on judgment particular to this firm? */
  firmSpecificJudgment: Answer;
  /** Could the firm keep it running after whoever built it moves on? */
  canMaintain: Answer;
  /** Would a client notice this as something the firm does differently? */
  clientVisible: Answer;
}

export interface SourcingResult {
  inputs: SourcingInputs;
  verdict: Sourcing;
  /** The sentence a principal would repeat in the corridor. */
  headline: string;
  because: string[];
  /** What has to be found out before this can be answered at all. */
  unknowns: string[];
}

/**
 * The two questions that decide whether this is a commodity or a moat.
 *
 * Everything else shades the reasoning. Without these two there is no
 * decision to shade, because commodity and moat are the only two things the
 * verdict can be about.
 */
const DECIDING: { key: keyof SourcingInputs; missing: string }[] = [
  {
    key: "commonProblem",
    missing:
      "Whether other firms have this problem in the same shape. If they do, someone is already being paid to solve it and a second solution is a duplicate. If they do not, no vendor will ever arrive.",
  },
  {
    key: "firmSpecificJudgment",
    missing:
      "Whether the output depends on judgment particular to this firm. This is the whole difference between a tool that can be bought and one that only exists if you build it.",
  },
];

export function sourcing(inputs: SourcingInputs): SourcingResult {
  const unknowns = DECIDING.filter((d) => inputs[d.key] === "unknown").map(
    (d) => d.missing,
  );

  const because: string[] = [];
  let verdict: Sourcing;
  let headline: string;

  const moat = inputs.firmSpecificJudgment === "yes";
  const commodity = inputs.commonProblem === "yes";
  const maintainable = inputs.canMaintain;

  if (unknowns.length > 0) {
    verdict = "not-yet";
    headline =
      "This is a question about market size, and the answers that decide it are not here.";
    because.push(
      "A build-or-buy answer given without these is a preference rather than a decision, and it will be defended as though it were a decision.",
    );
  } else if (!moat && commodity && inputs.toolExists === "yes") {
    verdict = "buy";
    headline = "Everyone has this problem and somebody already sells the answer.";
    because.push(
      "The problem is common and the output does not turn on anything particular to this firm, so a bought tool produces the same result as a built one.",
      "Engineering time is the scarcest thing in a practice this size. Spending it re-solving a solved problem is the most expensive way to save a subscription.",
    );
  } else if (!moat && inputs.toolExists !== "yes") {
    verdict = "wait";
    headline =
      "A common problem with no tool yet is a vendor roadmap, not a project.";
    because.push(
      "Nothing here is specific to this firm, so anything built would be a generic product. Firms with a product motive are building it now and will maintain it forever.",
      "The exception is if being first with it is worth more than being right about it, which is a strategy question rather than a sourcing one.",
    );
  } else if (maintainable === "no") {
    verdict = "buy";
    headline =
      "It would be a moat, and a moat nobody can maintain is a liability with a moat's price.";
    because.push(
      "The judgment in this workflow is particular to the firm, so building it would produce something no competitor could buy.",
      "But the firm has said it could not keep it running once whoever wrote it moves on. An unmaintained tool inside a licensed workflow is worse than no tool: it keeps producing output after it has stopped being right.",
    );
  } else if (maintainable === "unknown") {
    verdict = "not-yet";
    unknowns.push(
      "Whether the firm could keep this running after whoever built it moves on. It does not change whether building is worth it. It changes whether building is possible.",
    );
    headline =
      "It looks like a moat. Nobody has said whether the firm could hold it.";
    because.push(
      "The commodity-or-moat question resolves toward building, which makes maintenance the deciding question rather than a detail to sort out later.",
    );
  } else if (moat && !commodity) {
    verdict = "build";
    headline =
      "A market of one. No vendor is coming, which is exactly why it is worth owning.";
    because.push(
      "The problem is not one other firms share in this shape, so the addressable market for a product is too small for anyone to serve it. The firm is not choosing to build over buying. There is nothing to buy.",
      "That is the argument for building, and it is not a cost argument. What gets built cannot be bought by a competitor next quarter.",
    );
  } else {
    verdict = "buy-base-build-edge";
    headline =
      "The common half has a vendor. The half that depends on your judgment does not.";
    because.push(
      "Other firms have the same problem, so the mechanical part of it is served and buying that part is straightforward.",
      "The judgment the output turns on is particular to this firm, so the layer that applies it is the part with a market of one. Built on top of something bought, it is small enough to maintain and it is the part worth owning.",
    );
  }

  if (verdict !== "not-yet" && inputs.clientVisible === "yes") {
    because.push(
      "A client would notice this as something the firm does differently, which raises what the judgment layer is worth and lowers the appeal of an answer every competitor can license.",
    );
  }

  if (verdict !== "not-yet" && inputs.clientVisible === "no" && moat) {
    because.push(
      "No client sees this directly, so the value of owning it is internal: it is leverage on the firm's own cost of doing the work rather than something to differentiate on.",
    );
  }

  return { inputs, verdict, headline, because, unknowns };
}

/**
 * The workflow the rest of this site models, answered as a principal would.
 *
 * Specification QA is the case that makes the naive framing look silly.
 * Every structural practice reviews submittals, so the mechanical part is
 * thoroughly served. What decides whether a review is any good is the firm's
 * own specification standards and its own tolerance for risk, which is a
 * market of one. Neither "buy it" nor "build it" is the answer.
 */
export const SPEC_QA_SOURCING: SourcingInputs = {
  commonProblem: "yes",
  toolExists: "yes",
  firmSpecificJudgment: "yes",
  canMaintain: "yes",
  clientVisible: "no",
};

export const QUESTIONS: { key: keyof SourcingInputs; ask: string }[] = [
  { key: "commonProblem", ask: "Do other firms have this in the same shape?" },
  { key: "toolExists", ask: "Does something already do most of it?" },
  {
    key: "firmSpecificJudgment",
    ask: "Does getting it right depend on your own judgment?",
  },
  { key: "canMaintain", ask: "Could you keep it running without its author?" },
  { key: "clientVisible", ask: "Would a client notice you do this differently?" },
];
