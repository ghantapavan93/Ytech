import { CommandHint } from "@/components/CommandPalette";
import { PrepBoard } from "@/components/PrepBoard";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Prep Board · Value Shift",
  description:
    "A working board for preparing an AEC client conversation using YegaTech's own published method. Every line carries its source. No model writes the substance.",
};

export default function PrepPage() {
  return (
    <div className="min-h-screen">
      <header className="print-hidden sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-5">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="hit-24 text-[15px] font-bold tracking-[-0.01em] text-ink-1 transition-colors hover:text-white"
            >
              VALUE&nbsp;SHIFT
            </Link>
            <span className="hidden font-mono text-[11.5px] text-ink-4 sm:block">
              // Prep Board
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <CommandHint />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-4 transition-colors hover:border-line-strong hover:text-ink-1"
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">Instrument</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 pb-20">
        <section className="print-hidden relative pt-16 sm:pt-20">
          <div className="hero-decor" aria-hidden />
          <p className="micro-label fade-up">
            A second instrument, built on the same rule
          </p>
          <h1
            className="fade-up mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Fifteen minutes before the call,
            <span className="block text-ink-4">
              built from what YegaTech has published.
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
            style={{ animationDelay: "160ms" }}
          >
            Tell it what you know about the firm. It hands back the opening
            question, the contradiction worth surfacing, what to advise them
            not to build, and the one experiment that fits where they actually
            are. Every line comes from something YegaTech has published, and
            the source stays attached so you can check it.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4"
            style={{ animationDelay: "220ms" }}
          >
            It is not a voice, and it does not pretend to be one. It is a
            scaffold you edit. Keep the lines that sound like you, set aside
            the ones that don't, and the board holds both for next time.
          </p>
        </section>

        <section className="mt-10">
          <PrepBoard />
        </section>

        <p className="print-hidden mt-10 text-[11.5px] leading-relaxed text-ink-4">
          Built by Pavan Kalyan as an independent prototype. Not affiliated
          with YegaTech. The method lines are drawn from their published
          articles, podcasts, and framework pages, each linked at the point of
          use. Your edits stay in this browser and are never sent anywhere.
        </p>
      </main>
    </div>
  );
}
