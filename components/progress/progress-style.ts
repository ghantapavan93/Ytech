import type { Decision, LayerState } from "@/lib/engines/progress-engine";

/**
 * The colour vocabulary the instrument argues in.
 *
 * Three states and four decisions, defined once so the chain rows, the
 * verdict card, the status pill and the audit log cannot drift apart. Every
 * state also carries its own words, because colour alone is not an
 * accessible way to say "this link is the one blocking you".
 */

export const STATE_STYLE: Record<
  LayerState,
  { dot: string; ring: string; text: string; word: string }
> = {
  proven: {
    dot: "bg-ok",
    ring: "border-ok/30 bg-ok/[0.05]",
    text: "text-ok",
    word: "Measured, holds",
  },
  adverse: {
    dot: "bg-crit",
    ring: "border-crit/30 bg-crit/[0.05]",
    text: "text-crit",
    word: "Measured, against you",
  },
  unknown: {
    // Dashed, because this is an absence rather than a bad reading. The
    // absence is what blocks the decision, so it still has to read loud.
    dot: "bg-warn",
    ring: "border-warn/40 border-dashed bg-warn/[0.04]",
    text: "text-warn",
    word: "Never measured",
  },
};

export const DECISION_STYLE: Record<
  Decision,
  { text: string; dot: string; border: string; bg: string; glow: string }
> = {
  scale: {
    text: "text-ok",
    dot: "bg-ok",
    border: "border-ok/40",
    bg: "bg-ok/[0.06]",
    glow: "rgba(16,185,129,0.30)",
  },
  bounded: {
    text: "text-warn",
    dot: "bg-warn",
    border: "border-warn/40",
    bg: "bg-warn/[0.06]",
    glow: "rgba(245,158,11,0.30)",
  },
  redesign: {
    text: "text-crit",
    dot: "bg-crit",
    border: "border-crit/40",
    bg: "bg-crit/[0.06]",
    glow: "rgba(244,63,94,0.28)",
  },
  stop: {
    text: "text-crit",
    dot: "bg-crit",
    border: "border-crit/55",
    bg: "bg-crit/[0.09]",
    glow: "rgba(244,63,94,0.40)",
  },
};
