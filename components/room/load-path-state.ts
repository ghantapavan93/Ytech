import {
  ATLAS_BASELINE,
  type EngineOutput,
  type Levers,
} from "@/lib/engines/engine";

/**
 * The firm's operating system read as a structural load path.
 *
 * Six members, top to bottom. Released capacity enters at the agent and
 * reaches business value only where something carries it. Each member has a
 * state the engine decides, and the whole point of drawing it this way is
 * that the failure is visible before any of it is read: the top member is
 * green because the agent genuinely worked, and something further down is
 * bowing or leaking.
 *
 * This is derived rather than authored. Nothing here decides anything; it
 * translates one engine run into the six readings the section draws.
 */

export type MemberState = "ok" | "strained" | "failing" | "inert";

export interface Member {
  id: string;
  label: string;
  /** The reading, in the member's own units. */
  value: string;
  /** What that reading means, in the fewest words that stay true. */
  note: string;
  state: MemberState;
  /**
   * How far this member is past what it can carry, 0–1. Drives the visible
   * bow. Only the review member ever bends; everything else stays straight
   * and communicates through colour and the width of the load it passes.
   */
  overload: number;
  /** Share of the entering load this member passes down, 0–1. */
  passes: number;
  /** Load that leaves sideways here rather than travelling on. */
  leak: number;
}

const hrs = (n: number) => `${Math.round(n)}h`;

export function loadPath(out: EngineOutput, levers: Levers): Member[] {
  const released = out.jrRedeployedHours + out.jrSavedHoursUnused;
  const sustainable = ATLAS_BASELINE.pePillarSustainableHrsPerWeek;
  const keepsSaving = levers.pricingModel !== "TM_100";

  // The fee gate passes what the firm gets to keep. Under hourly billing an
  // hour not drafted is an hour not billed, so the saving stops here even
  // when the hours themselves were routed somewhere useful.
  const feePasses = keepsSaving ? 1 : 0;
  const routed = released > 0 ? out.jrRedeployedHours / released : 0;
  const reviewRatio = out.peHoursPerWeek / sustainable;
  const arriving = keepsSaving ? out.jrRedeployedHours : 0;

  return [
    {
      id: "agent",
      label: "AGENT PERFORMANCE",
      value: `−${Math.round(levers.aiSpeedupPct * 100)}%`,
      note: levers.aiEnabled
        ? "every technical test passed"
        : "not switched on yet",
      state: levers.aiEnabled ? "ok" : "inert",
      overload: 0,
      passes: 1,
      leak: 0,
    },
    {
      id: "capacity",
      label: "PRODUCTION CAPACITY",
      value: hrs(released),
      note: released > 0 ? "freed, looking for a home" : "nothing freed yet",
      state: released > 0 ? "ok" : "inert",
      overload: 0,
      passes: routed,
      leak: 1 - routed,
    },
    {
      id: "fee",
      label: "FEE MODEL",
      value: keepsSaving ? "FIXED FEE" : "HOURLY",
      note: keepsSaving
        ? "the firm keeps the saving"
        : "the client keeps the saving",
      state: released === 0 ? "inert" : keepsSaving ? "ok" : "failing",
      overload: 0,
      passes: feePasses,
      leak: keepsSaving ? 0 : 1,
    },
    {
      id: "review",
      label: "REVIEWER CAPACITY",
      value: `${out.peHoursPerWeek.toFixed(1)}h`,
      note:
        reviewRatio > 1
          ? `past the ${sustainable}h it can carry`
          : `inside the ${sustainable}h it can carry`,
      state: out.liabilityBreach
        ? "failing"
        : reviewRatio > 1.15
          ? "failing"
          : reviewRatio > 1
            ? "strained"
            : "ok",
      overload: Math.max(0, Math.min(1, reviewRatio - 1)),
      passes: 1,
      leak: 0,
    },
    {
      id: "talent",
      label: "TALENT DEVELOPMENT",
      value: `${Math.round(out.learningIndexPct)}%`,
      note:
        out.learningIndexPct === 0
          ? "no junior learns this now"
          : "of the practice hours juniors had",
      state:
        out.learningIndexPct === 0
          ? "failing"
          : out.learningIndexPct < 60
            ? "strained"
            : "ok",
      overload: 0,
      passes: 1,
      leak: 0,
    },
    {
      id: "value",
      label: "BUSINESS VALUE",
      value: hrs(arriving),
      note:
        arriving > 0
          ? "reached the foundation"
          : "nothing reached the base",
      state: out.deltaMargin > 0 ? "ok" : arriving > 0 ? "strained" : "failing",
      overload: 0,
      passes: 1,
      leak: 0,
    },
  ];
}

/** The one sentence the section exists to earn. */
export function verdictLine(out: EngineOutput): string {
  if (out.deltaMargin > 0) {
    return "The technology carried the task, and the operating model carried the value.";
  }
  return "The technology carried the task. The operating model could not carry the value.";
}
