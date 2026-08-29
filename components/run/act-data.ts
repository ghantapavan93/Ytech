import {
  ATLAS_BASELINE,
  NAIVE_DEPLOYMENT,
  runEngine,
  type Levers,
} from "@/lib/engines/engine";
import { PRESETS } from "@/lib/presets";

/**
 * The run, act by act.
 *
 * One causal load travels through a firm and the reader watches what happens
 * to it. The load path is the only object on screen throughout; the acts are
 * what changes around it.
 *
 * Every act changes exactly one thing about the operating model, and the
 * structure recomputes through the same engine. That constraint is the whole
 * design: an earlier version ran four acts on identical levers and one act
 * that flipped everything at once, so the copy claimed a member was buckling
 * while the drawing had been bowed since the first frame. Narrating a change
 * that already happened is the failure this file exists to prevent.
 */

export const GOVERNED_LEVERS: Levers = PRESETS.find(
  (p) => p.id === "governed-firm",
)!.levers;

/** The firm before any of this. Nothing released, nothing under strain. */
export const BEFORE: Levers = { ...NAIVE_DEPLOYMENT, aiEnabled: false };

/** Each lever lands on top of the one before it. */
const FEE: Levers = { ...NAIVE_DEPLOYMENT, pricingModel: "FIXED_FEE" };
const CAPACITY: Levers = { ...FEE, backlogRedeploymentPct: 1 };
const REVIEW: Levers = { ...CAPACITY, reviewArchitecture: "TIERED_DELTA_GATE" };
const PRACTICE: Levers = {
  ...REVIEW,
  apprenticeshipSafeguard: "BLIND_AUDIT_20_PCT",
};

/** Applying all four in order must land exactly on the governed preset. */
export const FULLY_RETUNED = PRACTICE;

export interface Act {
  n: string;
  kicker: string;
  headline: string;
  body: string;
  /** Which operating model the load path runs under during this act. */
  levers: Levers;
  /** What the reader clicks to move on. Absent on the last act. */
  advance?: string;
}

const at = (levers: Levers) => runEngine(ATLAS_BASELINE, levers);
const money = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
const released = (o: ReturnType<typeof at>) =>
  Math.round(o.jrRedeployedHours + o.jrSavedHoursUnused);

const before = at(BEFORE);
const naive = at(NAIVE_DEPLOYMENT);
const fee = at(FEE);
const capacity = at(CAPACITY);
const review = at(REVIEW);
const practice = at(PRACTICE);

const sustainable = ATLAS_BASELINE.pePillarSustainableHrsPerWeek;

export const ACTS: Act[] = [
  {
    n: "01",
    kicker: "The firm before",
    headline: "Twenty submittal packages a month, and a structure at rest.",
    body: `Atlas Structural & Civil, a synthetic 45-person practice. Nothing is automated yet. Licensed review sits at ${before.peHoursPerWeek.toFixed(1)} hours a week, inside the ${sustainable} the desk can carry, and no capacity is being released because none has been freed. This is the structure before any load is applied to it.`,
    levers: BEFORE,
    advance: "Switch the agent on",
  },
  {
    n: "02",
    kicker: "The load arrives",
    headline: `${released(naive)} hours released. Watch the review member.`,
    body: `The agent cuts drafting time by 42% and every technical test passes. But the verification did not go away, it multiplied: juniors forward raw output, reviewers stop trusting the flags and re-read whole packages, and licensed review climbs to ${naive.peHoursPerWeek.toFixed(1)} hours a week against ${sustainable} it can sustain. That member is now past capacity, so it bows. Meanwhile the released hours run to ground, because nothing routes them anywhere.`,
    levers: NAIVE_DEPLOYMENT,
    advance: "See what it costs",
  },
  {
    n: "03",
    kicker: "The contradiction",
    headline: "The agent worked. The operating system rejected it.",
    body: `The technology did what it promised and the firm is ${money(Math.abs(naive.deltaMargin))} a month worse off. Every failing member is a leadership design decision rather than a technology failure, which is the only reason any of this is fixable. Four conditions hold the structure up. We change them one at a time.`,
    levers: NAIVE_DEPLOYMENT,
    advance: "Lever one, the fee model",
  },
  {
    n: "04",
    kicker: "Lever one, pricing",
    headline: "Fixed fee. The gate opens, and nothing comes through it.",
    body: `Under hourly billing an hour not drafted is an hour not billed, so the fee gate was stopping the load. On a fixed fee per package the firm keeps what it saves and the gate turns green, which moves the monthly position to ${money(fee.deltaMargin)}. Watch the foundation though: still nothing arrives. An open gate carries no load while zero hours are being routed to it. One lever on its own is usually inert, which is why single-lever pilots fail and get blamed on the technology.`,
    levers: FEE,
    advance: "Lever two, where the hours go",
  },
  {
    n: "05",
    kicker: "Lever two, capacity",
    headline: `${released(capacity)} released hours, now routed to billable backlog.`,
    body: `Freed capacity that nobody assigns becomes slack, and slack shows up as falling utilization rather than as value. Routing those hours into backlog work carries them to the foundation instead of to ground, and now the gate opened in the last act finally has something to pass: the position moves to ${money(capacity.deltaMargin)}. Review is still over capacity and still bowing, because neither of these levers was ever its problem.`,
    levers: CAPACITY,
    advance: "Lever three, the review gate",
  },
  {
    n: "06",
    kicker: "Lever three, review",
    headline: `Licensed review back to ${review.peHoursPerWeek.toFixed(1)} hours a week. The member straightens.`,
    /*
     * The caveat is the point of this act, not a hedge on it.
     *
     * The tiered gate is budgeted at 1.0 hours a package against a manual
     * baseline of 3.0, which is the largest single assumption in the run and
     * the first thing a reviewer who works in this world will go after. Left
     * unsaid, it reads as the model quietly finding a two-thirds saving in
     * licensed review, which is the exact move the rest of the page argues
     * against. Said out loud, it is a budget the firm has to hold, and the
     * instrument's job is to show what happens when it cannot.
     */
    body: `A risk-tiered delta gate puts the reviewer in front of flagged clauses rather than whole packages. The stamp stays defensible and the load comes back inside what the desk can carry, so the bow comes out of the member while you watch. This is the lever that was actually failing, and it is the last one anybody reaches for. It is also the heaviest assumption on this page: ${review.peHoursPerPkg.toFixed(1)} hours a package against ${ATLAS_BASELINE.basePeHoursPerPkg.toFixed(1)} today is a budget the firm sets, not a saving the tool hands over, and a gate that cannot hold it puts the bow straight back.`,
    levers: REVIEW,
    advance: "The fourth condition",
  },
  {
    n: "07",
    kicker: "The practice floor",
    headline: `${money(practice.deltaMargin)} a month, and fewer hours released than before.`,
    body: `A 20% manual first pass keeps juniors reading specifications, which is how a firm grows the engineers who will hold the licence in ten years. It costs real released capacity: ${released(practice)} hours rather than ${released(review)}. The structure carries less load and is worth more, which is the trade the instrument exists to make visible.`,
    levers: PRACTICE,
    advance: "So deploy it?",
  },
  {
    n: "08",
    kicker: "The decision",
    headline: "No. Continue as a bounded thirty-day experiment.",
    body: "A working model of the economics is not evidence that the economics happened. Accepted-output quality was never measured, and an unmeasured link does not pass, it blocks. What this produces is not a deployment. It is an experiment with a named owner, measurable conditions, and a stop rule.",
    levers: PRACTICE,
  },
];

/**
 * The count, spelled out.
 *
 * "One load, one structure, 8 acts" mixes words and numerals inside one
 * phrase. Derived rather than typed, because the typed version said six for
 * two acts longer than it was true.
 */
const NUMERALS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve",
];
export const ACT_COUNT_WORD = NUMERALS[ACTS.length] ?? String(ACTS.length);
