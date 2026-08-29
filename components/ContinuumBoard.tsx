"use client";

import { QUESTION, START_DELTA, TIMELINE } from "@/lib/content/positions-data";
import {
  answerFrom,
  decide,
  DECISION_LABEL,
  type Decision,
  type Evidence,
  type Position,
} from "@/lib/engines/continuum-engine";
import { SNAP } from "@/lib/motion";
import { motion } from "framer-motion";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * Four screens: what was said, what appears to have moved, what the author
 * decides, and what may then be spoken.
 *
 * The third screen is the product. The first two are inference and could be
 * automated; the fourth is bookkeeping. Only the third is a judgment, and it
 * is the one every system of this kind quietly performs on the author's
 * behalf.
 */

const STEPS = ["Then and now", "The delta", "The decision", "What may be said"] as const;

const DECISIONS: { id: Decision; detail: string }[] = [
  { id: "keep-both", detail: "Both are true, of different firms. The newer one leads for firms already running pilots." },
  { id: "supersede", detail: "The newer position replaces the older one everywhere." },
  { id: "qualify", detail: "Keep the old sequence, but gate it on how far along the firm already is." },
  { id: "reject", detail: "This is not a change of position. The earlier answer stands as written." },
  { id: "defer", detail: "Not enough to decide on. Neither answer is spoken until it is." },
];

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export function ContinuumBoard() {
  const [step, setStep] = useState(0);
  const [decision, setDecision] = useState<Decision | null>(null);

  const resolved = useMemo(
    () => (decision ? decide(START_DELTA, decision, "Sam", "2026-08-29") : null),
    [decision],
  );

  const positions: Position[] = useMemo(
    () => resolved?.positions ?? [START_DELTA.previous, START_DELTA.proposed],
    [resolved],
  );

  const answer = useMemo(
    () => answerFrom(QUESTION, positions, resolved ? null : START_DELTA),
    [positions, resolved],
  );

  return (
    <div className="space-y-6">
      <div className="-ml-1 flex flex-wrap items-center gap-1">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            aria-current={i === step ? "step" : undefined}
            className={`rounded-lg px-3 py-1.5 text-[12.5px] transition-colors ${
              i === step
                ? "bg-surface-2 font-medium text-ink-1"
                : "text-ink-4 hover:text-ink-2"
            }`}
          >
            <span className="mono-num mr-1.5 text-[11px] text-ink-4">{i + 1}</span>
            {s}
          </button>
        ))}
      </div>

      <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SNAP}>
        {step === 0 && <ThenAndNow />}
        {step === 1 && <Delta />}
        {step === 2 && (
          <TheDecision decision={decision} onChoose={(d) => { setDecision(d); setStep(3); }} />
        )}
        {step === 3 && (
          <WhatMayBeSaid answer={answer} decision={decision} onReset={() => { setDecision(null); setStep(0); }} />
        )}
      </motion.div>
    </div>
  );
}

function ThenAndNow() {
  return (
    <div className="space-y-5">
      <div className="card p-5 sm:p-6">
        <p className="micro-label">The question</p>
        <p className="mt-2 text-[19px] font-semibold leading-snug tracking-[-0.02em] text-ink-1">
          {QUESTION}
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {[START_DELTA.previous, START_DELTA.proposed].map((p, i) => (
          <div
            key={p.id}
            className={`status-surface rounded-xl border p-5 ${
              i === 0 ? "border-line bg-surface-1" : "border-warn/40 bg-warn/[0.05]"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="micro-label">{i === 0 ? "Answered from" : "Newer material suggests"}</p>
              <span className="mono-num text-[11px] text-ink-4">
                v{p.version} · {fmt(p.effectiveFrom)}
              </span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{p.claim}</p>
            <dl className="mt-4 space-y-1.5 border-t border-line pt-3.5 text-[12.5px]">
              <Row k="Audience" v={p.audience} />
              <Row k="Applies when" v={p.applicability} />
            </dl>
            {i === 0 && (
              <p className="mt-3 rounded-md border border-line px-3 py-2 text-[12px] text-ink-4">
                Correct when captured. Possibly incomplete today.
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="card p-5 sm:p-6">
        <p className="micro-label">Every source, dated</p>
        <ol className="mt-4 space-y-0">
          {TIMELINE.map((e: Evidence, i) => (
            <li key={e.id} className="flex gap-4 border-t border-line py-2.5 first:border-t-0 first:pt-0">
              <span className="mono-num w-20 shrink-0 text-[11.5px] text-ink-4">
                {fmt(e.date)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] leading-snug text-ink-2">
                  {e.verbatim ? `“${e.quote}”` : e.quote}
                </span>
                <span className="mt-0.5 block text-[11.5px] text-ink-4">
                  {e.source}
                  {!e.verbatim && " · summarised, not verbatim"}
                </span>
              </span>
              <span className="mono-num shrink-0 text-[10px] text-ink-4">
                {i < 3 ? "v1" : "v2?"}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Delta() {
  const d = START_DELTA;
  return (
    <div className="space-y-4">
      <div className="status-surface rounded-xl border border-warn/40 bg-warn/[0.05] p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="micro-label !text-warn">Position delta detected</p>
          <span className="mono-num text-[11.5px] text-warn">
            confidence {Math.round(d.confidence * 100)}% · unapproved
          </span>
        </div>
        <p className="mt-3 text-[19px] font-semibold leading-snug tracking-[-0.02em] text-ink-1">
          {d.topic}
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{d.whatChanged}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="What did not change">
          <p className="text-[13px] leading-relaxed text-ink-3">{d.whatDidNot}</p>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-4">
            Said first and on purpose. Most apparent reversals are additions,
            and a system that reports every addition as a contradiction will be
            switched off inside a week.
          </p>
        </Panel>

        <Panel title="Likeliest explanation">
          <p className="text-[13px] leading-relaxed text-ink-3">
            {d.likeliestExplanation}
          </p>
        </Panel>

        <Panel title="What this cannot tell from the evidence">
          <ul className="space-y-2">
            {d.uncertainty.map((u) => (
              <li key={u} className="text-[13px] leading-relaxed text-ink-3">
                {u}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Answers this would change">
          <ul className="space-y-2">
            {d.affects.map((a) => (
              <li key={a} className="text-[13px] leading-relaxed text-ink-3">
                {a}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <p className="border-l-2 border-line-strong pl-4 text-[13px] leading-relaxed text-ink-3">
        Confidence {Math.round(d.confidence * 100)}% is a reading about the
        published record, not about what anybody believes. Nothing above is a
        finding that a position is wrong, and nothing here is permission to
        change one.
      </p>
    </div>
  );
}

function TheDecision({
  decision,
  onChoose,
}: {
  decision: Decision | null;
  onChoose: (d: Decision) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="card p-5 sm:p-6">
        <p className="micro-label">What this will not do</p>
        <p className="mt-2.5 max-w-2xl text-[19px] font-semibold leading-snug tracking-[-0.02em] text-ink-1">
          I found a possible evolution in judgment. That is not permission to
          rewrite a position.
        </p>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-4">
          The obvious behaviour here is to update automatically and report the
          improvement. It is also the behaviour that produces a system speaking
          confidently as a version of somebody that never existed. Five options,
          and nothing happens without one being chosen.
        </p>
      </div>

      <div className="space-y-2.5">
        {DECISIONS.map((d) => (
          <button
            key={d.id}
            onClick={() => onChoose(d.id)}
            className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors ${
              decision === d.id
                ? "border-ok/45 bg-ok/[0.06]"
                : "border-line bg-surface-1 hover:border-line-strong hover:bg-surface-2"
            }`}
          >
            <span className="mt-0.5 shrink-0 text-ink-4">
              {decision === d.id ? <Check size={14} className="text-ok" /> : <ArrowRight size={14} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-medium text-ink-1">
                {DECISION_LABEL[d.id]}
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-ink-4">
                {d.detail}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function WhatMayBeSaid({
  answer,
  decision,
  onReset,
}: {
  answer: ReturnType<typeof answerFrom>;
  decision: Decision | null;
  onReset: () => void;
}) {
  const p = answer.provenance;
  const speaking = answer.mode !== "abstain";
  const executable = decision === "keep-both" || decision === "supersede" || decision === "qualify";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="micro-label">Ask the same question again</p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-ink-4 transition-colors hover:border-line-strong hover:text-ink-2"
        >
          <RotateCcw size={11} />
          start over
        </button>
      </div>

      <div className="card p-5 sm:p-6">
        <p className="text-[13px] text-ink-4">{QUESTION}</p>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-1">{answer.text}</p>

        {answer.note && (
          <p className="mt-3 rounded-md border border-warn/35 bg-warn/[0.05] px-3 py-2 text-[12.5px] leading-relaxed text-ink-3">
            {answer.note}
          </p>
        )}

        <dl className="mt-5 grid gap-x-8 gap-y-2 border-t border-line pt-4 text-[12.5px] sm:grid-cols-2">
          <Row k="Position" v={`v${p.version}, ${p.approval}`} />
          <Row k="Effective from" v={p.effectiveFrom === "—" ? "—" : fmt(p.effectiveFrom)} />
          <Row k="Applies to" v={p.audience} />
          <Row k="Conditions" v={p.applicability} />
          {p.supersedes !== undefined && <Row k="Supersedes" v={`v${p.supersedes}`} />}
          <Row k="Approved by" v={speaking && decision ? "Sam, 29 Aug 2026" : "not approved"} />
        </dl>
      </div>

      {executable && (
        <div className="status-surface rounded-xl border border-ok/40 bg-ok/[0.06] p-5">
          <p className="micro-label !text-ok">This position has an executable method</p>
          <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">
            The approved position says the operating conditions decide whether
            value survives. That is a claim something can be run against rather
            than only stated, so the next time a client says an agent is 42%
            faster, the position has a way of being tested instead of repeated.
          </p>
          <Link
            href="/room"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line-strong bg-surface-1 px-4 py-2.5 text-[13px] font-medium text-ink-1 transition-colors hover:border-white/25 hover:bg-surface-2"
          >
            Run the method
            <ArrowRight size={13} className="text-ink-4" />
          </Link>
        </div>
      )}

      <p className="border-l-2 border-line-strong pl-4 text-[13px] leading-relaxed text-ink-3">
        The answer changed because somebody decided it should, on a date, with
        the evidence attached and the older position still readable underneath.
        Knowledge can be updated automatically. Judgment cannot.
      </p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface-1 p-5">
      <p className="micro-label">{title}</p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-line pt-1.5 first:border-t-0">
      <dt className="shrink-0 text-ink-4">{k}</dt>
      <dd className="text-right text-ink-2">{v}</dd>
    </div>
  );
}
