"use client";

import { CLAIM } from "@/lib/engines/progress-engine";
import { useEffect, useState } from "react";

/**
 * The claim, rendered the way the pilot report renders it.
 *
 * A dial, a large number, a green status line. This is deliberately the most
 * confident-looking object on the page, because the argument only works if
 * the claim is presented at full strength before anything is done to it.
 */
export function ClaimReadout({ settled }: { settled: boolean }) {
  const n = useCountUp(CLAIM.headlineValue, 1100);

  return (
    <div
      className={`claim-dial status-surface relative overflow-hidden rounded-2xl border p-6 sm:p-7 ${
        settled ? "border-line" : "border-white/12"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="micro-label">Pilot report</p>
        <p className="mono-num text-[10px] uppercase tracking-[0.16em] text-ink-4">
          90-day window
        </p>
      </div>

      <div className="mt-6 flex items-end justify-center gap-1 py-2">
        <span
          className={`text-[72px] font-semibold leading-[0.85] sm:text-[96px] ${
            settled ? "text-ink-4 transition-colors duration-700" : "claim-figure"
          }`}
        >
          {n}
        </span>
        <span
          className={`pb-2 text-2xl font-semibold sm:text-3xl ${
            settled ? "text-ink-4" : "claim-figure"
          }`}
        >
          {CLAIM.headlineUnit}
        </span>
      </div>
      <p className="text-center text-[11.5px] uppercase tracking-[0.18em] text-ink-4">
        {CLAIM.headlineLabel}
      </p>

      <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
        <Cell label="Adoption" value={`${CLAIM.adoptionPct}%`} />
        <Cell label="Assisted reviews" value={String(CLAIM.runs)} />
        <Cell label="Draft hours before" value={`${CLAIM.baselineHours}h`} />
        <Cell label="Draft hours after" value={`${CLAIM.afterHours}h`} />
      </div>

      <div
        className={`status-surface mt-4 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 ${
          settled
            ? "border-line bg-canvas/40 text-ink-4"
            : "border-ok/40 bg-ok/[0.06] text-ok"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${settled ? "bg-zinc-600" : "bg-ok"}`}
        />
        <span className="text-[11.5px] font-medium uppercase tracking-[0.14em]">
          {settled ? "Claim under test" : "Pilot status: successful"}
        </span>
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-1 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.14em] text-ink-4">{label}</p>
      <p className="mono-num mt-1 text-[15px] font-semibold text-ink-2">{value}</p>
    </div>
  );
}

function useCountUp(target: number, ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return n;
}
