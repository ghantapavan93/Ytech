"use client";

import type { EngineOutput, FirmBaseline, Levers } from "@/lib/engines/engine";
import { fmtHours, fmtMoney, fmtPct } from "@/lib/format";
import { ArrowRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { RangeSlider } from "./RangeSlider";
import { SegmentedControl } from "./SegmentedControl";
import { PILLAR_STYLE, SYSTEM_STYLE } from "./status";
import { Ticker } from "./Ticker";

interface Stage3Props {
  base: FirmBaseline;
  levers: Levers;
  out: EngineOutput;
  naiveOut: EngineOutput;
  onLeverChange: <K extends keyof Levers>(key: K, value: Levers[K]) => void;
  onBaseChange: <K extends keyof FirmBaseline>(key: K, value: FirmBaseline[K]) => void;
  charterRevealed: boolean;
  onCompile: () => void;
}

function LeverBlock({
  id,
  step,
  title,
  children,
}: {
  /** Anchor, so the autopilot can bring this lever into view as it turns it. */
  id?: string;
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="mb-2 flex items-baseline gap-2.5">
        <span className="mono-num text-[11.5px] font-semibold text-cyan-400/80">{step}</span>
        <h3 className="text-[13px] font-semibold tracking-wide text-ink-1">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CompareBar({
  label,
  value,
  max,
  hex,
  dim,
}: {
  label: string;
  value: number;
  max: number;
  hex: string;
  dim?: boolean;
}) {
  const widthPct = Math.max((value / max) * 100, 2);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className={`text-[13px] ${dim ? "text-ink-4" : "text-ink-2"}`}>{label}</span>
        <Ticker
          value={value}
          format={(n) => fmtMoney(n)}
          className={`text-[13px] font-semibold ${dim ? "text-ink-4" : "text-ink-1"}`}
        />
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="bar-fill h-full rounded-full"
          style={{ width: `${widthPct}%`, backgroundColor: hex, opacity: dim ? 0.45 : 1 }}
        />
      </div>
    </div>
  );
}

/**
 * Stage 3, the four leadership levers plus the assumption ledger.
 * Every slider movement recalculates the entire causal chain instantly.
 */
export function Stage3Levers({
  base,
  levers,
  out,
  naiveOut,
  onLeverChange,
  onBaseChange,
  charterRevealed,
  onCompile,
}: Stage3Props) {
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const sys = SYSTEM_STYLE[out.systemStatus];
  const maxMargin = Math.max(out.margin, out.baselineMargin, naiveOut.margin) * 1.08;

  const set = onLeverChange;

  return (
    <section id="stage-3" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14">
      <div className="fade-up">
        <p className="micro-label">Stage 03 · Leadership re-tuning</p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-ink-1 sm:text-3xl">
          Same agent. Same speed.{" "}
          <span className="text-ink-4">Different operating system.</span>
        </h2>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          {/* Levers */}
          <div className="card space-y-6 p-6">
            <LeverBlock id="lever-pricing" step="01" title="Contract pricing model">
              <SegmentedControl
                ariaLabel="Contract pricing model"
                value={levers.pricingModel}
                onChange={(v) => set("pricingModel", v)}
                options={[
                  { value: "TM_100", label: "100% Time & Materials", detail: "legacy" },
                  { value: "BLENDED_50", label: "Blended 50 / 50", detail: "transition" },
                  {
                    value: "FIXED_FEE",
                    label: "Fixed fee per package",
                    detail: fmtMoney(base.fixedFeePerPackage),
                  },
                ]}
              />
            </LeverBlock>

            <LeverBlock id="lever-capacity" step="02" title="Saved-capacity routing">
              <RangeSlider
                ariaLabel="Share of freed junior hours redeployed to backlog"
                min={0}
                max={100}
                step={5}
                value={Math.round(levers.backlogRedeploymentPct * 100)}
                display={fmtPct(levers.backlogRedeploymentPct * 100, 0)}
                onChange={(v) => set("backlogRedeploymentPct", v / 100)}
                leftHint="idle (absorbed as overhead)"
                rightHint="redeployed to billable backlog"
              />
            </LeverBlock>

            <LeverBlock id="lever-review" step="03" title="Review architecture">
              <SegmentedControl
                ariaLabel="PE review architecture"
                value={levers.reviewArchitecture}
                onChange={(v) => set("reviewArchitecture", v)}
                options={[
                  { value: "FULL_MANUAL", label: "Full manual re-verification", detail: "3.5h / pkg" },
                  {
                    value: "RAW_AI_UNGOVERNED",
                    label: "Accept raw AI output",
                    detail: "liability",
                    hazard: true,
                  },
                  { value: "TIERED_DELTA_GATE", label: "Risk-tiered delta gate", detail: "1.0h / pkg" },
                ]}
              />
            </LeverBlock>

            <LeverBlock id="lever-apprenticeship" step="04" title="Apprenticeship safeguard">
              <SegmentedControl
                ariaLabel="Apprenticeship safeguard"
                value={levers.apprenticeshipSafeguard}
                onChange={(v) => set("apprenticeshipSafeguard", v)}
                options={[
                  { value: "NONE", label: "Full automation", detail: "0h practice" },
                  {
                    value: "BLIND_AUDIT_20_PCT",
                    label: "20% blind audit + delta review",
                    detail: "80h / mo",
                  },
                ]}
              />
            </LeverBlock>

            {/* Assumption ledger */}
            <div className="border-t border-line pt-4">
              <button
                onClick={() => setAssumptionsOpen(!assumptionsOpen)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="flex items-center gap-2 text-[13px] font-medium text-ink-3">
                  <SlidersHorizontal size={13} />
                  Assumption ledger, every number is synthetic &amp; editable
                </span>
                <ChevronDown
                  size={15}
                  className={`text-ink-4 transition-transform ${assumptionsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {assumptionsOpen && (
                <div className="mt-4 space-y-4">
                  <RangeSlider
                    ariaLabel="Agent speedup percentage"
                    min={0}
                    max={60}
                    step={1}
                    value={Math.round(levers.aiSpeedupPct * 100)}
                    display={`−${Math.round(levers.aiSpeedupPct * 100)}%`}
                    onChange={(v) => set("aiSpeedupPct", v / 100)}
                    leftHint="agent speedup on junior production hours"
                  />
                  <RangeSlider
                    ariaLabel="Monthly package volume"
                    min={5}
                    max={40}
                    step={1}
                    value={base.monthlyPackageVolume}
                    display={`${base.monthlyPackageVolume}`}
                    onChange={(v) => onBaseChange("monthlyPackageVolume", v)}
                    leftHint="spec packages per month"
                  />
                  <RangeSlider
                    ariaLabel="Fixed fee per package"
                    min={3000}
                    max={7000}
                    step={100}
                    value={base.fixedFeePerPackage}
                    display={fmtMoney(base.fixedFeePerPackage)}
                    onChange={(v) => onBaseChange("fixedFeePerPackage", v)}
                    leftHint="fixed fee per package"
                  />
                  <p className="text-[11.5px] leading-relaxed text-ink-4">
                    Rates: Jr ${base.jrBillRate}/${base.jrCostRate} · PM $
                    {base.pmBillRate}/${base.pmCostRate} · PE ${base.peBillRate}/$
                    {base.peCostRate} (bill/cost per hour). AI tooling $
                    {base.aiToolCostPerMonth}/mo. Baseline utilization{" "}
                    {Math.round(base.baselineJrUtilization * 100)}%.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Live outcome */}
          <div className="flex flex-col gap-5">
            <div
              id="verdict-governed"
              className={`status-surface card scroll-mt-24 p-6 ${sys.bgTint} ${sys.border}`}
              style={{ boxShadow: `0 0 48px -18px ${sys.hex}66` }}
            >
              <div className="flex items-center justify-between">
                <p className="micro-label">Live verdict</p>
                <span
                  className={`mono-num rounded-md px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] ${sys.text}`}
                  style={{ background: `${sys.hex}1a` }}
                >
                  {sys.chipLabel}
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <Ticker
                  value={out.deltaMargin}
                  format={(n) => fmtMoney(n, { sign: true })}
                  className={`text-4xl font-semibold ${sys.text}`}
                />
                <span className="text-[13px] text-ink-4">net margin / mo vs pre-AI</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
                {out.primaryBreakdownReason}
              </p>
            </div>

            <div className="card space-y-5 p-6">
              <p className="micro-label">Monthly gross margin</p>
              <CompareBar
                label="Legacy firm · no AI"
                value={out.baselineMargin}
                max={maxMargin}
                hex="#71717a"
                dim
              />
              <CompareBar
                label="Naive deployment · untouched model"
                value={naiveOut.margin}
                max={maxMargin}
                hex="#f43f5e"
                dim
              />
              <CompareBar
                label="This configuration"
                value={out.margin}
                max={maxMargin}
                hex={sys.hex}
              />
            </div>

            <div className="card grid grid-cols-2 gap-x-4 gap-y-4 p-6 sm:grid-cols-4">
              {(
                [
                  ["Margin", fmtPct(out.marginPct, 1), out.pillars.revenue.status],
                  ["PE load", `${fmtHours(out.peHoursPerWeek, 1)}/wk`, out.pillars.reviewGate.status],
                  ["Jr util", fmtPct(out.jrUtilizationPct, 0), out.pillars.incentives.status],
                  ["Learning", fmtPct(out.learningIndexPct, 0), out.pillars.apprenticeship.status],
                ] as const
              ).map(([label, value, status]) => (
                <div key={label}>
                  <p className="micro-label">{label}</p>
                  <p className={`mono-num mt-1 text-[15px] font-semibold ${PILLAR_STYLE[status].text}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {!charterRevealed && (
              <button
                onClick={onCompile}
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-zinc-100 px-5 py-3.5 text-[15px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.6)]"
              >
                Compile the 30-day experiment
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
