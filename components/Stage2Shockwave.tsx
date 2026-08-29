"use client";

import type { EngineOutput, Levers } from "@/lib/engines/engine";
import { fmtHours, fmtMoney, fmtPct } from "@/lib/format";
import {
  ArrowRight,
  GraduationCap,
  Landmark,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { LoadPathDiagram } from "./diagram/LoadPathDiagram";
import { PILLAR_STYLE, SYSTEM_STYLE } from "./status";
import { Ticker } from "./Ticker";

interface Stage2Props {
  out: EngineOutput;
  /** The load path needs these to know whether the fee gate passes load. */
  levers: Levers;
  aiSpeedupPct: number;
  retuneRevealed: boolean;
  onRetune: () => void;
}

/** Animated left rail: a colored line with a traveling pulse dot. */
function PulseRail({ hex, delayMs }: { hex: string; delayMs: number }) {
  return (
    <div className="absolute left-0 top-3 bottom-3 w-[2px] overflow-visible rounded-full">
      <div
        className="absolute inset-0 rounded-full opacity-50 transition-colors duration-500"
        style={{ background: `linear-gradient(to bottom, transparent, ${hex}, transparent)` }}
      />
      <div
        className="rail-dot absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full transition-colors duration-500"
        style={{
          background: hex,
          boxShadow: `0 0 12px 2px ${hex}`,
          animationDelay: `${delayMs}ms`,
        }}
      />
    </div>
  );
}

interface PillarCardProps {
  icon: React.ReactNode;
  label: string;
  status: keyof typeof PILLAR_STYLE;
  headline: React.ReactNode;
  sub: React.ReactNode;
  narrative: string;
  index: number;
}

function PillarCard({ icon, label, status, headline, sub, narrative, index }: PillarCardProps) {
  const style = PILLAR_STYLE[status];
  return (
    <div
      className={`status-surface card relative overflow-hidden p-5 pl-6 ${style.bgTint} ${style.border}`}
    >
      <PulseRail hex={style.hex} delayMs={index * 550} />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-ink-3">
          {icon}
          <span className="micro-label !text-ink-3">{label}</span>
        </div>
        <span
          className={`mono-num rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-[0.14em] ${style.text}`}
          style={{ background: `${style.hex}1a` }}
        >
          {style.chipLabel}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-2.5">
        <span className={`text-[26px] font-semibold leading-none ${style.text}`}>
          {headline}
        </span>
        <span className="mono-num text-[13px] text-ink-4">{sub}</span>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-3">{narrative}</p>
    </div>
  );
}

/**
 * Stage 2, the wind tunnel. One technical improvement propagates through
 * four organizational pillars, live, from the current lever state.
 */
export function Stage2Shockwave({
  out,
  levers,
  aiSpeedupPct,
  retuneRevealed,
  onRetune,
}: Stage2Props) {
  const sys = SYSTEM_STYLE[out.systemStatus];
  const speedup = Math.round(aiSpeedupPct * 100);

  return (
    <section id="stage-2" className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14">
      <div className="fade-up">
        <p className="micro-label">Stage 02 · Organizational propagation</p>

        {/* Verdict banner */}
        <div
          id="verdict-naive"
          className={`verdict-glow card mt-5 flex scroll-mt-24 flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between ${sys.bgTint}`}
          style={
            {
              "--glow-color": `${sys.hex}55`,
              "--glow-color-border": `${sys.hex}66`,
            } as React.CSSProperties
          }
        >
          <div>
            <h2 className={`text-xl font-semibold tracking-[-0.02em] sm:text-2xl ${sys.text}`}>
              {sys.verdict}
            </h2>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink-3">
              {out.primaryBreakdownReason}
            </p>
          </div>
          <div className="shrink-0 text-left sm:text-right">
            <p className="micro-label">Net margin vs pre-AI</p>
            <Ticker
              value={out.deltaMargin}
              format={(n) => fmtMoney(n, { sign: true })}
              className={`text-3xl font-semibold ${sys.text}`}
            />
            <p className="mono-num mt-1 text-[11.5px] text-ink-4">per month</p>
          </div>
        </div>

        {/* Source node feeding the pillars */}
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_2.1fr]">
          <div className="card relative flex flex-col justify-between gap-6 border-cyan-500/25 bg-cyan-500/[0.06] p-5">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Zap size={14} />
                <span className="micro-label !text-cyan-300/80">The change entering the system</span>
              </div>
              <p className="mt-4 text-[26px] font-semibold leading-none text-cyan-200">
                −{speedup}%
              </p>
              <p className="mono-num mt-1.5 text-[13px] text-ink-4">
                junior production hours / package
              </p>
            </div>
            <div className="space-y-2 border-t border-line pt-4 font-mono text-[11.5px] text-ink-4">
              <div className="flex justify-between">
                <span>Jr package hours</span>
                <Ticker value={out.jrPackageHours} format={(n) => fmtHours(n, 1)} className="text-ink-2" />
              </div>
              <div className="flex justify-between">
                <span>Hours freed / mo</span>
                <Ticker
                  value={out.jrRedeployedHours + out.jrSavedHoursUnused}
                  format={(n) => fmtHours(n, 1)}
                  className="text-ink-2"
                />
              </div>
              <div className="flex justify-between">
                <span>· redeployed</span>
                <Ticker value={out.jrRedeployedHours} format={(n) => fmtHours(n, 1)} className="text-emerald-400" />
              </div>
              <div className="flex justify-between">
                <span>· sitting idle</span>
                <Ticker value={out.jrSavedHoursUnused} format={(n) => fmtHours(n, 1)} className="text-rose-400" />
              </div>
            </div>
          </div>

          {/* The load, and where it stops being carried */}
          <div className="mb-4">
            <LoadPathDiagram out={out} levers={levers} />
          </div>

          {/* Four pillars */}
          <div id="pillars" className="grid scroll-mt-24 gap-4 sm:grid-cols-2">
            <PillarCard
              index={0}
              icon={<Landmark size={14} />}
              label="Fee structure"
              status={out.pillars.revenue.status}
              headline={
                <Ticker value={out.deltaRevenue} format={(n) => fmtMoney(n, { sign: true })} />
              }
              sub="revenue / mo"
              narrative={out.pillars.revenue.narrative}
            />
            <PillarCard
              index={1}
              icon={<ShieldAlert size={14} />}
              label="PE review gate"
              status={out.pillars.reviewGate.status}
              headline={
                <Ticker value={out.peHoursPerWeek} format={(n) => fmtHours(n, 1)} />
              }
              sub={`/ week · was ${fmtHours(out.baselinePeHoursPerWeek, 0)}`}
              narrative={out.pillars.reviewGate.narrative}
            />
            <PillarCard
              index={2}
              icon={<Zap size={14} />}
              label="Utilization incentives"
              status={out.pillars.incentives.status}
              headline={
                <Ticker value={out.jrUtilizationPct} format={(n) => fmtPct(n, 0)} />
              }
              sub={`jr billable · was ${fmtPct(out.baselineJrUtilizationPct, 0)}`}
              narrative={out.pillars.incentives.narrative}
            />
            <PillarCard
              index={3}
              icon={<GraduationCap size={14} />}
              label="Apprenticeship"
              status={out.pillars.apprenticeship.status}
              headline={
                <Ticker value={out.learningIndexPct} format={(n) => fmtPct(n, 0)} />
              }
              sub="deep practice retained"
              narrative={out.pillars.apprenticeship.narrative}
            />
          </div>
        </div>

        {!retuneRevealed && (
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-[13px] leading-relaxed text-ink-4">
              None of this is a technology failure. Every red light is a
              leadership design decision, which means leadership can re-tune it.
            </p>
            <button
              onClick={onRetune}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-zinc-100 px-5 py-3 text-[15px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(16,185,129,0.55)]"
            >
              Re-tune the operating system
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
