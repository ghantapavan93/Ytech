import { CommandHint } from "@/components/CommandPalette";
import { ProofOffice } from "@/components/ProofOffice";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Proof Office · Value Shift",
  description:
    "A recommendation is written once and treated as permanent, though every condition holding it up is temporary. This is what happens when one of them moves.",
};

export default function ProofPage() {
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
              // The Proof Office
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

      <main className="mx-auto w-full max-w-5xl px-5 pb-20">
        <section className="relative pt-16 sm:pt-20">
          <div className="hero-decor" aria-hidden />
          <p className="micro-label fade-up">
            The layer after the decision
          </p>
          <h1
            className="fade-up mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Decisions expire.
            <span className="block text-ink-4">
              Almost nothing in consulting is built to notice.
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
            style={{ animationDelay: "160ms" }}
          >
            A recommendation gets written once and then treated as permanent,
            even though every condition holding it up is temporary. The owner
            leaves. A contract narrows the data environment. Review effort
            climbs past the budget the economics were approved against. None
            of that is a technology failure, and none of it shows up in a tool
            that only watches the tool.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4"
            style={{ animationDelay: "220ms" }}
          >
            So an authorization here is not a verdict. It is a verdict plus the
            conditions it depends on. Move time forward and watch what happens
            to a workflow that is still doing its job perfectly well.
          </p>
        </section>

        <section className="mt-10">
          <ProofOffice />
        </section>

        <section className="mt-12">
          <div className="card p-7">
            <p className="micro-label">Why this is the harder half</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="text-[15px] font-semibold text-ink-1">
                  What a normal review asks
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
                  Is the agent still working? Almost always yes, which is why
                  quarterly reviews so often conclude that everything is fine
                  right up until something is very much not fine.
                </p>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-ink-1">
                  What this asks instead
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
                  Is the thing that justified the decision still true? That is
                  a question about the firm, not the software, and it is the
                  one a licensed professional actually has to answer.
                </p>
              </div>
            </div>
            <p className="mt-5 border-t border-line pt-5 text-[13px] leading-relaxed text-ink-3">
              Repairing a broken condition does not restore the clearance. That
              is deliberate, and it is enforced in the engine rather than
              suggested in the copy. Fixing what broke earns you a bounded
              retest, not a return to where you were, because the evidence that
              supported the original decision was gathered under conditions
              that no longer exist.
            </p>
          </div>
        </section>

        <section className="mt-6">
          <div className="card flex flex-col items-start justify-between gap-5 border-cyan-500/25 bg-cyan-500/[0.06] p-7 sm:flex-row sm:items-center">
            <div>
              <p className="micro-label !text-cyan-300/80">Where this sits</p>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-2">
                The wind tunnel asks whether a workflow should be tested. The
                decision record asks whether evidence arrived. This asks
                whether the authorization still stands, which is the only one
                of the three that keeps asking after everyone has moved on.
              </p>
            </div>
            <Link
              href="/record"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-zinc-100 px-5 py-3 text-[15px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.6)]"
            >
              See the decision records
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <p className="mt-8 text-[11.5px] leading-relaxed text-ink-4">
            One synthetic case, computed by a deterministic engine whose
            invariants are covered by the test suite. No real firm and no real
            engagement is
            represented. Built by Pavan Kalyan as an independent prototype, not
            affiliated with YegaTech.
          </p>
        </section>
      </main>
    </div>
  );
}
