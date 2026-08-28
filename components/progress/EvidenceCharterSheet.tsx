"use client";

import {
  CLAIM,
  DECISION_LABEL,
  buildCharter,
  type Decision,
  type ProgressResult,
} from "@/lib/engines/progress-engine";
import { Printer } from "lucide-react";

/**
 * The charter, rendered as the document rather than as an interface.
 *
 * Up to this point everything on the page is an instrument. This is the
 * thing the instrument produces, so it stops being dark cards and becomes a
 * sheet of paper with a header, a statement, and fields someone has to sign
 * off. It prints as-is.
 */

const DECISION_INK: Record<Decision, { ink: string; chip: string }> = {
  scale: { ink: "#0f7a4a", chip: "#dff3e7" },
  bounded: { ink: "#8a5a05", chip: "#fbf0d6" },
  redesign: { ink: "#9b1c2e", chip: "#fbe1e4" },
  stop: { ink: "#9b1c2e", chip: "#f8d2d7" },
};

/** The twelve derived fields, grouped the way a reader scans them. */
const GROUPS: { title: string; fields: string[] }[] = [
  {
    title: "What is being tested",
    fields: ["Business owner", "The original claim", "Baseline"],
  },
  {
    title: "What must be measured",
    fields: [
      "Accepted-output quality",
      "Rework and exception rate",
      "Licensed-review burden",
    ],
  },
  {
    title: "Where the value has to land",
    fields: [
      "Saved-capacity destination",
      "Fee-model exposure",
      "Junior learning protection",
    ],
  },
  {
    title: "How it ends",
    fields: ["Success condition", "Stop condition", "Evidence required to reopen"],
  },
];

export function EvidenceCharterSheet({ result }: { result: ProgressResult }) {
  const charter = buildCharter(result);
  const byLabel = new Map(charter.map((f) => [f.label, f.value]));
  const ink = DECISION_INK[result.decision];

  return (
    <div
      id="evidence-sheet"
      className="paper overflow-hidden rounded-lg px-7 py-8 sm:px-10 sm:py-10"
    >
      {/* masthead */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="paper-label">
            Value Shift · Proof of Progress · synthetic case
          </p>
          <h3 className="mt-2.5 text-2xl font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[30px]">
            30-day specification-QA
            <br />
            evidence charter
          </h3>
        </div>
        <button
          onClick={() => window.print()}
          className="print-hidden inline-flex items-center gap-2 rounded-md border border-black/15 px-3 py-2 text-[12px] font-medium text-[#2c2c30] transition-colors hover:border-black/35 hover:bg-black/[0.04]"
        >
          <Printer size={13} />
          Print / save PDF
        </button>
      </div>

      {/* the decision, stated once, at the top */}
      <div className="paper-rule mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-5">
        <div>
          <p className="paper-label">Decision</p>
          <span
            className="mt-1.5 inline-block rounded px-2 py-1 text-[13px] font-semibold"
            style={{ color: ink.ink, background: ink.chip }}
          >
            {DECISION_LABEL[result.decision]}
          </span>
        </div>
        <div>
          <p className="paper-label">Links measured and holding</p>
          <p className="paper-mono mt-2 text-[15px] font-semibold">
            {result.proven} of {result.layers.length}
          </p>
        </div>
        <div>
          <p className="paper-label">Links never measured</p>
          <p className="paper-mono mt-2 text-[15px] font-semibold">
            {result.unknown}
          </p>
        </div>
        <div>
          <p className="paper-label">Headline claim under test</p>
          <p className="paper-mono mt-2 text-[15px] font-semibold">
            {CLAIM.headlineValue}
            {CLAIM.headlineUnit} {CLAIM.headlineLabel}
          </p>
        </div>
      </div>

      {/* the finding, in the words the room will repeat */}
      <div className="paper-rule mt-6 border-t pt-6">
        <p className="paper-label">Finding</p>
        <p className="mt-2.5 max-w-3xl text-[17px] font-medium leading-[1.45] tracking-[-0.01em] sm:text-[19px]">
          {result.headline}
        </p>
        <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-[#4a4a50]">
          {result.because}
        </p>
      </div>

      {/* the fields */}
      <div className="paper-rule mt-7 grid gap-x-8 gap-y-7 border-t pt-6 sm:grid-cols-2">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <p className="paper-label">{g.title}</p>
            <dl className="mt-3 space-y-3">
              {g.fields.map((label) => (
                <div key={label}>
                  <dt className="text-[12px] font-semibold text-[#2c2c30]">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-[12.5px] leading-relaxed text-[#55555c]">
                    {byLabel.get(label)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      {/* what remains open */}
      {result.toScale.length > 0 && (
        <div className="paper-rule mt-7 border-t pt-6">
          <p className="paper-label">Open before this can scale</p>
          <ol className="mt-3 space-y-1.5">
            {result.toScale.map((s, i) => (
              <li key={s} className="flex gap-3 text-[12.5px] leading-relaxed">
                <span className="paper-mono shrink-0 text-[#63636b]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[#3a3a40]">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="paper-rule mt-8 flex flex-wrap items-end justify-between gap-4 border-t pt-5">
        <p className="max-w-md text-[10.5px] leading-relaxed text-[#63636b]">
          Synthetic worked example. Every figure is computed from published
          consultant fee and utilization data through a deterministic model,
          with no language model anywhere in the decision path.
        </p>
        <p className="text-right text-[12px] font-semibold text-[#2c2c30]">
          A pilot is not a result.
          <br />
          <span className="font-normal text-[#55555c]">
            The result is what the firm can prove afterwards.
          </span>
        </p>
      </div>
    </div>
  );
}
