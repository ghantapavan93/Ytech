import { CommandHint } from "@/components/CommandPalette";
import { TenXScreen } from "@/components/TenXScreen";
import { TriageBoard } from "@/components/TriageBoard";
import { SyntheticBadge } from "@/components/SyntheticBadge";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Which workflow · Value Shift",
  description:
    "Before an agent is worth building, something has to choose the workflow. A deterministic triage that ranks candidates by exposure and refuses to rank the ones nobody has measured.",
};

export default function TriagePage() {
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
              // Which workflow
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
          <p className="micro-label fade-up">The step before the instrument</p>
          <h1
            className="fade-up mt-5 max-w-3xl text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-[44px]"
            style={{ animationDelay: "80ms" }}
          >
            Something has to choose
            <span className="block text-ink-4">which workflow is even worth testing.</span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
            style={{ animationDelay: "160ms" }}
          >
            An engagement does not open with a finished agent. It opens with a
            principal listing what the firm does over and over, and someone
            working out which of those is worth the cost of an experiment. This
            is that conversation, run as arithmetic.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4"
            style={{ animationDelay: "220ms" }}
          >
            It takes what a principal can answer in fifteen minutes rather than
            a data warehouse, and it will not rank a workflow nobody has
            measured. A missing answer does not average away with the ones you
            have. It blocks, and the useful output is knowing which question to
            go and answer.
          </p>
        </section>

        <section className="mt-12">
          <TriageBoard />
        </section>

        <section className="mt-16 border-t border-line pt-10">
          <p className="micro-label">Then the workflow gets sized</p>
          <h2 className="mt-4 max-w-3xl text-[26px] font-semibold leading-[1.12] tracking-[-0.025em] text-ink-1 sm:text-[32px]">
            The screen cannot fail this workflow.
            <span className="block text-ink-4">Only the operating model can.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-3">
            Once a workflow is chosen, the next step is nearly always a return
            threshold: build it only if it is worth some multiple of what it
            costs. It is good discipline and this is not an argument against
            it. It is an argument that the threshold is being applied to the
            wrong quantity.
          </p>
          <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4">
            A screen values the hours the agent frees. The firm receives what
            survives the fee model, the routing decision, the review gate and
            the practice floor. On the one workflow here that has been through
            the wind tunnel, those two numbers do not differ by a margin. They
            differ in sign, and a denominator cannot move a number across zero.
          </p>

          <div className="mt-8">
            <TenXScreen />
          </div>
        </section>

        <section className="mt-16 border-t border-line pt-10">
          <p className="micro-label">What happens next</p>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-3">
            Specification QA is the largest exposure on this list and it is not
            the one to test first, because it is billed hourly and it is how
            juniors learn the craft. Changing those conditions before a live
            pilot is the recommendation, and the wind tunnel is how you work
            out which conditions, without deploying anything.{" "}
            <Link
              href="/"
              className="text-ink-2 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-ink-1"
            >
              Run it
            </Link>
            .
          </p>
          <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4">
            The question most firms reach for between those two steps is
            whether to build the thing or buy it. It is a smaller question than
            it looks, and it is not the cost question everyone treats it as.{" "}
            <Link
              href="/sourcing"
              className="text-ink-2 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-ink-1"
            >
              Build it or buy it
            </Link>
            .
          </p>
        </section>

        <p className="mt-12 text-[11.5px] leading-relaxed text-ink-4">
          Built by Pavan Kalyan as an independent prototype, not affiliated with
          YegaTech. The candidate list is synthetic and describes no real firm.
          The scoring is deterministic arithmetic over the answers shown, with
          no model anywhere in it.
        </p>
      </main>
    </div>
  );
}
