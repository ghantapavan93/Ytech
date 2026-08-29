/**
 * The Kill Review, content for /review.
 *
 * This is the adversarial product review that produced Value Shift: the
 * prosecution of the earlier concepts, the eight hard tests, the concept
 * tournament, and the brutal conclusion. The same discipline the wind
 * tunnel applies to AI agents was applied to the product itself before a
 * line of it was built.
 */

export type ChargeSeverity =
  | "FATAL"
  | "CORRECTABLE"
  | "REQUIRES VALIDATION"
  | "LOW RISK";

export interface Charge {
  charge: string;
  severity: ChargeSeverity;
  detail: string;
}

/** Phase One, the strongest reasons Sam would dismiss the Outcome Compiler / generic agent OS. */
export const PROSECUTION: Charge[] = [
  {
    charge: "The problem it solves is already commoditized",
    severity: "FATAL",
    detail:
      "Agent inventory, identity, lifecycle, and governance are shipped features: Microsoft Agent 365's registry, ServiceNow AI Control Tower, and the AIA's AI Firm Toolkit (Aug 2026) with risk tiers, named owners, and 90-day reviews. A dashboard of agent records reads as a redundant subset of all three.",
  },
  {
    charge: "The delivery bottleneck was inferred, never evidenced",
    severity: "FATAL",
    detail:
      "No public signal shows YegaTech struggling to deliver its programs. Building infrastructure for an internal problem the founders have not reported is a guess wearing a roadmap.",
  },
  {
    charge: "If it vanished tomorrow, nobody would notice",
    severity: "FATAL",
    detail:
      "No repeated, painful task disappears the day after it exists, the governing question fails, so everything downstream of it is decoration.",
  },
  {
    charge: "Workshop 'compilation' is document generation in a costume",
    severity: "FATAL",
    detail:
      "ChatGPT, Claude, or Copilot Studio produce 80% of the output today. Impressive terminology does not create a defensible layer; a deterministic capability does.",
  },
  {
    charge: "It encodes Sam's methodology into an outsider's software",
    severity: "REQUIRES VALIDATION",
    detail:
      "Her firm sells founder-led, customized judgment, 'never off the shelf.' Software that presumes to run her program reads as an unsolicited redesign of something she just launched.",
  },
  {
    charge: "It needs private data to be useful on day one",
    severity: "REQUIRES VALIDATION",
    detail:
      "Assessment responses, meeting notes, client documents, none of which an outsider has or should have. A prototype that only works after access is granted is a meeting request, not a demo.",
  },
  {
    charge: "It adds documentation work instead of removing work",
    severity: "CORRECTABLE",
    detail:
      "Participants would feed the system so it can be smart later. Value that arrives only after extra labor is a cost wearing a value proposition.",
  },
  {
    charge: "It creates a system YegaTech would have to maintain",
    severity: "CORRECTABLE",
    detail:
      "YegaTech states plainly it is not a software vendor and does not sell implementation hours. Handing them an operations burden contradicts their own positioning.",
  },
  {
    charge: "Holding client information creates governance exposure",
    severity: "CORRECTABLE",
    detail:
      "A trust-selling consultancy cannot adopt tooling that raises new confidentiality questions. Any winning concept must be safe by construction, not by policy.",
  },
  {
    charge: "The wow moment is technically impressive, not commercially relevant",
    severity: "LOW RISK",
    detail:
      "An agent count or orchestration graph impresses engineers. Sam's audience is firm principals deciding where money and liability go.",
  },
];

export interface ConceptVerdict {
  concept: string;
  verdict: "KILL" | "PARK" | "NARROW" | "DEFER" | "BUILD";
  reason: string;
}

/** The concept graveyard, every earlier idea, sentenced. */
export const GRAVEYARD: ConceptVerdict[] = [
  {
    concept: "Sam AI Twin",
    verdict: "KILL",
    reason: "Presumes to replace the judgment her clients pay for. Removes no work; creates offense risk.",
  },
  {
    concept: "Outcome Compiler",
    verdict: "KILL",
    reason: "Invented bottleneck, commodity output, private-data dependency, no task removed. Four fatal charges.",
  },
  {
    concept: "Generic Agent OS / living agent record",
    verdict: "KILL",
    reason: "Microsoft, ServiceNow, and the AIA already ship it. Competing with free templates and platform incumbents.",
  },
  {
    concept: "Work Orders / Recommission",
    verdict: "PARK",
    reason: "Real future mechanism (change-triggered revalidation), wrong first artifact. Kept as Horizon 4.",
  },
  {
    concept: "Preflight (research briefs)",
    verdict: "NARROW",
    reason: "Useful, but the first 30 seconds look like polished ChatGPT. Commodity-adjacent; parked.",
  },
  {
    concept: "Greenlight (project AI clearance)",
    verdict: "DEFER",
    reason: "Strongest operational product, AIA says contracts override firm policy, but weakest first-minute reaction. Horizon 3.",
  },
  {
    concept: "Value Shift (economics wind tunnel)",
    verdict: "BUILD",
    reason: "Survived all eight tests. Makes Sam's own thesis operable in 90 seconds, on synthetic data, with a refusal at its core.",
  },
];

export interface Identification {
  q: string;
  a: string;
}

/** The governing question, answered concretely. */
export const IDENTIFICATION: Identification[] = [
  {
    q: "The exact user",
    a: "Sam (or a YegaTech facilitator), later, a client principal inside a paid stress-test engagement.",
  },
  {
    q: "The exact moment they open it",
    a: "Someone says “we have an agent that is 42% faster” or “we want to automate this workflow”, keynote prep, cohort kickoff, first strategy call.",
  },
  {
    q: "What they currently do instead",
    a: "Rebuild the incentive-contradiction argument verbally: whiteboards, anecdotes, twenty minutes of causal storytelling per audience.",
  },
  {
    q: "How often that work occurs",
    a: "Every keynote, every cohort session, every first client conversation where an agent idea arrives before an operating-model question.",
  },
  {
    q: "Why it is frustrating, expensive, or slow",
    a: "The argument is causal and quantitative, but it is delivered qualitatively, it leaks persuasion, cannot be handed to others, and resets to zero with each audience.",
  },
  {
    q: "What output they receive",
    a: "A live causal propagation with a verdict, and a printable 30-day experiment charter with an owner, targets, and stop conditions.",
  },
  {
    q: "What decision becomes easier",
    a: "Deploy as an experiment, redesign first, or do not deploy, before any agent is built.",
  },
  {
    q: "What work they no longer perform",
    a: "Constructing the “the technology worked, the operating model rejected it” story from scratch, every single time.",
  },
  {
    q: "Does it help before the November cohort?",
    a: "Yes. The cohort (Nov 10 – Dec 15) promises each firm 2–3 working agents; the wind tunnel is the economics gate a firm runs before building agent number one.",
  },
  {
    q: "Why ordinary ChatGPT cannot produce 80% of it",
    a: "ChatGPT writes the prose. It cannot hold a deterministic causal model stable under live lever edits, and it will happily invent the numbers this instrument refuses to.",
  },
];

export interface HardTest {
  name: string;
  question: string;
  answer: string;
}

/** Phase Two, the eight hard tests, applied to Value Shift. All pass. */
export const HARD_TESTS: HardTest[] = [
  {
    name: "The Monday Morning Test",
    question: "Could Sam use it during an actual task next Monday?",
    answer:
      "Yes. A small-firm CEO says “we want a spec-QA agent.” Sam opens the tunnel in the meeting, enters the claim, and shows in 90 seconds why their T&M billing would reject it, then hands over a 30-day experiment instead of an opinion.",
  },
  {
    name: "The Two Hour Test",
    question: "What two hours of repetitive work disappear?",
    answer:
      "The hours spent per audience constructing and narrating the incentive-rejection story. One controlled, editable simulation replaces the whiteboard rebuild, and improves decision quality by making every assumption visible and editable.",
  },
  {
    name: "The Thirty Second Test",
    question: "Is the value understood before the demo reaches 30 seconds?",
    answer:
      "The opening sentence does it alone: “This agent cuts drafting time by 42%. The firm should not deploy it. Yet.”",
  },
  {
    name: "The Existing Tool Test",
    question: "Can ChatGPT, Claude, Copilot Studio, or Relevance AI already do the essential job?",
    answer:
      "No tool shows a technical pass colliding with an economic rejection, live, under editable levers. The defensible layer is the deterministic engine, 24 pinned invariants, zero LLM-generated numbers, and a refusal built in.",
  },
  {
    name: "The Founder Bottleneck Test",
    question: "Does it remove work only Sam or Mehdi can currently perform?",
    answer:
      "Yes, explaining why technically successful pilots destroy value requires their combined AI-and-AEC judgment. The tunnel makes that argument visible so they spend the meeting on judgment, not exposition. It outputs a decision, not more material to review.",
  },
  {
    name: "The Money Test",
    question: "Does it affect money without inventing ROI?",
    answer:
      "Preparation cost falls, the cohort's agent-building promise gains a defensible gate, keynotes gain a live instrument, and the stress test itself can become a paid pre-build module, all without one invented ROI number.",
  },
  {
    name: "The 72 Hour Truth Test",
    question: "Can one engineer demonstrate the value with one synthetic company and one workflow?",
    answer:
      "It happened: one firm (Atlas Structural & Civil), one workflow (spec-QA), four levers, five stages, 24 passing tests, a static production build. Nothing in the demo is a mockup.",
  },
  {
    name: "The Trust Test",
    question: "Does it handle evidence, confidentiality, judgment, provenance, uncertainty, and refusal?",
    answer:
      "Every figure is labeled synthetic and editable; assumption hashes give provenance; liability breaches auto-reject regardless of margin; “do not deploy” is a first-class output; humans sign the charter; anonymization of evidence nodes is enforced by unit tests.",
  },
];

export interface TournamentRow {
  criterion: string;
  preflight: number;
  greenlight: number;
  valueShift: number;
}

/** Phase Five, the concept tournament. 15 criteria, scored 1–10. */
export const TOURNAMENT: TournamentRow[] = [
  { criterion: "Public evidence of need", preflight: 8, greenlight: 8, valueShift: 10 },
  { criterion: "Immediate usefulness", preflight: 9, greenlight: 8, valueShift: 10 },
  { criterion: "Founder time removed", preflight: 8, greenlight: 7, valueShift: 9 },
  { criterion: "Revenue, margin, or delivery effect", preflight: 7, greenlight: 8, valueShift: 9 },
  { criterion: "Alignment with Sam's latest thinking", preflight: 8, greenlight: 8, valueShift: 10 },
  { criterion: "Connection to a current YegaTech activity", preflight: 8, greenlight: 9, valueShift: 10 },
  { criterion: "Difference from ordinary ChatGPT", preflight: 6, greenlight: 7, valueShift: 10 },
  { criterion: "AEC specificity", preflight: 7, greenlight: 10, valueShift: 9 },
  { criterion: "Trustworthiness", preflight: 8, greenlight: 9, valueShift: 10 },
  { criterion: "Thirty-second clarity", preflight: 9, greenlight: 7, valueShift: 10 },
  { criterion: "Ninety-second demonstration strength", preflight: 8, greenlight: 8, valueShift: 10 },
  { criterion: "72-hour feasibility", preflight: 10, greenlight: 8, valueShift: 10 },
  { criterion: "Technical depth", preflight: 6, greenlight: 8, valueShift: 8 },
  { criterion: "Reusable internal IP", preflight: 8, greenlight: 9, valueShift: 10 },
  { criterion: "Likelihood of earning a meeting", preflight: 8, greenlight: 9, valueShift: 10 },
];

export const TOURNAMENT_TOTALS = {
  preflight: TOURNAMENT.reduce((s, r) => s + r.preflight, 0),
  greenlight: TOURNAMENT.reduce((s, r) => s + r.greenlight, 0),
  valueShift: TOURNAMENT.reduce((s, r) => s + r.valueShift, 0),
};

export interface BrutalQA {
  q: string;
  a: string;
}

/** Phase Nine, the brutally honest conclusion. */
export const BRUTAL_CONCLUSION: BrutalQA[] = [
  {
    q: "What is the Outcome Compiler genuinely useful for?",
    a: "Naming the right end-goal, verified business outcomes, not agent counts. As a framing it seeded everything that followed; as a product it removes no repeated work.",
  },
  {
    q: "What is unnecessary or overbuilt about it?",
    a: "All of its operations: registries, lifecycle records, workshop compilation. Commoditized by platforms, premature for a boutique, and dependent on data an outsider does not hold.",
  },
  {
    q: "Who would use the winning concept tomorrow?",
    a: "Sam, preparing any executive room where an agent idea arrives before an operating-model question, and Pavan, demonstrating it to Aftab for calibration first.",
  },
  {
    q: "What exact task does it replace?",
    a: "Rebuilding the “technology worked, operating model rejected it” argument verbally, audience by audience, with nothing reusable left behind.",
  },
  {
    q: "Why can ordinary ChatGPT not do the same job?",
    a: "It cannot keep a causal model deterministic under live edits, it invents financial numbers on request, and it never refuses the easy answer. This instrument's value is precisely those three refusals.",
  },
  {
    q: "What would Sam likely find impressive?",
    a: "Her own thesis made operable: the four levers map onto her published triad, the $5,880 apprenticeship tradeoff is priced honestly, and “do not deploy” is a real output. Plus the evidence nodes, her firm's future moat, anonymized by construction.",
  },
  {
    q: "What would Sam likely find presumptuous?",
    a: "Anything claiming to encode her judgment, run her program, or predict real ROI. Which is why the tool decides nothing, charters are signed by humans, and every number is labeled synthetic.",
  },
  {
    q: "What must Pavan verify with Aftab before writing code?",
    a: "Whether firm principals already feel the T&M / utilization / PE-review contradiction, or still ask “which tool should we buy?” That answer calibrates the first 30 seconds of the demo.",
  },
  {
    q: "What is the smallest version worth building?",
    a: "One synthetic firm, one workflow, four levers, one charter. Exactly what was built, less has no causal chain, more dilutes it.",
  },
  {
    q: "What single sentence should Pavan say when the demo ends?",
    a: "“AI adoption isn't only resisted by people, it's rejected by the operating systems leadership designed. This makes that visible before your clients deploy.”",
  },
];
