import {
  ATLAS_BASELINE,
  NAIVE_DEPLOYMENT,
  runEngine,
  type Levers,
} from "@/lib/engines/engine";
import { PRESETS } from "@/lib/presets";

/**
 * The run, in six acts.
 *
 * One causal load travels through a firm and the reader watches what happens
 * to it. The load path is the only object on screen throughout; the acts are
 * what changes around it.
 *
 * The levers are the important part. Acts one to three run the naive
 * deployment, acts four to six run the governed one, so the reroute at act
 * four is the same engine recomputing rather than a second drawing swapped
 * in. Nothing here is narrated over a static picture.
 */

export const GOVERNED_LEVERS: Levers = PRESETS.find(
  (p) => p.id === "governed-firm",
)!.levers;

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

const naive = runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT);
const governed = runEngine(ATLAS_BASELINE, GOVERNED_LEVERS);

const released = Math.round(naive.jrRedeployedHours + naive.jrSavedHoursUnused);
const sustainable = ATLAS_BASELINE.pePillarSustainableHrsPerWeek;

export const ACTS: Act[] = [
  {
    n: "01",
    kicker: "The claim",
    headline: "42% less drafting time. The technical test passed.",
    body: "Atlas Structural & Civil built a specification-QA agent and ran it across twenty submittal packages a month. Every acceptance case was met. A software demonstration stops at this slide and tells the firm to deploy.",
    levers: NAIVE_DEPLOYMENT,
    advance: "Follow the time through the firm",
  },
  {
    n: "02",
    kicker: "The load",
    headline: `${released} hours released. Almost none of it lands anywhere.`,
    body: `Released capacity does not evaporate, it travels. Under hourly billing an hour not drafted is an hour not billed, so the fee gate stops the load before it reaches value. What is not routed to backlog runs to ground as slack. The structure is carrying almost nothing.`,
    levers: NAIVE_DEPLOYMENT,
    advance: "Watch the review desk",
  },
  {
    n: "03",
    kicker: "The member that fails",
    headline: `Licensed review at ${naive.peHoursPerWeek.toFixed(1)} hours a week against ${sustainable} it can sustain.`,
    body: "Automating the drafting did not remove the verification, it created more of it. Juniors forward raw output, reviewers stop trusting the flags and re-read whole packages, and the load lands on the one desk that cannot delegate. That member is past capacity, so it bows.",
    levers: NAIVE_DEPLOYMENT,
    advance: "See what it costs",
  },
  {
    n: "04",
    kicker: "The contradiction",
    headline: "The agent worked. The operating system rejected it.",
    body: `The technology did what it promised and the firm is ${Math.abs(naive.deltaMargin).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} a month worse off. Every red member is a leadership design decision rather than a technology failure, which means every one of them can be changed.`,
    levers: NAIVE_DEPLOYMENT,
    advance: "Change three conditions",
  },
  {
    n: "05",
    kicker: "The redesign",
    headline: "Same agent. Same speed. The load reroutes.",
    body: `Fixed fee, so the firm keeps what it saves. Freed capacity routed to billable backlog instead of slack. A risk-tiered gate, so the reviewer sees flagged clauses rather than whole packages. A protected practice floor, so juniors still learn to read a specification. The structure now carries the load, and the firm is ${governed.deltaMargin.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} a month better off.`,
    levers: GOVERNED_LEVERS,
    advance: "So deploy it?",
  },
  {
    n: "06",
    kicker: "The decision",
    headline: "No. Continue as a bounded thirty-day experiment.",
    body: "A working model of the economics is not evidence that the economics happened. Quality was never measured, and an unmeasured link does not pass, it blocks. What the instrument produces is not a deployment. It is an experiment with a named owner, measurable conditions, and a stop rule.",
    levers: GOVERNED_LEVERS,
  },
];
