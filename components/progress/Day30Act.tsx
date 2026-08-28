"use client";

import { DECISION_LABEL, EVIDENCE, type Evidence } from "@/lib/engines/progress-engine";
import { motion } from "framer-motion";
import { Check, CircleSlash, RotateCcw, X } from "lucide-react";
import type { RefObject } from "react";
import { SectionRail } from "./ProgressPrimitives";
import { DECISION_STYLE } from "./progress-style";
import type { DecisionLogEntry } from "./useProgressRun";

/**
 * Act four: new readings arrive, and the decision rewrites itself.
 *
 * The audit trail underneath is the point of the act. It records the moves
 * the decision actually made, so a reader can see that the verdict responds
 * to measurements rather than to opinion, and that a repaired condition does
 * not quietly restore the clearance that existed before.
 */
export function Day30Act({
  applied,
  log,
  onToggle,
  onClear,
  onReset,
  sectionRef,
}: {
  applied: string[];
  log: DecisionLogEntry[];
  onToggle: (evidence: Evidence) => void;
  onClear: () => void;
  onReset: () => void;
  sectionRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="scroll-mt-20"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <SectionRail n="05" title="Day 30, new readings" />
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-zinc-400">
            Turn on what the firm actually found. Each reading resolves one
            link, and the decision above rewrites itself. Two readings of the
            same link cannot both stand, so the newer one replaces the older.
          </p>
        </div>
        {applied.length > 0 && (
          <button
            onClick={onClear}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-zinc-500 transition-colors hover:border-line-strong hover:text-zinc-200"
          >
            <RotateCcw size={12} />
            Clear readings
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {EVIDENCE.map((e) => {
          const on = applied.includes(e.id);
          return (
            <button
              key={e.id}
              onClick={() => onToggle(e)}
              aria-pressed={on}
              className={`status-surface flex gap-3 rounded-xl border p-4 text-left ${
                on
                  ? e.good
                    ? "border-ok/35 bg-ok/[0.05]"
                    : "border-crit/35 bg-crit/[0.05]"
                  : "border-line bg-surface-1 hover:border-line-strong"
              }`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  on
                    ? e.good
                      ? "border-ok bg-ok/20 text-ok"
                      : "border-crit bg-crit/20 text-crit"
                    : "border-line-strong text-transparent"
                }`}
              >
                {on &&
                  (e.good ? (
                    <Check size={11} strokeWidth={3} />
                  ) : (
                    <X size={11} strokeWidth={3} />
                  ))}
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-[13.5px] font-medium ${
                    on ? "text-zinc-100" : "text-zinc-300"
                  }`}
                >
                  {e.label}
                </span>
                <span className="mt-1 block text-[12.5px] leading-relaxed text-zinc-500">
                  {e.detail}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-surface-1 p-5">
        <p className="micro-label">How the decision moved</p>
        <ol className="mt-3.5 space-y-2.5">
          {log.map((entry, i) => (
            <li key={`${entry.decision}-${i}`} className="flex items-start gap-3">
              <span className="mono-num mt-[3px] w-5 shrink-0 text-[11px] text-zinc-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span
                  className={`text-[13.5px] font-medium ${DECISION_STYLE[entry.decision].text}`}
                >
                  {DECISION_LABEL[entry.decision]}
                </span>
                <span className="block text-[12.5px] text-zinc-500">
                  {entry.cause}
                </span>
              </span>
            </li>
          ))}
        </ol>
        {log.length === 1 && (
          <p className="mt-4 flex items-start gap-2 border-t border-line pt-3.5 text-[12.5px] leading-relaxed text-zinc-600">
            <CircleSlash size={13} className="mt-[3px] shrink-0" />
            Nothing has changed the decision yet. It does not move on
            sentiment, only on a reading.
          </p>
        )}
      </div>

      <div className="mt-10 border-t border-line pt-8">
        <p className="max-w-3xl text-xl font-medium leading-[1.35] tracking-[-0.02em] text-zinc-200 sm:text-2xl">
          Your dashboard tells the board that AI is growing. This tells the
          board whether the business moved.
        </p>
        <button
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[12.5px] text-zinc-500 transition-colors hover:border-line-strong hover:text-zinc-200"
        >
          <RotateCcw size={12} />
          Run it again from the green dashboard
        </button>
      </div>
    </motion.section>
  );
}
