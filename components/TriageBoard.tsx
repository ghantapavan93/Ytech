"use client";

import { TriageFigure } from "@/components/diagram/TriageFigure";
import {
  CANDIDATES,
  VERDICT_LABEL,
  rank,
  type Answer,
  type Verdict,
  type WorkflowCandidate,
} from "@/lib/engines/triage-engine";
import { AnimatePresence, motion } from "framer-motion";
import { SETTLE } from "@/lib/motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

/**
 * The step before the wind tunnel.
 *
 * A consulting engagement does not open with "here is your agent". It opens
 * with a principal listing what the firm does over and over, and someone
 * working out which of those is worth the cost of an experiment.
 *
 * The answers are editable on purpose. Turning any blocking question to
 * "don't know" demotes the workflow immediately, which is the fastest way to
 * show that this is a rule being applied rather than a ranking someone
 * typed out.
 */

const TONE: Record<Verdict, { text: string; border: string; bg: string }> = {
  test: { text: "text-ok", border: "border-ok/40", bg: "bg-ok/[0.06]" },
  "redesign-first": { text: "text-warn", border: "border-warn/40", bg: "bg-warn/[0.06]" },
  "not-yet": { text: "text-cyan-300", border: "border-cyan-500/40", bg: "bg-cyan-500/[0.06]" },
  leave: { text: "text-ink-4", border: "border-line", bg: "bg-surface-1" },
};

const QUESTIONS: { key: keyof WorkflowCandidate; ask: string }[] = [
  { key: "qualityMeasured", ask: "Can you tell a good output from a bad one?" },
  { key: "licensedReview", ask: "Does a licensed professional sign it off?" },
  { key: "standardised", ask: "Is it the same shape every time?" },
  { key: "billedHourly", ask: "Is it billed hourly?" },
  { key: "teachesJuniors", ask: "Is it how juniors learn?" },
];

const CYCLE: Answer[] = ["yes", "no", "unknown"];

export function TriageBoard() {
  const [answers, setAnswers] = useState<WorkflowCandidate[]>(CANDIDATES);
  const [open, setOpen] = useState<string | null>(null);
  const results = useMemo(() => rank(answers), [answers]);
  const dirty = JSON.stringify(answers) !== JSON.stringify(CANDIDATES);

  const cycle = (id: string, key: keyof WorkflowCandidate) =>
    setAnswers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, [key]: CYCLE[(CYCLE.indexOf(c[key] as Answer) + 1) % 3] }
          : c,
      ),
    );

  const cannotJudge = results.filter((r) => r.verdict === "not-yet").length;

  return (
    <div className="space-y-5">
      <div className="card overflow-hidden">
        <div className="figure-pan px-4 pt-5 sm:px-6">
          <TriageFigure results={results} />
        </div>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="micro-label">The list, in the order to spend attention</p>
        {dirty && (
          <button
            onClick={() => setAnswers(CANDIDATES)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-ink-4 transition-colors hover:border-line-strong hover:text-ink-2"
          >
            <RotateCcw size={11} />
            reset answers
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {results.map((r) => {
          const tone = TONE[r.verdict];
          const expanded = open === r.candidate.id;
          return (
            <motion.div
              key={r.candidate.id}
              /**
               * Changing an answer re-ranks the list, which means the row you
               * just clicked moves. Animating the position turns that from a
               * jump into the thing worth watching: the eye follows the row
               * down the board and reads the demotion as a consequence.
               * Position only, so the expand height animation keeps its own
               * timing.
               */
              layout="position"
              transition={SETTLE}
              className={`status-surface rounded-xl border ${tone.border} ${tone.bg}`}
            >
              <button
                onClick={() => setOpen(expanded ? null : r.candidate.id)}
                aria-expanded={expanded}
                className="flex w-full items-start gap-4 p-4 text-left"
              >
                <span className={`mono-num w-14 shrink-0 text-[19px] font-semibold ${tone.text}`}>
                  {Math.round(r.exposureHours)}h
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-ink-1">
                    {r.candidate.name}
                  </span>
                  <span className={`mt-0.5 block text-[13px] ${tone.text}`}>
                    {r.headline}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span
                    className={`hidden text-[11.5px] font-medium sm:inline ${tone.text}`}
                  >
                    {VERDICT_LABEL[r.verdict]}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-ink-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={SETTLE}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-line px-4 py-4">
                      <ul className="space-y-1.5">
                        {r.because.map((b) => (
                          <li key={b} className="text-[13px] leading-relaxed text-ink-3">
                            {b}
                          </li>
                        ))}
                      </ul>

                      {r.unknowns.length > 0 && (
                        <div className="mt-4 border-l-2 border-warn/50 pl-3">
                          <p className="micro-label !text-warn">
                            What has to be found out
                          </p>
                          <ul className="mt-1.5 space-y-1.5">
                            {r.unknowns.map((u) => (
                              <li key={u} className="text-[13px] leading-relaxed text-ink-3">
                                {u}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="micro-label mt-5">
                        Change an answer and the verdict recomputes
                      </p>
                      <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                        {QUESTIONS.map((q) => {
                          const value = r.candidate[q.key] as Answer;
                          return (
                            <button
                              key={q.key}
                              onClick={() => cycle(r.candidate.id, q.key)}
                              className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2 text-left transition-colors hover:border-line-strong"
                            >
                              <span className="text-[13px] text-ink-3">{q.ask}</span>
                              <span
                                className={`mono-num shrink-0 text-[11.5px] font-semibold uppercase ${
                                  value === "unknown"
                                    ? "text-warn"
                                    : value === "yes"
                                      ? "text-ok"
                                      : "text-ink-4"
                                }`}
                              >
                                {value === "unknown" ? "don't know" : value}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <p className="border-l-2 border-line-strong pl-4 text-[13px] leading-relaxed text-ink-3">
        {cannotJudge > 0
          ? `${cannotJudge} of these cannot be judged yet, and that is the useful output. A triage that ranked them anyway would be inventing the part nobody measured.`
          : "Every workflow here has enough behind it to be judged. That is unusual, and worth saying out loud when it happens."}
      </p>
    </div>
  );
}
