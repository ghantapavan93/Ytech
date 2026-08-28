/**
 * The capability stack.
 *
 * A map of what an AI advisory practice runs on, assembled from what the
 * field visibly deploys. No firm is named anywhere in this file, and none
 * should be. The point is not who is ahead. The point is which layers a
 * two-person specialist practice can realistically own, and which ones
 * only make sense at scale.
 *
 * Written as an offer rather than an audit. Every gap here is phrased as
 * something that could be built, because that is what it is.
 */

export type Standing = "owned" | "partial" | "open";

export interface Layer {
  n: string;
  name: string;
  whatItIs: string;
  /** What the field has converged on, described without naming anyone. */
  fieldPattern: string;
  standing: Standing;
  /** Honest note on the current position. */
  position: string;
  /** Only present where something here already fills it. */
  builtHere?: string;
  /** Does owning this need scale? */
  needsScale: boolean;
}

export const STANDING_LABEL: Record<Standing, string> = {
  owned: "Already strong",
  partial: "Partly there",
  open: "Open",
};

export const LAYERS: Layer[] = [
  {
    n: "01",
    name: "Point of view",
    whatItIs:
      "A published argument the market can quote back to you. Books, talks, a recognisable thesis.",
    fieldPattern:
      "Nearly every serious practice leads with one. At scale it is produced by a research arm. At boutique scale it is the founder's own writing, which is usually sharper.",
    standing: "owned",
    position:
      "Three books, a keynote circuit, a monthly essay habit, and a thesis specific enough to build software against. This is the strongest layer here and it is not close.",
    needsScale: false,
  },
  {
    n: "02",
    name: "Entry diagnostic",
    whatItIs:
      "A short assessment that scores where a firm stands and starts a conversation.",
    fieldPattern:
      "Universal, and almost always the same shape: questionnaire, weighted score, PDF, follow-up call. The scoring model is usually hidden.",
    standing: "owned",
    position:
      "Sixteen statements across four weighted dimensions, already live and already feeding a CRM. Unusually, its scoring model is readable in the page source. That is a strength worth keeping rather than hiding.",
    needsScale: false,
  },
  {
    n: "03",
    name: "Education and certification",
    whatItIs: "Courses, cohorts, and a credential the market recognises.",
    fieldPattern:
      "Standard at every size. Large practices run academies. Small ones run cohorts and issue their own certificates.",
    standing: "owned",
    position:
      "A fifty-two lesson course with a certificate, an association bootcamp that sold out, and a six-week cohort that ships working agents. Complete.",
    needsScale: false,
  },
  {
    n: "04",
    name: "Community and convening",
    whatItIs: "A room the right people want to be in, and a reason to return to it.",
    fieldPattern:
      "The most reliable moat available to a small practice, and one large firms struggle to replicate credibly.",
    standing: "owned",
    position:
      "An annual summit, an executives-only symposium, and a paid private circle. A ladder from free content to a paid room, which most practices never finish building.",
    needsScale: false,
  },
  {
    n: "05",
    name: "Delivery instruments",
    whatItIs:
      "Something that runs during the engagement itself. Not a deck, not a spreadsheet. A tool that takes the client's situation and returns a decision.",
    fieldPattern:
      "This is where scale currently shows. Large practices field internal platforms and accelerators that make the hundredth engagement faster than the first. Small practices almost never have one, and rebuild the reasoning by hand each time.",
    standing: "open",
    position:
      "The clearest gap, and the one that is actually closeable without hiring. An instrument is code, not headcount.",
    builtHere:
      "The wind tunnel, the prep board, and the working agent are exactly this layer. Each takes a situation in and returns a decision with its reasoning attached.",
    needsScale: false,
  },
  {
    n: "06",
    name: "Accumulated evidence",
    whatItIs:
      "A record of what was decided, why, and whether it worked, that makes the next engagement start ahead of this one.",
    fieldPattern:
      "The real advantage at scale. Firms with hundreds of engagements turn them into internal knowledge platforms and reusable patterns. Below that size, engagement knowledge lives in people and slide archives, and evaporates.",
    standing: "open",
    position:
      "Nothing currently carries state from the assessment to the cohort to the follow-up. Each engagement starts at zero. This is the layer that compounds, so it is the one that gets worse by waiting.",
    builtHere:
      "The decision record and the pattern library. Anonymised by construction, and gated so only verified outcomes contribute.",
    needsScale: false,
  },
  {
    n: "07",
    name: "Owned benchmarks",
    whatItIs: "Numbers about the industry that you produced and nobody else has.",
    fieldPattern:
      "Sold as a product by the firms that own them, and cited by everyone else. The citing is free. The owning is the business.",
    standing: "open",
    position:
      "Current practice is to cite other people's industry data, which is honest and also gives the advantage away. A specialist practice sitting in front of dozens of firms a year is uniquely placed to produce numbers nobody else can.",
    builtHere:
      "The evidence nodes are the raw material. Enough of them, anonymised and aggregated, become a benchmark that did not previously exist.",
    needsScale: false,
  },
  {
    n: "08",
    name: "Pricing that matches the work",
    whatItIs:
      "Charging for outcomes, access, or standing capability rather than only for time and seats.",
    fieldPattern:
      "Moving, unevenly. Outcome-linked and subscription arrangements are appearing at the top of the market, usually where an instrument makes the outcome measurable.",
    standing: "partial",
    position:
      "Seats and cohorts are priced well and sell out, which is real evidence of demand. What is missing is a recurring line that is not tied to an event on a calendar.",
    builtHere:
      "Revalidation is naturally recurring. Approval expires when the model version, the contract, or the supervising professional changes, and something has to re-earn it.",
    needsScale: false,
  },
  {
    n: "09",
    name: "Own-practice leverage",
    whatItIs:
      "Using the same methods internally that you sell externally, and being able to show it.",
    fieldPattern:
      "Increasingly table stakes. Practices that cannot demonstrate internal adoption get asked why.",
    standing: "partial",
    position:
      "The claim exists in marketing. What does not exist publicly is the proof: a named workflow, a measured before and after, a result anyone can check.",
    needsScale: false,
  },
  {
    n: "10",
    name: "Research arm",
    whatItIs: "Dedicated capacity producing original studies at publication scale.",
    fieldPattern:
      "Real, expensive, and genuinely gated by headcount. This is the one layer on this list that a two-person firm should not try to own.",
    standing: "open",
    position:
      "Correctly skipped. Partnering with the associations that already publish is cheaper, faster, and lends more credibility than building a research function.",
    needsScale: true,
  },
];

export interface StackFinding {
  title: string;
  body: string;
}

export const FINDINGS: StackFinding[] = [
  {
    title: "The front of the funnel is unusually complete",
    body: "Point of view, diagnostic, education, community, convening. Four are fully owned and the fifth is a paid room that sells out. Most practices of any size never finish this ladder, and many large ones cannot build the community layer credibly at all.",
  },
  {
    title: "The gap is delivery, not marketing",
    body: "Everything above happens before and around the work. What runs during the work is still a person in a room rebuilding the same argument. That is the layer where scale currently wins, and it is the layer that code closes rather than headcount.",
  },
  {
    title: "Nothing yet compounds",
    body: "The assessment does not know about the cohort. The cohort does not know about the follow-up. Engagement forty starts where engagement one did. This is the most valuable gap on the list because it is the only one that gets worse by waiting.",
  },
  {
    title: "Two layers are worth skipping on purpose",
    body: "A research arm needs headcount that does not exist and would not pay for itself. Becoming a software vendor would contradict a stated position and add a maintenance burden. Neither is a gap. Both are correct refusals.",
  },
];
