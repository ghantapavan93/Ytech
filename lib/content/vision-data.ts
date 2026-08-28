/**
 * /vision, the first-principles argument for what an AEC AI consulting
 * firm becomes when it owns the instrument layer. Spoken quotes are
 * verified verbatim (≤15 words, dated, linked); the SPOKEN list grows as
 * podcast sources are verified.
 */

export interface Principle {
  n: string;
  title: string;
  body: string;
}

export const FIRST_PRINCIPLES: Principle[] = [
  {
    n: "01",
    title: "Consulting reduces to judgment × evidence × trust",
    body: "Strip away the decks and the day rates and that's the whole physics. AI is repricing all three inputs at once, and only one of them can compound.",
  },
  {
    n: "02",
    title: "Models commoditize; organizational fit doesn't",
    body: "Every firm can rent the same intelligence by the token. What no model holds is verified evidence of which fee structures, review gates, and incentive designs let that intelligence survive inside a real firm.",
  },
  {
    n: "03",
    title: "The firm that owns the instrument owns the learning rate",
    body: "Advice is consumed once. An instrument runs every engagement, deposits an evidence node every run, and makes the next engagement start further ahead. The learning rate, not the model, is the moat.",
  },
  {
    n: "04",
    title: "Refusal is a feature of the physics, not a courtesy",
    body: "Trust is the third input, and it compounds only while the instrument refuses to invent numbers, refuses to score what it can't see, and keeps 'do not deploy' as a first-class answer.",
  },
];

export interface StackStage {
  stage: string;
  name: string;
  question: string;
  detail: string;
  status: "SHIPPED" | "NEXT" | "HORIZON";
}

export const STACK: StackStage[] = [
  {
    stage: "S1",
    name: "Value Shift",
    question: "Should this workflow economically exist?",
    detail:
      "The wind tunnel: propagate a technically perfect agent through fee model, incentives, review capacity, and apprenticeship, before any build. Compiles a bounded 30-day experiment.",
    status: "SHIPPED",
  },
  {
    stage: "S2",
    name: "Shadow Run",
    question: "Does it survive time-frozen history?",
    detail:
      "Run the candidate workflow against closed historical projects, archived RFIs, spec redlines, submittals, measuring accuracy and exception rates with zero live-client risk.",
    status: "NEXT",
  },
  {
    stage: "S3",
    name: "Greenlight",
    question: "May it run on this project, this contract, this data?",
    detail:
      "Project-level AI clearance: client contracts override firm policy (AIA's own precedence rule). One agent can be fine on a public pursuit and prohibited on a secure facility.",
    status: "HORIZON",
  },
  {
    stage: "S4",
    name: "Recommission",
    question: "Does yesterday's approval still hold today?",
    detail:
      "Change-triggered revalidation. The model version changes, addenda land, the supervising PE leaves. Authorization gets re-earned rather than assumed, because agent economics keep moving.",
    status: "HORIZON",
  },
];

export interface TenXRow {
  dimension: string;
  ten_pct: string;
  ten_x: string;
}

/** Their own 10% vs 10X language, applied to the consulting firm itself. */
export const TEN_X: TenXRow[] = [
  {
    dimension: "What it sells",
    ten_pct: "Hours of advice, consumed once",
    ten_x: "Verified decisions, deposited as evidence that compounds",
  },
  {
    dimension: "How an engagement starts",
    ten_pct: "A blank page and a discovery workshop",
    ten_x: "A pattern library that already knows firms like this one",
  },
  {
    dimension: "The demo",
    ten_pct: "A tool walkthrough that ends in 'deploy'",
    ten_x: "A wind tunnel that sometimes ends in 'do not deploy, yet'",
  },
  {
    dimension: "The keynote",
    ten_pct: "Anecdote and analogy",
    ten_x: "A live instrument the room can argue with",
  },
  {
    dimension: "What compounds",
    ten_pct: "The slide archive",
    ten_x: "The learning rate: every run makes the next engagement sharper",
  },
];

export interface SpokenQuote {
  quote: string;
  source: string;
  date: string;
  href: string;
  /** What the instrument does with it. */
  echo: string;
}

/** Verified spoken/posted lines, seeded now, extended as sources verify. */
export const SPOKEN: SpokenQuote[] = [
  {
    quote: "Getting value from AI isn't a technology problem—it's an operating model challenge.",
    source: "YegaTech, LinkedIn (Summit panel)",
    date: "Mar 2026",
    href: "https://www.linkedin.com/posts/yegatech_enterpriseoperatingmodel-aitransformation-activity-7437165492055986176-ERmq",
    echo: "The entire instrument is this sentence, executable.",
  },
  {
    quote: "AI alone doesn't create competitive advantage. Adaptive leaders and organizations do.",
    source: "Dr. Sam Zolfagharian, samzolfagharian.com",
    date: "2026",
    href: "https://samzolfagharian.com/",
    echo: "The agent never changes in the wind tunnel. Only the organization does, and that flips the verdict.",
  },
  {
    quote: "The future isn't a fork in the road. It's a design space.",
    source: "Future by Design (book page)",
    date: "2026",
    href: "https://samzolfagharian.com/books/future-by-design/",
    echo: "Four levers, live recalculation, priced tradeoffs: a literal design space for the operating model.",
  },
  {
    quote: "So, how are you thinking about preventing agent sprawl?",
    source: "Dr. Mehdi Nourbakhsh (Cofounder & CEO), LinkedIn",
    date: "Jul 8, 2026",
    href: "https://www.linkedin.com/in/mehdinour/",
    echo: "Asked publicly six weeks ago, unanswered. It is the question S3 Greenlight and S4 Recommission exist to answer, clearance per project, and authorization re-earned when conditions change.",
  },
  {
    quote: "success isn't measured by prompts or tokens",
    source: "Dr. Mehdi Nourbakhsh, LinkedIn",
    date: "Jun 30, 2026",
    href: "https://www.linkedin.com/in/mehdinour/",
    echo: "The charter counts none of it. Its verifiable targets are margin delta, PE hours, a utilization floor, and a deep-practice floor, business progress only.",
  },
  {
    quote: "Shall I charge like less because now I'm using AI",
    source: "Her clients' question, as she reports it, ProjectReady podcast (transcript)",
    date: "Aug 2024",
    href: "https://project-ready.com/ai-driven-transformation-in-aec-navigating-data-strategy-and-the-future/",
    echo: "The pricing lever, asked out loud in her own engagements. On CEA 259 she predicted value-based models replacing hourly billing within five years, the wind tunnel answers with arithmetic instead of instinct.",
  },
  {
    quote: "Their responsibility is to verify and validate the result",
    source: "Civil Engineering Academy 259 (transcript)",
    date: "Nov 2024",
    href: "https://civilengineeringacademy.com/revolutionizing-the-aec-industry-with-ai-insights-from-dr-sam-zolfagharian-cea-259/",
    echo: "The review-architecture lever in one sentence. The tiered delta gate budgets exactly that verification, and accepting raw AI output auto-rejects, whatever the margin says.",
  },
  {
    quote: "it doesn't matter which tool we bring on board",
    source: "On culture as step one, IMEG podcast recap",
    date: "Oct 2024",
    href: "https://imegcorp.com/insights/blog/aec-firms-need-a-culture-of-innovation-to-leverage-ai-podcast-included/",
    echo: "Why the Index Lens holds Culture constant: the instrument measures economics and refuses to score what it cannot see. Step one stays hers.",
  },
];

export interface ServiceLine {
  name: string;
  body: string;
  tag: "EXISTS TODAY" | "NATURAL NEXT";
}

export const SERVICES: ServiceLine[] = [
  {
    name: "The keynote instrument",
    body: "Open every executive talk with the live wind tunnel instead of the whiteboard version of the same argument. Ninety seconds, and the room has felt the thesis.",
    tag: "EXISTS TODAY",
  },
  {
    name: "The cohort pre-build gate",
    body: "Every small-firm participant stress-tests their operating model before building agents one through three. The program's promise gets a defensible front door.",
    tag: "EXISTS TODAY",
  },
  {
    name: "The paid economics stress test",
    body: "A standalone engagement: one workflow, one firm's real fee structure and capacity, one signed 30-day experiment charter. Priced like diligence, because it is.",
    tag: "NATURAL NEXT",
  },
  {
    name: "The recommission subscription",
    body: "Standing revalidation: when the model version, the addenda, or the supervising PE changes, the evidence gets re-earned. Recurring by nature, not by contract trickery.",
    tag: "NATURAL NEXT",
  },
  {
    name: "Evidence-backed advisory",
    body: "Answers that open with 'in firms shaped like yours, here is what survived', because the pattern library holds what no general model has.",
    tag: "NATURAL NEXT",
  },
];

export const VISION_RESTRAINTS: string[] = [
  "The deploy-or-kill decision is never automated, charters are signed by humans.",
  "No real-world ROI claims from synthetic propagation, ever.",
  "Client evidence stays isolated by default; patterns cross firms only as anonymized bands and ratios, with consent.",
  "Culture is never scored from economics. The instrument refuses to measure what it cannot see.",
  "The instrument sharpens Sam's judgment. It does not impersonate it.",
];
