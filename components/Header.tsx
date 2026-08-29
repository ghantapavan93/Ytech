"use client";

import type { EngineOutput } from "@/lib/engines/engine";
import { fmtMoney } from "@/lib/format";
import { useState } from "react";
import { WatchRunButton } from "./Autopilot";
import { StageMode } from "./StageMode";
import { Presentation } from "lucide-react";
import { CommandHint } from "./CommandPalette";
import { SYSTEM_STYLE } from "./status";
import { Ticker } from "./Ticker";

interface HeaderProps {
  out: EngineOutput;
  /** Verdict is only shown once the shockwave has been revealed. */
  showVerdict: boolean;
  onWatch: () => void;
}

/**
 * Sticky command bar.
 *
 * This used to carry eight text links, each hiding itself at a different
 * breakpoint, which is what a nav does when it has outgrown its shape.
 * Everything now lives in the palette, and the bar keeps only the three
 * things worth a permanent seat.
 */
export function Header({ out, showVerdict, onWatch }: HeaderProps) {
  const sys = SYSTEM_STYLE[out.systemStatus];
  const [stage, setStage] = useState(false);

  return (
    <header className="print-hidden sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-baseline gap-3">
          <span className="hit-24 text-[15px] font-bold tracking-[-0.01em] text-ink-1">
            VALUE&nbsp;SHIFT
          </span>
          <span className="hidden font-mono text-[11.5px] text-ink-4 lg:block">
            // AEC AI Economics Wind Tunnel
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setStage(true)}
            title="Present full screen"
            className="hidden items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-4 transition-colors hover:border-line-strong hover:text-ink-1 sm:inline-flex"
          >
            <Presentation size={11} />
            <span className="hidden sm:inline">Stage</span>
          </button>
          <WatchRunButton onStart={onWatch} compact />
          <CommandHint />
          {showVerdict && (
            <div
              className="status-surface flex items-center gap-2 rounded-full border px-3 py-1.5"
              style={{
                borderColor: `${sys.hex}55`,
                background: `${sys.hex}14`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: sys.hex, boxShadow: `0 0 8px 1px ${sys.hex}` }}
              />
              <Ticker
                value={out.deltaMargin}
                format={(n) => `${fmtMoney(n, { sign: true })}/mo`}
                className={`text-[13px] font-semibold ${sys.text}`}
              />
            </div>
          )}
        </div>
      </div>
      {stage && <StageMode onClose={() => setStage(false)} />}
    </header>
  );
}
