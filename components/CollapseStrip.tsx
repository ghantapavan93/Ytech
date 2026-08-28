"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * The industry contradiction, as a cliff rather than a paragraph.
 *
 * These five figures were previously a wall of eleven-point grey prose, which
 * is a strange place to hide the most arresting numbers on the site. Adoption
 * is near-universal and impact is rare, and the distance between those two
 * facts is the entire reason this instrument exists. A reader should be able
 * to see that distance without reading a sentence.
 */

interface Rung {
  pct: number;
  label: string;
  /** The last rung in a group is the one that hurts. */
  terminal?: boolean;
}

interface Band {
  scope: string;
  source: string;
  rungs: Rung[];
}

const BANDS: Band[] = [
  {
    scope: "All industries",
    source: "McKinsey, State of AI, Nov 2025",
    rungs: [
      { pct: 88, label: "use AI regularly" },
      { pct: 39, label: "report enterprise-level EBIT impact" },
      { pct: 6, label: "qualify as high performers", terminal: true },
    ],
  },
  {
    scope: "AEC specifically",
    source: "Deltek Clarity A&E study, May 2026",
    rungs: [
      { pct: 70, label: "have adopted AI" },
      { pct: 38, label: "see measurable business impact", terminal: true },
    ],
  },
];

export function CollapseStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref}>
      <p className="micro-label">Why this instrument exists</p>
      <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-[1.15] tracking-[-0.025em] text-zinc-100 sm:text-[34px]">
        Almost everyone has adopted it.
        <span className="block text-zinc-500">Almost nobody can show a result.</span>
      </h2>

      <div className="mt-9 space-y-9">
        {BANDS.map((band, bandIndex) => (
          <div key={band.scope}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-zinc-300">
                {band.scope}
              </p>
              <p className="text-[11.5px] text-zinc-600">{band.source}</p>
            </div>

            <div className="mt-4 space-y-2.5">
              {band.rungs.map((rung, i) => (
                <div key={rung.label} className="flex items-center gap-4">
                  <span
                    className={`mono-num w-[74px] shrink-0 text-right text-[26px] font-semibold leading-none tracking-[-0.04em] sm:w-[96px] sm:text-[38px] ${
                      rung.terminal ? "text-crit" : "text-zinc-300"
                    }`}
                  >
                    {rung.pct}%
                  </span>

                  {/* The track matters as much as the bar. Without the full
                      width drawn behind it you see three bars rather than a
                      collapse, and the shortfall is the whole point. */}
                  <div className="relative h-[26px] min-w-0 flex-1 overflow-hidden rounded-sm border border-dashed border-white/[0.09] sm:h-[34px]">
                    <motion.div
                      className={`absolute inset-y-0 left-0 ${
                        rung.terminal ? "bg-crit/25" : "bg-white/[0.10]"
                      }`}
                      style={{
                        borderRight: rung.terminal
                          ? "2px solid var(--color-crit)"
                          : "2px solid rgba(255,255,255,0.3)",
                      }}
                      initial={{ width: 0 }}
                      animate={seen ? { width: `${rung.pct}%` } : { width: 0 }}
                      transition={{
                        duration: 0.9,
                        delay: bandIndex * 0.25 + i * 0.14,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </div>

                  <span className="hidden w-[13rem] shrink-0 text-[12.5px] leading-tight text-zinc-500 sm:block">
                    {rung.label}
                  </span>
                </div>
              ))}
            </div>

            {/* On narrow screens the labels move under the bars. */}
            <div className="mt-3 space-y-1 sm:hidden">
              {band.rungs.map((rung) => (
                <p key={rung.label} className="text-[12px] text-zinc-500">
                  <span className="mono-num text-zinc-400">{rung.pct}%</span>{" "}
                  {rung.label}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-9 max-w-2xl border-l-2 border-line-strong pl-4 text-[14.5px] leading-relaxed text-zinc-300">
        That drop is not a model problem. Every one of those firms has working
        technology. What they do not have is a fee structure, a review gate, an
        incentive, and a talent pipeline that can absorb what the technology
        gives them. This instrument runs one agent through all four before
        anyone deploys it.
      </p>
    </div>
  );
}
