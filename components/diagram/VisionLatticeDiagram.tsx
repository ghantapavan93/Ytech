"use client";

import { LatticeFigure } from "./LatticeFigure";
import { SvgFigure } from "./svg-kit";

const COLUMN: [number, number][] = [
  [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
];
const SPREAD: [number, number][] = [
  [4, 0], [5, 2], [6, 1], [4, 3], [7, 0], [6, 4], [5, 4],
];

export function VisionLatticeDiagram() {
  return (
    <SvgFigure
      caption="Why a library is not a pile of runs"
      description="Engagements across one axis, workflows across the other, one node per run. The filled column is a single firm studied thoroughly: real depth, supporting a claim about that firm only. The scattered nodes are the same effort spread across firms, which is the shape that begins to support a claim about the field. This is the structure of the argument rather than a count of anything that exists. There is no library yet, and the dashed cells are the honest size of what is unknown."
    >
      <LatticeFigure column={COLUMN} spread={SPREAD} />
    </SvgFigure>
  );
}
