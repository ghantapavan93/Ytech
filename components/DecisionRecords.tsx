"use client";

import { RecordFunnelDiagram } from "./diagram/RecordFunnelDiagram";
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
import { ENTER_EASE } from "@/lib/motion";
import { ArrowUp, CircleSlash, RotateCcw, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

const STATE_HEX: Record<EvidenceState, string> = {
  claimed: "#f43f5e",
  observed: "#f59e0b",
  verified: "#06b6d4",
  sustained: "#10b981",
  retired: "#71717a",
};

/**
 * One rung of the evidence ladder.
 *
 * These four counts describe a funnel: twelve decisions get claimed, fewer
 * get observed, fewer still get verified, and almost none stay true. They
 * used to sit in a four-column grid of cards, each with its own little bar
 * scaled to its own card, which is exactly the layout that hides a funnel.
 * Stacked on one shared track, the narrowing is the first thing you see.
 */
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
      className={`group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors sm:gap-4 ${
        active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
      }`}
    >
      <span
        className="w-[74px] shrink-0 text-[13px] font-semibold uppercase tracking-[0.08em] sm:w-[86px]"
        style={{ color: hex }}
      >
        {STATE_LABEL[state]}
      </span>

      <span className="mono-num w-6 shrink-0 text-right text-[19px] font-semibold text-ink-1 sm:text-[19px]">
        {count}
      </span>

      {/* The track is drawn full width so the shortfall is as visible as
          the bar. Without it these read as four bars rather than a drop. */}
      <span className="relative h-[22px] min-w-0 flex-1 overflow-hidden rounded-sm border border-dashed border-white/[0.10] sm:h-[26px]">
        <motion.span
          className="absolute inset-y-0 left-0 block"
          style={{ backgroundColor: hex, opacity: 0.3, borderRight: `2px solid ${hex}` }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.55, ease: ENTER_EASE }}
        />
      </span>

      <span className="hidden w-[15rem] shrink-0 text-[11.5px] leading-tight text-ink-4 lg:block">
        {STATE_MEANING[state]}
      </span>
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
          <h3 className="text-[15px] font-semibold text-ink-1">{record.workflow}</h3>
          <p className="mt-1 text-[11.5px] text-ink-4">
            {record.archetype} · bills {record.pricing} · {record.month}
          </p>
        </div>
        <span
          className="mono-num shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.12em]"
          style={{ color: hex, background: `${hex}1a` }}
        >
          {STATE_LABEL[record.state].toUpperCase()}
        </span>
      </div>

      <div className="space-y-3.5 p-5">
        <div>
          <p className="micro-label">They believed</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-3">{record.belief}</p>
        </div>
        <div>
          <p className="micro-label">What surfaced</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
            {record.contradiction}
          </p>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <p className="micro-label">Decision</p>
            <p className="mt-1 text-[13px] text-ink-3">
              {DECISION_LABEL[record.decision]}
            </p>
          </div>
          <div>
            <p className="micro-label">Owner</p>
            <p className="mt-1 text-[13px] text-ink-3">{record.owner}</p>
          </div>
        </div>
        <div>
          <p className="micro-label">What would settle it</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
            {record.evidenceRequired}
          </p>
        </div>
        {record.outcome && (
          <div className="rounded-xl border border-line bg-canvas/55 p-3.5">
            <p className="micro-label">What happened</p>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
              {record.outcome}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
        <span
          className={`inline-flex items-center gap-1.5 text-[11.5px] ${
            eligible ? "text-emerald-400" : "text-ink-4"
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-ink-2 transition-colors hover:border-line-strong hover:text-ink-1"
            >
              <ArrowUp size={11} />
              evidence arrived
            </button>
          )}
          {record.state !== "retired" && (
            <button
              onClick={onRetire}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-ink-4 transition-colors hover:border-rose-500/40 hover:text-rose-400"
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
            <h2 className="mt-2.5 max-w-2xl text-xl font-semibold leading-snug tracking-[-0.02em] text-ink-1 sm:text-2xl">
              {headline(stats)}
            </h2>
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-3">
              A firm can run twelve pilots and be unable to prove anything
              about eleven of them. This is that problem drawn to scale. Move
              a decision up the ladder when evidence actually arrives, or stop
              it and keep the reason.
            </p>
          </div>
          {dirty && (
            <button
              onClick={() => setRecords(SEED_RECORDS)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[11.5px] text-ink-3 transition-colors hover:text-ink-1"
            >
              <RotateCcw size={11} />
              reset portfolio
            </button>
          )}
        </div>

        <div className="mt-6">
          <RecordFunnelDiagram records={records} />
        </div>

        <div className="mt-6 space-y-1">
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
              filter === "retired" ? "text-ink-1" : "text-ink-4 hover:text-ink-2"
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
        <p className="card p-8 text-center text-[13px] text-ink-4">
          Nothing in that state right now.
        </p>
      )}
    </div>
  );
}
