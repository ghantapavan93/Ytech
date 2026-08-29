"use client";

import type { Layer } from "@/lib/content/stack-data";
import { D, MONO, T, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: some layers of this stack exist only at a scale
 * this practice does not have.
 *
 * Every layer named and placed. Colour is standing. A layer drawn as an
 * outline is present in the design and absent in the building, which is a
 * different claim from "weak" and worth keeping separate.
 */

const TONE = { owned: D.ok, partial: D.warn, open: D.dim } as const;
const WORD = { owned: "held", partial: "partly", open: "open" } as const;

const ROW = 24;
const TOP = 22;

export function StackFigure({ layers }: { layers: Layer[] }) {
  const reduced = useReducedMotion();
  const height = TOP + layers.length * ROW + 16;
  const needsScale = layers.filter((l) => l.needsScale).length;

  return (
    <svg
      viewBox={`0 0 440 ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${layers.length} layers. ${layers.filter((l) => l.standing === "owned").length} already strong, ${needsScale} need scale.`}
    >
      <text x={8} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        THE CAPABILITY STACK, LAYER ONE AT THE BASE
      </text>
      <text x={434} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO} textAnchor="end">
        OUTLINED = NEEDS SCALE
      </text>

      {/* drawn bottom-up so layer one sits at the base */}
      {[...layers].reverse().map((layer, idx) => {
        const y = TOP + idx * ROW;
        const tone = TONE[layer.standing];
        return (
          <motion.g key={layer.n} {...reveal(0.05 + idx * 0.05, reduced)}>
            <rect
              x={8}
              y={y + 2}
              width={424}
              height={ROW - 6}
              rx="2"
              fill={tone}
              fillOpacity={layer.needsScale ? 0.04 : 0.12}
              stroke={tone}
              strokeOpacity={layer.needsScale ? 0.55 : 0.6}
              strokeWidth="0.75"
              strokeDasharray={layer.needsScale ? "4 3" : undefined}
            />
            <text x={16} y={y + ROW / 2 + 1} fontSize={T.micro} fill={D.label} fontFamily={MONO}>
              {layer.n}
            </text>
            <text x={36} y={y + ROW / 2 + 1} fontSize={T.body} fill={D.value} fontWeight="600">
              {layer.name}
            </text>
            <text
              x={424}
              y={y + ROW / 2 + 1}
              fontSize={T.micro}
              fill={tone}
              textAnchor="end"
              fontFamily={MONO}
            >
              {(layer.needsScale ? "needs scale" : WORD[layer.standing]).toUpperCase()}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
