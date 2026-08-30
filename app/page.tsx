import { CommandHint } from "@/components/CommandPalette";
import { FilmPlaceholder } from "@/components/FilmPlaceholder";
import { SyntheticBadge } from "@/components/SyntheticBadge";
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
            <SyntheticBadge />
            <span className="hidden font-mono text-[11.5px] text-ink-4 sm:block">
              // The instrument
            </span>
          </div>
          <nav aria-label="Site" className="flex items-center gap-2.5">
            <CommandHint />
          </nav>
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

        {/*
          The film sits between the claim and the instrument: it is how
          somebody who will not click anything still leaves with the argument,
          and it is the thing a link preview is standing in for today.
        */}
        <section className="mx-auto mt-10 w-full max-w-6xl px-5">
          <FilmPlaceholder
            eyebrow="Thirty seconds"
            title="The agent passed. The firm failed."
            supporting="An AEC value load path, from released capacity to the foundation it never reached."
            runtime="0:30"
            poster="loadpath"
          />
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
          <p className="micro-label">Three ways in, and no more</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                href: "/room",
                title: "Run the room",
                body: "One screen, five minutes, one decision. The version that runs in front of people.",
                lead: true,
              },
              {
                href: "/thesis",
                title: "Inspect the evidence",
                body: "Every claim quoted and dated, including where this argument is weakest.",
              },
              {
                href: "/engineer",
                title: "Engineer view",
                body: "The formulas, the decision rules, the full baseline and every invariant.",
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`group rounded-xl border p-5 transition-colors ${
                  l.lead
                    ? "border-line-strong bg-surface-2 hover:border-white/25"
                    : "border-line bg-surface-1 hover:border-line-strong hover:bg-surface-2"
                }`}
              >
                <p className="text-[15px] font-semibold text-ink-1">{l.title}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-4">
                  {l.body}
                </p>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-ink-4">
            The workflow triage, the sourcing screen, the refusal ranking and
            the demand dial are all still here and all still reachable, from
            search or from the pages above. None of them is offered to somebody
            who has just watched the argument land.
          </p>
        </section>

      </main>
      <footer>
        <p className="mx-auto w-full max-w-6xl px-5 pb-16 pt-12 text-[11.5px] leading-relaxed text-ink-4">
          Built by Pavan Kalyan as an independent prototype, not affiliated with
          YegaTech. Atlas Structural &amp; Civil is synthetic, with inputs informed by
          published consultant fee and utilization data. No real firm and no real
          engagement is represented.
        </p>
      </footer>
    </div>
  );
}
