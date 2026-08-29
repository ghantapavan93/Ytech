"use client";

import { useMemo } from "react";
import { DiagramFigure } from "./DiagramFigure";
import { buildLatticeScene } from "./scenes/latticeScene";

const COLUMNS = 7;
const ROWS = 5;

/**
 * Deliberately a shape rather than a count.
 *
 * There is no library of real evidence nodes yet, so this draws the argument
 * about structure and says so in words, rather than implying a dataset that
 * does not exist. Nodes are placed twice: down one column, and spread across
 * the grid.
 */
export function VisionLatticeDiagram() {
  const filled = useMemo<[number, number][]>(() => {
    // One engagement, many workflows: a full column, one firm understood.
    const column: [number, number][] = Array.from(
      { length: ROWS },
      (_, r) => [1, r] as [number, number],
    );
    // The same effort spread across firms: a plane starts to form.
    const spread: [number, number][] = [
      [3, 0],
      [4, 1],
      [5, 0],
      [3, 2],
      [5, 3],
      [6, 1],
      [4, 4],
    ];
    return [...column, ...spread];
  }, []);

  const build = useMemo(
    () => buildLatticeScene({ columns: COLUMNS, rows: ROWS, filled }),
    [filled],
  );

  return (
    <DiagramFigure
      build={build}
      height={310}
      caption="Why a library is not a pile of runs"
      description={`Engagements run across one axis and workflows across the other, and every run deposits one node. The filled column is a single firm studied thoroughly: real depth, and it supports a claim about that firm only. The scattered nodes are the same amount of work spread across several firms, which is the shape that begins to support a claim about the field. This is the structure of the argument, not a count of anything that exists today. There is no library yet, and the outlines are the honest size of what is still unknown.`}
      readout={[
        { label: "Grid", value: `${COLUMNS} x ${ROWS}` },
        { label: "Nodes drawn", value: String(filled.length) },
        { label: "Real nodes today", value: "0" },
        {
          label: "Space still open",
          value: `${Math.round((1 - filled.length / (COLUMNS * ROWS)) * 100)}%`,
        },
      ]}
    />
  );
}
