"use client";

import {
  buildDecisionAt,
  CONDITIONS,
  evaluate,
  REMEDIES,
  STATUS_LABEL,
  TIMELINE_WEEKS,
  WEEK_LABEL,
} from "@/lib/engines/proof-engine";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ShieldOff, Undo2, X } from "lucide-react";
import { ProofDivergenceDiagram } from "./diagram/ProofDivergenceDiagram";
import { DivergenceTrack } from "./DivergenceTrack";
import { useMemo, useState } from "react";

const WEEKS = TIMELINE_WEEKS;

export function ProofOffice() {
  const [week, setWeek] = useState<number>(0);
  const [applied, setApplied] = useState<string[]>([]);

  const decision = useMemo(() => buildDecisionAt(week, applied), [week, applied]);

  const result = useMemo(() => evaluate(decision), [decision]);
  const visibleEvents = decision.events.filter((e) => e.breaks.length > 0 || e.week === 0);

  const toggle = (id: string) =>
    setApplied((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <div className="space-y-5">
      {/* Timeline */}
      <div className="card p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="micro-label">Move time forward</p>
          {week > 0 && (
            <button
              onClick={() => {
                setWeek(0);
                setApplied([]);
              }}
              className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-4 transition-colors hover:text-ink-2"
            >
              <Undo2 size={11} />
              back to day 30
            </button>
          )}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-canvas/55 p-1.5">
          {WEEKS.map((w) => (
            <button
              key={w}
              onClick={() => setWeek(w)}
              aria-pressed={w === week}
              disabled={w === 8 && applied.length === 0}
              className={`rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-35 ${
                w === week
                  ? "bg-cyan-500/12 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.45)]"
                  : "text-ink-3 hover:bg-white/[0.06]"
              }`}
            >
              {WEEK_LABEL[w]}
            </button>
          ))}
        </div>
        {week === 6 && applied.length === 0 && (
          <p className="mt-2.5 text-[11.5px] text-ink-4">
            Apply at least one remedy below to move forward again.
          </p>
        )}
      </div>

      <DivergenceTrack applied={applied} week={week} />

      <ProofDivergenceDiagram applied={applied} />

      {/* The sentence for the week you are standing in. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={result.headline}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className={`status-surface card p-5 sm:p-6 ${
            result.expired
              ? "border-rose-500/40 bg-rose-500/[0.06]"
              : result.broken.length > 0
                ? "border-amber-500/40 bg-amber-500/[0.06]"
                : "border-emerald-500/40 bg-emerald-500/[0.06]"
          }`}
        >
          <div
            className={`flex items-center gap-2 ${
              result.expired
                ? "text-rose-400"
                : result.broken.length > 0
                  ? "text-amber-400"
                  : "text-emerald-400"
            }`}
          >
            <ShieldOff size={14} />
            <p className="micro-label !text-current">
              {result.expired ? "Expired" : STATUS_LABEL[result.status]}
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-[15px] font-medium leading-relaxed text-ink-1">
            {result.headline}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Conditions */}
      <div className="card overflow-hidden">
        <p className="micro-label border-b border-line px-5 py-3">
          What the decision rests on
        </p>
        <div className="divide-y divide-line">
          {CONDITIONS.map((c) => {
            const broken = result.broken.find((b) => b.condition.id === c.id);
            return (
              <div
                key={c.id}
                className={`flex gap-3.5 p-5 transition-colors ${
                  broken ? "bg-rose-500/[0.06]" : ""
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${
                    broken
                      ? "bg-rose-500/12 text-rose-400"
                      : "bg-emerald-500/12 text-emerald-400"
                  }`}
                >
                  {broken ? <X size={12} /> : <Check size={12} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <h3 className="text-[13px] font-semibold text-ink-1">
                      {c.label}
                    </h3>
                    {c.critical && (
                      <span className="mono-num rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-bold tracking-[0.12em] text-ink-4">
                        VOIDS ON BREAK
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11.5px] text-ink-4">
                    Approved on: {c.approvedOn}
                  </p>
                  {broken ? (
                    <div className="mt-2.5 rounded-lg border border-rose-500/25 bg-canvas/55 p-3">
                      <p className="text-[13px] font-medium text-rose-300">
                        {broken.event.headline}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
                        {broken.event.detail}
                      </p>
                      <p className="mt-2 text-[11.5px] leading-relaxed text-ink-4">
                        {c.whyItVoids}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Events */}
      {visibleEvents.length > 1 && (
        <div className="card overflow-hidden">
          <p className="micro-label border-b border-line px-5 py-3">
            Evidence that arrived
          </p>
          <div className="divide-y divide-line">
            <AnimatePresence initial={false}>
              {visibleEvents.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 p-5"
                >
                  <span className="mono-num shrink-0 text-[11.5px] text-ink-4">
                    wk {e.week}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-ink-1">
                      {e.headline}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
                      {e.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Remedies */}
      {week >= 6 && (
        <div className="card p-6">
          <p className="micro-label">What the firm can change</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
            Each of these repairs a condition. None of them restores the
            clearance, which is the part most systems get wrong.
          </p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {REMEDIES.map((r) => {
              const on = applied.includes(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => toggle(r.id)}
                  aria-pressed={on}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    on
                      ? "border-cyan-500/40 bg-cyan-500/12"
                      : "border-line hover:border-line-strong hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={`text-[13px] font-semibold ${
                        on ? "text-cyan-200" : "text-ink-1"
                      }`}
                    >
                      {r.label}
                    </h3>
                    {on && <Check size={13} className="mt-0.5 shrink-0 text-cyan-300" />}
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-4">
                    {r.detail}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* What must happen */}
      {result.required.length > 0 && (
        <div className="card border-amber-500/25 bg-amber-500/[0.06] p-6">
          <p className="micro-label !text-amber-300/80">What has to happen next</p>
          <ul className="mt-3 space-y-2">
            {result.required.map((r) => (
              <li
                key={r}
                className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2"
              >
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-400/80" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* The closing line, once it has been earned */}
      {result.expired && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="py-6 text-center text-xl font-semibold tracking-[-0.02em] text-ink-1 sm:text-2xl"
        >
          The agent did not fail.{" "}
          <span className="text-rose-400">The decision expired.</span>
        </motion.p>
      )}
    </div>
  );
}
