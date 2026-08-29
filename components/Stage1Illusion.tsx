"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { WatchRunButton } from "./Autopilot";

interface Stage1Props {
  aiSpeedupPct: number; // 0–1
  revealed: boolean; // whether stage 2 has been triggered
  onSimulate: () => void;
  onWatch: () => void;
}

const TERMINAL_LINES: { text: string; ok?: boolean; delta?: boolean }[] = [
  { text: '$ atlas run spec-qa-agent --batch 20 --standards "ASTM · ACI 318 · AISC 360"' },
  { text: "parsing 20/20 submittal packages", ok: true },
  { text: "redline matrix generated · 842 clauses checked", ok: true },
  { text: "spec-section cross references resolved", ok: true },
  { text: "syntax + citation validation · 100% pass", ok: true },
  { text: "accuracy on standard clauses · 98.2%", ok: true },
  { text: "unit cost · $0.14 / package (tokens)", ok: true },
];

/**
 * Stage 1, the attractive illusion. A technically flawless agent run,
 * exactly where a normal software demo stops and tells you to buy it.
 */
export function Stage1Illusion({ aiSpeedupPct, revealed, onSimulate, onWatch }: Stage1Props) {
  const speedup = Math.round(aiSpeedupPct * 100);
  const aiMinutes = (20 * (1 - aiSpeedupPct)).toFixed(1);

  return (
    <section className="relative mx-auto w-full max-w-6xl px-5 pt-20 pb-14 sm:pt-28">
      <div className="hero-decor" aria-hidden />
      {/* Hero */}
      <p className="micro-label fade-up">Value Shift · AEC AI Economics Wind Tunnel</p>
      <h1
        className="fade-up mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink-1 sm:text-6xl"
        style={{ animationDelay: "80ms" }}
      >
        This agent cuts drafting time by{" "}
        <span className="claim-figure">{speedup}%</span>.
        <span className="block text-ink-4">
          The firm should not deploy it. Yet.
        </span>
      </h1>
      <p
        className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
        style={{ animationDelay: "160ms" }}
      >
        Atlas Structural &amp; Civil, a synthetic 45-person engineering firm,         built a specification-QA agent. The technology passed every test. This
        instrument runs it through the operating system it has to live inside:
        the fee model, the utilization incentives, the licensed-PE review gate,
        and the apprenticeship pipeline.
      </p>

      {/* Terminal card */}
      <div
        className="card fade-up mt-10 overflow-hidden"
        style={{ animationDelay: "240ms" }}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="ml-2 font-mono text-[11.5px] text-ink-4">
              atlas-civil / spec-qa-agent · technical validation
            </span>
          </div>
          <span className="micro-label hidden sm:block">Synthetic run</span>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.5fr_1fr]">
          {/* Log */}
          <div className="border-b border-line p-5 font-mono text-[13px] leading-7 lg:border-b-0 lg:border-r">
            {TERMINAL_LINES.map((line, i) => (
              <div
                key={line.text}
                className="term-line flex items-start gap-2"
                style={{ animationDelay: `${350 + i * 170}ms` }}
              >
                {line.ok ? (
                  <span className="mt-1.5 text-emerald-400">
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                  </span>
                ) : (
                  <span className="w-[13px]" />
                )}
                <span className={line.ok ? "text-ink-2" : "text-ink-4"}>
                  {line.text}
                </span>
              </div>
            ))}
            <div
              className="term-line mt-2 flex items-center gap-2"
              style={{ animationDelay: `${350 + TERMINAL_LINES.length * 170}ms` }}
            >
              <span className="text-cyan-300">Δ production time</span>
              <span className="font-semibold text-cyan-200">−{speedup}.0%</span>
              <span className="blink-cursor inline-block h-3.5 w-[7px] bg-zinc-400" />
            </div>
          </div>

          {/* Headline metrics */}
          <div className="flex flex-col justify-between gap-6 p-5">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <div>
                <p className="micro-label">Review time / pkg</p>
                <p className="mono-num mt-1.5 text-2xl font-semibold text-ink-1">
                  {aiMinutes}h
                  <span className="ml-1.5 text-sm font-normal text-ink-4 line-through">
                    20h
                  </span>
                </p>
              </div>
              <div>
                <p className="micro-label">Speedup</p>
                <p className="mono-num mt-1.5 text-2xl font-semibold text-emerald-400">
                  −{speedup}%
                </p>
              </div>
              <div>
                <p className="micro-label">Accuracy</p>
                <p className="mono-num mt-1.5 text-2xl font-semibold text-ink-1">
                  98.2%
                </p>
              </div>
              <div>
                <p className="micro-label">Token cost / pkg</p>
                <p className="mono-num mt-1.5 text-2xl font-semibold text-ink-1">
                  $0.14
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/12 px-3 py-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span className="mono-num text-[13px] font-semibold tracking-wide text-emerald-300">
                TECHNICAL TEST: PASSED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The trap line + CTA */}
      <div
        className="fade-up mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
        style={{ animationDelay: "320ms" }}
      >
        <p className="max-w-md text-[13px] leading-relaxed text-ink-4">
          A software demo stops here and tells the firm to deploy. A wind
          tunnel asks what the surrounding organization does to that number.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {!revealed && (
            <button
              onClick={onSimulate}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-zinc-100 px-5 py-3 text-[15px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(244,63,94,0.5)]"
            >
              Simulate organizational impact
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          )}
          <WatchRunButton onStart={onWatch} />
        </div>
      </div>

      <p className="mt-10 text-[11.5px] text-ink-4">
        All figures are synthetic and editable · deterministic engine · no
        AI-generated numbers anywhere in this instrument.
      </p>
    </section>
  );
}
