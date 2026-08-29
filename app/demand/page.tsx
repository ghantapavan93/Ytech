import { CommandHint } from "@/components/CommandPalette";
import { DemandBoard } from "@/components/DemandBoard";
import { SUBSIDY } from "@/components/demand/demand-data";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What the shortage is worth · Value Shift",
  description:
    "Every AI pilot in AEC this year is being measured inside the tightest labour market the industry has had. This separates the part of the result that is the operating model from the part that is the market.",
};

const money = (n: number) =>
  `$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

export default function DemandPage() {
  const worth = SUBSIDY[0].worth;
  const hourly = SUBSIDY.find((m) => m.id === "TM_100")!;

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
            <span className="hidden font-mono text-[11.5px] text-ink-4 sm:block">
              // What the shortage is worth
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
          <p className="micro-label fade-up">The condition nobody set</p>
          <h1
            className="fade-up mt-5 max-w-3xl text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-[44px]"
            style={{ animationDelay: "80ms" }}
          >
            Part of your pilot result
            <span className="block text-ink-4">is the labour market, not the agent.</span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
            style={{ animationDelay: "160ms" }}
          >
            An agent frees capacity. Whether that capacity becomes revenue
            depends on there being work waiting for it, and right now there
            always is: roughly a third of firms are turning work away, so every
            freed hour finds a home the moment it exists. That is the most
            generous market this argument will ever be tested in, and it is the
            one every pilot running this year is being measured in.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4"
            style={{ animationDelay: "220ms" }}
          >
            The rest of this site holds that condition at full, which is honest
            about today and silent about the assumption. This page names it and
            turns it down.{" "}
            <Link
              href="/thesis"
              className="text-ink-2 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-ink-1"
            >
              The receipts concede it
            </Link>{" "}
            as the strongest counter-evidence against the fee-model argument.
            This is the part that was missing: what happens after.
          </p>
        </section>

        <section className="mt-12">
          <DemandBoard />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <p className="micro-label">What changes if you accept this</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                head: "A pilot result is two numbers",
                body: `One at the market you are in and one at the market you are not. The gap between them is ${money(worth)} a month here, and it belongs to the labour market rather than to anything the firm built.`,
              },
              {
                head: "Redeployment stops being free",
                body: "Routing freed hours into backlog is the lever that currently works by itself. It works because the backlog is there. It is the first of the four to stop working, and it will stop without anyone deciding anything.",
              },
              {
                head: "The fee model is the one that holds",
                body: `Billed hourly, this agent is ${money(hourly.best)} a month down with the market at its most generous and ${money(hourly.worst)} down without it. A fixed fee is the only configuration here that does not depend on the weather.`,
              },
            ].map((c) => (
              <div key={c.head} className="rounded-xl border border-line bg-surface-1 p-5">
                <p className="text-[15px] font-semibold text-ink-1">{c.head}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-4">
                  {c.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl border-l-2 border-line-strong pl-4 text-[15px] leading-relaxed text-ink-3">
            None of this says the agent is bad. It says the firm is currently
            unable to tell how much of its result it built and how much it was
            handed, and that a report which does not separate the two is not
            wrong so much as unreadable.
          </p>
        </section>

        <p className="mt-12 text-[11.5px] leading-relaxed text-ink-4">
          Built by Pavan Kalyan as an independent prototype, not affiliated with
          YegaTech. Atlas Structural &amp; Civil is synthetic. The share of freed
          hours the market absorbs is a reading the visitor sets, not a measured
          figure, and the arithmetic downstream of it is the same deterministic
          engine every other page on this site runs on.
        </p>
      </main>
    </div>
  );
}
