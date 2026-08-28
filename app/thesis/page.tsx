import { CommandHint } from "@/components/CommandPalette";
import { PageContents, type ContentsEntry } from "@/components/PageContents";
import {
  ATLAS_BASELINE,
  NAIVE_DEPLOYMENT,
  runEngine,
  type Levers,
} from "@/lib/engines/engine";
import { computeIndexLens, type IndexLensResult } from "@/lib/engines/index-lens";
import {
  AECOM_PROOF,
  CHALLENGES,
  CLIENT_PROOFS,
  FUNNEL_STEPS,
  GROUNDING_ROWS,
  MESSAGE_ARC,
  ROOM_VOICES,
  SPOKEN_RECORD,
  THESIS_ROWS,
} from "@/lib/content/thesis-data";
import {
  Anchor,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  Building2,
  CalendarClock,
  Gauge,
  History,
  Mic,
  Quote,
  Swords,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

/** Derived from the data below, so these counts cannot go stale. */
const CONCEDED = CHALLENGES.filter((c) => c.conceded).length;

const CONTENTS: ContentsEntry[] = [
  { id: "claims", count: String(THESIS_ROWS.length), label: "claims mapped to a mechanism" },
  { id: "weak", count: `${CONCEDED}/${CHALLENGES.length}`, label: "challenges to the premise, conceded" },
  { id: "room", count: String(ROOM_VOICES.length), label: "voices from the room on 4 December" },
  { id: "spoken", count: String(SPOKEN_RECORD.length), label: "frameworks from the spoken record" },
  { id: "clients", count: String(CLIENT_PROOFS.length), label: "client results already public" },
  { id: "calendar", count: String(FUNNEL_STEPS.length), label: "steps in their own calendar" },
  { id: "yardstick", count: "1", label: "their yardstick, turned on this work" },
  { id: "grounding", count: String(GROUNDING_ROWS.length), label: "assumptions anchored to a source" },
];

export const metadata: Metadata = {
  title: "The Receipts · Value Shift",
  description:
    "Every mechanism in the Value Shift wind tunnel, mapped to the published YegaTech claim it operationalizes, quoted, dated, and linked. Plus the industry grounding behind every synthetic assumption.",
};

const GOVERNED_LEVERS: Levers = {
  aiEnabled: true,
  aiSpeedupPct: 0.42,
  pricingModel: "FIXED_FEE",
  backlogRedeploymentPct: 1,
  reviewArchitecture: "TIERED_DELTA_GATE",
  apprenticeshipSafeguard: "BLIND_AUDIT_20_PCT",
};

const STAGE_HEX: Record<IndexLensResult["stage"], string> = {
  Exploring: "#71717a",
  Adopting: "#f59e0b",
  Transforming: "#06b6d4",
  Leading: "#10b981",
};

function LensCard({ title, sub, lens }: { title: string; sub: string; lens: IndexLensResult }) {
  const hex = STAGE_HEX[lens.stage];
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-semibold text-zinc-200">{title}</h3>
          <p className="mt-1 text-[11.5px] text-zinc-500">{sub}</p>
        </div>
        <div className="text-right">
          <p className="mono-num text-2xl font-semibold" style={{ color: hex }}>
            {lens.scorePct}%
          </p>
          <p
            className="mono-num mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-[0.12em]"
            style={{ color: hex, background: `${hex}1a` }}
          >
            {lens.stage.toUpperCase()}
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-3.5">
        {lens.dimensions.map((d) => (
          <div key={d.name}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="text-[11.5px] font-medium text-zinc-300">
                {d.name}
                <span className="mono-num ml-1.5 text-[10px] text-zinc-600">
                  ×{d.weight.toFixed(2)}
                </span>
              </span>
              <span className="mono-num text-[11px] text-zinc-400">
                {d.rating.toFixed(1)} / 5
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full"
                style={{ width: `${(d.rating / 5) * 100}%`, background: hex }}
              />
            </div>
            <p className="mt-1 text-[10.5px] leading-relaxed text-zinc-600">{d.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * /thesis, the receipts. The instrument's bibliography: each published
 * YegaTech claim mapped to the mechanism that operationalizes it, what
 * their clients have already shown publicly, and the industry grounding
 * behind every synthetic assumption in the Atlas Civil model.
 */
export default function ThesisPage() {
  const naiveLens = computeIndexLens(
    runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT),
    NAIVE_DEPLOYMENT);
  const governedLens = computeIndexLens(
    runEngine(ATLAS_BASELINE, GOVERNED_LEVERS),
    GOVERNED_LEVERS);
  return (
    <div className="min-h-screen">
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
              // The Receipts
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
        <section className="relative pt-20 sm:pt-24">
          <div className="hero-decor" aria-hidden />
          <p className="micro-label fade-up">
            Thesis map · every claim quoted, dated, and linked
          </p>
          <h1
            className="fade-up mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-zinc-100 sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Their argument.
            <span className="block text-zinc-500">Made operable.</span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-400"
            style={{ animationDelay: "160ms" }}
          >
            Nothing in this instrument is a new theory. Every mechanism,             the rejected speedup, the four levers, the experiment charter, the
            pattern library, operationalizes something YegaTech has already
            published. This page is the bibliography: the claim, the quote,
            the date, and the exact place in the wind tunnel where it runs.
          </p>
        </section>

        <section className="mt-10">
          <PageContents
            summary={`${THESIS_ROWS.length} claims, every one quoted, dated and linked`}
            entries={CONTENTS}
          />
        </section>

        {/* Claim → mechanism rows */}
        <section id="claims" className="mt-14 scroll-mt-20">
          <div className="flex items-center gap-2 text-zinc-500">
            <BookOpenText size={14} />
            <p className="micro-label">The argument, mechanism by mechanism</p>
          </div>
          <div className="mt-5 space-y-3">
            {THESIS_ROWS.map((row) => (
              <div
                key={row.quote}
                className={`card grid gap-5 p-6 lg:grid-cols-[1.1fr_1fr] ${
                  row.tension ? "border-amber-500/30 bg-amber-500/[0.04]" : ""
                }`}
              >
                <div>
                  {row.tension && (
                    <span className="mono-num mb-2 inline-block rounded-md bg-amber-500/15 px-2 py-1 text-[9px] font-bold tracking-[0.14em] text-amber-400">
                      THE TENSION, WHERE THIS INSTRUMENT PUSHES BACK
                    </span>
                  )}
                  <p className="text-[13.5px] font-semibold leading-snug text-zinc-200">
                    {row.claim}
                  </p>
                  <div className="mt-3 flex gap-2.5">
                    <Quote
                      size={13}
                      className={`mt-0.5 shrink-0 ${row.tension ? "text-amber-400/80" : "text-cyan-400/70"}`}
                    />
                    <p className="text-[13px] italic leading-relaxed text-zinc-400">
                      &ldquo;{row.quote}&rdquo;
                    </p>
                  </div>
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                  >
                    {row.source} · {row.date}
                    <ArrowUpRight
                      size={10}
                      className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                    />
                  </a>
                </div>
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-line bg-canvas/50 p-4">
                  <p className="text-[12.5px] leading-relaxed text-zinc-400">
                    <span className="font-semibold text-zinc-300">
                      In the instrument:{" "}
                    </span>
                    {row.mechanism}
                  </p>
                  <Link
                    href={row.anchor}
                    className="inline-flex items-center gap-1.5 self-start rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-[11.5px] font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/20"
                  >
                    <Anchor size={11} />
                    {row.anchorLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Where the premise is weak */}
        <section id="weak" className="mt-14 scroll-mt-20">
          <div className="flex items-center gap-2 text-zinc-500">
            <Swords size={14} />
            <p className="micro-label">Where this premise is weak</p>
          </div>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-zinc-400">
            A prototype that only collects agreeing evidence is marketing.
            These are the strongest findings against the argument this
            instrument runs on. Four of the five are conceded outright,
            because a room of engineers will find them anyway and it is better
            to have found them first.
          </p>
          <div className="mt-5 space-y-3">
            {CHALLENGES.map((c) => (
              <div
                key={c.claim}
                className={`card grid gap-5 p-6 lg:grid-cols-[1.1fr_1fr] ${
                  c.conceded ? "border-amber-500/25 bg-amber-500/[0.03]" : ""
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[13.5px] font-semibold leading-snug text-zinc-200">
                      {c.claim}
                    </h3>
                    {c.conceded && (
                      <span className="mono-num shrink-0 rounded-md bg-amber-500/15 px-2 py-1 text-[9px] font-bold tracking-[0.12em] text-amber-400">
                        CONCEDED
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5 text-[12.5px] leading-relaxed text-zinc-400">
                    {c.detail}
                  </p>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-2 inline-flex items-center gap-1.5 text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                  >
                    {c.source}
                    <ArrowUpRight size={10} />
                  </a>
                </div>
                <div className="rounded-xl border border-line bg-canvas/50 p-4">
                  <p className="text-[12.5px] leading-relaxed text-zinc-400">
                    <span className="font-semibold text-zinc-300">Response: </span>
                    {c.response}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="card mt-4 border-emerald-500/25 bg-emerald-500/[0.04] p-6">
            <p className="micro-label !text-emerald-300/80">
              The one firm that answered it out loud
            </p>
            <p className="mt-3 text-[14px] italic leading-relaxed text-zinc-200">
              &ldquo;{AECOM_PROOF.quote}&rdquo;
            </p>
            <p className="mt-1.5 text-[11.5px] text-zinc-500">{AECOM_PROOF.who}</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-zinc-400">
              {AECOM_PROOF.context}
            </p>
            <a
              href={AECOM_PROOF.href}
              target="_blank"
              rel="noreferrer"
              className="group mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
            >
              {AECOM_PROOF.source}
              <ArrowUpRight size={10} />
            </a>
          </div>

          <p className="mt-5 max-w-3xl rounded-xl border border-cyan-500/25 bg-cyan-500/[0.05] p-5 text-[13px] leading-relaxed text-zinc-300">
            <span className="font-semibold">Where that leaves the argument.</span>{" "}
            The contradiction is documented, named by ACEC as an industry
            barrier, and currently masked rather than refuted. A labor shortage
            is setting the redeployment lever to full for free, so nobody feels
            the loss yet. That makes redeployment the most important lever on
            the instrument, not pricing, and it makes the honest question a
            different one:{" "}
            <span className="font-semibold text-zinc-100">
              what happens when the backlog normalizes and absorbing the freed
              hours stops being automatic?
            </span>{" "}
            Nobody found in this research is answering that publicly.
          </p>
        </section>

        {/* The room */}
        <section id="room" className="mt-14 scroll-mt-20">
          <div className="flex items-center gap-2 text-zinc-500">
            <Users size={14} />
            <p className="micro-label">
              The room on 4 December, in its own words
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-zinc-400">
            These are people scheduled to speak at the CEO AI Symposium. They
            are not YegaTech, which is what makes them worth quoting. The
            premise this instrument runs on does not need to be argued at that
            room.{" "}
            <span className="font-semibold text-zinc-200">
              It is already being said inside it.
            </span>
          </p>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {ROOM_VOICES.map((v) => (
              <div key={v.quote} className="card flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[13.5px] font-semibold text-zinc-200">{v.who}</h3>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
                      {v.role}
                    </p>
                  </div>
                  <span className="mono-num shrink-0 rounded-md bg-cyan-500/10 px-2 py-1 text-[9px] font-bold tracking-[0.12em] text-cyan-400">
                    {v.lever.toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2.5">
                  <Quote size={13} className="mt-0.5 shrink-0 text-cyan-400/70" />
                  <p className="text-[13.5px] italic leading-relaxed text-zinc-300">
                    &ldquo;{v.quote}&rdquo;
                  </p>
                </div>
                <p className="text-[12px] leading-relaxed text-zinc-500">{v.context}</p>
                <a
                  href={v.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-auto inline-flex items-center gap-1.5 text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                >
                  {v.date}
                  <ArrowUpRight size={10} />
                </a>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">
            One more finding worth stating plainly, because it cuts against
            this project as much as for it. Across all seven speakers' firms,
            not a single published AI return figure exists. They publish
            adoption counts instead: agents built, training completed. That is
            a vacuum rather than a competitor, and it is also a warning. A tool
            that hands this room one more number to manage will meet the exact
            objection Bennett already makes about utilization.
          </p>
        </section>

        {/* The spoken record */}
        <section id="spoken" className="mt-14 scroll-mt-20">
          <div className="flex items-center gap-2 text-zinc-500">
            <Mic size={14} />
            <p className="micro-label">
              The spoken record, her frameworks from the podcast corpus
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-zinc-400">
            Transcripts and recaps of her appearances, read in full. Seven
            frameworks recur across two years of tape, and each one already
            has a mechanism waiting for it in the instrument. As she put it in
            STRUCTURE: the challenge isn't access to AI, it's focus.
          </p>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {SPOKEN_RECORD.map((f) => (
              <div key={f.title} className="card flex flex-col gap-3 p-6">
                <h3 className="text-[13.5px] font-semibold text-zinc-200">{f.title}</h3>
                <p className="text-[12.5px] leading-relaxed text-zinc-500">{f.oneLiner}</p>
                {f.quote && (
                  <div className="flex gap-2.5">
                    <Quote size={12} className="mt-0.5 shrink-0 text-cyan-400/70" />
                    <p className="text-[12.5px] italic leading-relaxed text-zinc-400">
                      &ldquo;{f.quote}&rdquo;
                    </p>
                  </div>
                )}
                <a
                  href={f.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                >
                  {f.source} · {f.date}
                  <ArrowUpRight size={10} />
                </a>
                <p className="mt-auto rounded-xl border border-line bg-canvas/50 p-3.5 text-[12px] leading-relaxed text-zinc-400">
                  <span className="font-semibold text-zinc-300">In the instrument: </span>
                  {f.echo}
                </p>
              </div>
            ))}
          </div>

          {/* Message arc */}
          <div className="mt-8">
            <div className="flex items-center gap-2 text-zinc-500">
              <History size={14} />
              <p className="micro-label">Her message arc, the instrument lands where it points</p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MESSAGE_ARC.map((step, i) => (
                <div
                  key={step.year}
                  className={`card p-5 ${
                    i === MESSAGE_ARC.length - 1
                      ? "border-cyan-500/40 bg-cyan-500/[0.06]"
                      : ""
                  }`}
                >
                  <p
                    className={`mono-num text-[11px] font-semibold ${
                      i === MESSAGE_ARC.length - 1 ? "text-cyan-300" : "text-zinc-500"
                    }`}
                  >
                    {step.year}
                  </p>
                  <h3
                    className={`mt-2 text-[13.5px] font-semibold ${
                      i === MESSAGE_ARC.length - 1 ? "text-cyan-200" : "text-zinc-200"
                    }`}
                  >
                    {step.theme}
                  </h3>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-zinc-500">{step.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client proofs */}
        <section id="clients" className="mt-14 scroll-mt-20">
          <div className="flex items-center gap-2 text-zinc-500">
            <Building2 size={14} />
            <p className="micro-label">
              What their clients have already shown publicly
            </p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {CLIENT_PROOFS.map((proof) => (
              <div key={proof.firm} className="card p-6">
                <p className="micro-label !text-cyan-300/80">{proof.firm}</p>
                <h3 className="mt-2 text-[14px] font-semibold text-zinc-200">
                  {proof.headline}
                </h3>
                <ul className="mt-3 space-y-2">
                  {proof.facts.map((fact) => (
                    <li
                      key={fact}
                      className="flex gap-2.5 text-[12.5px] leading-relaxed text-zinc-400"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                      {fact}
                    </li>
                  ))}
                </ul>
                {proof.href && (
                  <a
                    href={proof.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-3 inline-flex items-center gap-1.5 text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                  >
                    Source
                    <ArrowUpRight size={10} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Why now, their calendar */}
        <section id="calendar" className="mt-14 scroll-mt-20">
          <div className="flex items-center gap-2 text-zinc-500">
            <CalendarClock size={14} />
            <p className="micro-label">Why now, their own calendar</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FUNNEL_STEPS.map((step) => (
              <div
                key={step.title}
                className={`card p-5 ${
                  step.insert
                    ? "border-cyan-500/40 bg-cyan-500/[0.06] shadow-[0_0_40px_-14px_rgba(6,182,212,0.5)]"
                    : ""
                }`}
              >
                <p
                  className={`mono-num text-[11px] font-semibold ${
                    step.insert ? "text-cyan-300" : "text-zinc-500"
                  }`}
                >
                  {step.date}
                </p>
                <h3
                  className={`mt-2 text-[13.5px] font-semibold ${
                    step.insert ? "text-cyan-200" : "text-zinc-200"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The Index Lens */}
        <section id="yardstick" className="mt-14 scroll-mt-20">
          <div className="flex items-center gap-2 text-zinc-500">
            <Gauge size={14} />
            <p className="micro-label">Their yardstick, applied</p>
          </div>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-zinc-400">
            YegaTech's AI Transformation Index scores firms across four
            dimensions whose published weights put Operating Model (35%) and
            Business Model (30%) at 65% of the total. Score the wind tunnel's
            two canonical states through that structure and the four levers
            move Atlas Civil{" "}
            <span className="font-semibold text-zinc-200">
              a full stage up their own Index, without touching culture.
            </span>
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <LensCard
              title="Naive deployment"
              sub="42% faster agent, untouched operating model"
              lens={naiveLens}
            />
            <LensCard
              title="Governed re-tune"
              sub="Same agent, pricing, capacity, review, and audit re-tuned"
              lens={governedLens}
            />
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">
            The dimensions, weights, and stage bands are YegaTech's, read from
            the Index page's published scoring script. The mapping from
            wind-tunnel outputs to dimension ratings is ours, deterministic,
            documented in code, unit-tested, and deliberately conservative:
            Culture of Innovation is held constant because this instrument
            measures economics, not culture, and refuses to score what it
            cannot see.
          </p>
        </section>

        {/* Grounding */}
        <section id="grounding" className="mt-14 scroll-mt-20">
          <div className="flex items-center gap-2 text-zinc-500">
            <Anchor size={14} />
            <p className="micro-label">
              Why Atlas Civil looks the way it does, every assumption anchored
            </p>
          </div>
          <div className="card mt-5 divide-y divide-line">
            {GROUNDING_ROWS.map((row) => (
              <div
                key={row.assumption}
                className="grid gap-2 px-6 py-4 lg:grid-cols-[1fr_1.3fr]"
              >
                <p className="text-[12.5px] font-semibold leading-relaxed text-zinc-300">
                  {row.assumption}
                </p>
                <div>
                  <p className="text-[12.5px] leading-relaxed text-zinc-400">
                    {row.grounding}
                  </p>
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-1 inline-flex items-center gap-1.5 text-[11px] text-zinc-600 transition-colors hover:text-zinc-300"
                  >
                    {row.source}
                    <ArrowUpRight size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">
            The firm itself, its name, staff, volumes, and every dollar, is
            synthetic and editable. The grounding above anchors the shape of
            the model, never its outputs. The instrument refuses to predict
            real-world ROI.
          </p>
        </section>

        {/* CTA */}
        <section id="point" className="mt-14 scroll-mt-20">
          <div className="card flex flex-col items-start justify-between gap-5 border-cyan-500/20 bg-cyan-500/[0.04] p-7 sm:flex-row sm:items-center">
            <div>
              <p className="micro-label !text-cyan-300/80">The point</p>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-zinc-300">
                Reading someone's work is easy. This is the harder compliment:
                their argument, running as software, refusing the same easy
                answers they refuse.
              </p>
            </div>
            <Link
              href="/?run=1"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-zinc-100 px-5 py-3 text-[14px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.6)]"
            >
              Watch it run
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <p className="mt-8 text-[11px] text-zinc-600">
            Built by Pavan Kalyan. Independent work, not affiliated with or
            endorsed by YegaTech. Quotes are 15 words or fewer, attributed and
            linked; anything unverifiable was left out.
          </p>
        </section>
      </main>
    </div>
  );
}
