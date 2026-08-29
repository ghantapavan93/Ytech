"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Framer Motion honours the reader's reduced-motion setting.
 *
 * globals.css already flattens CSS animations and transitions under
 * prefers-reduced-motion, and every SVG figure checks useReducedMotion and
 * draws a finished state instead of animating into one. None of that reached
 * Framer, which defaults to reducedMotion "never" and drives most of the
 * movement on the site: the act transitions, the epilogue, the reordering
 * rows on the triage board.
 *
 * "user" is the setting that defers to the operating system. It suppresses
 * transform and layout animation and leaves opacity alone, which is the
 * distinction that matters: fading is not what makes people ill, travelling
 * is.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
