"use client";

import { Play, RotateCcw, X } from "lucide-react";
import type { AutopilotState } from "./useAutopilot";

/**
 * The cinematic layer for the self-running 90-second demonstration:
 * a subtitle bar while the script performs, and an end card when it lands.
 * The autopilot presses the same levers a human would, nothing is canned.
 */
export function Autopilot({ pilot }: { pilot: AutopilotState }) {
  if (!pilot.active) return null;

  return (
    <>
      {/* Caption bar */}
      {!pilot.done && (
        <div className="print-hidden pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4">
          <div className="pointer-events-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-line-strong bg-canvas/80 shadow-[0_16px_60px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="flex items-center gap-3.5 px-5 py-3.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <p
                aria-live="polite"
                className="flex-1 text-[13px] leading-relaxed text-ink-1"
              >
                {pilot.caption}
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <span className="mono-num text-[10px] text-ink-4">
                  {String(pilot.stepIndex + 1).padStart(2, "0")} /{" "}
                  {String(pilot.totalSteps).padStart(2, "0")}
                </span>
                <button
                  onClick={pilot.stop}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-medium text-ink-3 transition-colors hover:bg-white/[0.06] hover:text-ink-1"
                >
                  <X size={11} />
                  Skip
                </button>
              </div>
            </div>
            {/* Per-step progress */}
            <div className="h-[2px] w-full bg-white/[0.06]">
              <div
                key={pilot.stepIndex}
                className="h-full bg-cyan-400/80"
                style={{
                  animation: `caption-progress ${pilot.stepMs}ms linear forwards`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* End card */}
      {pilot.done && (
        <div className="print-hidden fixed inset-0 z-[70] flex items-center justify-center bg-canvas/80 px-5 backdrop-blur-md">
          <div className="fade-up w-full max-w-xl rounded-2xl border border-line-strong bg-surface-1 p-8 text-center shadow-[0_24px_90px_-20px_rgba(0,0,0,0.9)]">
            <p className="micro-label">The run is complete</p>
            <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.02em] text-ink-1">
              AI adoption isn't only resisted by people.
              <span className="block text-ink-3">
                Sometimes it's rejected by the economics leadership designed.
              </span>
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-4">
              Everything you just watched was computed live by the deterministic
              engine, the autopilot pressed the same levers you can. The state
              it built is still on the page, ready to explore.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                onClick={pilot.stop}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-3 text-[15px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.6)]"
              >
                Explore it yourself
              </button>
              <button
                onClick={() => pilot.start()}
                className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-[15px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink-1"
              >
                <RotateCcw size={15} />
                Replay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Small trigger used in the hero and header. */
export function WatchRunButton({
  onStart,
  compact = false,
}: {
  onStart: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <button
        onClick={onStart}
        title="Watch the 90-second run"
        className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/12 px-2.5 py-1.5 text-[11.5px] font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/25"
      >
        <Play size={11} />
        <span className="hidden sm:inline">90-sec run</span>
      </button>
    );
  }
  return (
    <button
      onClick={onStart}
      className="inline-flex items-center gap-2.5 rounded-xl border border-line-strong px-5 py-3 text-[15px] font-medium text-ink-2 transition-colors hover:border-cyan-500/55 hover:bg-cyan-500/12 hover:text-cyan-200"
    >
      <Play size={15} />
      Watch the 90-second run
    </button>
  );
}
