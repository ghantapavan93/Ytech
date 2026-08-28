"use client";

import { DECISION_LABEL, type ProgressResult } from "@/lib/engines/progress-engine";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, CircleDashed } from "lucide-react";
import type { RefObject } from "react";
import { EvidenceCharterSheet } from "./EvidenceCharterSheet";
import { SectionRail, Tally } from "./ProgressPrimitives";
import { DECISION_STYLE } from "./progress-style";

/**
 * Act three: the verdict, and the document it produces.
 *
 * The headline is keyed on its own text so that a decision changing at day
 * thirty animates as a replacement rather than a silent swap. The charter
 * below it is derived from the same result, so the two can never disagree.
 */
export function VerdictAct({
  result,
  showAdvance,
  onAdvance,
  sectionRef,
}: {
  result: ProgressResult;
  showAdvance: boolean;
  onAdvance: () => void;
  sectionRef: RefObject<HTMLDivElement | null>;
}) {
  const ds = DECISION_STYLE[result.decision];

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-20"
    >
      <SectionRail n="03" title="The verdict" />
      <div
        className={`verdict-glow status-surface mt-5 rounded-2xl border p-6 sm:p-8 ${ds.border} ${ds.bg}`}
        style={
          {
            "--glow-color": ds.glow,
            "--glow-color-border": "rgba(255,255,255,0.05)",
          } as React.CSSProperties
        }
      >
        <p className={`micro-label ${ds.text}`}>
          {DECISION_LABEL[result.decision]}
        </p>
        <AnimatePresence mode="wait">
          <motion.h2
            key={result.headline}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="mt-3 max-w-3xl text-2xl font-semibold leading-[1.14] tracking-[-0.025em] text-zinc-100 sm:text-4xl"
          >
            {result.headline}
          </motion.h2>
        </AnimatePresence>
        <p className="mt-5 max-w-2xl text-[14.5px] leading-relaxed text-zinc-400">
          {result.because}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Tally n={result.proven} label="measured, holds" tone="text-ok" />
          <Tally n={result.adverse} label="measured, against you" tone="text-crit" />
          <Tally n={result.unknown} label="never measured" tone="text-warn" />
        </div>
      </div>

      {result.toScale.length > 0 && (
        <div className="mt-5 rounded-xl border border-line bg-surface-1 p-5">
          <p className="micro-label">What it would take to scale</p>
          <ul className="mt-3 space-y-2">
            {result.toScale.map((s) => (
              <li
                key={s}
                className="flex gap-2.5 text-[13.5px] leading-relaxed text-zinc-300"
              >
                <CircleDashed size={14} className="mt-[3px] shrink-0 text-zinc-600" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <SectionRail n="04" title="What it produces" />
        <div className="mt-5">
          <EvidenceCharterSheet result={result} />
        </div>
      </div>

      {showAdvance && (
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
          <button
            onClick={onAdvance}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-line-strong bg-surface-1 px-5 py-3 text-[14px] font-medium text-zinc-100 transition-colors hover:border-white/25 hover:bg-surface-2"
          >
            Thirty days later, add the evidence
            <ArrowDown
              size={15}
              className="text-zinc-500 transition-transform group-hover:translate-y-0.5"
            />
          </button>
          <p className="max-w-xs text-[12.5px] leading-relaxed text-zinc-600">
            This is where a dashboard redraws a chart. Watch what happens here
            instead.
          </p>
        </div>
      )}
    </motion.section>
  );
}
