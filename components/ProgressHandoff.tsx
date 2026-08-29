"use client";

import { motion } from "framer-motion";
import { ENTER_EASE } from "@/lib/motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * The handoff at the bottom of the wind tunnel.
 *
 * By this point the visitor has compiled a charter, which is a decision made
 * on a model. The obvious next question is what happens when the pilot has
 * actually run for a month and someone has to tell a board whether it worked.
 * That is a different instrument, so this points at it rather than answering
 * it here.
 */
export function ProgressHandoff({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: ENTER_EASE }}
      className="print-hidden border-t border-line"
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="micro-label">The next question</p>
            <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-[1.14] tracking-[-0.025em] text-ink-1 sm:text-3xl">
              This charter was written before the pilot ran.
              <span className="block text-ink-4">
                Thirty days later, someone has to tell a board what happened.
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-3">
              The report will say the agent ran 500 times, task time fell 42
              percent, and adoption reached 80 percent. All true, all activity.
              Proof of Progress traces that claim down seven links and stops at
              the first one nobody measured.
            </p>
            <Link
              href="/progress"
              className="group mt-7 inline-flex items-center gap-2.5 rounded-xl border border-line-strong bg-surface-1 px-5 py-3 text-[15px] font-medium text-ink-1 transition-colors hover:border-white/25 hover:bg-surface-2"
            >
              Open Proof of Progress
              <ArrowRight
                size={15}
                className="text-ink-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* A miniature of the chain, in the order it fails. */}
          <div className="rounded-2xl border border-line bg-surface-1 p-5">
            <p className="micro-label">The chain, in short</p>
            <ol className="mt-4 space-y-2.5">
              {[
                { name: "The agent ran", tone: "bg-ok" },
                { name: "Draft time fell", tone: "bg-ok" },
                { name: "Licensed review rose to 45.6h", tone: "bg-crit" },
                { name: "Output quality, never measured", tone: "bg-warn" },
                { name: "Freed capacity, never tracked", tone: "bg-warn" },
                { name: "Junior exposure fell", tone: "bg-crit" },
                { name: "Fee model gives it away", tone: "bg-crit" },
              ].map((row) => (
                <li key={row.name} className="flex items-center gap-3">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${row.tone}`} />
                  <span className="text-[13px] text-ink-3">{row.name}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-line pt-4 text-[13px] leading-relaxed text-ink-4">
              Two links were never measured. That is enough to block the
              conclusion, whatever the other five say.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
