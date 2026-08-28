"use client";

import {
  advance,
  canEmitPattern,
  DECISION_LABEL,
  headline,
  portfolioStats,
  retire,
  SEED_RECORDS,
  STATE_LABEL,
  STATE_MEANING,
  STATE_ORDER,
  type DecisionRecord,
  type EvidenceState,
} from "@/lib/engines/record-engine";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, CircleSlash, RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

const STATE_HEX: Record<EvidenceState, string> = {
  claimed: "#f43f5e",
  observed: "#f59e0b",
  verified: "#06b6d4",
  sustained: "#10b981",
  retired: "#71717a",
};

function Rung({
  state,
  count,
  max,
  active,
  onClick,
}: {
  state: EvidenceState;
  count: number;
  max: number;
  active: boolean;
  onClick: () => void;
}) {
  const hex = STATE_HEX[state];
  const pct = max === 0 ? 0 : (count / max) * 100;
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`w-full rounded-xl border p-4 text-left transition-colors ${
        active ? "border-line-strong bg-white/[0.04]" : "border-line hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12.5px] font-semibold" style={{ color: hex }}>
          {STATE_LABEL[state]}
        </span>
        <span className="mono-num text-[15px] font-semibold text-zinc-200">{count}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: hex }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="mt-2 text-[10.5px] leading-relaxed text-zinc-600">
        {STATE_MEANING[state]}
      </p>
    </button>
  );
}

function RecordCard({
  record,
  onAdvance,
  onRetire,
}: {
  record: DecisionRecord;
  onAdvance: () => void;
  onRetire: () => void;
}) {
  const hex = STATE_HEX[record.state];
  const eligible = canEmitPattern(record);
  const atTop = record.state === "sustained" || record.state === "retired";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="card overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line p-5">
        <div>
          <h3 className="text-[14px] font-semibold text-zinc-200">{record.workflow}</h3>
          <p className="mt-1 text-[11.5px] text-zinc-500">
            {record.archetype} · bills {record.pricing} · {record.month}
          </p>
        </div>
        <span
          className="mono-num shrink-0 rounded-md px-2 py-1 text-[9.5px] font-bold tracking-[0.12em]"
          style={{ color: hex, background: `${hex}1a` }}
        >
          {STATE_LABEL[record.state].toUpperCase()}
        </span>
      </div>

      <div className="space-y-3.5 p-5">
        <div>
          <p className="micro-label">They believed</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-400">{record.belief}</p>
        </div>
        <div>
          <p className="micro-label">What surfaced</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-300">
            {record.contradiction}
          </p>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <p className="micro-label">Decision</p>
            <p className="mt-1 text-[12.5px] text-zinc-400">
              {DECISION_LABEL[record.decision]}
            </p>
          </div>
          <div>
            <p className="micro-label">Owner</p>
            <p className="mt-1 text-[12.5px] text-zinc-400">{record.owner}</p>
          </div>
        </div>
        <div>
          <p className="micro-label">What would settle it</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-400">
            {record.evidenceRequired}
          </p>
        </div>
        {record.outcome && (
          <div className="rounded-xl border border-line bg-canvas/50 p-3.5">
            <p className="micro-label">What happened</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-zinc-300">
              {record.outcome}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] ${
            eligible ? "text-emerald-400" : "text-zinc-600"
          }`}
        >
          {eligible ? <ShieldCheck size={12} /> : <CircleSlash size={12} />}
          {eligible
            ? "May contribute an anonymized pattern"
            : "Not proven enough to contribute a pattern"}
        </span>
        <div className="flex gap-2">
          {!atTop && (
            <button
              onClick={onAdvance}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-zinc-300 transition-colors hover:border-line-strong hover:text-zinc-100"
            >
              <ArrowUp size={11} />
              evidence arrived
            </button>
          )}
          {record.state !== "retired" && (
            <button
              onClick={onRetire}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-zinc-500 transition-colors hover:border-rose-500/40 hover:text-rose-400"
            >
              <CircleSlash size={11} />
              stop it
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function DecisionRecords() {
  const [records, setRecords] = useState<DecisionRecord[]>(SEED_RECORDS);
  const [filter, setFilter] = useState<EvidenceState | null>(null);

  const stats = useMemo(() => portfolioStats(records), [records]);
  const maxRung = Math.max(...STATE_ORDER.map((s) => stats.byState[s]), 1);

  const shown = filter ? records.filter((r) => r.state === filter) : records;

  const update = (id: string, fn: (r: DecisionRecord) => DecisionRecord) =>
    setRecords((prev) => prev.map((r) => (r.id === id ? fn(r) : r)));

  const dirty = records.some(
    (r, i) => r.state !== SEED_RECORDS[i].state,
  );

  return (
    <div className="space-y-6">
      {/* The uncomfortable number, computed */}
      <div className="card p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="micro-label">Portfolio, twelve synthetic decisions</p>
            <h2 className="mt-2.5 max-w-2xl text-xl font-semibold leading-snug tracking-[-0.02em] text-zinc-100 sm:text-2xl">
              {headline(stats)}
            </h2>
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-zinc-400">
              A firm can run twelve pilots and be unable to prove anything
              about eleven of them. This is that problem drawn to scale. Move
              a decision up the ladder when evidence actually arrives, or stop
              it and keep the reason.
            </p>
          </div>
          {dirty && (
            <button
              onClick={() => setRecords(SEED_RECORDS)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[11.5px] text-zinc-400 transition-colors hover:text-zinc-200"
            >
              <RotateCcw size={11} />
              reset portfolio
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STATE_ORDER.map((s) => (
            <Rung
              key={s}
              state={s}
              count={stats.byState[s]}
              max={maxRung}
              active={filter === s}
              onClick={() => setFilter(filter === s ? null : s)}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4">
          <button
            onClick={() => setFilter(filter === "retired" ? null : "retired")}
            className={`text-[11.5px] transition-colors ${
              filter === "retired" ? "text-zinc-200" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {stats.retired} retired, kept on purpose
          </button>
          <span className="text-[11.5px] text-emerald-400">
            {stats.patternEligible} eligible to contribute a pattern
          </span>
          {filter && (
            <button
              onClick={() => setFilter(null)}
              className="text-[11.5px] text-cyan-300 transition-colors hover:text-cyan-200"
            >
              show all {records.length}
            </button>
          )}
        </div>
      </div>

      {/* The records */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((r) => (
            <RecordCard
              key={r.id}
              record={r}
              onAdvance={() => update(r.id, advance)}
              onRetire={() => update(r.id, retire)}
            />
          ))}
        </AnimatePresence>
      </div>

      {shown.length === 0 && (
        <p className="card p-8 text-center text-[13px] text-zinc-500">
          Nothing in that state right now.
        </p>
      )}
    </div>
  );
}
