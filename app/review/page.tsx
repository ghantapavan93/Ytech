import { CommandHint } from "@/components/CommandPalette";
import {
  BRUTAL_CONCLUSION,
  GRAVEYARD,
  HARD_TESTS,
  IDENTIFICATION,
  PROSECUTION,
  TOURNAMENT,
  TOURNAMENT_TOTALS,
  type ChargeSeverity,
  type ConceptVerdict,
} from "@/lib/content/review-data";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Gavel,
  Scale,
  Skull,
  Swords,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Kill Review · Value Shift",
  description:
    "The adversarial product review that produced Value Shift: the prosecution of every earlier concept, the eight hard tests, the tournament, and the brutally honest conclusion.",
};

const SEVERITY_STYLE: Record<ChargeSeverity, { text: string; bg: string }> = {
  FATAL: { text: "text-rose-400", bg: "bg-rose-500/10" },
  CORRECTABLE: { text: "text-amber-400", bg: "bg-amber-500/10" },
  "REQUIRES VALIDATION": { text: "text-cyan-400", bg: "bg-cyan-500/10" },
  "LOW RISK": { text: "text-zinc-400", bg: "bg-white/[0.06]" },
};

const VERDICT_STYLE: Record<ConceptVerdict["verdict"], { text: string; bg: string }> = {
  KILL: { text: "text-rose-400", bg: "bg-rose-500/10" },
  PARK: { text: "text-zinc-400", bg: "bg-white/[0.06]" },
  NARROW: { text: "text-amber-400", bg: "bg-amber-500/10" },
  DEFER: { text: "text-amber-400", bg: "bg-amber-500/10" },
  BUILD: { text: "text-emerald-400", bg: "bg-emerald-500/10" },
};

const JUMP_LINKS = [
  { href: "#question", label: "The governing question" },
  { href: "#prosecution", label: "The prosecution" },
  { href: "#tests", label: "Eight hard tests" },
  { href: "#tournament", label: "The tournament" },
  { href: "#conclusion", label: "The brutal conclusion" },
];

function SectionHeading({
  id,
  kicker,
  title,
  sub,
  icon,
}: {
  id: string;
  kicker: string;
  title: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="flex items-center gap-2 text-zinc-500">
        {icon}
        <p className="micro-label">{kicker}</p>
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-zinc-100 sm:text-3xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-zinc-400">{sub}</p>
      )}
    </div>
  );
}

/**
 * /review, The Kill Review. A static dossier documenting the adversarial
 * process that produced Value Shift. The same discipline the wind tunnel
 * applies to AI agents was applied to the product itself, first.
 */
export default function ReviewPage() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="text-[14px] font-bold tracking-[-0.01em] text-zinc-100 transition-colors hover:text-white"
            >
              VALUE&nbsp;SHIFT
            </Link>
            <span className="hidden font-mono text-[11px] text-zinc-600 sm:block">
              // The Kill Review
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

      <main className="mx-auto w-full max-w-6xl px-5 pb-20">
        {/* Hero */}
        <section className="pt-20 sm:pt-24">
          <p className="micro-label fade-up">
            Adversarial product review · nine phases · zero presumption of value
          </p>
          <h1
            className="fade-up mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-zinc-100 sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            We tried to kill this product
            <span className="block text-zinc-500">before we built it.</span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-400"
            style={{ animationDelay: "160ms" }}
          >
            Every earlier concept entered this review with no presumption of
            value and one governing question. Most did not survive. This page
            is the record: the prosecution, the eight hard tests, the
            tournament, and the honest conclusion. The discipline the wind
            tunnel applies to AI agents got applied to the wind tunnel first.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[14px] leading-relaxed text-zinc-500"
            style={{ animationDelay: "200ms" }}
          >
            It is published for one reason. You have killed more bad AI ideas
            than we have, and the arguments below are the best ones we could
            find against our own work. If you can add a better one, that is
            worth more to us than agreement.
          </p>
          <nav
            className="fade-up mt-8 flex flex-wrap gap-2"
            style={{ animationDelay: "240ms" }}
            aria-label="Sections"
          >
            {JUMP_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg border border-line px-3 py-1.5 text-[12px] font-medium text-zinc-400 transition-colors hover:border-line-strong hover:text-zinc-200"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </section>

        {/* Governing question */}
        <section className="mt-16">
          <SectionHeading
            id="question"
            kicker="Phase 00"
            title="The governing question"
            icon={<Scale size={14} />}
            sub="What specific piece of painful, repeated work disappears for Sam or YegaTech the day after this prototype exists? Answers like “it improves transformation” were rejected as descriptions, not value. Here is the concrete answer, in ten parts."
          />
          <div className="card mt-6 divide-y divide-line">
            {IDENTIFICATION.map((row) => (
              <div
                key={row.q}
                className="grid gap-1.5 px-6 py-4 sm:grid-cols-[240px_1fr] sm:gap-8"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                  {row.q}
                </p>
                <p className="text-[13px] leading-relaxed text-zinc-300">{row.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prosecution */}
        <section className="mt-16">
          <SectionHeading
            id="prosecution"
            kicker="Phase 01"
            title="The prosecution"
            icon={<Gavel size={14} />}
            sub="The Outcome Compiler and the generic agent OS were assumed to be bad ideas, then charged. Ten charges, each labeled by severity. Four were fatal, one is enough."
          />
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {PROSECUTION.map((c) => {
              const s = SEVERITY_STYLE[c.severity];
              return (
                <div key={c.charge} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-[13.5px] font-semibold leading-snug text-zinc-200">
                      {c.charge}
                    </h3>
                    <span
                      className={`mono-num shrink-0 rounded-md px-2 py-1 text-[9px] font-bold tracking-[0.12em] ${s.text} ${s.bg}`}
                    >
                      {c.severity}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-500">
                    {c.detail}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Graveyard */}
          <div className="mt-10">
            <div className="flex items-center gap-2 text-zinc-500">
              <Skull size={14} />
              <p className="micro-label">The concept graveyard, every idea, sentenced</p>
            </div>
            <div className="card mt-4 divide-y divide-line">
              {GRAVEYARD.map((g) => {
                const v = VERDICT_STYLE[g.verdict];
                return (
                  <div
                    key={g.concept}
                    className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span
                      className={`mono-num shrink-0 rounded-md px-2 py-1 text-center text-[10px] font-bold tracking-[0.14em] sm:w-20 ${v.text} ${v.bg}`}
                    >
                      {g.verdict}
                    </span>
                    <p className="w-56 shrink-0 text-[13px] font-semibold text-zinc-200">
                      {g.concept}
                    </p>
                    <p className="text-[12.5px] leading-relaxed text-zinc-500">{g.reason}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Eight hard tests */}
        <section className="mt-16">
          <SectionHeading
            id="tests"
            kicker="Phase 02"
            title="The eight hard tests"
            icon={<CheckCircle2 size={14} />}
            sub="A concept had to pass all eight to be built. Value Shift is the only one that did, and the 72-hour test is not a projection: the build exists, with 24 pinned invariants."
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {HARD_TESTS.map((t) => (
              <div key={t.name} className="card p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[13.5px] font-semibold text-zinc-200">{t.name}</h3>
                  <span className="mono-num flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-[9px] font-bold tracking-[0.14em] text-emerald-400">
                    <CheckCircle2 size={10} />
                    PASS
                  </span>
                </div>
                <p className="mt-1.5 text-[11.5px] italic text-zinc-600">{t.question}</p>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-400">{t.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tournament */}
        <section className="mt-16">
          <SectionHeading
            id="tournament"
            kicker="Phase 05"
            title="The tournament"
            icon={<Swords size={14} />}
            sub="The three surviving finalists, scored 1–10 on fifteen criteria. The Outcome Compiler was eliminated before scoring on penalty grounds: private-data dependency, an assumed internal problem, maintenance burden, and encoding founder judgment. Ties were not allowed."
          />
          <div className="card mt-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead>
                  <tr className="border-b border-line">
                    <th className="micro-label px-5 py-3 font-semibold">Criterion</th>
                    <th className="micro-label px-4 py-3 text-right font-semibold">Preflight</th>
                    <th className="micro-label px-4 py-3 text-right font-semibold">Greenlight</th>
                    <th className="micro-label px-4 py-3 text-right font-semibold !text-cyan-300">
                      Value Shift
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TOURNAMENT.map((r) => (
                    <tr key={r.criterion} className="border-b border-line/60">
                      <td className="px-5 py-2.5 text-[12.5px] text-zinc-400">{r.criterion}</td>
                      <td className="mono-num px-4 py-2.5 text-right text-[12.5px] text-zinc-500">
                        {r.preflight}
                      </td>
                      <td className="mono-num px-4 py-2.5 text-right text-[12.5px] text-zinc-500">
                        {r.greenlight}
                      </td>
                      <td
                        className={`mono-num px-4 py-2.5 text-right text-[12.5px] font-semibold ${
                          r.valueShift === 10 ? "text-cyan-300" : "text-zinc-300"
                        } bg-cyan-500/[0.05]`}
                      >
                        {r.valueShift}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-white/[0.02]">
                    <td className="px-5 py-3.5 text-[13px] font-bold text-zinc-200">
                      Total · 150 possible
                    </td>
                    <td className="mono-num px-4 py-3.5 text-right text-[14px] font-bold text-zinc-400">
                      {TOURNAMENT_TOTALS.preflight}
                    </td>
                    <td className="mono-num px-4 py-3.5 text-right text-[14px] font-bold text-zinc-400">
                      {TOURNAMENT_TOTALS.greenlight}
                    </td>
                    <td className="mono-num bg-cyan-500/10 px-4 py-3.5 text-right text-[15px] font-bold text-cyan-300">
                      {TOURNAMENT_TOTALS.valueShift}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="border-t border-line px-5 py-3.5 text-[11px] leading-relaxed text-zinc-600">
              Winner: Value Shift, {TOURNAMENT_TOTALS.valueShift}/150. Greenlight
              survives as Horizon 3 (project-level AI clearance); Preflight stays
              parked. The scores are judgments, recorded here so they can be argued
              with, which is the point of writing them down.
            </p>
          </div>
        </section>

        {/* Brutal conclusion */}
        <section className="mt-16">
          <SectionHeading
            id="conclusion"
            kicker="Phase 09"
            title="The brutally honest conclusion"
            icon={<Gavel size={14} />}
            sub="Ten questions the review was required to end with, answered without rescue attempts."
          />
          <div className="mt-6 space-y-3">
            {BRUTAL_CONCLUSION.map((qa, i) => (
              <div key={qa.q} className="card p-5">
                <div className="flex items-baseline gap-3">
                  <span className="mono-num shrink-0 text-[11px] font-semibold text-cyan-400/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[13.5px] font-semibold text-zinc-200">{qa.q}</h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">{qa.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA back */}
        <section className="mt-16">
          <div className="card flex flex-col items-start justify-between gap-5 border-cyan-500/20 bg-cyan-500/[0.04] p-7 sm:flex-row sm:items-center">
            <div>
              <p className="micro-label !text-cyan-300/80">The survivor</p>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-zinc-300">
                One concept passed all eight tests and won the tournament. It is
                not a document, it runs.
              </p>
            </div>
            <Link
              href="/"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-zinc-100 px-5 py-3 text-[14px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.6)]"
            >
              Enter the wind tunnel
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-8 text-[11px] text-zinc-600">
            Built by Pavan Kalyan. Independent work, not affiliated with or
            endorsed by YegaTech. Scores and verdicts are the author's recorded
            judgments; external facts cited on the instrument page were verified
            against primary sources.
          </p>
        </section>
      </main>
    </div>
  );
}
