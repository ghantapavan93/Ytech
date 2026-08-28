"use client";

import {
  CONDITIONS,
  evaluate,
  REMEDIES,
  SPEC_QA_DECISION,
  STATUS_LABEL,
  type EvidenceEvent,
  type LivingDecision,
} from "@/lib/engines/proof-engine";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Check, ShieldOff, Undo2, X } from "lucide-react";
import { useMemo, useState } from "react";

const WEEKS = [0, 6, 8] as const;
const WEEK_LABEL: Record<number, string> = {
  0: "Day 30, test passed",
  6: "Week 6",
  8: "After remedies",
};

export function ProofOffice() {
  const [week, setWeek] = useState<number>(0);
  const [applied, setApplied] = useState<string[]>([]);

  const decision: LivingDecision = useMemo(() => {
    const base = SPEC_QA_DECISION.events.filter((e) => e.week <= Math.min(week, 6));
    const remedyEvents: EvidenceEvent[] =
      week >= 8
        ? applied.map((id) => {
            const r = REMEDIES.find((x) => x.id === id)!;
            return {
              id: `remedy-${r.id}`,
              week: 8,
              headline: r.label,
              detail: r.detail,
              breaks: [],
              restores: r.restores,
            };
          })
        : [];
    return { ...SPEC_QA_DECISION, events: [...base, ...remedyEvents] };
  }, [week, applied]);

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
              className="inline-flex items-center gap-1.5 text-[11.5px] text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <Undo2 size={11} />
              back to day 30
            </button>
          )}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl border border-line bg-canvas/60 p-1.5">
          {WEEKS.map((w) => (
            <button
              key={w}
              onClick={() => setWeek(w)}
              aria-pressed={w === week}
              disabled={w === 8 && applied.length === 0}
              className={`rounded-lg px-3 py-2.5 text-[12.5px] font-medium transition-all disabled:cursor-not-allowed disabled:opacity-35 ${
                w === week
                  ? "bg-cyan-500/10 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.45)]"
                  : "text-zinc-400 hover:bg-white/[0.04]"
              }`}
            >
              {WEEK_LABEL[w]}
            </button>
          ))}
        </div>
        {week === 6 && applied.length === 0 && (
          <p className="mt-2.5 text-[11px] text-zinc-600">
            Apply at least one remedy below to move forward again.
          </p>
        )}
      </div>

      {/* The two facts, side by side. This pairing is the whole idea. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="status-surface card border-emerald-500/35 bg-emerald-500/[0.05] p-6">
          <div className="flex items-center gap-2 text-emerald-400">
            <Activity size={14} />
            <p className="micro-label !text-emerald-400/90">The agent</p>
          </div>
          <p className="mt-3 text-2xl font-semibold text-emerald-400">
            Performing
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
            Same task time, same accuracy, same acceptance cases as the day it
            was approved. Nothing about the tool has changed.
          </p>
        </div>

        <motion.div
          key={result.expired ? "void" : "valid"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`status-surface card p-6 ${
            result.expired
              ? "border-rose-500/40 bg-rose-500/[0.06]"
              : result.broken.length > 0
                ? "border-amber-500/40 bg-amber-500/[0.05]"
                : "border-emerald-500/35 bg-emerald-500/[0.05]"
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
            <p className="micro-label !text-current">The authorization</p>
          </div>
          <p
            className={`mt-3 text-2xl font-semibold ${
              result.expired
                ? "text-rose-400"
                : result.broken.length > 0
                  ? "text-amber-400"
                  : "text-emerald-400"
            }`}
          >
            {result.expired ? "Expired" : STATUS_LABEL[result.status]}
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
            {result.headline}
          </p>
        </motion.div>
      </div>

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
                  broken ? "bg-rose-500/[0.05]" : ""
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 rounded-lg p-1.5 ${
                    broken
                      ? "bg-rose-500/15 text-rose-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {broken ? <X size={12} /> : <Check size={12} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <h3 className="text-[13px] font-semibold text-zinc-200">
                      {c.label}
                    </h3>
                    {c.critical && (
                      <span className="mono-num rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-bold tracking-[0.12em] text-zinc-500">
                        VOIDS ON BREAK
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11.5px] text-zinc-600">
                    Approved on: {c.approvedOn}
                  </p>
                  {broken ? (
                    <div className="mt-2.5 rounded-lg border border-rose-500/25 bg-canvas/50 p-3">
                      <p className="text-[12.5px] font-medium text-rose-300">
                        {broken.event.headline}
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-zinc-400">
                        {broken.event.detail}
                      </p>
                      <p className="mt-2 text-[11.5px] leading-relaxed text-zinc-500">
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
                  <span className="mono-num shrink-0 text-[11px] text-zinc-600">
                    wk {e.week}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-zinc-200">
                      {e.headline}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-400">
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
          <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
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
                      ? "border-cyan-500/45 bg-cyan-500/10"
                      : "border-line hover:border-line-strong hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={`text-[13px] font-semibold ${
                        on ? "text-cyan-200" : "text-zinc-200"
                      }`}
                    >
                      {r.label}
                    </h3>
                    {on && <Check size={13} className="mt-0.5 shrink-0 text-cyan-300" />}
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500">
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
        <div className="card border-amber-500/30 bg-amber-500/[0.05] p-6">
          <p className="micro-label !text-amber-300/90">What has to happen next</p>
          <ul className="mt-3 space-y-2">
            {result.required.map((r) => (
              <li
                key={r}
                className="flex gap-2.5 text-[12.5px] leading-relaxed text-zinc-300"
              >
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-400/70" />
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
          className="py-6 text-center text-xl font-semibold tracking-[-0.02em] text-zinc-100 sm:text-2xl"
        >
          The agent did not fail.{" "}
          <span className="text-rose-400">The decision expired.</span>
        </motion.p>
      )}
    </div>
  );
}
