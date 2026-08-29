"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { RangeSlider } from "./RangeSlider";
import { Ticker } from "./Ticker";

/**
 * The compounding simulator, a deterministic toy model of the learning-rate
 * argument. Every engagement runs the wind tunnel and deposits anonymized
 * evidence nodes; coverage of the archetype space grows with diminishing
 * returns; a blank-page consultancy resets to zero every engagement.
 *
 * Synthetic by construction: the archetype grid (36 cells = 3 firm-size
 * bands × 3 pricing regimes × 4 workflow classes) and the saturation
 * constant are stated assumptions, not measurements.
 */

const GRID_CELLS = 36;
const BREADTH_SATURATION = 60; // archetype draws at which coverage hits ~63%
const CONFIGS_PER_WORKFLOW = 4; // lever configurations recorded per workflow

/**
 * Coverage is driven by BREADTH, each engagement's workflows land in
 * archetype cells (draws), while the 4 recorded configurations per
 * workflow deepen a cell without widening coverage. Diminishing returns:
 * repeat archetypes stop adding breadth.
 */
function coverageAt(breadthDraws: number): number {
  return 1 - Math.exp(-breadthDraws / BREADTH_SATURATION);
}

interface SimPoint {
  month: number;
  coverage: number;
}

function simulate(engagementsPerYear: number, workflowsPerEngagement: number) {
  const drawsPerMonth = (engagementsPerYear * workflowsPerEngagement) / 12;
  const nodesPerMonth = drawsPerMonth * CONFIGS_PER_WORKFLOW;
  const points: SimPoint[] = [];
  for (let m = 0; m <= 36; m++) {
    points.push({ month: m, coverage: coverageAt(drawsPerMonth * m) });
  }
  const year3Coverage = coverageAt(drawsPerMonth * 36);
  return {
    points,
    year3Nodes: Math.round(nodesPerMonth * 36),
    year3CoveragePct: year3Coverage * 100,
    cellsFilled: Math.round(year3Coverage * GRID_CELLS),
  };
}

/** Build an SVG path for the coverage curve inside a 100×54 viewBox. */
function curvePath(points: SimPoint[]): string {
  return points
    .map((p, i) => {
      const x = (p.month / 36) * 100;
      const y = 52 - p.coverage * 48;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function CompoundingSim() {
  const [engagements, setEngagements] = useState(12);
  const [workflows, setWorkflows] = useState(2);

  const sim = useMemo(() => simulate(engagements, workflows), [engagements, workflows]);
  const path = useMemo(() => curvePath(sim.points), [sim.points]);

  return (
    <div className="card overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1fr_1.4fr]">
        {/* Controls + outputs */}
        <div className="space-y-5 border-b border-line p-6 lg:border-b-0 lg:border-r">
          <div>
            <p className="micro-label">Engagements per year</p>
            <div className="mt-2">
              <RangeSlider
                ariaLabel="Engagements per year"
                min={4}
                max={40}
                step={1}
                value={engagements}
                display={`${engagements}`}
                onChange={setEngagements}
                leftHint="a boutique's calendar"
                rightHint="keynotes + cohorts + stress tests"
              />
            </div>
          </div>
          <div>
            <p className="micro-label">Workflows stress-tested per engagement</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-canvas/55 p-1.5">
              {[1, 2, 3].map((w) => (
                <button
                  key={w}
                  onClick={() => setWorkflows(w)}
                  aria-pressed={w === workflows}
                  className={`rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                    w === workflows
                      ? "bg-cyan-500/12 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.45)]"
                      : "text-ink-3 hover:bg-white/[0.06]"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-line pt-5">
            <div>
              <p className="micro-label">Nodes · 3 yrs</p>
              <Ticker
                value={sim.year3Nodes}
                format={(n) => `${Math.round(n)}`}
                className="mt-1 block text-xl font-semibold text-ink-1"
              />
            </div>
            <div>
              <p className="micro-label">Grid coverage</p>
              <Ticker
                value={sim.year3CoveragePct}
                format={(n) => `${n.toFixed(0)}%`}
                className="mt-1 block text-xl font-semibold text-cyan-300"
              />
            </div>
            <div>
              <p className="micro-label">Cells filled</p>
              <Ticker
                value={sim.cellsFilled}
                format={(n) => `${Math.round(n)}/${GRID_CELLS}`}
                className="mt-1 block text-xl font-semibold text-ink-1"
              />
            </div>
          </div>

          <p className="text-[11.5px] leading-relaxed text-ink-4">
            Toy model, labeled as such: 36 archetype cells (3 size bands × 3
            pricing regimes × 4 workflow classes). Breadth, which cells hold
            evidence, grows with each engagement's workflows and saturates;
            the 4 recorded lever configurations per workflow deepen cells
            without widening them. The point is the shape, not the forecast:
            evidence accumulates; blank pages don't.
          </p>
        </div>

        {/* Curve */}
        <div className="p-6">
          <div className="flex items-baseline justify-between">
            <p className="micro-label">Share of “firms like yours” answerable from evidence</p>
            <p className="mono-num text-[10px] text-ink-4">36 months</p>
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 100 56" className="w-full" role="img" aria-label="Coverage over 36 months: instrument-owning firm compounds; blank-page consultancy stays flat">
              {/* grid lines */}
              {[0.25, 0.5, 0.75].map((g) => (
                <line
                  key={g}
                  x1="0"
                  x2="100"
                  y1={52 - g * 48}
                  y2={52 - g * 48}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.3"
                />
              ))}
              <line x1="0" x2="100" y1="52" y2="52" stroke="rgba(255,255,255,0.14)" strokeWidth="0.4" />

              {/* blank-page consultancy: resets every engagement, never accumulates */}
              <line
                x1="0"
                x2="100"
                y1="50.5"
                y2="50.5"
                stroke="#71717a"
                strokeWidth="0.7"
                strokeDasharray="2.4 2"
              />

              {/* the compounding curve */}
              <motion.path
                key={path}
                d={path}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.1"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 4px rgba(6,182,212,0.55))" }}
              />

              {/* year ticks */}
              {[12, 24, 36].map((m) => (
                <g key={m}>
                  <line
                    x1={(m / 36) * 100}
                    x2={(m / 36) * 100}
                    y1="52"
                    y2="53.5"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="0.3"
                  />
                </g>
              ))}
            </svg>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-4">
              <span>start</span>
              <span>year 1</span>
              <span>year 2</span>
              <span>year 3</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <span className="flex items-center gap-2 text-[11.5px] text-ink-3">
              <span className="h-[3px] w-5 rounded-full bg-cyan-400" />
              Owns the instrument, every run deposits a node
            </span>
            <span className="flex items-center gap-2 text-[11.5px] text-ink-4">
              <span className="h-[3px] w-5 rounded-full bg-zinc-600" style={{ opacity: 0.8 }} />
              Blank-page consultancy, each engagement starts at zero
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
