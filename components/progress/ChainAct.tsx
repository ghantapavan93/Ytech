"use client";

import type { Layer } from "@/lib/engines/progress-engine";
import { motion } from "framer-motion";
import { ChainSpine } from "./ChainSpine";
import { Reading, SectionRail } from "./ProgressPrimitives";
import { STATE_STYLE } from "./progress-style";

/**
 * Act two: the chain, revealed one link at a time.
 *
 * Links that have not been reached yet stay dimmed and blurred rather than
 * hidden, so the reader can see how much chain is still to come while the
 * trace runs. The spine down the left carries each link's state as a colour,
 * which makes the turn from green to red visible before any of it is read.
 */
export function ChainAct({
  layers,
  revealed,
  traced,
}: {
  layers: Layer[];
  revealed: number;
  traced: boolean;
}) {
  const shownCount = traced ? layers.length : Math.min(revealed, layers.length);

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <SectionRail n="02" title="The task got faster. Did the firm?" />
        <p className="mono-num text-[11.5px] text-zinc-600">
          {shownCount} / {layers.length} links traced
        </p>
      </div>

      <div className="relative mt-5 pl-7 sm:pl-9">
        <ChainSpine layers={layers} revealed={revealed} complete={traced} />

        <div className="space-y-3">
          {layers.map((layer, i) => {
            const shown = traced || i < revealed;
            const st = STATE_STYLE[layer.state];
            return (
              <motion.div
                key={layer.id}
                initial={false}
                animate={{
                  opacity: shown ? 1 : 0.14,
                  y: shown ? 0 : 6,
                  filter: shown ? "blur(0px)" : "blur(2px)",
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <span
                  className={`absolute -left-7 top-[18px] h-2.5 w-2.5 rounded-full ring-4 ring-canvas transition-colors duration-500 sm:-left-9 ${
                    shown ? st.dot : "bg-zinc-700"
                  }`}
                />
                <div
                  className={`status-surface rounded-xl border p-4 ${
                    shown ? st.ring : "border-line bg-surface-1"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-[13.5px] font-semibold text-zinc-100">
                      {layer.name}
                    </p>
                    <p className={`micro-label ${shown ? st.text : ""}`}>
                      {shown ? st.word : "Not yet traced"}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[12px] italic text-zinc-500">
                    {layer.question}
                  </p>
                  {shown && <Reading metric={layer.metric} />}
                  <p className="mt-2.5 text-[13.5px] leading-relaxed text-zinc-300">
                    {layer.finding}
                  </p>
                  {shown && layer.state !== "proven" && (
                    <p className="mt-2.5 border-l-2 border-line pl-3 text-[12.5px] leading-relaxed text-zinc-500">
                      {layer.blocks}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
