import type { PillarStatus, SystemStatus } from "@/lib/engines/engine";

export interface StatusStyle {
  /** Accent hex for glows, rails, and dots. */
  hex: string;
  text: string;
  border: string;
  bgTint: string;
  chipLabel: string;
}

export const PILLAR_STYLE: Record<PillarStatus, StatusStyle> = {
  OK: {
    hex: "#10b981",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
    bgTint: "bg-emerald-500/[0.06]",
    chipLabel: "STABLE",
  },
  WARN: {
    hex: "#f59e0b",
    text: "text-amber-400",
    border: "border-amber-500/40",
    bgTint: "bg-amber-500/[0.06]",
    chipLabel: "FRICTION",
  },
  CRITICAL: {
    hex: "#f43f5e",
    text: "text-rose-400",
    border: "border-rose-500/40",
    bgTint: "bg-rose-500/[0.10]",
    chipLabel: "CRITICAL",
  },
};

export const SYSTEM_STYLE: Record<
  SystemStatus,
  StatusStyle & { verdict: string }
> = {
  OPTIMAL_GOVERNANCE: {
    hex: "#10b981",
    text: "text-emerald-400",
    border: "border-emerald-500/40",
    bgTint: "bg-emerald-500/[0.06]",
    chipLabel: "OPTIMAL GOVERNANCE",
    verdict: "THE OPERATING SYSTEM NOW PERMITS THE VALUE TO EXIST.",
  },
  WARNING_FRICTION: {
    hex: "#f59e0b",
    text: "text-amber-400",
    border: "border-amber-500/40",
    bgTint: "bg-amber-500/[0.06]",
    chipLabel: "WARNING · FRICTION",
    verdict: "THE ECONOMICS HOLD, BUT THE SYSTEM IS STILL FIGHTING THE AGENT.",
  },
  CRITICAL_REJECTION: {
    hex: "#f43f5e",
    text: "text-rose-400",
    border: "border-rose-500/40",
    bgTint: "bg-rose-500/[0.10]",
    chipLabel: "CRITICAL REJECTION",
    verdict: "THE TECHNOLOGY WORKED. THE OPERATING SYSTEM REJECTED IT.",
  },
};
