"use client";

import type { EngineOutput, FirmBaseline, Levers } from "@/lib/engines/engine";
import { assumptionHash, fmtHours, fmtMoney, fmtPct } from "@/lib/format";
import type { Preset } from "@/lib/presets";
import { FlaskConical, Printer, RotateCcw } from "lucide-react";
import { SYSTEM_STYLE } from "./status";

interface Stage4Props {
  base: FirmBaseline;
  levers: Levers;
  out: EngineOutput;
  presets: Preset[];
  activePresetId: string | null;
  onPreset: (preset: Preset) => void;
  onReset: () => void;
}

const PRICING_LABEL: Record<Levers["pricingModel"], string> = {
  TM_100: "100% time & materials (legacy)",
  BLENDED_50: "Blended 50/50 fixed + T&M",
  FIXED_FEE: "Fixed fee per package",
};

const REVIEW_LABEL: Record<Levers["reviewArchitecture"], string> = {
  FULL_MANUAL: "Full manual PE re-verification",
  RAW_AI_UNGOVERNED: "Raw AI acceptance (ungoverned)",
  TIERED_DELTA_GATE: "Risk-tiered delta gate, exception escalation",
};

const SAFEGUARD_LABEL: Record<Levers["apprenticeshipSafeguard"], string> = {
  NONE: "None, full automation of junior pass",
  BLIND_AUDIT_20_PCT: "20% blind manual audit + AI delta comparison",
};

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-1.5">
      <span className="text-[11.5px] uppercase tracking-[0.1em] text-neutral-500">{k}</span>
      <span
        className={`mono-num text-right text-[13px] ${
          strong ? "font-semibold text-neutral-900" : "text-neutral-700"
        }`}
      >
        {v}
      </span>
    </div>
  );
}

/**
 * Stage 4, the deliverable. Not a deployment recommendation: a bounded,
 * owned, stoppable 30-day experiment compiled from the current lever state.
 * Renders as a paper artifact; printing ships only this sheet.
 */
export function Stage4Charter({
  base,
  levers,
  out,
  presets,
  activePresetId,
  onPreset,
  onReset,
}: Stage4Props) {
  const sys = SYSTEM_STYLE[out.systemStatus];
  const pilotPackages = Math.max(Math.round(base.monthlyPackageVolume / 2), 1);
  const pilotShare = pilotPackages / base.monthlyPackageVolume;
  const pilotMarginTarget = out.deltaMargin * pilotShare;
  const peStopThreshold = (out.peHoursPerPkg * 1.5).toFixed(1);
  const hash = assumptionHash({ base, levers });

  const recommendationCopy =
    out.recommendation === "RUN_30_DAY_EXPERIMENT"
      ? "Proceed as a bounded 30-day experiment. Deployment approval comes from the measured result, not this simulation."
      : out.recommendation === "REDESIGN_BEFORE_PILOT"
        ? "Do not pilot yet. Resolve the flagged friction (see verdict) and re-run the wind tunnel before committing real packages."
        : "Do not deploy. The current operating configuration rejects this agent, re-tune pricing, review, or safeguards first.";

  return (
    <section id="stage-4" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14">
      <div className="fade-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="micro-label">Stage 04 · The deliverable</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-ink-1 sm:text-3xl">
              Not a deployment. <span className="text-ink-4">A 30-day experiment.</span>
            </h2>
          </div>
          <div className="print-hidden flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => onPreset(p)}
                title={p.tagline}
                className={`rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all ${
                  activePresetId === p.id
                    ? "border-cyan-400/55 bg-cyan-500/12 text-cyan-200"
                    : "border-line text-ink-3 hover:border-line-strong hover:text-ink-1"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* The paper charter */}
          <div
            id="charter-sheet"
            className="rounded-2xl border border-neutral-300 bg-white p-7 text-neutral-900 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.6)] sm:p-9"
          >
            <div className="flex items-start justify-between gap-4 border-b-2 border-neutral-900 pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">
                  Value Shift · Wind Tunnel Output
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-neutral-900">
                  30-Day Experiment Charter
                </h3>
                <p className="mt-1 text-[13px] text-neutral-500">
                  Spec-QA agent · Atlas Structural &amp; Civil (synthetic case)
                </p>
              </div>
              <div className="text-right">
                <p className="mono-num text-[11.5px] text-neutral-500">Assumption hash</p>
                <p className="mono-num text-[13px] font-bold tracking-wider text-neutral-900">
                  {hash}
                </p>
                <p
                  className="mono-num mt-2 inline-block rounded px-2 py-0.5 text-[10px] font-bold tracking-[0.12em] text-white"
                  style={{ backgroundColor: sys.hex }}
                >
                  {sys.chipLabel}
                </p>
              </div>
            </div>

            <div className="grid gap-x-10 sm:grid-cols-2">
              <div className="pt-4">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-neutral-900">
                  Ownership &amp; scope
                </p>
                <Row k="Accountable owner" v="Structural Practice Leader (PE)" strong />
                <Row k="Bounded scope" v={`${pilotPackages} commercial submittal pkgs`} />
                <Row k="Duration" v="30 days, weekly review" />
                <Row k="Decision at day 30" v="Scale · redesign · kill" strong />
              </div>

              <div className="pt-4">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-neutral-900">
                  Governed architecture
                </p>
                <Row k="Pricing" v={PRICING_LABEL[levers.pricingModel]} />
                <Row
                  k="Capacity routing"
                  v={`${Math.round(levers.backlogRedeploymentPct * 100)}% freed hours → backlog`}
                />
                <Row k="Review gate" v={REVIEW_LABEL[levers.reviewArchitecture]} />
                <Row k="Apprenticeship" v={SAFEGUARD_LABEL[levers.apprenticeshipSafeguard]} />
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-neutral-900">
                  Verifiable targets
                </p>
                <Row
                  k="Net margin uplift"
                  v={`${fmtMoney(pilotMarginTarget, { sign: true })} on ${pilotPackages} pkgs`}
                  strong
                />
                <Row
                  k="PE review budget"
                  v={`≤ ${fmtHours(out.peHoursPerPkg * pilotPackages, 0)} total (${fmtHours(out.peHoursPerPkg, 1)}/pkg)`}
                />
                <Row k="Jr utilization floor" v={`≥ ${fmtPct(Math.min(out.jrUtilizationPct, 90), 0)}`} />
                <Row k="Deep-practice floor" v={`${fmtHours(out.deepPracticeHours * pilotShare, 0)} blind-audit hours`} />
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-neutral-900">
                  Deterministic stop conditions
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-neutral-700">
                  Halt immediately and redesign if{" "}
                  <span className="font-semibold">
                    PE exception handling exceeds {peStopThreshold}h per package
                  </span>
                  , the blind audit finds{" "}
                  <span className="font-semibold">any material error</span> the agent
                  missed, or realized margin runs below the pre-AI baseline for two
                  consecutive weeks.
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-neutral-200 pt-4">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-neutral-900">
                Recommendation
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-700">
                {recommendationCopy}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-10 border-t border-neutral-200 pt-5">
              <div>
                <div className="h-8 border-b border-neutral-400" />
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                  Experiment owner · date
                </p>
              </div>
              <div>
                <div className="h-8 border-b border-neutral-400" />
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                  Managing principal · date
                </p>
              </div>
            </div>

            <p className="mt-6 text-[10px] leading-relaxed text-neutral-400">
              Compiled by the Value Shift deterministic engine from the synthetic,
              editable assumptions hashed above. This sheet models organizational
              fit; it does not predict real-world ROI. Baseline: {fmtMoney(out.baselineRevenue)}{" "}
              revenue · {fmtMoney(out.baselineMargin)} margin ({fmtPct(out.baselineMarginPct, 0)}) ·{" "}
              {fmtHours(out.baselinePeHoursPerWeek, 0)}/wk PE review ·{" "}
              {fmtPct(out.baselineJrUtilizationPct, 0)} junior utilization.
            </p>
          </div>

          {/* Side rail: actions + future glimpse */}
          <div className="print-hidden flex flex-col gap-5">
            <div className="card p-6">
              <p className="micro-label">Export</p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
                The charter prints as a clean one-page executive artifact, ready
                for a board packet, an SOW appendix, or a cohort workshop.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-[13px] font-semibold text-zinc-950 transition-colors hover:bg-white"
                >
                  <Printer size={15} />
                  Export / print charter
                </button>
                <button
                  onClick={onReset}
                  className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-[13px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink-1"
                >
                  <RotateCcw size={15} />
                  Reset wind tunnel
                </button>
              </div>
            </div>

            <div className="card border-cyan-500/25 bg-cyan-500/[0.06] p-6">
              <div className="flex items-center gap-2 text-cyan-300">
                <FlaskConical size={14} />
                <p className="micro-label !text-cyan-300/80">Reusable pattern created</p>
              </div>
              <p className="mono-num mt-3 text-[13px] leading-relaxed text-ink-3">
                small-aec-firm · t&amp;m-dominant · pe-gated-workflow ·{" "}
                {out.systemStatus === "OPTIMAL_GOVERNANCE"
                  ? "governed-retuning-accepted"
                  : "operating-model-rejection"}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-4">
                This run just compiled one anonymized evidence node, the seed of
                something no general model has.
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("stage-5")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
              >
                Explore Horizon Two
                <span aria-hidden>↓</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
