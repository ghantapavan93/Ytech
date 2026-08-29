"use client";

import { Autopilot } from "@/components/Autopilot";
import { EvidenceFooter } from "@/components/EvidenceFooter";
import { ProgressHandoff } from "@/components/ProgressHandoff";
import { Header } from "@/components/Header";
import { useAutopilot } from "@/components/useAutopilot";
import { Stage1Illusion } from "@/components/Stage1Illusion";
import { Stage2Shockwave } from "@/components/Stage2Shockwave";
import { Stage3Levers } from "@/components/Stage3Levers";
import { Stage4Charter } from "@/components/Stage4Charter";
import { Stage5Horizon } from "@/components/Stage5Horizon";
import {
  ATLAS_BASELINE,
  NAIVE_DEPLOYMENT,
  runEngine,
  type FirmBaseline,
  type Levers,
} from "@/lib/engines/engine";
import { PRESETS, sameLevers, type Preset } from "@/lib/presets";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * The wind tunnel is a staged narrative:
 *   1. The illusion  , a technically perfect agent run.
 *   2. The shockwave , the same result propagated through the firm.
 *   3. The levers    , leadership re-tunes the operating system, live.
 *   4. The charter   , a bounded 30-day experiment, not a deployment.
 * Stages stay mounted once revealed so the whole story scrolls.
 */
export default function Home() {
  const [base, setBase] = useState<FirmBaseline>(ATLAS_BASELINE);
  const [levers, setLevers] = useState<Levers>(NAIVE_DEPLOYMENT);
  const [stage, setStage] = useState(1);

  const out = useMemo(() => runEngine(base, levers), [base, levers]);
  const activePresetId = useMemo(
    () => PRESETS.find((p) => sameLevers(p.levers, levers))?.id ?? null,
    [levers]);

  // Fixed comparison point: the same speedup dropped into an untouched
  // operating model, so "this configuration" always has a fair naive twin.
  const naiveOut = useMemo(
    () => runEngine(base, { ...NAIVE_DEPLOYMENT, aiSpeedupPct: levers.aiSpeedupPct }),
    [base, levers.aiSpeedupPct]);

  const reveal = (next: number, anchor: string) => {
    setStage((s) => Math.max(s, next));
    // Wait one frame so the newly mounted section exists before scrolling.
    setTimeout(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  // Functional updates so rapid interactions (fast presenters, double-fires)
  // can never clobber each other inside one React batch.
  const handleLeverChange = useCallback(
    <K extends keyof Levers>(key: K, value: Levers[K]) =>
      setLevers((prev) => ({ ...prev, [key]: value })),
    []);

  const handleBaseChange = useCallback(
    <K extends keyof FirmBaseline>(key: K, value: FirmBaseline[K]) =>
      setBase((prev) => ({ ...prev, [key]: value })),
    []);

  const handlePreset = (preset: Preset) => setLevers({ ...preset.levers });

  const handleReset = () => {
    setBase(ATLAS_BASELINE);
    setLevers(NAIVE_DEPLOYMENT);
    document.getElementById("stage-2")?.scrollIntoView({ behavior: "smooth" });
  };

  // The self-running 90-second demonstration. It presses the same state
  // setters a human presenter would, every number stays engine-computed.
  const pilot = useAutopilot({
    reset: () => {
      setBase(ATLAS_BASELINE);
      setLevers(NAIVE_DEPLOYMENT);
      setStage(1);
    },
    revealStage: (n) => setStage((s) => Math.max(s, n)),
    setLever: handleLeverChange,
    setBase: handleBaseChange,
  });

  // Shareable auto-play: /?run=1 starts the scripted run on load
  // (/?run=fast is the accelerated QA variant).
  const { start: startPilot } = pilot;
  useEffect(() => {
    const run = new URLSearchParams(window.location.search).get("run");
    if (!run) return;
    const t = setTimeout(() => startPilot(run === "fast" ? 6 : 1), 900);
    return () => clearTimeout(t);
  }, [startPilot]);

  // Deep links: /#stage-N auto-reveals the gated stages up to N, then
  // scrolls there, so the thesis and review pages can point into the
  // middle of the narrative.
  useEffect(() => {
    const match = window.location.hash.match(/^#stage-([2-5])$/);
    if (!match) return;
    const target = Number(match[1]);
    // Stage 5 mounts together with stage 4.
    setStage((s) => Math.max(s, Math.min(target, 4)));
    const t = setTimeout(() => {
      document
        .getElementById(`stage-${target}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen">
      <Header out={out} showVerdict={stage >= 2} onWatch={() => pilot.start()} />
      <main>
        <Stage1Illusion
          aiSpeedupPct={levers.aiSpeedupPct}
          revealed={stage >= 2}
          onSimulate={() => reveal(2, "stage-2")}
          onWatch={() => pilot.start()}
        />
        {stage >= 2 && (
          <Stage2Shockwave
            out={out}
            levers={levers}
            aiSpeedupPct={levers.aiSpeedupPct}
            retuneRevealed={stage >= 3}
            onRetune={() => reveal(3, "stage-3")}
          />
        )}
        {stage >= 3 && (
          <Stage3Levers
            base={base}
            levers={levers}
            out={out}
            naiveOut={naiveOut}
            onLeverChange={handleLeverChange}
            onBaseChange={handleBaseChange}
            charterRevealed={stage >= 4}
            onCompile={() => reveal(4, "stage-4")}
          />
        )}
        {stage >= 4 && (
          <>
            <Stage4Charter
              base={base}
              levers={levers}
              out={out}
              presets={PRESETS}
              activePresetId={activePresetId}
              onPreset={handlePreset}
              onReset={handleReset}
            />
            <Stage5Horizon base={base} levers={levers} out={out} />
          </>
        )}
      </main>
      <ProgressHandoff show={stage >= 4} />
      <EvidenceFooter />
      <Autopilot pilot={pilot} />
    </div>
  );
}
