import type { PositionDelta, Position } from "@/lib/engines/continuum-engine";

/**
 * One documented shift in one person's published emphasis.
 *
 * Every quote here is dated and public. Nothing is inferred about what
 * anybody privately thinks, and nothing describes a product anybody owns.
 * The claim this page makes is narrow and checkable: between 2024 and 2026
 * the published answer to "where does a firm start" moved from preparing an
 * organisation to adopt AI toward redesigning the work itself.
 *
 * It is deliberately not framed as a contradiction. The 2024 material is
 * still true about the firms it was addressed to, which is exactly why the
 * decision at the end of this is a person's to make and not a model's.
 */

const V1: Position = {
  id: "start-v1",
  topic: "Where a firm should start its AI transformation",
  claim:
    "Educate everyone first, then stand up an AI task force that mixes executives with the people in the weeds, then build a repeatable innovation process with one named accountable leader. Culture comes before tooling: without buy-in it does not matter which tool you bring on board.",
  version: 1,
  effectiveFrom: "2024-10-01",
  audience: "AEC firms that had not yet started",
  applicability:
    "Firms with no AI activity, no internal literacy, and no owner for it",
  approval: "approved",
  boundaries: [
    "Says nothing about which workflow to start on",
    "Says nothing about measuring business outcomes",
    "Addressed to firms at zero, not to firms already running pilots",
  ],
  evidence: [
    {
      id: "imeg-2024",
      quote:
        "it doesn't matter which tool we bring on board — without buy-in, culture comes first",
      source: "IMEG podcast, Oct 2024",
      date: "2024-10-01",
      verbatim: false,
    },
    {
      id: "playbook-2024",
      quote:
        "Educate all, then an AI task force of executives and people in the weeds, then a repeatable innovation process, then one named accountable leader",
      source: "Delivery playbook, recurring across 2024 podcast appearances",
      date: "2024-11-01",
      verbatim: false,
    },
    {
      id: "cea-259",
      quote:
        "value-based business models will replace hourly billing within about five years",
      source: "Civil Engineering Academy 259, Nov 2024",
      date: "2024-11-15",
      verbatim: false,
    },
  ],
};

const V2: Position = {
  id: "start-v2",
  topic: "Where a firm should start its AI transformation",
  claim:
    "Do not begin with tools or broad training. Begin by naming one workflow, the business outcome it is supposed to move, its owner, and the operating conditions its value has to survive: the fee model, where freed capacity goes, who reviews the output, and how juniors still learn. Then train the people involved in that workflow.",
  version: 2,
  effectiveFrom: "2026-08-29",
  audience: "AEC firms already experimenting with AI",
  applicability:
    "Firms with pilots running, tools in hand, and no measured business result",
  approval: "unapproved",
  boundaries: [
    "Does not say education was wrong, only that it is no longer the first move for this audience",
    "Does not apply to a firm with no AI activity at all",
    "Says nothing about which vendor or model to use",
  ],
  evidence: [
    {
      id: "structure-2025",
      quote: "the challenge for firms isn't access to AI. It's focus.",
      source: "STRUCTURE Magazine, co-authored, 30 Jun 2025",
      date: "2025-06-30",
      verbatim: true,
    },
    {
      id: "yega-blog-2026",
      quote:
        "Most organizations are still designed for human limitations, not for AI",
      source: "yegatech.com blog, Mar 2026",
      date: "2026-03-01",
      verbatim: true,
    },
    {
      id: "yega-li-2026",
      quote:
        "Getting value from AI isn't a technology problem—it's an operating model challenge.",
      source: "YegaTech, LinkedIn, 10 Mar 2026",
      date: "2026-03-10",
      verbatim: true,
    },
    {
      id: "doing-right-things",
      quote:
        "AI is a major shift from doing things right to doing the right things",
      source: "LinkedIn, 2 Apr 2026",
      date: "2026-04-02",
      verbatim: true,
    },
    {
      id: "egnyte-keynote",
      quote:
        "AI Won't Disrupt AEC, but Organizations That Redesign Work Will",
      source: "Egnyte AEC Summit keynote title, 13 May 2026",
      date: "2026-05-13",
      verbatim: true,
    },
    {
      id: "designed-2026",
      quote:
        "AI is starting to challenge the way organizations themselves were designed.",
      source: "LinkedIn, 19 May 2026",
      date: "2026-05-19",
      verbatim: true,
    },
    {
      id: "activity-2026",
      quote:
        "Executives: Are You Measuring AI Progress or Just AI Activity?",
      source: "Event title, 7 Jul 2026",
      date: "2026-07-07",
      verbatim: true,
    },
  ],
};

export const START_DELTA: PositionDelta = {
  topic: "Where a firm should start its AI transformation",
  previous: V1,
  proposed: V2,
  whatChanged:
    "The first move. In 2024 the published sequence began with literacy and organisation. Across 2025 and 2026 the emphasis moves to naming the work itself and the conditions its value has to survive.",
  whatDidNot:
    "Education, governance and a named owner are still present throughout, and the 2024 sequence is still the right answer for a firm at zero. Nothing here retracts anything.",
  likeliestExplanation:
    "The audience moved rather than the belief. In 2024 most AEC firms had not started; by 2026 most have tools and pilots and still no measured business result, so the binding constraint changed and the advice followed it.",
  confidence: 0.82,
  uncertainty: [
    "Whether the author regards this as a change of position or as the same position addressed to a different starting point",
    "Whether the 2024 sequence should still lead for firms that genuinely have no AI activity",
    "Whether any of this was ever meant as a universal ordering rather than a description of particular engagements",
  ],
  affects: [
    "What should an executive do first when beginning an AI journey?",
    "Should we train everyone before we pick a workflow?",
    "How do we know our AI programme is working?",
  ],
};

/**
 * The question the whole demonstration turns on. One question, two dated
 * answers, and a decision that belongs to a person.
 */
export const QUESTION =
  "What should an executive do first when beginning an AI journey?";

/** The arc, for the timeline. Dated, sourced, and not interpreted. */
export const TIMELINE = [...V1.evidence, ...V2.evidence].sort((a, b) =>
  a.date.localeCompare(b.date),
);
