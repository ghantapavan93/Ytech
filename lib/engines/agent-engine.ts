/**
 * The working agent.
 *
 * This is not a clone and it does not speak as anyone. It runs the
 * repeated preparation work that sits in front of a consultant's day, and
 * it stops at every point where judgment is required rather than guessing
 * past it.
 *
 * Three rules hold the design together:
 *
 *   1. Every step names the instrument or source it used.
 *   2. Anything that requires a decision is handed back, not decided.
 *   3. It runs with no model attached. A model can draft prose later, but
 *      the plan, the evidence, and the refusals are all deterministic.
 *
 * Intent matching is keyword scoring rather than a language model, which
 * means the routing is inspectable and testable.
 */

import {
  buildPrepSheet,
  DEFAULT_FIRM,
  stageOf,
  type FirmInput,
} from "./prep-engine";
import { portfolioStats, SEED_RECORDS, canEmitPattern } from "./record-engine";

export type PlayId =
  | "firm-call"
  | "talk-outline"
  | "triage-request"
  | "portfolio-review"
  | "session-followup";

export interface Play {
  id: PlayId;
  name: string;
  /** What the consultant would otherwise do by hand. */
  replaces: string;
  triggers: string[];
  example: string;
}

export const PLAYS: Play[] = [
  {
    id: "firm-call",
    name: "Prepare for a firm conversation",
    replaces: "Rebuilding the diagnostic questions from scratch for each firm",
    triggers: [
      "call", "meeting", "firm", "client", "prepare", "prep", "talk to",
      "conversation", "discovery", "intro", "civil", "structural", "architecture",
      "mep", "staff", "people",
    ],
    example: "Prep me for a call with a 60 person civil firm that bills hourly",
  },
  {
    id: "talk-outline",
    name: "Draft a talk structure",
    replaces: "Rebuilding the same argument arc before every keynote or workshop",
    triggers: [
      "keynote", "talk", "speak", "speech", "presentation", "session",
      "workshop", "symposium", "panel", "audience", "outline", "deck", "stage",
    ],
    example: "Outline my opening for a room of CEOs on December 4",
  },
  {
    id: "triage-request",
    name: "Triage an inbound agent request",
    replaces: "Talking a firm out of the wrong build, one call at a time",
    triggers: [
      "wants", "asking for", "build", "agent", "automate", "tool", "should we",
      "requested", "proposal", "idea", "pilot",
    ],
    example: "A firm wants to build an agent for proposal drafting",
  },
  {
    id: "portfolio-review",
    name: "Review the decision portfolio",
    replaces: "Reconstructing what happened after past workshops",
    triggers: [
      "portfolio", "review", "decisions", "records", "evidence", "status",
      "what happened", "follow up", "stalled", "pilots", "retire",
    ],
    example: "What in the portfolio needs evidence or should be stopped",
  },
  {
    id: "session-followup",
    name: "Turn a session into a decision record",
    replaces: "Converting workshop notes into something a board can act on",
    triggers: [
      "notes", "after", "followup", "follow-up", "summary", "recap",
      "workshop notes", "capture", "write up", "board",
    ],
    example: "Turn yesterday's workshop into a decision record",
  },
];

export type StepKind = "read" | "run" | "assemble" | "refuse" | "handoff";

export interface AgentStep {
  kind: StepKind;
  title: string;
  detail: string;
  /** Which instrument or source did the work. */
  via: string;
}

export interface AgentRun {
  play: Play;
  /** Confidence that this play matched, 0 to 1. */
  match: number;
  /** Other plays that scored, so the routing stays inspectable. */
  alternatives: { play: Play; score: number }[];
  steps: AgentStep[];
  /** The thing she can actually use. */
  artifact: { title: string; lines: string[] };
  /** What the agent will not decide. */
  handBack: string[];
  /** Facts the agent had to assume because the task did not say. */
  assumed: string[];
}

/** Pull a staff count out of free text, if one is there. */
export function parseSize(task: string): FirmInput["size"] | null {
  const m = task.match(/(\d{1,4})\s*(?:\+|-)?\s*(?:person|people|staff|employee)/i);
  if (!m) return null;
  const n = Number(m[1]);
  if (n < 25) return "under-25";
  if (n <= 75) return "25-75";
  if (n <= 250) return "75-250";
  return "over-250";
}

export function parsePricing(task: string): FirmInput["pricing"] | null {
  const t = task.toLowerCase();
  if (/fixed fee|lump sum|fixed-fee/.test(t)) return "fixed";
  if (/hourly|time and materials|t&m|billable hour/.test(t)) return "hourly";
  if (/blended|mixed|both/.test(t)) return "mixed";
  return null;
}

export function parseDiscipline(task: string): FirmInput["discipline"] | null {
  const t = task.toLowerCase();
  if (/structural/.test(t)) return "structural";
  if (/civil/.test(t)) return "civil";
  if (/architect/.test(t)) return "architecture";
  if (/\bmep\b|mechanical|electrical|plumbing/.test(t)) return "mep";
  if (/multi|multidiscipl|multi-discipl/.test(t)) return "multi";
  return null;
}

/** Keyword scoring. Inspectable on purpose. */
export function routeTask(task: string): { play: Play; score: number }[] {
  const t = task.toLowerCase();
  const scored = PLAYS.map((play) => {
    let score = 0;
    for (const trigger of play.triggers) {
      if (t.includes(trigger)) score += trigger.length > 6 ? 2 : 1;
    }
    return { play, score };
  });
  return scored.sort((a, b) => b.score - a.score);
}

function firmFromTask(task: string): { firm: FirmInput; assumed: string[] } {
  const assumed: string[] = [];
  const size = parseSize(task);
  const pricing = parsePricing(task);
  const discipline = parseDiscipline(task);

  if (!size) assumed.push("Staff count was not given, so the mid band was used.");
  if (!pricing)
    assumed.push("How they bill was not given, and hourly was assumed because it is still the common case.");
  if (!discipline) assumed.push("Discipline was not given.");
  assumed.push(
    "Maturity ratings are placeholders. Set them yourself on the prep board before the call.",
  );

  return {
    firm: {
      ...DEFAULT_FIRM,
      size: size ?? DEFAULT_FIRM.size,
      pricing: pricing ?? DEFAULT_FIRM.pricing,
      discipline: discipline ?? DEFAULT_FIRM.discipline,
    },
    assumed,
  };
}

function runFirmCall(task: string): Omit<AgentRun, "play" | "match" | "alternatives"> {
  const { firm, assumed } = firmFromTask(task);
  const sheet = buildPrepSheet(firm);
  const { stage, score } = stageOf(firm.maturity);

  const steps: AgentStep[] = [
    {
      kind: "read",
      title: "Read the task",
      detail: `Picked up size, discipline, and fee model where the task stated them. Anything missing is listed as an assumption rather than guessed quietly.`,
      via: "task parser",
    },
    {
      kind: "run",
      title: "Placed the firm on the four dimensions",
      detail: `Provisional score ${score.toFixed(0)}, which sits in ${stage}. This is a placeholder until you rate them yourself.`,
      via: "Index weights, operating model 35 and business model 30",
    },
    {
      kind: "assemble",
      title: "Built the prep sheet",
      detail: `Six sections assembled from published method, each line carrying its source.`,
      via: "prep engine",
    },
    {
      kind: "refuse",
      title: "Did not diagnose the firm",
      detail:
        "Nothing here is a finding about this firm. It is a set of questions to ask and contradictions to look for.",
      via: "standing rule",
    },
  ];

  const lines = [
    `Open with: ${sheet.openWith[0]?.text ?? ""}`,
    `Contradiction to watch: ${sheet.contradiction[0]?.text ?? ""}`,
    `Advise against: ${sheet.doNotBuild[0]?.text ?? ""}`,
    `Guardrail to name: ${sheet.guardrails[0]?.text ?? ""}`,
    `Experiment to propose: ${sheet.firstExperiment[0]?.text ?? ""}`,
    `In the room, watch: ${sheet.watchFor[0]?.text ?? ""}`,
  ].filter((l) => l.length > 20);

  return {
    steps,
    artifact: { title: `Prep sheet, ${stage} stage`, lines },
    handBack: [
      "Rate the four dimensions yourself. The agent's placement is a guess and yours is not.",
      "Decide which contradiction is safe to raise in a first conversation.",
      "Choose whether this firm hears the pricing argument now or later.",
    ],
    assumed,
  };
}

function runTalkOutline(task: string): Omit<AgentRun, "play" | "match" | "alternatives"> {
  const ceoRoom = /ceo|executive|board|principal|president/i.test(task);
  const short = /\b(10|15|20)\s*min|opening|short/i.test(task);

  const steps: AgentStep[] = [
    {
      kind: "read",
      title: "Read the audience",
      detail: ceoRoom
        ? "Room reads as owners and executives, so the arc opens on money and ends on a decision."
        : "Room reads as practitioners, so the arc opens on the work and ends on a method.",
      via: "task parser",
    },
    {
      kind: "assemble",
      title: "Pulled the argument arc from published material",
      detail:
        "Only claims that already exist in writing were used, so nothing on stage is new to defend.",
      via: "thesis corpus, 19 sourced claims",
    },
    {
      kind: "refuse",
      title: "Wrote no prose",
      detail:
        "The words on stage are yours. This is a spine and a running order, nothing more.",
      via: "standing rule",
    },
  ];

  const lines = ceoRoom
    ? [
        "Open on the gap, not the technology. Adoption is high and measurable impact is not.",
        "One concrete story where a technically successful workflow lost money.",
        "Name the four places value leaks: fee model, capacity routing, review gate, apprenticeship.",
        "Show the same workflow surviving once those four are re-tuned.",
        "Close on the decision each of them can take this week, not on a prediction.",
      ]
    : [
        "Open on a workflow everyone in the room does by hand.",
        "Show where the hours actually go, then where AI removes them.",
        "Name who reviews the output and what they are accountable for.",
        "Give the smallest experiment that would settle it.",
        "Close on the stop condition, so the room learns that stopping is a result.",
      ];

  if (short) lines.splice(3, 0, "Time check. At this length, cut the second example, not the stop condition.");

  return {
    steps,
    artifact: { title: ceoRoom ? "Executive room, running order" : "Practitioner room, running order", lines },
    handBack: [
      "Pick the story. The agent does not know which client example is safe to tell.",
      "Decide the one sentence you want repeated afterwards.",
    ],
    assumed: [
      ceoRoom
        ? "Audience read as executives from the wording of the task."
        : "Audience read as practitioners because no executive signal appeared in the task.",
    ],
  };
}

function runTriage(task: string): Omit<AgentRun, "play" | "match" | "alternatives"> {
  const { firm, assumed } = firmFromTask(task);
  const common =
    /proposal|rfp|meeting notes|summar|search|transcri|scheduling|invoice|timesheet/i.test(
      task,
    );

  const steps: AgentStep[] = [
    {
      kind: "read",
      title: "Read the request",
      detail: "Identified the workflow the firm wants to automate.",
      via: "task parser",
    },
    {
      kind: "run",
      title: "Applied the buy or build rule",
      detail: common
        ? "This is a common industry problem. A vendor will do it better, so the honest advice is to buy."
        : "This does not look like a commodity problem, so it may be worth building. Confirm nobody sells it before agreeing.",
      via: "published rule, buy the common and build the unique",
    },
    {
      kind: "run",
      title: "Checked the economics gate",
      detail:
        firm.pricing === "hourly"
          ? "They bill hourly, so any hours the agent saves come off the invoice unless the fee model or the capacity routing changes first."
          : "Fee model is not the blocker here, so the gate moves to review capacity and ownership.",
      via: "wind tunnel, pricing lever",
    },
    {
      kind: "refuse",
      title: "Did not approve the build",
      detail:
        "No agent gets a yes from this tool. The output is the set of conditions that would have to be true first.",
      via: "standing rule",
    },
  ];

  return {
    steps,
    artifact: {
      title: "Conditions before this build gets a yes",
      lines: [
        "Name the accountable owner. Not a committee.",
        "State the one measurable that would prove it worked, and the baseline it beats.",
        "Say who reviews the output and what they are professionally on the hook for.",
        common
          ? "Check the market first. If a vendor already does this, building it is a hobby."
          : "Confirm no vendor covers it, which is what would make it worth owning.",
        firm.pricing === "hourly"
          ? "Decide where the freed hours go before the first package runs."
          : "Confirm review capacity exists at the volume they are imagining.",
        "Write the stop condition. An experiment nobody can lose is a purchase.",
      ],
    },
    handBack: [
      "Whether to say no outright or route them to a smaller first step.",
      "Whether this firm is ready to hear that the answer is buy, not build.",
    ],
    assumed,
  };
}

function runPortfolioReview(): Omit<AgentRun, "play" | "match" | "alternatives"> {
  const stats = portfolioStats(SEED_RECORDS);
  const stuck = SEED_RECORDS.filter((r) => r.state === "claimed");
  const eligible = SEED_RECORDS.filter(canEmitPattern);

  const steps: AgentStep[] = [
    {
      kind: "read",
      title: "Read the portfolio",
      detail: `${stats.total} records, ${stats.active} active, ${stats.retired} retired on purpose.`,
      via: "decision records",
    },
    {
      kind: "run",
      title: "Sorted by evidence, not by enthusiasm",
      detail: `${stats.byState.claimed} have never been measured. ${stats.patternEligible} are proven enough to contribute a pattern.`,
      via: "evidence ladder",
    },
    {
      kind: "refuse",
      title: "Did not retire anything",
      detail:
        "Stopping work is a leadership act with consequences for the people on it. The agent lists candidates and stops there.",
      via: "standing rule",
    },
  ];

  return {
    steps,
    artifact: {
      title: "What needs attention",
      lines: [
        ...stuck.slice(0, 4).map((r) => `Unmeasured: ${r.workflow}. Needs ${r.evidenceRequired.toLowerCase()}.`),
        ...eligible.slice(0, 2).map((r) => `Proven: ${r.workflow}. Ready to contribute a pattern.`),
      ],
    },
    handBack: [
      "Which unmeasured decisions get evidence and which get stopped.",
      "Who to tell first when something is being stopped.",
    ],
    assumed: ["The portfolio shown is the synthetic seed, not a real engagement history."],
  };
}

function runSessionFollowup(): Omit<AgentRun, "play" | "match" | "alternatives"> {
  const steps: AgentStep[] = [
    {
      kind: "assemble",
      title: "Laid out the record skeleton",
      detail:
        "The fields a decision needs before it can be checked later: belief, contradiction, decision, owner, evidence, stop condition.",
      via: "decision record schema",
    },
    {
      kind: "refuse",
      title: "Left every field empty",
      detail:
        "The agent was not in the room. Filling these in from a transcript would be invention wearing a summary's clothes.",
      via: "standing rule",
    },
    {
      kind: "handoff",
      title: "Ready for your notes",
      detail: "Paste or type the six answers and it becomes a record that can be checked in ninety days.",
      via: "handoff",
    },
  ];

  return {
    steps,
    artifact: {
      title: "Decision record, ready to fill",
      lines: [
        "What did they believe before the session?",
        "What contradiction surfaced?",
        "What did they decide: run it, redesign first, or not deploy?",
        "Who owns it by name and role?",
        "What single measurement would settle it, against what baseline?",
        "What stop condition ends it early?",
      ],
    },
    handBack: [
      "Every answer above. The agent supplies the structure and none of the content.",
    ],
    assumed: [],
  };
}

export function runAgent(task: string): AgentRun | null {
  const trimmed = task.trim();
  if (trimmed.length < 4) return null;

  const ranked = routeTask(trimmed);
  const top = ranked[0];
  if (!top || top.score === 0) return null;

  const totalScore = ranked.reduce((s, r) => s + r.score, 0);
  const match = totalScore === 0 ? 0 : top.score / totalScore;

  const body =
    top.play.id === "firm-call"
      ? runFirmCall(trimmed)
      : top.play.id === "talk-outline"
        ? runTalkOutline(trimmed)
        : top.play.id === "triage-request"
          ? runTriage(trimmed)
          : top.play.id === "portfolio-review"
            ? runPortfolioReview()
            : runSessionFollowup();

  return {
    play: top.play,
    match,
    alternatives: ranked.slice(1).filter((r) => r.score > 0),
    ...body,
  };
}
