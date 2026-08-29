"use client";

import { LoadPathDiagram } from "@/components/diagram/LoadPathDiagram";
import { DivergenceTrack } from "@/components/DivergenceTrack";
import { EvidenceCharterSheet } from "@/components/progress/EvidenceCharterSheet";
import { ATLAS_BASELINE, runEngine } from "@/lib/engines/engine";
import { evaluateProgress } from "@/lib/engines/progress-engine";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ACTS } from "./act-data";

/**
 * The run.
 *
 * One load, one structure, six acts. The load path stays on screen the whole
 * way and every act recomputes it through the same engine, so the reroute at
 * act five is the model responding rather than a second picture swapped in.
 *
 * The last two beats are the ones that matter. A structure that carries its
 * load still does not earn a deployment, because a model of the economics is
 * not evidence that the economics happened. And six weeks later the
 * authorization expires while the agent keeps working, which is the fact the
 * whole instrument exists to make visible.
 */
export function TheRun() {
  const [act, setAct] = useState(0);
  const [epilogue, setEpilogue] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Clamped on read as well as on write. Two clicks landing in the same
  // tick both saw the same act from their closure and both incremented, so
  // the index ran past the end and the page died on ACTS[6].levers.
  const current = ACTS[Math.min(act, ACTS.length - 1)];
  const out = useMemo(
    () => runEngine(ATLAS_BASELINE, current.levers),
    [current.levers],
  );
  const charter = useMemo(() => evaluateProgress([]), []);
  const last = act === ACTS.length - 1;

  const advance = () => {
    if (last) {
      setEpilogue(true);
      setTimeout(
        () => endRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        120,
      );
      return;
    }
    setAct((a) => Math.min(a + 1, ACTS.length - 1));
  };

  const restart = () => {
    setAct(0);
    setEpilogue(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-24">
      <div className="grid gap-8 md:grid-cols-[1fr_1.05fr] md:items-start">
        {/* The argument */}
        <div className="md:pt-4">
          <div className="flex items-center gap-3">
            <span className="mono-num text-[11.5px] font-semibold text-ink-4">
              {current.n}
            </span>
            <span className="h-px w-6 bg-line-strong" />
            <span className="micro-label">{current.kicker}</span>
            <span className="mono-num ml-auto text-[11.5px] text-ink-4">
              {act + 1} / {ACTS.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={act}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="mt-5 text-2xl font-semibold leading-[1.14] tracking-[-0.028em] text-ink-1 sm:text-[32px]">
                {current.headline}
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-3">
                {current.body}
              </p>
            </motion.div>
          </AnimatePresence>

          {!epilogue && (
            <button
              onClick={advance}
              className="group mt-7 inline-flex items-center gap-2.5 rounded-xl border border-line-strong bg-surface-1 px-5 py-3 text-[15px] font-medium text-ink-1 transition-colors hover:border-white/25 hover:bg-surface-2"
            >
              {current.advance ?? "See what it produces"}
              <ArrowRight
                size={15}
                className="text-ink-4 transition-transform group-hover:translate-x-0.5"
              />
            </button>
          )}

          {/* Every act is one click from the next, and none of them hides
              the ones already seen. */}
          <div className="mt-7 flex gap-1.5">
            {ACTS.map((a, i) => (
              <button
                key={a.n}
                onClick={() => setAct(i)}
                aria-label={`Act ${a.n}, ${a.kicker}`}
                className={`h-1 rounded-full transition-all ${
                  i === act
                    ? "w-9 bg-zinc-300"
                    : i < act
                      ? "w-4 bg-zinc-600 hover:bg-zinc-400"
                      : "w-4 bg-zinc-800 hover:bg-zinc-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* The structure, carrying whatever the current act asks of it */}
        <div className="md:sticky md:top-20">
          <LoadPathDiagram out={out} levers={current.levers} />
        </div>
      </div>

      <AnimatePresence>
        {epilogue && (
          <motion.div
            ref={endRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 scroll-mt-20"
          >
            <div className="flex items-center gap-3">
              <span className="mono-num text-[11.5px] font-semibold text-ink-4">
                07
              </span>
              <span className="h-px w-6 bg-line-strong" />
              <span className="micro-label">What it produces</span>
            </div>
            <div className="mt-5">
              <EvidenceCharterSheet result={charter} />
            </div>

            <div className="mt-14 border-t border-line pt-10">
              <div className="flex items-center gap-3">
                <span className="mono-num text-[11.5px] font-semibold text-ink-4">
                  08
                </span>
                <span className="h-px w-6 bg-line-strong" />
                <span className="micro-label">Six weeks later</span>
              </div>
              <h2 className="mt-5 max-w-3xl text-2xl font-semibold leading-[1.14] tracking-[-0.025em] text-ink-1 sm:text-[32px]">
                The agent still works. The authorization does not.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-3">
                The owner who signed the charter left. Review ran past the budget
                it was approved against. A new contract narrowed the data the
                workflow was cleared for. Nothing about the tool changed, and the
                decision that authorised it is void. Repairing every condition
                earns one bounded retest, never the clearance it started with.
              </p>

              {/* Shown rather than asserted. The paragraph above claims the
                  two facts diverge; this is the record doing it. */}
              <div className="mt-7">
                <DivergenceTrack applied={[]} week={6} />
              </div>

              <p className="mt-12 max-w-3xl text-xl font-medium leading-[1.35] tracking-[-0.02em] text-ink-1 sm:text-2xl">
                Your dashboard tells the board that AI is growing. This tells the
                board whether the business moved.
              </p>

              <button
                onClick={restart}
                className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[13px] text-ink-4 transition-colors hover:border-line-strong hover:text-ink-1"
              >
                <RotateCcw size={12} />
                Run it again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
