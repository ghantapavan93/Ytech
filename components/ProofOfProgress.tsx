"use client";

import { ChainAct } from "./progress/ChainAct";
import { ClaimAct } from "./progress/ClaimAct";
import { Day30Act } from "./progress/Day30Act";
import { VerdictAct } from "./progress/VerdictAct";
import { useProgressRun } from "./progress/useProgressRun";

/**
 * Proof of Progress, in four acts.
 *
 * A claim, the chain underneath it, the verdict that chain supports, and
 * what happens thirty days later when real readings arrive. Each act mounts
 * only once the one before it has finished, so the page grows downward as
 * the argument does rather than presenting its conclusion up front.
 *
 * Everything stateful lives in useProgressRun. The acts are presentational,
 * which is what makes them readable on their own.
 */
export function ProofOfProgress() {
  const run = useProgressRun();

  return (
    <div className="space-y-16">
      <ClaimAct
        traced={run.traced}
        showCta={run.stage === "dashboard"}
        onStart={run.startTrace}
      />

      {run.stage !== "dashboard" && (
        <ChainAct
          layers={run.result.layers}
          revealed={run.revealed}
          traced={run.traced}
        />
      )}

      {run.traced && (
        <VerdictAct
          result={run.result}
          showAdvance={run.stage === "verdict"}
          onAdvance={run.openDay30}
          sectionRef={run.verdictRef}
        />
      )}

      {run.stage === "day30" && (
        <Day30Act
          applied={run.applied}
          log={run.log}
          onToggle={run.toggle}
          onClear={run.clearReadings}
          onReset={run.reset}
          sectionRef={run.day30Ref}
        />
      )}
    </div>
  );
}
