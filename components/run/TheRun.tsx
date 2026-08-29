"use client";

import { LoadPathDiagram } from "@/components/diagram/LoadPathDiagram";
import { DivergenceTrack } from "@/components/DivergenceTrack";
import { EvidenceCharterSheet } from "@/components/progress/EvidenceCharterSheet";
import { ATLAS_BASELINE, runEngine } from "@/lib/engines/engine";
import { evaluateProgress } from "@/lib/engines/progress-engine";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { ENTER, SNAP } from "@/lib/motion";
import { useMemo, useRef, useState } from "react";
import { ACTS } from "./act-data";

/**
 * The epilogue continues the run's numbering rather than restarting it.
 *
 * Hardcoded, these read 07 and 08 and collided with the two acts of the same
 * number further up the same page. Left over from a six-act version, and the
 * kind of thing that costs a page arguing for rigour more than it looks.
 */
const beat = (n: number) => String(ACTS.length + n).padStart(2, "0");

/**
 * The run.
 *
 * One load, one structure, one act per condition. The load path stays on
 * screen the whole way and every act recomputes it through the same engine,
 * so the reroute part-way through is the model responding rather than a
 * second picture swapped in.
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
      {/*
        Three cells rather than two, so the drawing can sit in a different
        place on a phone than it does on a desktop.

        Stacked, the old two-column version put the whole argument first and
        the structure underneath it, which on a 390px screen left the drawing
        roughly nine hundred pixels below the act text. Every act changes the
        structure, and the reader was being asked to take that on trust. Here
        the drawing follows the headline and precedes the explanation, so the
        order on a phone is: what act this is, what happened, the structure it
        happened to, then why. On a desktop it returns to the right-hand
        column, spanning both rows and sticky, exactly as before.
      */}
      <div className="grid gap-x-8 gap-y-7 md:grid-cols-[1fr_1.05fr] md:items-start">
        <div className="md:col-start-1 md:row-start-1 md:pt-4">
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

          {/*
            No AnimatePresence here, which is the point.

            With mode="wait" the incoming headline was held until the outgoing
            one had finished leaving, so every act change cost 350ms of exit
            before 350ms of entrance and a reader clicking through at their own
            pace was queueing behind an animation. Apple puts it plainly: do
            not make people wait out a motion they are going to see again, and
            this one is seen eight times.

            Remounting on the key swaps the text immediately and springs it in
            from wherever it is, so a second click retargets instead of waiting.
          */}
          <motion.h2
            key={act}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SNAP}
            className="mt-5 text-2xl font-semibold leading-[1.14] tracking-[-0.028em] text-ink-1 sm:text-[32px]"
          >
            {current.headline}
          </motion.h2>
        </div>

        {/* The structure, carrying whatever the current act asks of it */}
        <div className="min-w-0 md:sticky md:top-20 md:col-start-2 md:row-start-1 md:row-span-2">
          <LoadPathDiagram out={out} levers={current.levers} />
        </div>

        <div className="md:col-start-1 md:row-start-2">
          <motion.p
            key={act}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SNAP}
            className="max-w-xl text-[15px] leading-relaxed text-ink-3"
          >
            {current.body}
          </motion.p>

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

          {/*
            Every act is one click from the next, and none of them hides the
            ones already seen.

            The bar is 4px tall because a thicker one would read as a control
            rather than as progress. A thumb cannot hit 4px, so the button
            carries transparent padding out to 24px square and the bar is an
            inner span. The negative margin keeps the row the height it looks.
          */}
          <div className="-ml-1 mt-7 flex">
            {ACTS.map((a, i) => (
              <button
                key={a.n}
                onClick={() => setAct(i)}
                aria-label={`Act ${a.n}, ${a.kicker}`}
                aria-current={i === act ? "step" : undefined}
                className="group -my-2.5 px-1 py-2.5"
              >
                <span
                  className={`block h-1 rounded-full transition-all ${
                    i === act
                      ? "w-9 bg-zinc-300"
                      : i < act
                        ? "w-4 bg-zinc-600 group-hover:bg-zinc-400"
                        : "w-4 bg-zinc-800 group-hover:bg-zinc-600"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {epilogue && (
          <motion.div
            ref={endRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ENTER}
            className="mt-16 scroll-mt-20"
          >
            <div className="flex items-center gap-3">
              <span className="mono-num text-[11.5px] font-semibold text-ink-4">
                {beat(1)}
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
                  {beat(2)}
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
