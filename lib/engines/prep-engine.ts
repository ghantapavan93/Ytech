/**
 * The Prep Board engine.
 *
 * A deterministic scaffold that prepares a client conversation using
 * YegaTech's own published method. No model writes the substance. Each
 * line below traces to something Sam or Mehdi has published, and the
 * source travels with the line so she can check it.
 *
 * The rule this file obeys: it can suggest what to ask and what to watch
 * for. It never decides. It never claims to know a firm it has not been
 * told about.
 */

export type SizeBand = "under-25" | "25-75" | "75-250" | "over-250";
export type Discipline = "architecture" | "civil" | "structural" | "mep" | "multi";
export type Pricing = "hourly" | "mixed" | "fixed";

/** Their Index dimensions, 1-5, as Sam would rate them from a first call. */
export interface Maturity {
  culture: number;
  adoption: number;
  operating: number;
  business: number;
}

export type Trigger =
  | "wants-agent"
  | "board-roi"
  | "client-pressure"
  | "shadow-usage"
  | "pilot-stalled"
  | "talent-worry";

export interface FirmInput {
  name: string;
  size: SizeBand;
  discipline: Discipline;
  pricing: Pricing;
  maturity: Maturity;
  triggers: Trigger[];
}

export interface PrepLine {
  id: string;
  text: string;
  /** Where this comes from in their published work. */
  source: string;
  href?: string;
}

export interface PrepSheet {
  stage: string;
  stageNote: string;
  openWith: PrepLine[];
  contradiction: PrepLine[];
  doNotBuild: PrepLine[];
  guardrails: PrepLine[];
  firstExperiment: PrepLine[];
  watchFor: PrepLine[];
}

const SIZE_LABEL: Record<SizeBand, string> = {
  "under-25": "under 25 staff",
  "25-75": "25 to 75 staff",
  "75-250": "75 to 250 staff",
  "over-250": "over 250 staff",
};

const SRC = {
  insideOut: {
    source: "Inside-out strategy, STRUCTURE Magazine, June 2025",
    href: "https://www.structuremag.org/article/why-structural-firms-should-adopt-an-inside-out-ai-strategy/",
  },
  roni: {
    source: "RONI, not ROI, YegaTech blog, June 2026",
    href: "https://yegatech.com/if-your-board-is-pushing-on-roi-ask-them-this-one-question/",
  },
  governance: {
    source: "Three-level governance, YegaTech blog, May 2024",
    href: "https://yegatech.com/governance-system-for-ai-adoption-at-the-team-organizational-and-industry-levels/",
  },
  clients: {
    source: "Are your repeat clients outpacing you, April 2025",
    href: "https://yegatech.com/are-your-repeat-clients-outpacing-you-in-their-ai-journey/",
  },
  steam: {
    source: "Still using AI like a steam engine, June 2025",
    href: "https://yegatech.com/still-using-ai-like-a-steam-engine/",
  },
  culture: {
    source: "Culture of innovation, IMEG podcast, October 2024",
    href: "https://imegcorp.com/insights/blog/aec-firms-need-a-culture-of-innovation-to-leverage-ai-podcast-included/",
  },
  buyBuild: {
    source: "Mehdi on buy common, build unique, ProjectReady, August 2024",
    href: "https://project-ready.com/ai-driven-transformation-in-aec-navigating-data-strategy-and-the-future/",
  },
  sprawl: {
    source: "Mehdi on agent sprawl, LinkedIn, July 2026",
    href: "https://www.linkedin.com/in/mehdinour/",
  },
  verify: {
    source: "Verification is the human's job, CEA 259, November 2024",
    href: "https://civilengineeringacademy.com/revolutionizing-the-aec-industry-with-ai-insights-from-dr-sam-zolfagharian-cea-259/",
  },
  critical: {
    source: "Is AI killing critical thinking, February 2025",
    href: "https://yegatech.com/is-ai-killing-critical-thinking-researchers-have-some-answers/",
  },
  index: {
    source: "AI Transformation Index dimensions and weights",
    href: "https://yegatech.com/ai-readiness/",
  },
  pricing: {
    source: "Sam on value-based billing replacing hourly, CEA 259",
    href: "https://civilengineeringacademy.com/revolutionizing-the-aec-industry-with-ai-insights-from-dr-sam-zolfagharian-cea-259/",
  },
  leadership: {
    source: "Trips can be managed, journeys must be led, July 2025",
    href: "https://yegatech.com/the-hidden-reason-ai-initiatives-struggle/",
  },
} as const;

/** Their published stage bands, applied to a rating she sets by hand. */
export function stageOf(m: Maturity): { stage: string; note: string; score: number } {
  const score = ((m.culture * 0.2 + m.adoption * 0.15 + m.operating * 0.35 + m.business * 0.3) / 5) * 100;
  if (score >= 75)
    return {
      stage: "Leading",
      note: "Ahead of most of the market. The useful conversation here is about defending the position, not starting.",
      score,
    };
  if (score >= 50)
    return {
      stage: "Transforming",
      note: "Real redesign underway. Their risk now is sprawl, not inertia.",
      score,
    };
  if (score >= 25)
    return {
      stage: "Adopting",
      note: "Tools are in the building. Nothing about the work has changed yet. This is the crowded middle.",
      score,
    };
  return {
    stage: "Exploring",
    note: "Early. Push too hard on operating model here and you will lose the room.",
    score,
  };
}

export function buildPrepSheet(f: FirmInput): PrepSheet {
  const { stage, note } = stageOf(f.maturity);
  const has = (t: Trigger) => f.triggers.includes(t);
  const small = f.size === "under-25" || f.size === "25-75";
  const firm = f.name.trim() || "this firm";

  const openWith: PrepLine[] = [];
  const contradiction: PrepLine[] = [];
  const doNotBuild: PrepLine[] = [];
  const guardrails: PrepLine[] = [];
  const firstExperiment: PrepLine[] = [];
  const watchFor: PrepLine[] = [];

  // Opening. Always inside-out, adjusted for what brought them to the call.
  openWith.push({
    id: "open-inside-out",
    text: `Ask what breaks first inside ${firm} on a normal Tuesday. Stay there until you have a real answer. The tool conversation can wait.`,
    ...SRC.insideOut,
  });

  if (has("wants-agent")) {
    openWith.push({
      id: "open-agent",
      text: `They arrived asking for an agent. Before saying yes, ask which workflow, whose hours it frees, and who reviews what it produces.`,
      ...SRC.insideOut,
    });
  }

  if (has("board-roi")) {
    openWith.push({
      id: "open-roni",
      text: `The board wants a payback number. Turn the question around: what does it cost ${firm} to not invest? They are building a capability, not buying software.`,
      ...SRC.roni,
    });
  }

  if (has("client-pressure")) {
    openWith.push({
      id: "open-clients",
      text: `Their clients are moving. Ask whether any client has already done in a day what ${firm} quotes in weeks. If yes, that story is the whole meeting.`,
      ...SRC.clients,
    });
  }

  if (has("pilot-stalled")) {
    openWith.push({
      id: "open-stalled",
      text: `A stalled pilot is usually a management problem wearing a technology costume. Ask who owned it and what they were measured on.`,
      ...SRC.leadership,
    });
  }

  // The contradiction to surface, driven by pricing and maturity.
  if (f.pricing === "hourly") {
    contradiction.push({
      id: "con-hourly",
      text: `They bill by the hour and want work to take fewer hours. Nobody in the room has said that out loud yet. Say it early and gently.`,
      ...SRC.pricing,
    });
    contradiction.push({
      id: "con-hourly-2",
      text: `Ask what happens to the invoice when a task that took twenty hours takes twelve. If the answer is a discount, the fee model is the project.`,
      ...SRC.pricing,
    });
  } else if (f.pricing === "mixed") {
    contradiction.push({
      id: "con-mixed",
      text: `Part of their book is fixed fee. Find out which part, and whether the AI work is landing on the side that keeps the savings.`,
      ...SRC.pricing,
    });
  } else {
    contradiction.push({
      id: "con-fixed",
      text: `Fixed fee means they keep the savings, so the fee model is not the obstacle here. Move the conversation to review capacity and who has time to check the work.`,
      ...SRC.verify,
    });
  }

  if (f.maturity.operating <= 2 && f.maturity.adoption >= 3) {
    contradiction.push({
      id: "con-gap",
      text: `Adoption is running ahead of the operating model. Tools are in use, the work has not been redesigned. This is the gap where value quietly leaks.`,
      ...SRC.steam,
    });
  }

  if (f.maturity.culture <= 2) {
    contradiction.push({
      id: "con-culture",
      text: `Culture is the weak leg. Without buy-in, it does not matter which tool they bring on board. Fix the why before the what.`,
      ...SRC.culture,
    });
  }

  // What to tell them not to build.
  doNotBuild.push({
    id: "dnb-common",
    text: `If the problem is common across the industry, tell them to buy. A vendor will do it better. Build only what is uniquely theirs, because nobody else will ever build that.`,
    ...SRC.buyBuild,
  });

  if (small) {
    doNotBuild.push({
      id: "dnb-small",
      text: `At ${SIZE_LABEL[f.size]}, an internal platform is a trap. One workflow, one owner, one measurable outcome. Nothing that needs a maintenance team.`,
      ...SRC.buyBuild,
    });
  }

  if (has("wants-agent") && f.maturity.operating <= 2) {
    doNotBuild.push({
      id: "dnb-premature",
      text: `An agent built on an unredesigned workflow inherits the workflow's problems and adds review load. Worth saying plainly before anyone writes code.`,
      ...SRC.steam,
    });
  }

  if (f.maturity.adoption >= 4) {
    doNotBuild.push({
      id: "dnb-sprawl",
      text: `They already run several tools. Ask how many, who owns each, and what happens when one goes wrong. Sprawl is the next mess.`,
      ...SRC.sprawl,
    });
  }

  // Guardrails, from the three-level governance model.
  guardrails.push({
    id: "gr-team",
    text: `Team level: written dos and don'ts, plus the rule that nothing gets stamped until a licensed engineer has verified it.`,
    ...SRC.governance,
  });
  guardrails.push({
    id: "gr-org",
    text: `Firm level: a way to evaluate tools, a place to report incidents, and one named person accountable for the whole thing.`,
    ...SRC.governance,
  });

  if (has("shadow-usage")) {
    guardrails.push({
      id: "gr-shadow",
      text: `Staff are already using AI without a policy. That is normal and it is not a discipline problem. Write the light version of the policy this month, not the perfect one next quarter.`,
      ...SRC.governance,
    });
  }

  if (has("talent-worry")) {
    guardrails.push({
      id: "gr-juniors",
      text: `If juniors stop doing the work that teaches judgment, the firm loses the people who could have checked the machine later. Keep a slice of manual practice on purpose.`,
      ...SRC.critical,
    });
  }

  // One experiment, sized to where they actually are.
  if (stage === "Exploring") {
    firstExperiment.push({
      id: "exp-explore",
      text: `Thirty days, one team, one repeated task. The goal is a shared vocabulary and one small win, not a transformation.`,
      ...SRC.culture,
    });
  } else if (stage === "Adopting") {
    firstExperiment.push({
      id: "exp-adopt",
      text: `Thirty days, one workflow, with the fee model and the review step decided before the first package runs. Name the owner in the room.`,
      ...SRC.insideOut,
    });
  } else {
    firstExperiment.push({
      id: "exp-transform",
      text: `They are past pilots. Propose a review of what is already running: what to scale, what to redesign, what to retire.`,
      ...SRC.sprawl,
    });
  }

  firstExperiment.push({
    id: "exp-stop",
    text: `Whatever they run, write the stop condition first. An experiment nobody can lose is a purchase in disguise.`,
    ...SRC.leadership,
  });

  // What to watch during the meeting.
  watchFor.push({
    id: "watch-activity",
    text: `If they present prompts, tokens, or seat counts as progress, ask what changed in the business. Activity is not outcome.`,
    ...SRC.sprawl,
  });

  if (f.maturity.business <= 2) {
    watchFor.push({
      id: "watch-biz",
      text: `Business model is their weakest dimension and it carries thirty percent of the Index. Worth naming, carefully, once trust is there.`,
      ...SRC.index,
    });
  }

  if (f.maturity.operating <= 2) {
    watchFor.push({
      id: "watch-op",
      text: `Operating model is weak and it carries thirty-five percent, more than any other dimension. The conversation eventually has to go here.`,
      ...SRC.index,
    });
  }

  watchFor.push({
    id: "watch-room",
    text: `Notice who in the room has budget and who has the workflow. If they are different people, the follow-up needs both.`,
    ...SRC.leadership,
  });

  return {
    stage,
    stageNote: note,
    openWith,
    contradiction,
    doNotBuild,
    guardrails,
    firstExperiment,
    watchFor,
  };
}

export const DEFAULT_FIRM: FirmInput = {
  name: "",
  size: "25-75",
  discipline: "civil",
  pricing: "hourly",
  maturity: { culture: 3, adoption: 3, operating: 2, business: 2 },
  triggers: ["wants-agent", "board-roi"],
};

export const TRIGGER_LABELS: { value: Trigger; label: string }[] = [
  { value: "wants-agent", label: "They came in asking for an agent" },
  { value: "board-roi", label: "The board wants an ROI number" },
  { value: "client-pressure", label: "Clients are moving faster than they are" },
  { value: "shadow-usage", label: "Staff already use AI with no policy" },
  { value: "pilot-stalled", label: "A pilot stalled or quietly died" },
  { value: "talent-worry", label: "Worried about junior development" },
];
