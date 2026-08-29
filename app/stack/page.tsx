import { CommandHint } from "@/components/CommandPalette";
import { StackDiagram } from "@/components/diagram/StackDiagram";
import {
  FLOOR_CASES,
  FLOOR_CONTRAST,
  FLOOR_FINDINGS,
  FLOOR_METHOD,
  FLOOR_WHY,
} from "@/lib/content/floor-data";
import { EVIDENCE_GATED, HELD_LABEL, OFFERS, ORDER_OF_OPERATIONS, type Held } from "@/lib/content/offer-data";
import { FINDINGS, LAYERS, STANDING_LABEL, type Standing } from "@/lib/content/stack-data";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDashed,
  Layers,
  Lock,
  Receipt,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Capability Stack · Value Shift",
  description:
    "Ten layers an AI advisory practice runs on, and an honest read on which ones a two-person specialist firm can own. No competitor is named.",
};

const HELD_STYLE: Record<Held, { bg: string; text: string }> = {
  sold: { bg: "bg-emerald-500/12", text: "text-emerald-400" },
  free: { bg: "bg-amber-500/12", text: "text-amber-400" },
  absent: { bg: "bg-cyan-500/12", text: "text-cyan-400" },
};

const STANDING_STYLE: Record<Standing, { hex: string; bg: string; text: string }> = {
  owned: { hex: "#10b981", bg: "bg-emerald-500/12", text: "text-emerald-400" },
  partial: { hex: "#f59e0b", bg: "bg-amber-500/12", text: "text-amber-400" },
  open: { hex: "#06b6d4", bg: "bg-cyan-500/12", text: "text-cyan-400" },
};

export default function StackPage() {
  const owned = LAYERS.filter((l) => l.standing === "owned").length;
  const open = LAYERS.filter((l) => l.standing === "open" && !l.needsScale).length;
  const filled = LAYERS.filter((l) => l.builtHere).length;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="hit-24 text-[15px] font-bold tracking-[-0.01em] text-ink-1 transition-colors hover:text-white"
            >
              VALUE&nbsp;SHIFT
            </Link>
            <span className="hidden font-mono text-[11.5px] text-ink-4 sm:block">
              // The Capability Stack
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

      <main className="mx-auto w-full max-w-6xl px-5 pb-20">
        {/* Hero */}
        <section className="relative pt-16 sm:pt-20">
          <div className="hero-decor" aria-hidden />
          <p className="micro-label fade-up">
            Ten layers · nobody named on this page, deliberately
          </p>
          <h1
            className="fade-up mt-5 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-5xl"
            style={{ animationDelay: "80ms" }}
          >
            Four layers are already strong.
            <span className="block text-ink-4">
              The open ones are all buildable without hiring anyone.
            </span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
            style={{ animationDelay: "160ms" }}
          >
            This is a map of what an AI advisory practice runs on, drawn from
            what the field visibly deploys. It names no firms, because the
            useful question is not who is ahead. It is which layers a
            two-person specialist can own outright, and which ones only make
            sense with a hundred consultants behind them.
          </p>

          <div
            className="fade-up mt-8 grid gap-3 sm:grid-cols-3"
            style={{ animationDelay: "220ms" }}
          >
            {[
              { n: owned, label: "layers already strong", hex: "#10b981" },
              { n: open, label: "open and closeable without scale", hex: "#06b6d4" },
              { n: filled, label: "already filled by what is built here", hex: "#e4e4e7" },
            ].map((s) => (
              <div key={s.label} className="card p-5">
                <p
                  className="mono-num text-3xl font-semibold"
                  style={{ color: s.hex }}
                >
                  {s.n}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-4">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The layers */}
        <section className="mt-12">
          <StackDiagram />
        </section>

        <section className="mt-14">
          <div className="flex items-center gap-2 text-ink-4">
            <Layers size={14} />
            <p className="micro-label">The stack, layer by layer</p>
          </div>
          <div className="mt-5 space-y-3">
            {LAYERS.map((l) => {
              const s = STANDING_STYLE[l.standing];
              return (
                <div
                  key={l.n}
                  className={`card p-6 ${
                    l.builtHere ? "border-cyan-500/25 bg-cyan-500/[0.03]" : ""
                  }`}
                >
                  <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-baseline gap-3">
                          <span className="mono-num text-[11.5px] font-semibold text-ink-4">
                            {l.n}
                          </span>
                          <h2 className="text-[15px] font-semibold text-ink-1">
                            {l.name}
                          </h2>
                        </div>
                        <span
                          className={`mono-num inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.12em] ${s.bg} ${s.text}`}
                        >
                          {l.standing === "owned" ? (
                            <Check size={9} />
                          ) : l.needsScale ? (
                            <Lock size={9} />
                          ) : (
                            <CircleDashed size={9} />
                          )}
                          {STANDING_LABEL[l.standing].toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-ink-3">
                        {l.whatItIs}
                      </p>
                      <p className="mt-3 border-l-2 border-line pl-3.5 text-[13px] leading-relaxed text-ink-4">
                        <span className="font-semibold text-ink-3">
                          What the field does:{" "}
                        </span>
                        {l.fieldPattern}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="rounded-xl border border-line bg-canvas/55 p-4">
                        <p className="text-[13px] leading-relaxed text-ink-2">
                          {l.position}
                        </p>
                      </div>
                      {l.builtHere && (
                        <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/[0.06] p-4">
                          <p className="micro-label !text-cyan-300/80">
                            What is already built here
                          </p>
                          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
                            {l.builtHere}
                          </p>
                        </div>
                      )}
                      {l.needsScale && (
                        <p className="text-[11.5px] leading-relaxed text-ink-4">
                          This layer genuinely needs headcount. Skipping it is the
                          right call, not a shortfall.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* What the field prices */}
        <section className="mt-14">
          <div className="flex items-center gap-2 text-ink-4">
            <Receipt size={14} />
            <p className="micro-label">What the field actually prices</p>
          </div>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-3">
            Eight offers recur across independent AI practices. Every range
            below is taken from a price a firm publishes on its own page, so
            these are market facts rather than estimates. Who charges what is
            not interesting. The shape of the ladder is.
          </p>
          <div className="mt-5 space-y-3">
            {OFFERS.map((o) => {
              const h = HELD_STYLE[o.held];
              return (
                <div key={o.n} className="card grid gap-5 p-6 lg:grid-cols-[1.05fr_1fr]">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-baseline gap-3">
                        <span className="mono-num text-[11.5px] font-semibold text-ink-4">
                          {o.n}
                        </span>
                        <h3 className="text-[15px] font-semibold text-ink-1">
                          {o.name}
                        </h3>
                      </div>
                      <span
                        className={`mono-num shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.12em] ${h.bg} ${h.text}`}
                      >
                        {HELD_LABEL[o.held].toUpperCase()}
                      </span>
                    </div>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-ink-3">
                      {o.shape}
                    </p>
                    <p className="mono-num mt-3 text-[13px] text-cyan-300">{o.range}</p>
                  </div>
                  <div className="rounded-xl border border-line bg-canvas/55 p-4">
                    <p className="text-[13px] leading-relaxed text-ink-3">{o.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Evidence-gated offers */}
        <section className="mt-14">
          <div className="flex items-center gap-2 text-ink-4">
            <ShieldCheck size={14} />
            <p className="micro-label">
              Four offers that packaging alone cannot launch
            </p>
          </div>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-3">
            Everything above can be launched in weeks, because the product is
            scope and cadence rather than intellectual property. These four
            cannot. Each one needs a body of prior engagements behind it,
            which is the commercial argument for building the evidence layer
            before the offers that depend on it.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {EVIDENCE_GATED.map((e) => (
              <div
                key={e.name}
                className="card border-cyan-500/25 bg-cyan-500/[0.06] p-6"
              >
                <h3 className="text-[15px] font-semibold text-ink-1">{e.name}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-3">
                  {e.why}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl rounded-xl border border-line bg-canvas/55 p-5 text-[13px] leading-relaxed text-ink-2">
            <span className="font-semibold">The order that falls out. </span>
            {ORDER_OF_OPERATIONS}
          </p>
        </section>

        {/* What the category cannot say */}
        <section className="mt-14">
          <div className="flex items-center gap-2 text-ink-4">
            <Scale size={14} />
            <p className="micro-label">What the category cannot say</p>
          </div>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-3">
            Around forty-five readiness assessments, maturity models and
            return calculators were examined for this page, thirteen of them
            with the formulas pulled out of the source and several driven live
            to their worst case. The result is the clearest thing on this
            site.
          </p>

          <div className="card mt-5 border-cyan-500/25 bg-cyan-500/[0.06] p-7">
            <p className="text-xl font-semibold leading-snug tracking-[-0.02em] text-ink-1 sm:text-2xl">
              {FLOOR_FINDINGS[0].title}
            </p>
            <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-ink-2">
              {FLOOR_FINDINGS[0].body}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {FLOOR_CASES.map((c) => (
              <div
                key={c.n}
                /*
                  [&>*]:min-w-0 because a grid item will not shrink below its
                  own min-content by default, and the item here holds a code
                  block. The block scrolls itself, but the track sized to the
                  unwrapped line anyway and pushed the page 97px wider than a
                  phone at 375px.
                */
                className={`card grid gap-5 p-6 lg:grid-cols-[1fr_1.15fr] [&>*]:min-w-0 ${
                  c.exception ? "border-emerald-500/25 bg-emerald-500/[0.06]" : ""
                }`}
              >
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="mono-num text-[11.5px] font-semibold text-ink-4">
                      {c.n}
                    </span>
                    <h3 className="text-[15px] font-semibold text-ink-1">
                      {c.mechanism}
                    </h3>
                  </div>
                  <div
                    className={`mt-3 overflow-x-auto rounded-lg border px-3.5 py-2.5 ${
                      c.exception
                        ? "border-emerald-500/25 bg-canvas/55"
                        : "border-line bg-canvas/55"
                    }`}
                  >
                    <code
                      className={`mono-num whitespace-nowrap text-[13px] ${
                        c.exception ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {c.evidence}
                    </code>
                  </div>
                  {!c.isCode && (
                    <p className="mt-1.5 text-[10px] text-ink-4">
                      Observed behaviour rather than a line of code.
                    </p>
                  )}
                </div>
                <p className="text-[13px] leading-relaxed text-ink-3">
                  {c.reading}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {FLOOR_FINDINGS.slice(1).map((f) => (
              <div key={f.title} className="card p-5">
                <h3 className="text-[15px] font-semibold text-ink-1">
                  {f.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
                  {f.body}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-ink-4">
            {FLOOR_WHY}
          </p>
          <p className="mt-4 max-w-3xl rounded-xl border border-cyan-500/25 bg-cyan-500/[0.06] p-5 text-[13px] leading-relaxed text-ink-2">
            {FLOOR_CONTRAST}
          </p>
          <p className="mt-3 text-[11.5px] leading-relaxed text-ink-4">
            {FLOOR_METHOD}
          </p>
        </section>

        {/* Findings */}
        <section className="mt-14">
          <p className="micro-label">What the map says</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {FINDINGS.map((f) => (
              <div key={f.title} className="card p-6">
                <h3 className="text-[15px] font-semibold text-ink-1">{f.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-3">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14">
          <div className="card flex flex-col items-start justify-between gap-5 border-cyan-500/25 bg-cyan-500/[0.06] p-7 sm:flex-row sm:items-center">
            <div>
              <p className="micro-label !text-cyan-300/80">The short version</p>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-2">
                The layers that need a hundred consultants are the ones worth
                skipping. The layers that need code are already half built, and
                they are sitting on this site.
              </p>
            </div>
            <Link
              href="/engine?run=1"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-zinc-100 px-5 py-3 text-[15px] font-semibold text-zinc-950 transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.6)]"
            >
              See the first one run
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <p className="mt-8 text-[11.5px] leading-relaxed text-ink-4">
            Assembled from publicly visible offerings across the advisory
            market. No firm is named on this page and none should be, because
            the comparison that matters is against what the work needs, not
            against anyone else. Built by Pavan Kalyan as an independent
            prototype, not affiliated with YegaTech.
          </p>
        </section>
      </main>
    </div>
  );
}
