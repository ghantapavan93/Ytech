import { CommandHint } from "@/components/CommandPalette";
import { ACT_COUNT_WORD } from "@/components/run/act-data";
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
              className="hit-24 text-[15px] font-bold tracking-[-0.01em] text-ink-1 transition-colors hover:text-white"
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
            One load, one structure, {ACT_COUNT_WORD} acts
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
            The agent does everything it promised. Every technical test
            passes, and the firm still ends the month worse off. The drawing
            reads the firm&rsquo;s operating system as a load path: released
            capacity enters at the top and reaches business value only where
            something carries it. Four members decide whether it gets there,
            and a pilot that changes one of them fails for reasons the pilot
            cannot see.
          </p>
        </section>

        <section className="mt-12 sm:mt-14">
          <TheRun />
        </section>

        {/*
          The exits, named as the objections rather than as the pages.

          This was three cards chosen before two of these existed, and the two
          strongest things to hand a sceptic were reachable only from the
          command palette. Five one-line rows are less visually heavy than
          three cards were and they say what each one is for, which is the
          part a reader who has just watched the argument actually wants.
          Everything else the run absorbed is still there for anyone who goes
          looking and none of it is offered here.
        */}
        <section className="mx-auto w-full max-w-6xl border-t border-line px-5 pt-10">
          <p className="micro-label">What you would ask next</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {[
              {
                href: "/refusal",
                q: "Isn't this just a number people will learn to manage?",
                a: "Every operating model ranked. The best three are refused.",
              },
              {
                href: "/demand",
                q: "How much of this is the labour market rather than the firm?",
                a: "More than half of it, at today's market. The dial is here.",
              },
              {
                href: "/thesis",
                q: "Where does any of this come from?",
                a: "Every claim, quoted and dated, against the mechanism it drives.",
              },
              {
                href: "/engine",
                q: "Can I change the assumptions?",
                a: "The levers, the ledger, and every number open to editing.",
              },
              {
                href: "/vision",
                q: "What would this be worth more than once?",
                a: "What one instrument becomes across a cohort.",
              },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex flex-col gap-1 py-3.5 transition-colors sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="text-[15px] font-medium text-ink-2 transition-colors group-hover:text-ink-1 sm:w-[46%] sm:shrink-0">
                    {l.q}
                  </span>
                  <span className="text-[13px] leading-relaxed text-ink-4 transition-colors group-hover:text-ink-3">
                    {l.a}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
