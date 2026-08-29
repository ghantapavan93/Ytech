"use client";

import { SourcingFigure } from "@/components/diagram/SourcingFigure";
import { RangeSlider } from "@/components/RangeSlider";
import {
  AMORTISATION_MONTHS,
  DEFAULT_COSTS,
  compare,
  type Costs,
} from "@/components/sourcing/sourcing-data";
import {
  QUESTIONS,
  SOURCING_LABEL,
  SPEC_QA_SOURCING,
  sourcing,
  type Answer,
  type Sourcing,
  type SourcingInputs,
} from "@/lib/engines/sourcing-engine";
import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

/**
 * The structural half and the arithmetic half, in that order.
 *
 * The questions come first on purpose. A reader who meets the cost dials
 * first will decide on the numbers, which is the habit this page exists to
 * argue with, and no amount of copy underneath undoes an order of reading.
 */

const TONE: Record<Sourcing, { text: string; border: string; bg: string }> = {
  buy: { text: "text-live", border: "border-cyan-500/40", bg: "bg-cyan-500/[0.06]" },
  "buy-base-build-edge": {
    text: "text-ok",
    border: "border-ok/40",
    bg: "bg-ok/[0.06]",
  },
  build: { text: "text-ok", border: "border-ok/40", bg: "bg-ok/[0.06]" },
  wait: { text: "text-warn", border: "border-warn/40", bg: "bg-warn/[0.06]" },
  "not-yet": { text: "text-warn", border: "border-warn/40", bg: "bg-warn/[0.06]" },
};

const CYCLE: Answer[] = ["yes", "no", "unknown"];

const money = (n: number) =>
  `$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

export function SourcingBoard() {
  const [answers, setAnswers] = useState<SourcingInputs>(SPEC_QA_SOURCING);
  const [costs, setCosts] = useState<Costs>(DEFAULT_COSTS);

  const result = useMemo(() => sourcing(answers), [answers]);
  const c = useMemo(() => compare(costs), [costs]);
  const tone = TONE[result.verdict];

  const dirty =
    JSON.stringify(answers) !== JSON.stringify(SPEC_QA_SOURCING) ||
    JSON.stringify(costs) !== JSON.stringify(DEFAULT_COSTS);

  const cycle = (key: keyof SourcingInputs) =>
    setAnswers((prev) => ({
      ...prev,
      [key]: CYCLE[(CYCLE.indexOf(prev[key]) + 1) % 3],
    }));

  const pct = c.shareOfOperating * 100;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="micro-label">Five questions about the problem</p>
        {dirty && (
          <button
            onClick={() => {
              setAnswers(SPEC_QA_SOURCING);
              setCosts(DEFAULT_COSTS);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-ink-4 transition-colors hover:border-line-strong hover:text-ink-2"
          >
            <RotateCcw size={11} />
            reset
          </button>
        )}
      </div>

      <div className="grid gap-1.5 sm:grid-cols-2">
        {QUESTIONS.map((q) => {
          const value = answers[q.key];
          return (
            <button
              key={q.key}
              onClick={() => cycle(q.key)}
              className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-1 px-3.5 py-3 text-left transition-colors hover:border-line-strong"
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

      <div
        className={`status-surface rounded-xl border p-5 sm:p-6 ${tone.border} ${tone.bg}`}
      >
        <p className={`micro-label !${tone.text}`}>
          {SOURCING_LABEL[result.verdict]}
        </p>
        <p className="mt-2.5 max-w-2xl text-[19px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink-1">
          {result.headline}
        </p>
        <ul className="mt-4 space-y-2 border-t border-line pt-4">
          {result.because.map((b) => (
            <li key={b} className="text-[13px] leading-relaxed text-ink-3">
              {b}
            </li>
          ))}
        </ul>
        {result.unknowns.length > 0 && (
          <div className="mt-4 border-l-2 border-warn/50 pl-3">
            <p className="micro-label !text-warn">What has to be found out</p>
            <ul className="mt-1.5 space-y-1.5">
              {result.unknowns.map((u) => (
                <li key={u} className="text-[13px] leading-relaxed text-ink-3">
                  {u}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-line pt-8">
        <p className="micro-label">And now the part everyone starts with</p>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-3">
          Put your own numbers in. Whatever they are, they move one line of the
          model, and the drawing puts that line next to the decision the same
          firm has not made yet.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="micro-label">Subscription, a month</p>
            <div className="mt-2">
              <RangeSlider
                ariaLabel="Vendor subscription per month"
                min={0}
                max={6_000}
                step={100}
                value={costs.subscription}
                display={money(costs.subscription)}
                onChange={(subscription) => setCosts((p) => ({ ...p, subscription }))}
              />
            </div>
          </div>
          <div>
            <p className="micro-label">Cost to build it, once</p>
            <div className="mt-2">
              <RangeSlider
                ariaLabel="One-off cost to build"
                min={0}
                max={200_000}
                step={5_000}
                value={costs.buildCost}
                display={money(costs.buildCost)}
                onChange={(buildCost) => setCosts((p) => ({ ...p, buildCost }))}
              />
            </div>
          </div>
          <div>
            <p className="micro-label">Keeping it alive, a month</p>
            <div className="mt-2">
              <RangeSlider
                ariaLabel="Monthly maintenance of a built tool"
                min={0}
                max={4_000}
                step={100}
                value={costs.maintenance}
                display={money(costs.maintenance)}
                onChange={(maintenance) => setCosts((p) => ({ ...p, maintenance }))}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Buying, a month", value: money(c.buy) },
            {
              label: `Building, over ${AMORTISATION_MONTHS} months`,
              value: money(c.build),
            },
            {
              label: `Cheaper by`,
              value: `${money(c.gap)} · ${c.cheaper === "build" ? "building" : "buying"}`,
            },
          ].map((r) => (
            <div key={r.label} className="rounded-xl border border-line bg-surface-1 p-4">
              <p className="micro-label">{r.label}</p>
              <p className="mono-num mt-1.5 text-[17px] font-semibold text-ink-1">
                {r.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <figure className="card overflow-hidden">
        <div className="figure-pan px-4 pt-5 sm:px-6">
          <SourcingFigure gap={c.gap} />
        </div>
        <figcaption className="mt-2 border-t border-line px-5 py-4">
          <p className="text-[13px] font-medium text-ink-2">
            The two decisions, on one scale
          </p>
          <p className="diagram-reading mt-1.5 text-[13px] leading-relaxed text-ink-4">
            At these numbers, choosing between building and buying is worth{" "}
            {money(c.gap)} a month, which is{" "}
            {pct < 0.1 ? "under a tenth of a percent" : `${pct.toFixed(1)}%`} of
            what changing the four conditions around the workflow is worth. Both
            bars are the same scale. Where the tool came from does not appear on
            the value side of the model at all: the same hours come free, the
            same review load arrives, and the same fee gate decides who keeps
            the saving.
          </p>
        </figcaption>
      </figure>

      <p className="border-l-2 border-line-strong pl-4 text-[13px] leading-relaxed text-ink-3">
        Which is not an argument that this decision does not matter. It is an
        argument that a cost comparison is the wrong instrument for it. What
        building buys is a thing a competitor cannot license next quarter, and
        that is worth either a great deal or nothing at all depending on the
        five answers above, none of which is a price.
      </p>
    </div>
  );
}
