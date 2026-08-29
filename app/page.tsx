import { CommandHint } from "@/components/CommandPalette";
import { TheRun } from "@/components/run/TheRun";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Value Shift · A working agent, and the firm that cannot carry it",
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
              className="text-[15px] font-bold tracking-[-0.01em] text-ink-1 transition-colors hover:text-white"
            >
              VALUE&nbsp;SHIFT
            </Link>
            <span className="hidden font-mono text-[11.5px] text-ink-4 sm:block">
              // The instrument
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <CommandHint />
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
            className="fade-up mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Watch a working agent
            <span className="block text-ink-4">
              travel through a firm that cannot carry it.
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
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

        {/* Three ways out, and no more. Everything the run absorbed is
            still there for anyone who goes looking; none of it is offered
            to a reader who has just watched the argument land. */}
        <section className="mx-auto w-full max-w-6xl border-t border-line px-5 pt-10">
          <p className="micro-label">If you want to check it</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "/thesis",
                title: "Inspect the evidence",
                body: "Every claim behind this, quoted and dated, mapped to the mechanism it drives.",
              },
              {
                href: "/engine",
                title: "Inspect the engine",
                body: "The levers, the assumption ledger, and every number open to editing.",
              },
              {
                href: "/vision",
                title: "See where this could go",
                body: "What one instrument becomes across a cohort, written as a proposal.",
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group rounded-xl border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong hover:bg-surface-2"
              >
                <p className="text-[15px] font-semibold text-ink-1 transition-colors group-hover:text-ink-1">
                  {l.title}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-4">
                  {l.body}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <p className="mx-auto w-full max-w-6xl px-5 pb-16 pt-12 text-[11.5px] leading-relaxed text-ink-4">
          Built by Pavan Kalyan as an independent prototype, not affiliated with
          YegaTech. Atlas Structural &amp; Civil is synthetic, calibrated against
          published consultant fee and utilization data. No real firm and no real
          engagement is represented.
        </p>
      </main>
    </div>
  );
}
