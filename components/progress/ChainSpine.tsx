"use client";

import type { Layer, LayerState } from "@/lib/engines/progress-engine";
import { motion } from "framer-motion";

/**
 * The spine that runs down the evidence chain.
 *
 * The gradient's colour stops are the states of the links it passes, so the
 * line turns from green to red to amber as it descends and the chain reads
 * before any of it is read. It fills downward at the pace the trace reveals.
 *
 * It reveals by clipping rather than by stroke-dash: the spine stretches to
 * whatever height the cards happen to occupy, and dash lengths on a stretched
 * path are meaningless. Clipping keeps the colour stops anchored to the full
 * height while the reveal animates independently.
 */

const STATE_HEX: Record<LayerState, string> = {
  proven: "#10b981",
  adverse: "#f43f5e",
  unknown: "#f59e0b",
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function ChainSpine({
  layers,
  revealed,
  complete,
}: {
  layers: Layer[];
  revealed: number;
  complete: boolean;
}) {
  const total = layers.length;
  const progress = complete ? 1 : Math.min(1, revealed / total);
  const hidden = (1 - progress) * 100;
  const travelling = progress > 0 && progress < 1;

  /**
   * Each link owns an equal slice, hard-stopped at both ends so a link reads
   * as its own colour rather than blending into its neighbour.
   */
  const gradient = `linear-gradient(to bottom, ${layers
    .flatMap((layer, i) => {
      const hex = STATE_HEX[layer.state];
      return [`${hex} ${(i / total) * 100}%`, `${hex} ${((i + 1) / total) * 100}%`];
    })
    .join(", ")})`;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-8 left-[8px] top-4 w-[3px] sm:left-[12px]"
    >
      {/* The unlit track, so the distance still to go stays visible. */}
      <div className="absolute inset-0 rounded-full bg-white/[0.07]" />

      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: gradient }}
        initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
        animate={{ clipPath: `inset(0% 0% ${hidden}% 0%)` }}
        transition={{ duration: 0.62, ease: EASE }}
      />

      <motion.div
        className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ boxShadow: "0 0 12px 2px rgba(255,255,255,0.55)" }}
        initial={{ top: "0%", opacity: 0 }}
        animate={{ top: `${progress * 100}%`, opacity: travelling ? 1 : 0 }}
        transition={{ duration: 0.62, ease: EASE }}
      />
    </div>
  );
}
