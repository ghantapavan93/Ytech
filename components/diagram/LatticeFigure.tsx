"use client";

import { D, MONO, T, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: depth in one firm and breadth across firms are not
 * the same asset.
 *
 * The same number of runs, placed twice. Down a single column they describe
 * one firm thoroughly. Spread across the grid they begin to describe the
 * field. The empty cells are drawn because the honest size of what is not
 * known is part of the claim.
 */

const COLS = 8;
const ROWS = 5;
const CELL = 20;
const GAP = 6;
const LEFT = 24;
const TOP = 34;

export function LatticeFigure({
  column,
  spread,
}: {
  /** Cells filled by one deep engagement, as [col, row]. */
  column: [number, number][];
  /** Cells filled by the same effort spread across firms. */
  spread: [number, number][];
}) {
  const reduced = useReducedMotion();
  const inColumn = new Set(column.map(([c, r]) => `${c},${r}`));
  const inSpread = new Set(spread.map(([c, r]) => `${c},${r}`));
  const width = LEFT + COLS * (CELL + GAP) + 10;

  return (
    <svg
      viewBox={`0 0 ${width} 168`}
      className="h-auto w-full"
      role="img"
      aria-label={`A grid of engagements by workflows. ${column.length} nodes fill one column, ${spread.length} of the same effort spread across the grid. ${COLS * ROWS - column.length - spread.length} cells remain empty.`}
    >
      <text x={LEFT} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        WORKFLOWS ↑ · ENGAGEMENTS →
      </text>

      {Array.from({ length: COLS }).map((_, c) =>
        Array.from({ length: ROWS }).map((_, r) => {
          const key = `${c},${r}`;
          const filled = inColumn.has(key) || inSpread.has(key);
          const tone = inColumn.has(key) ? D.live : inSpread.has(key) ? D.claim : D.dim;
          return (
            <motion.rect
              key={key}
              x={LEFT + c * (CELL + GAP)}
              y={TOP + (ROWS - 1 - r) * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx="2.5"
              fill={filled ? tone : "transparent"}
              fillOpacity={filled ? 0.42 : 0}
              stroke={tone}
              strokeOpacity={filled ? 0.9 : 0.22}
              strokeWidth="1"
              strokeDasharray={filled ? undefined : "3 3"}
              {...reveal(0.04 + (c * ROWS + r) * 0.012, reduced)}
            />
          );
        }),
      )}

      <text x={LEFT + 1 * (CELL + GAP) + CELL / 2} y={TOP - 8} fontSize={T.micro} fill={D.live} textAnchor="middle" fontFamily={MONO}>
        ONE FIRM
      </text>
      <text x={LEFT + 5 * (CELL + GAP) + CELL / 2} y={TOP - 8} fontSize={T.micro} fill={D.claim} textAnchor="middle" fontFamily={MONO}>
        SAME EFFORT, MANY FIRMS
      </text>

      <text x={LEFT} y={TOP + ROWS * (CELL + GAP) + 14} fontSize={T.micro} fill={D.live}>
        a full column supports a claim about that firm
      </text>
      <text x={LEFT} y={TOP + ROWS * (CELL + GAP) + 26} fontSize={T.micro} fill={D.claim}>
        a spread starts to support a claim about the field
      </text>
      <text x={LEFT} y={TOP + ROWS * (CELL + GAP) + 38} fontSize={T.micro} fill={D.label}>
        dashed cells are the honest size of what is not known. no library exists yet
      </text>
    </svg>
  );
}
