import { CommandHint } from "@/components/CommandPalette";
import { RefusalFigure } from "@/components/diagram/RefusalFigure";
import {
  BEST,
  BEST_SIGNED,
  BEST_SIGNED_RANK,
  CONFIGURATIONS,
  COST_OF_REFUSING,
  VERDICT_LABEL,
} from "@/lib/engines/configurations";
import { SyntheticBadge } from "@/components/SyntheticBadge";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The number it will not sign · Value Shift",
  description:
    "Every operating model this firm could choose, ranked by the number a dashboard would celebrate. The best three are all ones the instrument refuses, which is the only useful property a metric like this can have.",
};

const money = (n: number) =>
  `${n < 0 ? "−" : "+"}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

const signed = CONFIGURATIONS.filter((c) => c.signed).length;

export default function RefusalPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-5">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="hit-24 text-[15px] font-bold tracking-[-0.01em] text-ink-1 transition-colors hover:text-white"
            >
              VALUE&nbsp;SHIFT
            </Link>
            <SyntheticBadge />
            <span className="hidden font-mono text-[11.5px] text-ink-4 sm:block">
              // The number it will not sign
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <CommandHint />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-4 transition-colors hover:border-line-strong hover:text-ink-2"
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">The run</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-24">
        <section className="relative pt-16 sm:pt-20">
          <div className="hero-decor" aria-hidden />
          <p className="micro-label fade-up">The objection this has to survive</p>
          <h1
            className="fade-up mt-5 max-w-3xl text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-[44px]"
            style={{ animationDelay: "80ms" }}
          >
            The best month this model can produce
            <span className="block text-ink-4">is one it refuses to sign.</span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
            style={{ animationDelay: "160ms" }}
          >
            Any number put in front of leadership becomes a number leadership
            manages. That is not cynicism, it is the ordinary behaviour of
            organisations, and it is the strongest objection to everything else
            on this site: if the monthly position is just a new metric, someone
            will learn to move it and nothing will have changed.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4"
            style={{ animationDelay: "220ms" }}
          >
            The answer cannot be a promise in a paragraph. It has to be the
            ranking. Below are all {CONFIGURATIONS.length} operating models
            these levers can express, ordered by the number a dashboard would
            put on the wall, each one carrying whatever the instrument says
            about it. Redeployment is held at full throughout, so every row is
            shown in the best market it will ever see.
          </p>
        </section>

        <section className="mt-12">
          <figure className="card overflow-hidden">
            <div className="figure-pan px-4 pt-5 sm:px-6">
              <RefusalFigure />
            </div>
            <figcaption className="mt-2 border-t border-line px-5 py-4">
              <p className="text-[13px] font-medium text-ink-2">
                Ranked by the number, coloured by the verdict
              </p>
              <p className="diagram-reading mt-1.5 text-[13px] leading-relaxed text-ink-4">
                The best available month is {money(BEST.position)} and the
                instrument refuses it outright. The second is {" "}
                {money(CONFIGURATIONS[1].position)} and it needs a condition
                changed first. The third is refused as well. The best
                configuration the instrument will sign is ranked{" "}
                {BEST_SIGNED_RANK} at {money(BEST_SIGNED.position)}, which is{" "}
                {money(COST_OF_REFUSING).replace("+", "")} a month worse than
                the top of the list. Anyone optimising the headline number ends
                up somewhere this will not follow them.
              </p>
            </figcaption>
          </figure>
        </section>

        <section className="mt-8">
          <p className="micro-label">
            The top of the ranking, and why it is refused
          </p>
          <div className="mt-4 space-y-2.5">
            {CONFIGURATIONS.slice(0, BEST_SIGNED_RANK).map((c, i) => {
              const tone = c.signed
                ? { border: "border-ok/40", bg: "bg-ok/[0.06]", text: "text-ok" }
                : c.out.recommendation === "REDESIGN_BEFORE_PILOT"
                  ? { border: "border-warn/40", bg: "bg-warn/[0.06]", text: "text-warn" }
                  : { border: "border-crit/40", bg: "bg-crit/[0.06]", text: "text-crit" };
              return (
                <div
                  key={c.label}
                  className={`status-surface rounded-xl border p-4 ${tone.border} ${tone.bg}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="mono-num w-6 shrink-0 pt-0.5 text-[13px] text-ink-4">
                      {i + 1}
                    </span>
                    <span
                      className={`mono-num w-24 shrink-0 text-[19px] font-semibold ${tone.text}`}
                    >
                      {money(c.position)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-semibold text-ink-1">
                        {c.label}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-ink-3">
                        {c.refusal ??
                          "The conditions around the workflow hold, so a bounded test would measure the agent rather than the operating model around it."}
                      </span>
                    </span>
                    <span
                      className={`hidden shrink-0 text-[11.5px] font-medium sm:block ${tone.text}`}
                    >
                      {VERDICT_LABEL[c.out.recommendation]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <p className="micro-label">What this is worth saying for</p>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-3">
            {signed} of the {CONFIGURATIONS.length} configurations here are
            signable. A gate that passed most of what it saw would be a
            formality, and a gate whose best-scoring option was also its
            recommended one would be a dashboard with extra steps. The property
            worth having is the awkward one: following the number leads
            somewhere the instrument will not go, and the distance between
            those two places is{" "}
            <span className="font-semibold text-ink-1">
              {money(COST_OF_REFUSING).replace("+", "")} a month
            </span>{" "}
            that a firm gives up on purpose.
          </p>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-3">
            That is also the honest answer to what this instrument is for. It
            does not find money. It tells a firm what the money would cost, and
            then it declines to sign for the version that costs too much.
          </p>
          <p className="mt-6 max-w-3xl text-[13px] leading-relaxed text-ink-4">
            Worth being plain about the limit: the refusals come from rules
            written into the engine, and rules written by one person are a
            position rather than a standard. They are visible, argued, and{" "}
            <Link
              href="/thesis"
              className="text-ink-2 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-ink-1"
            >
              sourced
            </Link>
            , which is the most a prototype can offer. A firm that disagreed
            with one of them would change it and get a different ranking, and
            that argument is the useful part.
          </p>
        </section>

        <p className="mt-12 text-[11.5px] leading-relaxed text-ink-4">
          Built by Pavan Kalyan as an independent prototype, not affiliated with
          YegaTech. Atlas Structural &amp; Civil is synthetic. Every row is the
          same deterministic engine run at different lever positions, with no
          model anywhere in it.
        </p>
      </main>
    </div>
  );
}
