"use client";

import type { Layer, LayerState } from "@/lib/engines/progress-engine";
import { animate, utils } from "animejs";
import { useEffect, useRef } from "react";

/**
 * The spine that runs down the evidence chain.
 *
 * This used to be a one-pixel div. It is now the readout: a gradient whose
 * stops are the states of the links it passes, so the chain visibly turns
 * from green to red to amber as it descends, and it fills downward at
 * exactly the pace the trace reveals.
 *
 * It reveals by clipping rather than by stroke-dash. A first attempt drew an
 * SVG line with createDrawable, but the spine has to stretch to whatever
 * height the cards happen to occupy, and a viewBox stretched that far makes
 * dash lengths meaningless: anime.js measured a 100-unit line as 3599px and
 * the stroke never appeared. Clipping a gradient keeps the colour stops
 * anchored to the full height while the reveal animates independently.
 */

const STATE_HEX: Record<LayerState, string> = {
  proven: "#10b981",
  adverse: "#f43f5e",
  unknown: "#f59e0b",
};

interface ChainSpineProps {
  layers: Layer[];
  /** How many links have been revealed so far. */
  revealed: number;
  /** True once the whole chain is shown, so the spine completes. */
  complete: boolean;
}

export function ChainSpine({ layers, revealed, complete }: ChainSpineProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const total = layers.length;
  const progress = complete ? 1 : Math.min(1, revealed / total);

  /**
   * Each link owns an equal slice, hard-stopped at both ends so a link reads
   * as its own colour rather than blending into its neighbour.
   */
  const gradient = `linear-gradient(to bottom, ${layers
    .flatMap((layer, i) => {
      const hex = STATE_HEX[layer.state];
      return [
        `${hex} ${(i / total) * 100}%`,
        `${hex} ${((i + 1) / total) * 100}%`,
      ];
    })
    .join(", ")})`;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fill = root.querySelector<HTMLElement>(".spine-fill");
    const pulse = root.querySelector<HTMLElement>(".spine-pulse");
    const hidden = (1 - progress) * 100;

    if (fill) {
      animate(fill, {
        clipPath: `inset(0% 0% ${hidden}% 0%)`,
        duration: 620,
        ease: "outCubic",
      });
    }

    if (pulse) {
      animate(pulse, {
        top: `${progress * 100}%`,
        opacity: progress > 0 && progress < 1 ? 1 : 0,
        duration: 620,
        ease: "outCubic",
      });
    }

    // An earlier version wrapped this in createScope and reverted the scope
    // on unmount, which cleaned up nothing: a scope only owns animations
    // registered inside scope.add(), and these are bare animate() calls.
    // utils.remove cancels the in-flight tweens on the nodes themselves,
    // which is what actually needed cancelling.
    return () => {
      if (fill) utils.remove(fill);
      if (pulse) utils.remove(pulse);
    };
  }, [progress]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute bottom-8 left-[8px] top-4 w-[3px] sm:left-[12px]"
    >
      {/* The unlit track, so the distance still to go stays visible. */}
      <div className="absolute inset-0 rounded-full bg-white/[0.07]" />

      <div
        className="spine-fill absolute inset-0 rounded-full"
        style={{
          background: gradient,
          clipPath: "inset(0% 0% 100% 0%)",
        }}
      />

      <div
        className="spine-pulse absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0"
        style={{ top: "0%", boxShadow: "0 0 12px 2px rgba(255,255,255,0.55)" }}
      />
    </div>
  );
}
