import type { Levers } from "./engines/engine";
import { NAIVE_DEPLOYMENT } from "./engines/engine";

/** Field-by-field lever equality, used to highlight the active preset chip. */
export function sameLevers(a: Levers, b: Levers): boolean {
  return (
    a.aiEnabled === b.aiEnabled &&
    a.aiSpeedupPct === b.aiSpeedupPct &&
    a.pricingModel === b.pricingModel &&
    a.backlogRedeploymentPct === b.backlogRedeploymentPct &&
    a.reviewArchitecture === b.reviewArchitecture &&
    a.apprenticeshipSafeguard === b.apprenticeshipSafeguard
  );
}

export interface Preset {
  id: string;
  label: string;
  tagline: string;
  levers: Levers;
}

/** One-click demo states for live presentation and reset. */
export const PRESETS: Preset[] = [
  {
    id: "tm-trap",
    label: "The T&M Trap",
    tagline: "42% less drafting time, dropped into an untouched operating model.",
    levers: { ...NAIVE_DEPLOYMENT },
  },
  {
    id: "pe-bottleneck",
    label: "The PE Bottleneck",
    tagline: "Pricing fixed, but every package still queues behind one license.",
    levers: {
      aiEnabled: true,
      aiSpeedupPct: 0.42,
      pricingModel: "FIXED_FEE",
      backlogRedeploymentPct: 0.5,
      reviewArchitecture: "FULL_MANUAL",
      apprenticeshipSafeguard: "NONE",
    },
  },
  {
    id: "false-economy",
    label: "The False Economy",
    tagline: "Best margin on paper, shipped on an unreviewed stamp.",
    levers: {
      aiEnabled: true,
      aiSpeedupPct: 0.42,
      pricingModel: "FIXED_FEE",
      backlogRedeploymentPct: 1,
      reviewArchitecture: "RAW_AI_UNGOVERNED",
      apprenticeshipSafeguard: "NONE",
    },
  },
  {
    id: "governed-firm",
    label: "The Governed Firm",
    tagline: "Fee model, review gate, incentives, and apprenticeship re-tuned.",
    levers: {
      aiEnabled: true,
      aiSpeedupPct: 0.42,
      pricingModel: "FIXED_FEE",
      backlogRedeploymentPct: 1,
      reviewArchitecture: "TIERED_DELTA_GATE",
      apprenticeshipSafeguard: "BLIND_AUDIT_20_PCT",
    },
  },
];
