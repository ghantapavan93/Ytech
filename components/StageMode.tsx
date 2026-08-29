"use client";

import {
  ATLAS_BASELINE,
  NAIVE_DEPLOYMENT,
  runEngine,
} from "@/lib/engines/engine";
import { fmtMoney } from "@/lib/format";
import { PRESETS } from "@/lib/presets";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Stage mode.
 *
 * Sam speaks to rooms. A page that reads well on a laptop is not the same
 * object as something that survives a projector at the back of a hall, so
 * this is the argument at room scale: no navigation, no body copy, one
 * figure per slide, advanced with the spacebar.
 *
 * Every number here is computed by the same engine the site runs on rather
 * than typed into a slide. If a lever changes, the talk changes with it,
 * which is the only reason a presentation mode belongs in an instrument
 * instead of in a deck.
 */

interface Slide {
  kicker: string;
  figure?: string;
  headline: string;
  note?: string;
  tone: "claim" | "warn" | "crit" | "ok" | "plain";
}

const TONE: Record<Slide["tone"], { figure: string; kicker: string }> = {
  claim: { figure: "claim-figure", kicker: "text-zinc-500" },
  warn: { figure: "text-warn", kicker: "text-warn/70" },
  crit: { figure: "text-crit", kicker: "text-crit/70" },
  ok: { figure: "text-ok", kicker: "text-ok/70" },
  plain: { figure: "text-zinc-100", kicker: "text-zinc-500" },
};

function useSlides(): Slide[] {
  return useMemo(() => {
    const naive = runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT);
    const governedLevers = PRESETS.find((p) => p.id === "governed-firm")!.levers;
    const governed = runEngine(ATLAS_BASELINE, governedLevers);

    const released = Math.round(
      naive.jrRedeployedHours + naive.jrSavedHoursUnused,
    );
    const sustainable = ATLAS_BASELINE.pePillarSustainableHrsPerWeek;

    return [
      {
        kicker: "The pilot report",
        figure: `${Math.round(NAIVE_DEPLOYMENT.aiSpeedupPct * 100)}%`,
        headline: "less drafting time.",
        note: "The technology passed every test it was given.",
        tone: "claim",
      },
      {
        kicker: "Where it went",
        figure: `${released}h`,
        headline: "released every month.",
        note: "The firm had nowhere valuable for any of it to go.",
        tone: "warn",
      },
      {
        kicker: "The bottleneck moved",
        figure: `${naive.peHoursPerWeek.toFixed(1)}h`,
        headline: `of licensed review a week, against ${sustainable} the desk can sustain.`,
        note: "Automating the drafting did not remove the verification. It created more of it.",
        tone: "crit",
      },
      {
        kicker: "The verdict",
        figure: `${fmtMoney(naive.deltaMargin, { sign: true })}`,
        headline: "a month.",
        note: "The technology worked. The operating system rejected it.",
        tone: "crit",
      },
      {
        kicker: "Four conditions, changed",
        headline: "Fixed fee. Freed capacity routed to backlog. A risk-tiered review gate. A protected practice floor.",
        note: "None of these is a technology decision. Every one is a leadership decision.",
        tone: "plain",
      },
      {
        kicker: "The same agent",
        figure: `${fmtMoney(governed.deltaMargin, { sign: true })}`,
        headline: "a month.",
        note: "Same agent. Same speed. A different operating system around it.",
        tone: "ok",
      },
      {
        kicker: "Six weeks later",
        headline: "The agent still works. The authorization does not.",
        note: "The owner left, review ran past its budget, and a contract narrowed the data it was cleared for. Nothing about the tool changed.",
        tone: "warn",
      },
      {
        kicker: "The question",
        headline:
          "Your dashboard tells the board that AI is growing. This tells the board whether the business moved.",
        tone: "plain",
      },
    ];
  }, []);
}

export function StageMode({ onClose }: { onClose: () => void }) {
  const slides = useSlides();
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, slides.length - 1)),
    [slides.length],
  );
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    // Real fullscreen where the browser allows it. A refusal is not an
    // error: the overlay already covers the viewport on its own.
    document.documentElement.requestFullscreen?.().catch(() => {});
    return () => {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === " " || e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  const slide = slides[index];
  const tone = TONE[slide.tone];

  // Rendered through a portal on purpose.
  //
  // The trigger lives in the sticky header, and that header carries a
  // backdrop filter. A backdrop filter establishes a containing block, so a
  // position:fixed child is laid out against the header rather than the
  // viewport: the overlay ended up trapped in the top strip with the page
  // showing through it. Escaping to the body is the fix.
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-canvas"
      role="dialog"
      aria-modal="true"
      aria-label="Stage presentation"
    >
      <div className="flex items-center justify-between px-6 py-4 sm:px-10">
        <span className="text-[11px] font-bold tracking-[0.2em] text-zinc-700">
          VALUE&nbsp;SHIFT
        </span>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-[11px] text-zinc-600 transition-colors hover:border-line-strong hover:text-zinc-300"
        >
          <X size={12} />
          esc
        </button>
      </div>

      <div
        className="flex flex-1 cursor-pointer items-center px-8 sm:px-16 lg:px-24"
        onClick={next}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl"
          >
            <p
              className={`text-[13px] font-semibold uppercase tracking-[0.22em] sm:text-[15px] ${tone.kicker}`}
            >
              {slide.kicker}
            </p>

            {slide.figure && (
              <p
                className={`mono-num mt-6 text-[19vw] font-semibold leading-[0.82] tracking-[-0.045em] sm:text-[15vw] lg:text-[12vw] ${tone.figure}`}
              >
                {slide.figure}
              </p>
            )}

            <p
              className={`mt-6 font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-100 ${
                slide.figure
                  ? "text-[6vw] sm:text-[4vw] lg:text-[3.1vw]"
                  : "text-[7vw] sm:text-[5vw] lg:text-[3.9vw]"
              }`}
            >
              {slide.headline}
            </p>

            {slide.note && (
              <p className="mt-7 max-w-3xl text-[3.4vw] leading-relaxed text-zinc-500 sm:text-[2vw] lg:text-[1.35vw]">
                {slide.note}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.kicker}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-8 bg-zinc-300" : "w-4 bg-zinc-700 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>
        <p className="mono-num text-[11px] text-zinc-700">
          {index + 1} / {slides.length} · space to advance
        </p>
      </div>
    </div>,
    document.body,
  );
}
