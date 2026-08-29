import { CommandHint } from "@/components/CommandPalette";
import { ContinuumBoard } from "@/components/ContinuumBoard";
import { SyntheticBadge } from "@/components/SyntheticBadge";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Continuum · Value Shift",
  description:
    "A system built on somebody's published work answers from whatever it was given. Continuum tracks when a position moved, proposes the change, and refuses to make it without the author's approval.",
};

export default function ContinuumPage() {
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
              // Continuum
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
          <p className="micro-label fade-up">The layer above the instrument</p>
          <h1
            className="fade-up mt-5 max-w-3xl text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-[44px]"
            style={{ animationDelay: "80ms" }}
          >
            A system trained on what you said
            <span className="block text-ink-4">
              cannot know what you no longer believe.
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
            style={{ animationDelay: "160ms" }}
          >
            Anything built on a body of published work — a retrieval index, a
            course, a cohort handbook, an assistant over a back catalogue —
            answers from what it was given. It has no way to know an emphasis
            moved, because a document does not carry the fact of having been
            superseded. To a similarity search the newest source and the oldest
            one look the same.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4"
            style={{ animationDelay: "220ms" }}
          >
            The missing object is not a better retriever. It is a position: a
            claim with a version, a date it took effect, the audience it applies
            to, the evidence underneath it, and an approval. Positions supersede
            each other, and nothing supersedes anything without a person saying
            so. Detecting that an emphasis moved can be automated. Deciding
            whether that is a change of judgment or an added nuance cannot.
          </p>
        </section>

        <section className="mt-12">
          <ContinuumBoard />
        </section>

        <section className="mt-14 border-t border-line pt-10">
          <p className="micro-label">Where this sits</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                head: "Above the instrument",
                body: "An approved position can carry an executable method. This one says the operating conditions decide whether value survives, which the wind tunnel can run rather than restate.",
              },
              {
                head: "Not another voice",
                body: "Nothing here imitates anybody, writes in anybody's register, or answers as anybody. It decides which of a person's own dated statements may currently be quoted, and abstains when none may.",
              },
              {
                head: "The loop closes",
                body: "A decision run through the instrument produces a result, and the result is evidence that may move the position again. Thought, to approved judgment, to executable method, to evidence.",
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
        </section>

        <section className="mt-12 rounded-xl border border-line bg-surface-1 p-5 sm:p-6">
          <p className="micro-label">What this page is careful about</p>
          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-ink-3">
            Every quotation on this page is public, dated, and attributed, and
            each is marked as verbatim or summarised. Nothing here claims to
            know what anybody privately thinks, and nothing describes a product
            anybody owns. The only claim made is narrow and checkable: between
            2024 and 2026 the published answer to where a firm should start
            moved from preparing an organisation to adopt AI toward redesigning
            the work itself.
          </p>
          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-ink-3">
            It is deliberately not called a contradiction. The 2024 material is
            still the right answer for a firm at zero, which is exactly why the
            decision at the end belongs to its author and not to this.
          </p>
        </section>

        <p className="mt-12 text-[11.5px] leading-relaxed text-ink-4">
          Built by Pavan Kalyan as an independent prototype, not affiliated with
          YegaTech. The position record here is assembled from public,
          attributed sources for demonstration; the approval shown is
          illustrative and nobody has approved anything.
        </p>
      </main>
    </div>
  );
}
