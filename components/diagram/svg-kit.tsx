"use client";

/**
 * The shared parts of every diagram.
 *
 * One rule holds all of them together: a diagram states its own numbers.
 * Labels live inside the drawing, not in a legend beneath it, because a
 * reader should never have to hold the picture and its key in their head at
 * the same time. That single constraint is why these replaced a set of WebGL
 * scenes which were correct and unreadable.
 *
 * Each figure also carries its reading in prose. That text is what a screen
 * reader and a printed page receive, and the rule behind it has not changed:
 * if a fact exists only in the drawing, it is not on the page.
 */

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { ENTER_EASE } from "@/lib/motion";
import type { ReactNode } from "react";

/** The one curve, defined in lib/motion and re-exported so figures share it. */
export const EASE = ENTER_EASE;

/** State means the same thing in every drawing on the site. */
export const D = {
  claim: "#cdf94a",
  ok: "#10b981",
  warn: "#f59e0b",
  crit: "#f43f5e",
  live: "#06b6d4",
  track: "rgba(255,255,255,0.07)",
  trackLine: "rgba(255,255,255,0.16)",
  label: "rgba(255,255,255,0.42)",
  value: "rgba(255,255,255,0.92)",
  dim: "rgba(255,255,255,0.28)",
};

export const MONO = "var(--font-geist-mono), ui-monospace, monospace";

/** Type inside a drawing. Four sizes, so the figures share a voice. */
export const T = { micro: 7.5, label: 8.5, body: 10, figure: 14 } as const;

const IN_VIEW = { once: true, margin: "-40px" } as const;

/**
 * Entrance for a group. Under reduced motion the element is simply present,
 * which is the finished state rather than a frozen first frame.
 */
export function reveal(delay: number, reduced: boolean | null) {
  if (reduced) return { initial: false as const };
  return {
    initial: { opacity: 0, y: 6 },
    whileInView: { opacity: 1, y: 0 },
    viewport: IN_VIEW,
    transition: { delay, duration: 0.5, ease: EASE } as Transition,
  };
}

/** A bar that grows to its measured width. */
export function grow(width: number, delay: number, reduced: boolean | null) {
  if (reduced) return { initial: false as const, animate: { width } };
  return {
    initial: { width: 0 },
    whileInView: { width },
    viewport: IN_VIEW,
    transition: { delay, duration: 0.7, ease: EASE } as Transition,
  };
}

/** A stroke that draws itself. */
export function draw(delay: number, reduced: boolean | null) {
  if (reduced) return { initial: false as const };
  return {
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: IN_VIEW,
    transition: { delay, duration: 0.8, ease: EASE } as Transition,
  };
}

export { motion, useReducedMotion };

/**
 * The frame a diagram sits in: the drawing, then its reading in words.
 */
export function SvgFigure({
  caption,
  description,
  children,
  className = "",
}: {
  caption: string;
  /** Written so it survives without the drawing. */
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`card overflow-hidden ${className}`}>
      <div className="figure-pan px-4 pt-5 sm:px-6">{children}</div>
      <figcaption className="mt-2 border-t border-line px-5 py-4">
        <p className="text-[13px] font-medium text-ink-2">{caption}</p>
        <p className="diagram-reading mt-1.5 text-[13px] leading-relaxed text-ink-4">
          {description}
        </p>
      </figcaption>
    </figure>
  );
}
