import { CommandHint } from "@/components/CommandPalette";
import { AgentConsole } from "@/components/AgentConsole";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Working Agent · Value Shift",
  description:
    "An agent that runs the repeated preparation work in front of a consultant's day and stops wherever judgment is required. It runs with no model attached.",
};

export default function AgentPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-5">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="text-[14px] font-bold tracking-[-0.01em] text-zinc-100 transition-colors hover:text-white"
            >
              VALUE&nbsp;SHIFT
            </Link>
            <span className="hidden font-mono text-[11px] text-zinc-600 sm:block">
              // The Working Agent
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

      <main className="mx-auto w-full max-w-5xl px-5 pb-20">
        <section className="relative pt-16 sm:pt-20">
          <div className="hero-decor" aria-hidden />
          <p className="micro-label fade-up">An agent that knows what it is not</p>
          <h1
            className="fade-up mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-zinc-100 sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            It does the preparation.
            <span className="block text-zinc-500">You keep the judgment.</span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-400"
            style={{ animationDelay: "160ms" }}
          >
            Type what needs doing before your next meeting. It routes the task
            to one of five jobs it knows, runs the instruments behind this
            site, and gives you back a work product plus an explicit list of
            the calls it will not make for you.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-zinc-500"
            style={{ animationDelay: "220ms" }}
          >
            It does not write in anyone's voice and it does not pretend to be
            anyone. There is no model attached, which is deliberate. The
            routing is keyword matching you can audit, the substance comes
            from published sources, and every run refuses at least one thing
            out loud. A model could draft prose on top of this later. It could
            not be trusted with the refusals.
          </p>
        </section>

        <section className="mt-10">
          <AgentConsole />
        </section>

        <p className="mt-12 text-[11px] leading-relaxed text-zinc-600">
          Built by Pavan Kalyan as an independent prototype, not affiliated
          with YegaTech. The five jobs were chosen from publicly described
          consulting work: firm diagnosis, speaking, advising on what to build,
          reviewing what was decided, and following up afterwards.
        </p>
      </main>
    </div>
  );
}
