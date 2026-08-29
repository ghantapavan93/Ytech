import { ProgressChainDiagram } from "@/components/diagram/ProgressChainDiagram";
import { CommandHint } from "@/components/CommandPalette";
import { ProofOfProgress } from "@/components/ProofOfProgress";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Proof of Progress · Value Shift",
  description:
    "An instrument that traces an AI pilot claim from activity down to business result, and refuses to call it a success until the chain holds.",
};

export default function ProgressPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-5">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="text-[15px] font-bold tracking-[-0.01em] text-ink-1 transition-colors hover:text-white"
            >
              VALUE&nbsp;SHIFT
            </Link>
            <span className="hidden font-mono text-[11.5px] text-ink-4 sm:block">
              // Proof of Progress
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

      <main className="mx-auto w-full max-w-5xl px-5 pb-24">
        <section className="relative pt-16 sm:pt-20">
          <div className="hero-decor" aria-hidden />
          <p className="micro-label fade-up">
            Are you measuring AI progress, or AI activity?
          </p>
          <h1
            className="fade-up mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Your AI pilot looks successful.
            <span className="block text-ink-4">
              The question is whether the firm is.
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
            style={{ animationDelay: "160ms" }}
          >
            Prompts, tokens, tools, agents and adoption rates all count
            activity. This traces one pilot claim down seven links, from the
            fact that the agent ran to whether the firm was any better off, and
            it stops at the first link nobody measured.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4"
            style={{ animationDelay: "220ms" }}
          >
            The rule underneath it is one line. An unmeasured link does not
            pass, it blocks. A claim inherits the weakest evidence beneath it
            rather than the strongest, which is the opposite of how a dashboard
            adds things up. There is no model in the decision path. The chain
            is arithmetic you can read.
          </p>
        </section>

        <section className="mt-14 sm:mt-16">
          <ProofOfProgress />
        </section>

        <section className="mt-14">
          <ProgressChainDiagram />
        </section>

        <section className="mt-16 border-t border-line pt-10">
          <p className="micro-label">Where this sits</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[15px] font-semibold text-ink-1">
                The wind tunnel runs underneath
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-4">
                Every number in the chain above comes from the same
                deterministic model.{" "}
                <Link
                  href="/"
                  className="text-ink-2 underline decoration-ink-4 underline-offset-2 transition-colors hover:text-ink-1 hover:decoration-ink-4"
                >
                  Open the economics
                </Link>
                .
              </p>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-ink-1">
                The Proof Office keeps it alive
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-4">
                A decision made here still expires when its conditions break.{" "}
                <Link
                  href="/proof"
                  className="text-ink-2 underline decoration-ink-4 underline-offset-2 transition-colors hover:text-ink-1 hover:decoration-ink-4"
                >
                  See what expiry looks like
                </Link>
                .
              </p>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-ink-1">
                Every finished chain is a record
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-4">
                Enough of them and the pattern across firms becomes the asset.{" "}
                <Link
                  href="/vision"
                  className="text-ink-2 underline decoration-ink-4 underline-offset-2 transition-colors hover:text-ink-1 hover:decoration-ink-4"
                >
                  Read the argument
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <p className="mt-12 text-[11.5px] leading-relaxed text-ink-4">
          Built by Pavan Kalyan as an independent prototype, not affiliated with
          YegaTech. The specification-QA case is synthetic and calibrated
          against published consultant fee and utilization data. It is a worked
          example of the method, not a claim about any real firm.
        </p>
      </main>
    </div>
  );
}
