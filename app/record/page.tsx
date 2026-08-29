import { CommandHint } from "@/components/CommandPalette";
import { DecisionRecords } from "@/components/DecisionRecords";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Decision Record · Value Shift",
  description:
    "Both instruments end in a decision. Neither remembers what happened next. The Decision Record is the ladder a decision has to climb before it counts as evidence.",
};

export default function RecordPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="text-[14px] font-bold tracking-[-0.01em] text-zinc-100 transition-colors hover:text-white"
            >
              VALUE&nbsp;SHIFT
            </Link>
            <span className="hidden font-mono text-[11px] text-zinc-600 sm:block">
              // Decision Record
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <CommandHint />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-zinc-500 transition-colors hover:border-line-strong hover:text-zinc-200"
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">Instrument</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 pb-20">
        <section className="relative pt-16 sm:pt-20">
          <div className="hero-decor" aria-hidden />
          <p className="micro-label fade-up">The part everyone skips</p>
          <h1
            className="fade-up mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-zinc-100 sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Deciding is the easy half.
            <span className="block text-zinc-500">
              Finding out whether you were right is the half that gets skipped.
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-400"
            style={{ animationDelay: "160ms" }}
          >
            The wind tunnel produces a decision. The prep board produces a
            decision. Neither one remembers what happened afterwards, and that
            is where the industry keeps losing its evidence. A firm runs
            twelve pilots, believes all twelve worked, and can prove nothing
            about any of them.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-zinc-500"
            style={{ animationDelay: "220ms" }}
          >
            So each decision has a rung to climb. Claimed means somebody said
            it worked. Verified means it held against a baseline and a stop
            condition that could have failed it. Only the top two rungs may
            contribute a pattern to the library, which is the rule that keeps
            the library honest.
          </p>
        </section>

        <section className="mt-10">
          <DecisionRecords />
        </section>

        <section className="mt-12">
          <div className="card flex flex-col items-start justify-between gap-5 border-cyan-500/20 bg-cyan-500/[0.04] p-7 sm:flex-row sm:items-center">
            <div>
              <p className="micro-label !text-cyan-300/80">Where the loop closes</p>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-zinc-300">
                Verified records are the only ones that reach the pattern
                library. That is what makes the next engagement start further
                ahead than this one did.
              </p>
            </div>
            <Link
              href="/engine#stage-5"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-zinc-100 px-5 py-3 text-[14px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.6)]"
            >
              See the pattern library
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <p className="mt-8 text-[11px] leading-relaxed text-zinc-600">
            Twelve synthetic records, written to show the shape of the
            problem. No real firm is named and no real engagement is
            represented. Built by Pavan Kalyan as an independent prototype,
            not affiliated with YegaTech.
          </p>
        </section>
      </main>
    </div>
  );
}
