import { CommandHint } from "@/components/CommandPalette";
import { TheRun } from "@/components/run/TheRun";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Run · Value Shift",
  description:
    "One causal load travelling through an AEC firm. The agent works, the operating system rejects it, leadership changes three conditions, and the result is still a bounded experiment rather than a deployment.",
};

export default function RunPage() {
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
              // The Run
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

      <main>
        <section className="relative mx-auto w-full max-w-6xl px-5 pt-16 sm:pt-20">
          <div className="hero-decor" aria-hidden />
          <p className="micro-label fade-up">
            One load, one structure, six acts
          </p>
          <h1
            className="fade-up mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-zinc-100 sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Watch a working agent
            <span className="block text-zinc-500">
              travel through a firm that cannot carry it.
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-400"
            style={{ animationDelay: "160ms" }}
          >
            The drawing on the right is the firm&rsquo;s operating system read
            as a load path. Released capacity enters at the top and reaches
            business value only where something carries it. Every act
            recomputes the same deterministic model, so the structure responds
            rather than being redrawn.
          </p>
        </section>

        <section className="mt-12 sm:mt-14">
          <TheRun />
        </section>

        <p className="mx-auto w-full max-w-6xl px-5 pb-16 text-[11px] leading-relaxed text-zinc-600">
          Built by Pavan Kalyan as an independent prototype, not affiliated with
          YegaTech. Atlas Structural &amp; Civil is synthetic, calibrated against
          published consultant fee and utilization data. No real firm and no real
          engagement is represented.
        </p>
      </main>
    </div>
  );
}
