import { CommandHint } from "@/components/CommandPalette";
import { SourcingBoard } from "@/components/SourcingBoard";
import { OPERATING_SWING } from "@/components/sourcing/sourcing-data";
import { SyntheticBadge } from "@/components/SyntheticBadge";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Build it or buy it · Value Shift",
  description:
    "A build-or-buy screen that asks about the size of the market rather than the size of the invoice, and shows how little the invoice has to say.",
};

const money = (n: number) =>
  `$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

export default function SourcingPage() {
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
              // Build it or buy it
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
          <p className="micro-label fade-up">The question after the workflow</p>
          <h1
            className="fade-up mt-5 max-w-3xl text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-[44px]"
            style={{ animationDelay: "80ms" }}
          >
            Build it or buy it is a question
            <span className="block text-ink-4">about market size, not price.</span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
            style={{ animationDelay: "160ms" }}
          >
            A problem every firm has is a problem somebody is already being paid
            to solve, and solving it again in-house spends the scarcest thing a
            practice owns on something already finished. A problem shaped by one
            firm&rsquo;s own judgment has a market of one, so no vendor will ever
            arrive, and that is the actual argument for building it: not that it
            is cheaper, but that nobody can hand it to a competitor.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4"
            style={{ animationDelay: "220ms" }}
          >
            Which makes the usual version of this meeting the wrong meeting.
            Where a tool came from does not touch the value side of the model at
            all. It moves one line on the cost side, while the four conditions
            around the workflow are worth {money(OPERATING_SWING)} a month on
            the same firm. The cost comparison is here, underneath the questions
            that actually decide it, so you can see how little it has to say.
          </p>
        </section>

        <section className="mt-12">
          <SourcingBoard />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <p className="micro-label">Where this sits</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                head: "After the workflow is chosen",
                body: "There is no sourcing question until something has decided which piece of work is worth touching, and that decision is not a build-or-buy decision.",
                href: "/triage",
                link: "Which workflow",
              },
              {
                head: "Before the operating model is fixed",
                body: "A bought tool and a built one both arrive into whatever the firm's fee model, routing and review gate happen to be. Neither survives an operating model that cannot carry it.",
                href: "/",
                link: "The run",
              },
              {
                head: "And it never becomes a return",
                body: "The threshold everyone applies here is a multiple of build cost. On this workflow the screen and the outcome are on opposite sides of zero, so the denominator was never the problem.",
                href: "/triage",
                link: "The screen",
              },
            ].map((c) => (
              <div
                key={c.head}
                className="rounded-xl border border-line bg-surface-1 p-5"
              >
                <p className="text-[15px] font-semibold text-ink-1">{c.head}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-4">
                  {c.body}
                </p>
                <Link
                  href={c.href}
                  className="hit-24 mt-3 inline-block text-[13px] text-ink-2 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-ink-1"
                >
                  {c.link}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-12 text-[11.5px] leading-relaxed text-ink-4">
          Built by Pavan Kalyan as an independent prototype, not affiliated with
          YegaTech. Atlas Structural &amp; Civil is synthetic. The subscription,
          build and maintenance figures are readings the visitor sets, not
          measured prices; the {money(OPERATING_SWING)} they are compared
          against is the same deterministic engine every other page here runs
          on.
        </p>
      </main>
    </div>
  );
}
