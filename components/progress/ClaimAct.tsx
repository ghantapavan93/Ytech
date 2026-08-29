"use client";

import { CLAIM } from "@/lib/engines/progress-engine";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { ClaimReadout } from "./ClaimReadout";
import { SectionRail } from "./ProgressPrimitives";

/**
 * Act one: the pilot that looks successful.
 *
 * The claim is presented at full strength before anything is done to it,
 * because the argument only lands if the reader first believes the number.
 * Once the chain has been traced the figure loses its colour rather than
 * disappearing: it was never wrong, it was only never sufficient.
 */
export function ClaimAct({
  traced,
  showCta,
  onStart,
}: {
  traced: boolean;
  showCta: boolean;
  onStart: () => void;
}) {
  return (
    <section>
      <SectionRail n="01" title="The claim" />

      <div className="mt-6 grid items-start gap-8 md:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[44px]">
            <span className={traced ? "text-zinc-600" : "claim-figure"}>
              {CLAIM.headlineValue}
              {CLAIM.headlineUnit} {CLAIM.headlineLabel}.
            </span>
            <span className="mt-1 block text-zinc-300">
              Is that progress, or only{" "}
              <span
                className="underline decoration-[3px] underline-offset-[6px]"
                style={{ textDecorationColor: "var(--color-claim)" }}
              >
                activity
              </span>
              ?
            </span>
          </p>

          <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-zinc-400">
            Atlas Structural &amp; Civil runs an AI-assisted specification-QA
            workflow across
            twenty packages a month. It is dramatically faster, and every
            number in the pilot report is true. Not one of them answers the
            question the board will ask.
          </p>

          <AnimatePresence>
            {showCta && (
              <motion.div
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-7 overflow-hidden"
              >
                <button
                  onClick={onStart}
                  className="group inline-flex items-center gap-2.5 rounded-xl border border-line-strong bg-surface-1 px-5 py-3 text-[14px] font-medium text-zinc-100 transition-colors hover:border-white/25 hover:bg-surface-2"
                >
                  What changed for the business?
                  <ArrowDown
                    size={15}
                    className="text-zinc-500 transition-transform group-hover:translate-y-0.5"
                  />
                </button>
                <p className="mt-3 text-[12.5px] text-zinc-600">
                  Follow the released time through the firm.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ClaimReadout settled={traced} />
      </div>
    </section>
  );
}
