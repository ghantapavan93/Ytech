"use client";

import {
  EVIDENCE,
  evaluateProgress,
  type Decision,
  type Evidence,
  type ProgressResult,
} from "@/lib/engines/progress-engine";
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";

/**
 * The run: four acts, and the rules for moving between them.
 *
 * All of the state lives here so the acts stay presentational. The only
 * thing worth reading twice is the log, which appends when the decision
 * changes rather than when the evidence does. A reading that leaves the
 * verdict where it was is not a move, and the audit trail should not
 * pretend otherwise.
 */

export type Stage = "dashboard" | "tracing" | "verdict" | "day30";

export interface DecisionLogEntry {
  decision: Decision;
  cause: string;
}

export interface ProgressRun {
  stage: Stage;
  revealed: number;
  applied: string[];
  log: DecisionLogEntry[];
  result: ProgressResult;
  /** True once the whole chain has been shown. */
  traced: boolean;
  verdictRef: RefObject<HTMLDivElement | null>;
  day30Ref: RefObject<HTMLDivElement | null>;
  startTrace: () => void;
  openDay30: () => void;
  toggle: (evidence: Evidence) => void;
  clearReadings: () => void;
  reset: () => void;
}

export function useProgressRun(): ProgressRun {
  const [stage, setStage] = useState<Stage>("dashboard");
  const [revealed, setRevealed] = useState(0);
  const [applied, setApplied] = useState<string[]>([]);
  const [log, setLog] = useState<DecisionLogEntry[]>([]);

  const result = useMemo(() => evaluateProgress(applied), [applied]);
  const traced = stage === "verdict" || stage === "day30";

  const verdictRef = useRef<HTMLDivElement>(null);
  const day30Ref = useRef<HTMLDivElement>(null);

  /* the trace, one link at a time */
  useEffect(() => {
    if (stage !== "tracing") return;
    if (revealed >= result.layers.length) {
      const t = setTimeout(() => setStage("verdict"), 700);
      return () => clearTimeout(t);
    }
    // The first two links are the flattering ones. Move through them
    // quickly, then slow down where the chain stops being flattering.
    const t = setTimeout(() => setRevealed((r) => r + 1), revealed < 2 ? 420 : 720);
    return () => clearTimeout(t);
  }, [stage, revealed, result.layers.length]);

  /* bring each new act into view once it mounts */
  useEffect(() => {
    const target =
      stage === "verdict" ? verdictRef : stage === "day30" ? day30Ref : null;
    if (!target) return;
    const t = setTimeout(
      () => target.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      140,
    );
    return () => clearTimeout(t);
  }, [stage]);

  /* record every time the decision actually changes */
  const lastDecision = useRef<Decision | null>(null);
  useEffect(() => {
    if (!traced) return;
    if (lastDecision.current === result.decision) return;
    const cause =
      lastDecision.current === null
        ? "Opening evidence, day zero"
        : applied.length === 0
          ? "All readings cleared"
          : (EVIDENCE.find((e) => e.id === applied[applied.length - 1])?.label ??
            "Evidence changed");
    lastDecision.current = result.decision;
    setLog((l) => [...l, { decision: result.decision, cause }]);
  }, [result.decision, traced, applied]);

  const toggle = useCallback((evidence: Evidence) => {
    setApplied((prev) => {
      if (prev.includes(evidence.id)) return prev.filter((id) => id !== evidence.id);
      // Two readings of the same link cannot both stand. The newer wins.
      const sameLink = EVIDENCE.filter((e) => e.layer === evidence.layer).map(
        (e) => e.id,
      );
      return [...prev.filter((id) => !sameLink.includes(id)), evidence.id];
    });
  }, []);

  const startTrace = useCallback(() => setStage("tracing"), []);
  const openDay30 = useCallback(() => setStage("day30"), []);
  const clearReadings = useCallback(() => setApplied([]), []);

  const reset = useCallback(() => {
    setApplied([]);
    setStage("dashboard");
    setRevealed(0);
    setLog([]);
    lastDecision.current = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return {
    stage,
    revealed,
    applied,
    log,
    result,
    traced,
    verdictRef,
    day30Ref,
    startTrace,
    openDay30,
    toggle,
    clearReadings,
    reset,
  };
}
