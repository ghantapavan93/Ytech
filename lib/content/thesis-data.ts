/**
 * /thesis, "the receipts."
 *
 * Every row maps one published YegaTech claim to the exact mechanism in the
 * instrument that operationalizes it. Quotes are verbatim, 15 words or
 * fewer, dated and linked, verified by full-text reads of every post on
 * Aug 27, 2026. This file is the product's bibliography: nothing in it is
 * invented, and anything unverifiable was left out or labeled as a claim.
 */

export interface ThesisRow {
  /** The published claim, paraphrased in one sentence. */
  claim: string;
  /** Verbatim quote, ≤15 words. */
  quote: string;
  source: string;
  date: string;
  href: string;
  /** What the instrument does with the claim. */
  mechanism: string;
  /** Deep link into the narrative (hash reveals gated stages). */
  anchor: string;
  anchorLabel: string;
  /** Marks the one place the instrument respectfully pushes back. */
  tension?: boolean;
}

export const THESIS_ROWS: ThesisRow[] = [
  {
    claim:
      "Organizations, not models, decide whether AI creates value, redesigning work is the disruption.",
    quote: "AI Won't Disrupt AEC, but Organizations That Redesign Work Will",
    source: "Dr. Sam Zolfagharian, Egnyte AEC Summit keynote (title)",
    date: "May 2026",
    href: "https://www.egnyte.com/events/summit/2026/aec/on-demand",
    mechanism:
      "The entire instrument: a technically perfect agent enters an unchanged operating model and is rejected, then the same agent passes once the work around it is redesigned.",
    anchor: "/",
    anchorLabel: "The whole run",
  },
  {
    claim:
      "Their own words, on their own feed: value from AI is an operating-model problem.",
    quote:
      "Getting value from AI isn't a technology problem—it's an operating model challenge.",
    source: "YegaTech on LinkedIn, Summit panel “Operating Models & Ecosystems”",
    date: "Mar 10, 2026",
    href: "https://www.linkedin.com/posts/yegatech_enterpriseoperatingmodel-aitransformation-activity-7437165492055986176-ERmq",
    mechanism:
      "This sentence is the product. Stage 1 removes the technology problem entirely. The agent is perfect, so everything that happens next is, by construction, the operating-model challenge.",
    anchor: "/",
    anchorLabel: "The whole run",
  },
  {
    claim:
      "AI capability and adoption outran the organizational systems needed to turn them into value.",
    quote: "managing it is becoming more complex than building it",
    source: "YegaTech, “AI Got Good Fast! Organizations Didn't”",
    date: "Apr 29, 2026",
    href: "https://yegatech.com/ai-got-good-fast-organizations-didnt-review-of-hai-reports/",
    mechanism:
      "Stage 1 ends with TECHNICAL TEST: PASSED. Stage 2 is what the organization does to that badge, the wind tunnel exists for the gap between the two.",
    anchor: "/#stage-2",
    anchorLabel: "Stage 2 · the shockwave",
  },
  {
    claim:
      "Nearly every firm chases 10% efficiency inside old structures; almost none redesigns the work itself.",
    quote: "Everyone is experimenting. Everyone is learning. But very few are redesigning.",
    source: "YegaTech, “Insights from 35+ Countries”",
    date: "Mar 26, 2026",
    href: "https://yegatech.com/insights-from-35-countries-on-whats-actually-happening-with-ai-in-practice-big-layoffs-are-coming-because-of-ai-or-not/",
    mechanism:
      "The four levers are all redesign, pricing, capacity routing, review architecture, apprenticeship. The model never changes in the wind tunnel; only the organization does, and that is what flips the verdict.",
    anchor: "/#stage-3",
    anchorLabel: "Stage 3 · the levers",
  },
  {
    claim:
      "Their own assessment weights Operating Model (35%) and Business Model (30%) as 65% of a firm's AI transformation score.",
    quote:
      "AI systems increasingly perform work that previously depended primarily on people.",
    source:
      "YegaTech AI Transformation Index, statement 8; weights from the page's published scoring script",
    date: "2026",
    href: "https://yegatech.com/ai-readiness/",
    mechanism:
      "The wind tunnel's levers are those two dimensions made operable, pricing and value capture (business model), review architecture and capacity routing (operating model). The instrument is the bridge between scoring those dimensions and building agents.",
    anchor: "/#stage-3",
    anchorLabel: "Stage 3 · the levers",
  },
  {
    claim:
      "Her solo book's method: notice inherited defaults, rethink the tradeoffs, redesign the systems.",
    quote: "The future isn't a fork in the road. It's a design space.",
    source: "Dr. Sam Zolfagharian, Future by Design (book page)",
    date: "2026",
    href: "https://samzolfagharian.com/books/future-by-design/",
    mechanism:
      "The wind tunnel is that design space: inherited defaults (T&M billing, utilization ratings, full-manual review) made visible, tradeoffs priced, the $5,880 apprenticeship insurance, and systems redesigned live.",
    anchor: "/#stage-3",
    anchorLabel: "Stage 3 · the design space",
  },
  {
    claim:
      "AI dashboards fill with prompts, tokens, and adoption counts, activity metrics that can't say whether the strategy works.",
    quote: "Executives: Are You Measuring AI Progress or Just AI Activity?",
    source: "YegaTech on LinkedIn (event title)",
    date: "Jul 7, 2026",
    href: "https://www.linkedin.com/posts/yegatech_ai-innovation-futureofwork-activity-7480334064441495552-OrVL",
    mechanism:
      "Nothing in the charter counts activity. Its verifiable targets are business progress only, margin delta, PE hours, a utilization floor, a deep-practice floor, with stop conditions that end the experiment when progress stops.",
    anchor: "/#stage-4",
    anchorLabel: "Stage 4 · the targets",
  },
  {
    claim:
      "Demanding early ROI stalls AI; the board question that matters is the risk of not investing.",
    quote: "what's the risk of not investing? RONI, not ROI",
    source: "YegaTech, “If your board is pushing on ROI…”",
    date: "Jun 1, 2026",
    href: "https://yegatech.com/if-your-board-is-pushing-on-roi-ask-them-this-one-question/",
    mechanism:
      "The instrument refuses to fabricate ROI. It outputs a bounded experiment with stop conditions, evidence generation, not a payback promise, and 'do not deploy yet' is a first-class verdict.",
    anchor: "/#stage-4",
    anchorLabel: "Stage 4 · the charter",
  },
  {
    claim:
      "AI investment is capability-building, not a software purchase with a quarterly payback period.",
    quote: "You're not buying software, but you're building a capability",
    source: "YegaTech, RONI post",
    date: "Jun 1, 2026",
    href: "https://yegatech.com/if-your-board-is-pushing-on-roi-ask-them-this-one-question/",
    mechanism:
      "Every run deposits an anonymized evidence node. The artifact of use is accumulated organizational knowledge, a capability that compounds, not a license key.",
    anchor: "/#stage-5",
    anchorLabel: "Stage 5 · the library",
  },
  {
    claim:
      "The real question is where value gets created, not how the old way gets faster.",
    quote: "How does AI fundamentally change where value gets created?",
    source: "YegaTech, AI Summit 2026 insights",
    date: "May 20, 2026",
    href: "https://yegatech.com/insights-from-yegatech-ai-summit-2026-from-improving-the-old-way-of-work-to-redefining-the-work/",
    mechanism:
      "The pricing lever is exactly this question made operable: under T&M the client keeps the value; under fixed fee the firm does. Same agent, different value geography.",
    anchor: "/#stage-3",
    anchorLabel: "Stage 3 · pricing lever",
  },
  {
    claim:
      "Her clients already ask the pricing question out loud, and she has predicted value-based models replacing hourly billing within five years.",
    quote: "Shall I charge like less because now I'm using AI",
    source: "ProjectReady podcast transcript (her clients' question, as she reports it)",
    date: "Aug 15, 2024",
    href: "https://project-ready.com/ai-driven-transformation-in-aec-navigating-data-strategy-and-the-future/",
    mechanism:
      "The pricing lever answers that exact question with arithmetic: under T&M the discount is forced and the firm books the loss; under fixed fee the firm keeps the speedup. Her five-year prediction (CEA 259, Nov 2024) is the lever's direction of travel.",
    anchor: "/#stage-3",
    anchorLabel: "Stage 3 · pricing lever",
  },
  {
    claim:
      "Their CEO named the next governance problem publicly, and left it open.",
    quote: "Very soon, we'll be saying “Our AI agents are everywhere.”",
    source: "Dr. Mehdi Nourbakhsh (Cofounder & CEO), LinkedIn, on agent sprawl",
    date: "Jul 8, 2026",
    href: "https://www.linkedin.com/in/mehdinour/",
    mechanism:
      "Agent sprawl is what the stack's later stages prevent: Greenlight clears an agent for one project, contract, and data class; Recommission re-earns that authorization when the model, the addenda, or the supervising PE changes. Stage one keeps the sprawl from starting, an agent that fails the economics gate is never built.",
    anchor: "/vision",
    anchorLabel: "The four-stage stack",
  },
  {
    claim:
      "Governance is a dial with two failure modes, loose is risk, strict kills momentum.",
    quote:
      "Too loose, and you expose the firm to risk. Too strict, and you kill momentum.",
    source: "Zolfagharian & Nourbakhsh, STRUCTURE Magazine",
    date: "Jun 30, 2025",
    href: "https://www.structuremag.org/article/why-structural-firms-should-adopt-an-inside-out-ai-strategy/",
    mechanism:
      "The review-architecture lever is exactly this dial, with all three positions modeled: raw AI acceptance (too loose, auto-rejected on liability), full manual re-verification (too strict, the PE gate becomes the bottleneck), and the risk-tiered delta gate: her “safe lanes for fast-moving innovation,” budgeted at 1.0h per package.",
    anchor: "/#stage-3",
    anchorLabel: "Stage 3 · review lever",
  },
  {
    claim:
      "Shared tools can't differentiate a firm, how it runs its operation does.",
    quote: "value isn't in the airplane, but it's in how they run the airline",
    source: "YegaTech, “Are You United or Spirit Airlines?”",
    date: "Oct 23, 2025",
    href: "https://yegatech.com/are-you-united-or-spirit-airlines-when-it-comes-to-ai/",
    mechanism:
      "Every firm can buy the same spec-QA agent. The pattern library records which operating systems let it create value, the airline, not the airplane, becomes the moat.",
    anchor: "/#stage-5",
    anchorLabel: "Stage 5 · the library",
  },
  {
    claim:
      "Most of AI's disruption is below the visible surface, and leaders under-prepare for it.",
    quote:
      "That's ~5X more disruption than what's visible, and most leaders aren't preparing for it",
    source: "YegaTech, “The Iceberg of AI Disruption”",
    date: "Jan 12, 2026",
    href: "https://yegatech.com/the-iceberg-of-ai-disruption-is-bigger-than-you-think/",
    mechanism:
      "The visible metric is a 42% speedup. The submerged mass, utilization collapse, PE overload, apprenticeship decay, is what the causal propagation drags into view.",
    anchor: "/#stage-2",
    anchorLabel: "Stage 2 · below the surface",
  },
  {
    claim:
      "AI's promise is amplification, the same team delivering more, not headcount arithmetic.",
    quote: "the same team can deliver more, faster, with fewer errors",
    source: "YegaTech, “AECOM's $400M AI Bet”",
    date: "Dec 26, 2025",
    href: "https://yegatech.com/aecoms-400m-ai-bet-the-most-controversial-move-in-aec-in-recent-years/",
    mechanism:
      "The capacity-routing lever: freed junior hours flow to backlog and the firm grows throughput at constant headcount, or sit idle and rot the utilization metric.",
    anchor: "/#stage-3",
    anchorLabel: "Stage 3 · capacity lever",
  },
  {
    claim:
      "Adoption is an incentive-design problem: culture work is the step firms skip.",
    quote: "design the incentives that turn AI from a memo into daily practice",
    source: "YegaTech, AI Consulting & Advisory page",
    date: "2026",
    href: "https://yegatech.com/ai-consulting-for-aec/",
    mechanism:
      "The incentives pillar scores the number PMs are actually rated on, junior billable utilization, and shows the org quietly killing the agent when that number collapses.",
    anchor: "/#stage-2",
    anchorLabel: "Stage 2 · incentives pillar",
  },
  {
    claim:
      "Jumping into AI without a strategy puts a firm behind, not ahead, the SSOE lesson.",
    quote: "diving into the pool of AI without a strategy will actually put you further behind",
    source: "YegaTech, “Six Essential Elements of an AI Strategy”",
    date: "Apr 24, 2024",
    href: "https://yegatech.com/six-essential-elements-companies-need-to-focus-on-when-creating-an-ai-strategy/",
    mechanism:
      "The wind tunnel is the strategy step before the pool: a firm rehearses the deployment against its own operating model before committing real packages, real fees, and a real stamp.",
    anchor: "/",
    anchorLabel: "The gate before the pool",
  },
  {
    claim:
      "AI initiatives fail when run as predictable projects; they are uncertain journeys that need leadership.",
    quote: "Trips can be managed. Journeys must be led.",
    source: "YegaTech, “Too Much Management, Not Enough Leadership”",
    date: "Jul 16, 2025",
    href: "https://yegatech.com/the-hidden-reason-ai-initiatives-struggle/",
    mechanism:
      "The charter is a journey checkpoint, not a Gantt chart: a 30-day bounded leg, explicit stop conditions, and a leadership decision at the end, scale, redesign, or kill.",
    anchor: "/#stage-4",
    anchorLabel: "Stage 4 · the decision",
  },
  {
    claim:
      "Their 2024 post argues AI taking grunt work accelerates junior learning, the one place this instrument pushes back, then synthesizes.",
    quote:
      "employees actually learn more by working alongside AI systems than by performing grunt work themselves",
    source: "YegaTech, “How Will Junior Employees Gain Practical Experience…”",
    date: "Sep 10, 2024",
    href: "https://yegatech.com/have-you-thought-about-how-junior-employees-will-gain-practical-experience-if-ai-handles-the-grunt-work/",
    mechanism:
      "Licensure law makes judgment non-delegable (ASCE 573), so the instrument keeps a deep-practice floor, and their optimism too: the 20% blind audit has juniors working alongside the agent, studying the delta. The synthesis is priced honestly at $5,880/month.",
    anchor: "/#stage-3",
    anchorLabel: "Stage 3 · apprenticeship lever",
    tension: true,
  },
];

export interface SpokenFramework {
  title: string;
  oneLiner: string;
  quote?: string;
  source: string;
  date: string;
  href: string;
  echo: string;
}

/**
 * The spoken record, her recurring frameworks from the podcast corpus
 * (transcripts and recaps read in full, Aug 2026). Each mapped to what the
 * instrument does with it.
 */
export const SPOKEN_RECORD: SpokenFramework[] = [
  {
    title: "Inside-out, not outside-in",
    oneLiner:
      "Start from the firm's own bottlenecks, then shop, tool-chasing produces disconnected pilots and tech fatigue. Innovation and governance run as two task forces that must collaborate.",
    quote: "Teams don't need to be convinced; they pull the solutions in",
    source: "STRUCTURE Magazine (co-authored)",
    date: "Jun 2025",
    href: "https://www.structuremag.org/article/why-structural-firms-should-adopt-an-inside-out-ai-strategy/",
    echo: "The wind tunnel starts from the firm's own economics, fee model, capacity, incentives, never from a tool list. Inside-out strategy, executable.",
  },
  {
    title: "The delivery playbook",
    oneLiner:
      "Her stated engagement model: educate everyone first, stand up a task force mixing executives with people in the weeds, make the innovation process repeatable, appoint one accountable leader.",
    source: "ProjectReady podcast (transcript)",
    date: "Aug 2024",
    href: "https://project-ready.com/ai-driven-transformation-in-aec-navigating-data-strategy-and-the-future/",
    echo: "The charter operationalizes the last step, one accountable owner per experiment, and the instrument makes the process literally repeatable: same wind tunnel, every workflow, every firm.",
  },
  {
    title: "Business → AI → data, in that order",
    oneLiner:
      "Data lakes built without a question become swamps, she cites ~90% of construction project data going to waste. Her fix is a policy plus incentives: structured-data targets tied to bonuses.",
    quote: "data is like that grocery shopping item and AI is like that recipe",
    source: "ProjectReady podcast (transcript)",
    date: "Aug 2024",
    href: "https://project-ready.com/ai-driven-transformation-in-aec-navigating-data-strategy-and-the-future/",
    echo: "The instrument forces the question before the shopping: which workflow, which decision, which operating model. And her bonus-linked data targets are incentive design, the same lever family as Stage 3.",
  },
  {
    title: "Buy the common, build the unique",
    oneLiner:
      "For common industry problems, vendors will always beat an AEC firm. Build in-house only what is uniquely yours, precisely because its small market means no vendor will ever build it.",
    source: "ProjectReady podcast (transcript)",
    date: "Aug 2024",
    href: "https://project-ready.com/ai-driven-transformation-in-aec-navigating-data-strategy-and-the-future/",
    echo: "By her own rule, the pattern library is YegaTech's build-worthy asset: too AEC-specific for a platform vendor, compounding only for the firm that owns the instrument. The /vision argument, in her logic.",
  },
  {
    title: "It's a people problem",
    oneLiner:
      "Ten thousand tools exist; adoption fails on people, not capability, and pushing tools onto teams produces tech fatigue, not transformation.",
    quote: "We have over 10,000 solutions out there. It's just people problem",
    source: "ProjectReady podcast (transcript)",
    date: "Aug 2024",
    href: "https://project-ready.com/ai-driven-transformation-in-aec-navigating-data-strategy-and-the-future/",
    echo: "The incentives pillar scores the number people are actually rated on, junior billable utilization. The wind tunnel treats adoption as designed behavior, not persuasion.",
  },
  {
    title: "Sunset what underperforms",
    oneLiner:
      "Her summit's operating rule, as covered by an attendee: every AI use case needs an owner, a defined pain point, measurable outcomes, a scaling plan, and underperforming pilots get sunset.",
    source: "WaterWorld editorial on the YegaTech AI Summit",
    date: "Jun 2026",
    href: "https://www.waterworld.com/water-utility-management/blog/55382560/ai-your-workforce-multiplier",
    echo: "The charter is that rule as a signable document: accountable owner, verifiable targets, deterministic stop conditions, and a day-30 decision, scale, redesign, or kill.",
  },
  {
    title: "Verification is the human's job",
    oneLiner:
      "The engineer, not the AI, carries responsibility, the professional's role shifts toward verifying and validating what the machine produces.",
    quote: "It's not the AI that is responsible",
    source: "Civil Engineering Academy 259 (transcript)",
    date: "Nov 2024",
    href: "https://civilengineeringacademy.com/revolutionizing-the-aec-industry-with-ai-insights-from-dr-sam-zolfagharian-cea-259/",
    echo: "The engine encodes it as a hard rule: raw AI acceptance auto-rejects regardless of margin, and the tiered gate budgets the PE's verification hours explicitly.",
  },
];

export interface ArcStep {
  year: string;
  theme: string;
  note: string;
}

/** Her public message arc, the instrument lands where the arc points. */
export const MESSAGE_ARC: ArcStep[] = [
  {
    year: "2023",
    theme: "Governance",
    note: "AI governance and ethics, fairness, transparency, accountability (Confluence, as YegaTech CTO).",
  },
  {
    year: "2024",
    theme: "Culture & people",
    note: "Culture of innovation first; the “why” before the tool; educate, then adopt (IMEG, CEA, ProjectReady).",
  },
  {
    year: "2025",
    theme: "Inside-out strategy",
    note: "Focus over access; twin task forces; safe lanes for fast-moving innovation (STRUCTURE, Disrupt It).",
  },
  {
    year: "2026",
    theme: "Redesigning work",
    note: "“The real disruption is not technological; it's organizational” (Egnyte keynote abstract). The wind tunnel starts here, and prices the redesign.",
  },
];

export interface RoomVoice {
  who: string;
  role: string;
  quote: string;
  context: string;
  date: string;
  href: string;
  /** Which lever this lands on. */
  lever: string;
}

/**
 * The room, in its own words.
 *
 * These are people scheduled to speak at the CEO AI Symposium on 4
 * December. They are not YegaTech, which is what makes them worth
 * quoting. The premise this instrument runs on is not being argued at
 * them. It is already being said by them.
 */
export const ROOM_VOICES: RoomVoice[] = [
  {
    who: "Jennifer Bennett",
    role: "President and CEO, Shive-Hattery, around 760 staff across 18 offices",
    quote: "I hope we're all moving away from hourly work",
    context:
      "Said as an aside while explaining why she teaches utilization as the easy example of a gameable metric. The pricing lever, from a CEO who will be in the room.",
    date: "Jul 8, 2026",
    href: "https://www.knowledge-architecture.com/blog/inside-shive-hatterys-leadership-development-program",
    lever: "Pricing",
  },
  {
    who: "Jennifer Bennett",
    role: "President and CEO, Shive-Hattery",
    quote: "You can manage that number and improve the metric",
    context:
      "On telling people to be more chargeable after a bad utilization report. She finishes the thought: you are not really solving the problem, and you are probably creating additional ones.",
    date: "Jul 8, 2026",
    href: "https://www.knowledge-architecture.com/blog/inside-shive-hatterys-leadership-development-program",
    lever: "Incentives",
  },
  {
    who: "Jennifer Bennett",
    role: "President and CEO, Shive-Hattery",
    quote: "What does a new grad think when you say, 'You've got to get your utilization up'",
    context:
      "Her point continues: when they have little control over their workload. The apprenticeship pillar and the incentives pillar, named together, by an attendee.",
    date: "Jul 8, 2026",
    href: "https://www.knowledge-architecture.com/blog/inside-shive-hatterys-leadership-development-program",
    lever: "Apprenticeship",
  },
  {
    who: "ACEC Research Institute",
    role: "With Virginia Tech. Andy McCune of Wade Trim, also speaking on 4 December, sits on its board",
    quote: "it is fundamentally in a race to the bottom",
    context:
      "The full sentence: a firm that can deliver the same work product 30 to 50 percent more efficiently but still charges by the hour is in a race to the bottom. This is the institutional version of the premise, published two years ago.",
    date: "Sep 2024",
    href: "https://www.constructiondive.com/news/lump-sum-contracts-benefit-engineers-owners-ai/727926/",
    lever: "Pricing",
  },
  {
    who: "Bill Ashworth",
    role: "President and CEO, VHB",
    quote: "professional judgment and accountability remain at the center of every decision",
    context:
      "VHB's own policy goes further: no AI content in deliverables without expert review, and no reliance on AI for professional judgment or calculations without independent verification. That is the review gate, written down.",
    date: "Apr 2026",
    href: "https://www.vhb.com/artificial-intelligence-responsible-use/",
    lever: "Review gate",
  },
  {
    who: "Vince DiPofi",
    role: "CEO, SSOE Group, a YegaTech client for around three years",
    quote: "think like an AI firm aiming to deliver A/E services",
    context:
      "The most advanced of the seven. His firm publishes a governance timeline and a 100 percent training completion figure. What it does not publish, and neither does any of the other six, is a single AI return figure.",
    date: "2026",
    href: "https://www.ssoe.com/ai-at-ssoe/",
    lever: "Operating model",
  },
];

export interface Challenge {
  claim: string;
  detail: string;
  source: string;
  href: string;
  /** How the instrument answers, or concedes. */
  response: string;
  conceded: boolean;
}

/**
 * Where this premise is weak.
 *
 * A prototype that only collects agreeing evidence is marketing. These are
 * the strongest findings against the argument this instrument runs on,
 * kept here because a room of engineers will find them anyway and it is
 * better to have found them first.
 */
export const CHALLENGES: Challenge[] = [
  {
    claim: "The measured data currently points the other way",
    detail:
      "Monograph's 2026 benchmarks, drawn from platform data across hundreds of firms rather than a survey, show AI-adopting firms at 210 thousand revenue per employee against 190 thousand, utilization up 14 percent, and realization at 100 percent. Firms using AI are billing more, not less.",
    source: "Monograph, 2026 A&E Benchmarks",
    href: "https://monograph.com/blog/salary-and-business-benchmarks-for-architects-engineers",
    response:
      "Conceded, and it is the most useful fact in this whole file. The fear is anticipatory. Nothing in the measured record shows revenue destruction yet.",
    conceded: true,
  },
  {
    claim: "The labor shortage is absorbing the freed hours automatically",
    detail:
      "Around 84 percent of firms have roles they cannot fill and a third are turning work away. The CTO of V3 Companies, quoted in the same ACEC report that names the billing fear: AI efficiency at this point is just helping us meet demand.",
    source: "ACEC Research Institute, 2025 and 2026",
    href: "https://www.acec.org/news/last-word-blog/post/engineering-firms-have-more-work-than-people-the-answer-may-not-be-more-engineers/",
    response:
      "Conceded, and it sharpens the instrument rather than defeating it. Redeployment is one of the four levers. Today the labor market sets it to full automatically, which masks the problem. The real question is what happens when backlog normalizes and that stops being free.",
    conceded: true,
  },
  {
    claim: "AI has barely entered billable work at all",
    detail:
      "Phil Bernstein of Yale asked roughly 200 construction lawyers whether any client had raised AI in billable work. Two hands went up.",
    source: "Phil Bernstein, via Common Edge",
    href: "https://commonedge.org/how-ai-will-upend-architectures-antiquated-business-model/",
    response:
      "Conceded. This argues the wind tunnel is early rather than wrong, which is the correct time to run a rehearsal.",
    conceded: true,
  },
  {
    claim: "Most AEC work is not billed hourly in the first place",
    detail:
      "PSMJ benchmarks put lump sum and fixed fee at around 59 percent of work, rising to 76 percent for the smallest firms.",
    source: "PSMJ benchmarks, via trade coverage",
    href: "https://commonedge.org/how-ai-will-upend-architectures-antiquated-business-model/",
    response:
      "Partly answered. Frank Stasiowski of PSMJ, whose own benchmarks those are, argues that lump sum fees are still built from estimated hours, so the exposure survives the contract type. The instrument models blended and fixed states precisely because the answer differs by firm.",
    conceded: false,
  },
  {
    claim: "Practitioners surveyed at scale do not raise this at all",
    detail:
      "A survey of roughly 800 architects in March 2026 mentions fees zero times. Top barriers are output quality and software compatibility.",
    source: "Chaos survey, 2026",
    href: "https://www.aia.org/aia-architect/article/will-ai-change-billing-forever",
    response:
      "Conceded at the practitioner level. The gap is between what firm leaders tell researchers privately and what the profession discusses publicly, which is itself the thing worth showing on a screen.",
    conceded: true,
  },
];

export interface ProofPoint {
  who: string;
  quote: string;
  context: string;
  source: string;
  href: string;
}

/** The one public company that has answered the question out loud. */
export const AECOM_PROOF: ProofPoint = {
  who: "W. Troy Rudd, Chief Executive, AECOM",
  quote: "We will see improved margins on those contracts.",
  context:
    "An analyst asked directly whether AI-delivered projects carry fewer billable hours. The answer was that revenue does not necessarily rise, margin does, and the firm built a mechanism to share the benefit with clients that did not exist before. This is the premise, confirmed and answered on an earnings call.",
  source: "AECOM Q2 FY2026 earnings call, May 2026",
  href: "https://www.constructiondive.com/news/lump-sum-contracts-benefit-engineers-owners-ai/727926/",
};

export interface ClientProof {
  firm: string;
  headline: string;
  facts: string[];
  href?: string;
}

/** What YegaTech's named clients have already shown publicly. */
export const CLIENT_PROOFS: ClientProof[] = [
  {
    firm: "SSOE Group",
    headline: "Already runs spec-search AI on live projects",
    facts: [
      "SSOE's public AI page lists an ACC AI Assistant that searches specifications for faster RFI and submittal responses, the exact workflow class Atlas Civil models.",
      "CEO Vince DiPofi began firm-wide AI integration in 2022 with a governance team, after two years collaborating with YegaTech (SSOE press release).",
      "100% of employees completed voluntary Copilot training ahead of the October 2025 goal; YegaTech's case study cites an AI opportunity portfolio built in eight weeks.",
    ],
    href: "https://www.ssoe.com/ai-at-ssoe-2/",
  },
  {
    firm: "Wade Trim",
    headline: "A disciplined funnel: 20+ ideas → 3 opportunities",
    facts: [
      "YegaTech's case study: the 700-person civil firm turned 20+ AI ideas into three major business-improvement opportunities. CTO Tim O'Rourke: “a repeatable process for innovation with AI in our organization.”",
      "Wade Trim's own Innovation Alley podcast hosted both YegaTech founders; its 2026 Innovator of the Year award went to the leader rolling out its scalable AI tools.",
      "YegaTech's RONI post credits the disciplined strategy with a tenfold timeline acceleration, reported here as their published claim.",
    ],
    href: "https://yegatech.com/case-studies/",
  },
  {
    firm: "Mackenzie",
    headline: "From AI apprehension to governance, independently covered",
    facts: [
      "Independent DJC Oregon coverage (Feb 2024): the 60-year-old design firm engaged YegaTech for a customized strategic roadmap and an AI governance framework.",
      "Cross-disciplinary AI task force with a senior leader from each discipline, structural, civil, architecture, land-use planning.",
      "Principal Josh McDowell: “it is Mackenzie's priority to invest in the future for our clients and partners.”",
    ],
    href: "https://mackenzie.inc/news/aidjcarticle",
  },
];

export interface FunnelStep {
  date: string;
  title: string;
  body: string;
  /** Marks the step this instrument inserts into their existing funnel. */
  insert?: boolean;
}

/**
 * Why now, YegaTech's own calendar. The wind tunnel slots between their
 * assessment and their cohort: the economics gate the funnel currently skips.
 */
export const FUNNEL_STEPS: FunnelStep[] = [
  {
    date: "Always on",
    title: "AI Transformation Index",
    body: "Their funnel's entry: 16 statements scored across four dimensions. The published scoring script weights Operating Model at 35% and Business Model at 30%, 65% of the score is exactly what this wind tunnel simulates.",
  },
  {
    date: "The missing gate",
    title: "Value Shift, this instrument",
    body: "Between knowing where you are and building agents sits a question the funnel currently skips: will the firm's operating model let the agent create value? Run the wind tunnel before writing a line of agent code.",
    insert: true,
  },
  {
    date: "Nov 10 – Dec 15, 2026",
    title: "AI for Small Firms cohort",
    body: "Six weeks, firms under 75 people, and a hard promise: an AI strategy plus 2–3 working agents per firm. Early bird closes Oct 30, every participant needs the economics gate in the next nine weeks.",
  },
  {
    date: "Dec 4, 2026",
    title: "CEO AI Symposium",
    body: "A half-day room of CEOs and managing principals, promised “a sharper view of where value is moving for your clients,” qualified by “you can feel value shifting for your clients.” The instrument's name is their own language, twice.",
  },
];

export interface GroundingRow {
  assumption: string;
  grounding: string;
  source: string;
  href: string;
}

/** Why the synthetic firm looks the way it does, every assumption anchored. */
export const GROUNDING_ROWS: GroundingRow[] = [
  {
    assumption:
      "Why review cannot simply be pushed downstream onto the licensed engineer",
    grounding:
      "NCEES rewrote the definition of responsible charge in August 2025. It now means to exercise full professional knowledge of and control over work, with a four-part test that requires authority throughout development and personal answerability. NSPE is blunter still: reviewing documents after preparation, without involvement in the design process, does not satisfy responsible charge.",
    source: "NCEES Model Law, Aug 2025 · NSPE Position Statement 10-1778",
    href: "https://ncees.org/wp-content/uploads/2025/09/Model-Law_August-2025_web.pdf",
  },
  {
    assumption:
      "Why accepting raw AI output is an automatic rejection, whatever the margin",
    grounding:
      "The regulators reached this in 2024 and 2025. NCEES Position Statement 6.10 says AI is a tool to assist, not replace, professional judgment, and requires independent checks before implementation. North Carolina's board went furthest: the licensee must be capable of reproducing the output independently from any AI program. NSPE Case 24-2 found that a cursory review of AI-assisted design before sealing was unethical.",
    source: "NCEES PS 6.10 (2025) · NCBELS guidelines (Jul 2025) · NSPE BER 24-2",
    href: "https://www.ncbels.org/wp-content/uploads/2025/07/Guidelines-on-the-Use-of-Artificial-Intelligence-in-Engineering-and-Surveying-Services-FINAL.pdf",
  },
  {
    assumption:
      "Why full manual re-verification surges review hours, and why the tiered gate fixes it",
    grounding:
      "This is the best-evidenced mechanism in the model, and it cuts both ways. Unfiltered automation raises expert burden and lowers accuracy: mammography CAD across 222,135 women dropped specificity from 90.2 to 87.2 percent, raised biopsies 19.7 percent, and made overall accuracy worse. Google will not ship a code-review check above a 10 percent false-positive rate, having watched developers abandon one that was. But when the tool triages instead of flagging everything, the burden collapses: the MASAI randomized trial of 80,033 women cut screen-reading workload 44.3 percent while raising detection. The failure mode is triage design, not automation, which is exactly what the review lever moves.",
    source: "Fenton et al., NEJM 2007 · Lång et al., Lancet Oncology 2023 · Sadowski et al., CACM 2018",
    href: "https://doi.org/10.1016/S1470-2045(23)00298-X",
  },
  {
    assumption:
      "What the review is actually for, and what it is not",
    grounding:
      "Under AIA A201 the review checks conformance with information given and the design concept, and explicitly excludes the accuracy of dimensions and quantities, installation instructions, and means and methods, all of which stay with the contractor who warrants it verified them. Reviewing beyond that scope transfers liability rather than reducing it. Worth noting: the familiar phrase general conformance with the design concept appears nowhere in A201-2017 or EJCDC C-700. It is industry habit, not contract language.",
    source: "AIA A201-2017 §4.2.7 and §3.12.6 · EJCDC C-700 §6.17",
    href: "https://www.irmi.com/articles/expert-commentary/design-professional-review-of-submittals-under-the-aia-documents",
  },
  {
    assumption:
      "Why the escalation mechanism is not hypothetical",
    grounding:
      "The profession already has the case. Structural shop drawing review on the Hyatt Regency walkways was handled by a junior who had failed the licensing exam, who noticed the connection change, could not analyse it, and accepted a senior's verbal assurance that it was generally the same. One hundred and fourteen people died. Remove the AI from the model and this is the same funnel: under-qualified first pass, unfiltered escalation, senior check compressed to a skim.",
    source: "EJCDC, Shop Drawings and Submittals, Part 3",
    href: "https://ejcdc.org/shop-drawings-and-submittals-part-3-liability-associated-with-submittal-reviews-by-kevin-obeirne/",
  },
  {
    assumption:
      "Hours per package, and the honest state of the evidence",
    grounding:
      "There is no published per-submittal labour-hour standard from CSI, ASCE, AIA, or the DoD. Those bodies publish calendar durations, not hours, so every figure in circulation is vendor-published. The anchor used here is state DOT consultant fee guidance, the only non-vendor source that breaks hours out by staff class. Across nine Ohio DOT packages the preparer share averages 72.8 percent and total oversight 27.2 percent. This model sits at 76.9 and 23.1, inside both ranges, and 520 hours a month is about 12 percent of a 45-person firm's technical capacity.",
    source: "Ohio DOT Consultant Fee Estimation Guidance, Vol. 4",
    href: "https://www.dot.state.oh.us/Divisions/Engineering/Consultant/ConsultDocs/Volume%204%20Consultant%20Fee%20Estimation%20Guidance_April%202021.pdf",
  },
  {
    assumption: "The chosen workflow: specification QA & submittal review",
    grounding:
      "AIA research flags specification work as a high-friction AI target; the Navigant benchmark puts an average RFI at ~8 hours and ~$1,080 to process, and YegaTech's flagship client already runs spec-search AI for faster RFI/submittal responses.",
    source: "AIA/Deltek 2025 · Navigant via Procore · SSOE",
    href: "https://www.deltek.com/resources/articles/ai-in-specs/",
  },
  {
    assumption: "The T&M trap is the default failure mode, not a strawman",
    grounding:
      "ACEC's 2025 AI report names “Business Model Misalignment”, time-on-task billing versus value pricing, as a core barrier: hourly firms fear AI-reduced billables. Industry coverage of ACEC's lump-sum research warns an efficient hourly firm is “fundamentally in a race to the bottom.”",
    source: "ACEC Research Institute, May 2025 · Construction Dive, Sep 2024",
    href: "https://www.acec.org/wp-content/uploads/2025/05/The-Role-of-Artificial-Intelligence-in-the-Engineering-Industry.pdf",
  },
  {
    assumption: "Billing rates: Jr $175 · PM $240 · PE $310 per hour",
    grounding:
      "Inside published 2025 A/E rate bands: staff engineers ~$123–190/hr, senior PMs $200–275/hr, principals $250–350/hr.",
    source: "Monograph / ACEC-based pricing guides, 2025",
    href: "https://monograph.com/blog/structural-engineer-fees-cost-breakdown",
  },
  {
    assumption: "Utilization is a live pressure point, not an invented metric",
    grounding:
      "Deltek's 2026 Clarity study puts firmwide A&E utilization just under 60% and falling, with operating profit down to 16.7%; Zweig's 2026 fee report shows the target-vs-actual chargeability gap widening to 4.0%. Atlas's 92% is an individual production-staff target, synthetic and editable.",
    source: "Deltek Clarity, May 2026 · Zweig Group, Apr 2026",
    href: "https://www.deltek.com/company/news/latest-deltek-clarity-industry-studies-highlight-ai-challenges/",
  },
  {
    assumption: "The adoption-to-value gap, in AEC's own numbers",
    grounding:
      "Deltek Clarity 2026: AI adoption in A&E jumped to 70% (GenAI 78%), while only 38% of firms report measurable positive business impact. The industry's own version of the gap this wind tunnel exists to explain.",
    source: "Deltek Clarity A&E Study, May 2026",
    href: "https://www.deltek.com/company/news/latest-deltek-clarity-industry-studies-highlight-ai-challenges/",
  },
  {
    assumption: "The same gap at economy scale",
    grounding:
      "88% of organizations use AI regularly, 39% report enterprise EBIT impact, ~6% qualify as AI high performers.",
    source: "McKinsey, The State of AI, Nov 2025",
    href: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
  },
  {
    assumption: "Why the apprenticeship pillar is load-bearing",
    grounding:
      "ACEC's workforce research counts ~184,000 engineers retiring or leaving in 2022 against ~166,000 graduates, an ~18,000-a-year gap, and 49% of firms have turned down work for lack of staff. A firm that consumes its junior pipeline is eating its future PEs.",
    source: "ACEC Research Institute, Oct 2025",
    href: "https://engineeringinc.acec.org/blog/5-numbers-that-explain-americas-engineering-shortage/",
  },
  {
    assumption: "The PE gate is non-negotiable, raw AI acceptance auto-rejects",
    grounding:
      "AI cannot hold professional responsibility; the licensed engineer's judgment and accountability are non-delegable.",
    source: "ASCE Policy 573 (2024) · NSPE BER Case 24-2",
    href: "https://www.asce.org/advocacy/policy-statements/ps573---artificial-intelligence-and-engineering-responsibility",
  },
  {
    assumption: "Governance and records pressure is real, not theoretical",
    grounding:
      "80% of A/E professional-liability insurers view AI as a potential market disruptor and probe AI controls at renewal; EU AI Act logging duties apply from Aug 2026.",
    source: "Ames & Gough 2026 survey · EU AI Act Art. 12/26",
    href: "https://amesgough.com/ames-gough-2026-a-e-pl-survey-results/",
  },
];
