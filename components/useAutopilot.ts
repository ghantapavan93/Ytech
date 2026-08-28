"use client";

import type { FirmBaseline, Levers } from "@/lib/engines/engine";
import { useCallback, useEffect, useRef, useState } from "react";

export interface AutopilotHandlers {
  /** Restore the naive starting state and collapse to stage 1. */
  reset: () => void;
  /** Reveal a stage (idempotent). */
  revealStage: (stage: number) => void;
  setLever: <K extends keyof Levers>(key: K, value: Levers[K]) => void;
  setBase: <K extends keyof FirmBaseline>(key: K, value: FirmBaseline[K]) => void;
}

export interface AutopilotState {
  active: boolean;
  /** True once the script has finished (end card is showing). */
  done: boolean;
  caption: string;
  stepIndex: number;
  totalSteps: number;
  /** Duration of the current step in ms (drives the progress bar). */
  stepMs: number;
  start: (speed?: number) => void;
  stop: () => void;
}

interface Step {
  caption: string;
  ms: number;
  run?: (h: AutopilotHandlers, raf: React.MutableRefObject<number>) => void;
}

function scrollToAnchor(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Ease the redeployment slider from 0 → 100% so the audience sees it move. */
function animateRedeploy(
  h: AutopilotHandlers,
  raf: React.MutableRefObject<number>,
  durationMs: number) {
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min((now - start) / durationMs, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    h.setLever("backlogRedeploymentPct", Math.round(eased * 20) / 20);
    if (t < 1) raf.current = requestAnimationFrame(tick);
  };
  raf.current = requestAnimationFrame(tick);
}

/**
 * The scripted 90-second run. Every step performs the same state changes a
 * human presenter would. The engine recalculates live. Nothing is canned.
 */
const SCRIPT: Step[] = [
  {
    caption:
      "Atlas Structural & Civil, a synthetic 45-person firm, built a spec-QA agent. It passed every technical test.",
    ms: 5500,
    run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
  {
    caption:
      "A software demo would stop here and say deploy. A wind tunnel asks what the firm's operating system does to that number.",
    ms: 5000,
  },
  {
    caption:
      "Propagate it. Under time-and-materials billing, every saved hour is un-billed revenue, the client keeps the speedup, the firm books the loss.",
    ms: 7000,
    run: (h) => {
      h.revealStage(2);
      setTimeout(() => scrollToAnchor("stage-2"), 120);
    },
  },
  {
    caption:
      "PE review surges 75%, the bottleneck moves to the one license that can stamp drawings. Junior utilization collapses to 53%. Apprenticeship goes dark.",
    ms: 7500,
  },
  {
    caption:
      "Verdict: −$9,170 a month. The technology worked. The operating system rejected it.",
    ms: 5500,
  },
  {
    caption:
      "None of this is a technology failure. Every red light is a leadership design decision, so re-tune the operating system, live.",
    ms: 5500,
    run: (h) => {
      h.revealStage(3);
      setTimeout(() => scrollToAnchor("stage-3"), 120);
    },
  },
  {
    caption: "Lever one, pricing. Fixed fee per package: the firm now keeps the time the agent saves.",
    ms: 5000,
    run: (h) => h.setLever("pricingModel", "FIXED_FEE"),
  },
  {
    caption: "Lever two, capacity. Freed junior hours flow into billable backlog instead of sitting idle.",
    ms: 5000,
    run: (h, raf) => animateRedeploy(h, raf, 1400),
  },
  {
    caption:
      "Lever three, review. A risk-tiered delta gate: the PE sees only flagged clauses. One hour per package, and the stamp stays defensible.",
    ms: 6000,
    run: (h) => h.setLever("reviewArchitecture", "TIERED_DELTA_GATE"),
  },
  {
    caption:
      "Lever four, apprenticeship. A 20% blind audit protects the judgment pipeline. It costs $5,880 a month, and the instrument prices that honestly.",
    ms: 6500,
    run: (h) => h.setLever("apprenticeshipSafeguard", "BLIND_AUDIT_20_PCT"),
  },
  {
    caption:
      "+$22,120 a month. Optimal governance. Same agent, same speed, a different operating system.",
    ms: 6000,
  },
  {
    caption:
      "The output is never a deployment. It's a bounded 30-day experiment, one accountable owner, verifiable targets, deterministic stop conditions.",
    ms: 7000,
    run: (h) => {
      h.revealStage(4);
      setTimeout(() => scrollToAnchor("stage-4"), 120);
    },
  },
  {
    caption:
      "And every run deposits one anonymized evidence node. One run is a demo. A library, across a cohort, is a moat.",
    ms: 7000,
    run: () => setTimeout(() => scrollToAnchor("stage-5"), 120),
  },
];

export function useAutopilot(handlers: AutopilotHandlers): AutopilotState {
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [caption, setCaption] = useState("");
  const [stepMs, setStepMs] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const speedRef = useRef(1);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  };

  const stop = useCallback(() => {
    clearTimers();
    setActive(false);
    setDone(false);
    setCaption("");
  }, []);

  const runStep = useCallback((index: number) => {
    if (index >= SCRIPT.length) {
      setDone(true);
      setCaption("");
      return;
    }
    const step = SCRIPT[index];
    setStepIndex(index);
    setCaption(step.caption);
    const ms = step.ms / speedRef.current;
    setStepMs(ms);
    step.run?.(handlersRef.current, rafRef);
    timerRef.current = setTimeout(() => runStep(index + 1), ms);
  }, []);

  const start = useCallback(
    (speed = 1) => {
      clearTimers();
      speedRef.current = speed;
      handlersRef.current.reset();
      setActive(true);
      setDone(false);
      // Give React one paint to collapse back to stage 1 before the script begins.
      timerRef.current = setTimeout(() => runStep(0), 350 / speed);
    },
    [runStep]);

  // Escape always hands control back to the human.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, stop]);

  useEffect(() => clearTimers, []);

  return {
    active,
    done,
    caption,
    stepIndex,
    totalSteps: SCRIPT.length,
    stepMs,
    start,
    stop,
  };
}
