/**
 * What the field actually prices.
 *
 * Eight offers that recur across independent AI advisory practices, with
 * ranges taken only from prices those firms publish on their own pages.
 * No firm is named here. The ranges are the useful part; who charges what
 * is not.
 *
 * The "here" column is an honest read of what this practice already sells
 * against each pattern, and it is the reason the page exists.
 */

export type Held = "sold" | "free" | "absent";

export interface Offer {
  n: string;
  name: string;
  shape: string;
  /** Published ranges, lowest to highest observed. */
  range: string;
  held: Held;
  note: string;
  /** True where the offer needs accumulated evidence to sell honestly. */
  needsEvidence: boolean;
}

export const HELD_LABEL: Record<Held, string> = {
  sold: "Sold today",
  free: "Given away",
  absent: "Not offered",
};

export const OFFERS: Offer[] = [
  {
    n: "01",
    name: "Paid diagnostic",
    shape:
      "Two to four weeks, scored across five to eight dimensions, ending in a written report and a roadmap.",
    range: "$750 to $1,500 as a tripwire, $15,000 to $75,000 at the independent tier",
    held: "free",
    note: "The entry diagnostic here is free and scored automatically. That builds a list, which is a real asset, but the paid version of this same product is the most common first invoice in the market. The gap between a free score and a paid inspection is the deliverable, not the questions.",
    needsEvidence: false,
  },
  {
    n: "02",
    name: "Roadmap sprint",
    shape:
      "The diagnostic plus workshops. Scored use cases, a data and access map, a written go or no-go.",
    range: "$1,500 at the solo end to $25,000 at the boutique end",
    held: "absent",
    note: "Prices for near-identical deliverables span more than tenfold across the market, which says the number tracks buyer size rather than scope. Worth knowing before quoting.",
    needsEvidence: false,
  },
  {
    n: "03",
    name: "Fixed-scope pilot",
    shape:
      "One workflow, two to four weeks, before-and-after numbers. Often refundable in part if it fails.",
    range: "$4,800 to $12,000",
    held: "absent",
    note: "The best-converting second step in the market, and the natural product to wrap around a wind-tunnel run that says proceed.",
    needsEvidence: false,
  },
  {
    n: "04",
    name: "Production build",
    shape:
      "Ninety days to a working system with an evaluation harness and observability.",
    range: "$40,000 to $250,000",
    held: "absent",
    note: "Where the money is, and correctly declined here. Selling builds contradicts a stated position and adds a maintenance burden two people cannot carry.",
    needsEvidence: false,
  },
  {
    n: "05",
    name: "Fractional AI leadership",
    shape:
      "A fixed monthly fee, no hour cap, a ninety-day roadmap in the first month, one board-ready artefact each quarter, three-month minimum.",
    range: "$7,500 to $35,000 per month",
    held: "absent",
    note: "The highest-value recurring offer in the independent market and the most conspicuous absence here. The product is access and cadence rather than intellectual property, so it needs no new asset to launch.",
    needsEvidence: false,
  },
  {
    n: "06",
    name: "Standing operations retainer",
    shape: "Keeping what was built working, under an agreed response standard.",
    range: "$3,200 to $25,000 per month",
    held: "absent",
    note: "The only genuinely recurring line most independent practices have. Everything sold here today is tied to a date on a calendar, which means revenue restarts from zero every cycle.",
    needsEvidence: false,
  },
  {
    n: "07",
    name: "Cohort training",
    shape:
      "Six to twelve weeks, ending in something the participants built.",
    range: "$4,200 per seat, or $19,500 to $35,000 for a whole company",
    held: "sold",
    note: "Already strong. Worth noting that per-company pricing beats per-seat for a two-person practice: one delivery, one invoice, same effort. The self-paced course sitting free underneath it is the clearest unmonetised asset here.",
    needsEvidence: false,
  },
  {
    n: "08",
    name: "Governance package",
    shape:
      "A policy aligned to a named standard, a risk register, a control framework.",
    range: "$15,000 one-time, or $3,000 to $5,000 per month",
    held: "absent",
    note: "Sells on regulation rather than ambition, which means it survives budget freezes. The licensure research already assembled here would carry most of the content.",
    needsEvidence: false,
  },
];

export interface EvidenceGatedOffer {
  name: string;
  why: string;
}

/**
 * The offers that cannot be launched by packaging alone. Each one needs a
 * body of prior engagements behind it, which is the argument for building
 * the evidence layer before the offers that depend on it.
 */
export const EVIDENCE_GATED: EvidenceGatedOffer[] = [
  {
    name: "Peer benchmarks",
    why: "Telling a firm it scores below the median for its size requires a median, which requires enough comparable engagements to have one. This is repeatedly named as the structural weakness of small practices against large ones, and it is the only one that closes purely by accumulating.",
  },
  {
    name: "Guarantees with numbers in them",
    why: "Three quick wins or your money back. Ten hours a week or the fee is waived. These are priced off priors, so a guarantee is really an advertisement that you have data nobody else has. It is the most commercially direct use of an evidence library.",
  },
  {
    name: "Reusable accelerators",
    why: "Named assets built from prior work, sold as a head start rather than a service. They require prior builds to exist at all.",
  },
  {
    name: "A vertical constraint library",
    why: "Roughly ten engagements inside one industry accumulate the failure modes, constraints, and vocabulary that a generalist cannot acquire in six months. The specialism is already chosen here, which is the hard part. What is missing is the harvesting.",
  },
];

export const ORDER_OF_OPERATIONS =
  "The order that falls out of the evidence is unintuitive. Sell the packaged offers first, because they need no new asset. Instrument the delivery while selling them. Then let the packaging manufacture the intellectual property, rather than waiting to have the intellectual property before selling.";
