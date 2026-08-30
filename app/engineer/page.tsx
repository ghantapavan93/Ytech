import { CommandHint } from "@/components/CommandPalette";
import { SyntheticBadge } from "@/components/SyntheticBadge";
import { ATLAS_BASELINE, NAIVE_DEPLOYMENT, runEngine } from "@/lib/engines/engine";
import { GOVERNED_LEVERS } from "@/components/run/act-data";
import { computeIndexLens } from "@/lib/engines/index-lens";
import { INVARIANT_COUNT, SUITE, SUITE_FILE_COUNT } from "@/lib/engines/invariants";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Engineer view · Value Shift",
  description:
    "The formulas, the decision rules, the assumptions and every invariant the suite holds them to. The same numbers the rest of the site draws, without the drawing.",
};

/**
 * The second altitude.
 *
 * Everything else here is built so a principal understands it in ten seconds.
 * This is built so an engineer can sit with it for two hours and find the
 * place where it is wrong. Both have to be true of the same model or the
 * ten-second version is a sales pitch.
 *
 * Nothing on this page is a simplification and nothing is a restatement. It
 * is the arithmetic, the rules that sit on top of it, and the tests that hold
 * both. The figures come from the same engine the drawings do.
 */

const FORMULAS: { name: string; expr: string; note: string }[] = [
  {
    name: "Freed junior hours",
    expr: "pool = V·h_base − V·h_base·(1 − s)",
    note: "V packages a month at h_base hours each, s the agent's speedup. With a blind-audit safeguard, 20% of packages keep the full manual pass and only 80% take the speedup.",
  },
  {
    name: "Redeployment",
    expr: "redeployed = min(pool · intent, pool · absorption)",
    note: "The smaller of what the firm routes and what the market will buy. Intent is a lever; absorption is not. Their difference is reported separately as unrouted and unsold hours.",
  },
  {
    name: "Licensed review",
    expr: "pe_per_pkg = full_manual ? 1.75·b : tiered ? 1.0 : 0.25",
    note: "Against a manual baseline b of 3.0 hours. Full manual models the observed failure: juniors forward raw output and the reviewer re-reads whole packages. The tiered figure is a budget the firm sets, not a saving the tool delivers.",
  },
  {
    name: "Revenue",
    expr: "rev = (1−f)·(billed hours · rates) + f·V·fee + redeployed·jr_rate",
    note: "f is the fixed-fee share. Under hourly billing the package revenue falls with the hours; under a fixed fee it does not. Redeployed hours bill at the junior rate regardless, which is why the market is worth the same to both fee models.",
  },
  {
    name: "Cost",
    expr: "cost = worked_hours · cost_rates + tool_cost",
    note: "Job-cost convention: direct labour is costed on hours worked, so idle capacity is not a direct cost. It surfaces in the utilisation pillar instead, which is where an AEC incentive system actually feels it.",
  },
  {
    name: "Apprenticeship",
    expr: "learning = deep_practice_hours / baseline_hours",
    note: "Zero without a safeguard, because a junior shepherding agent output is not doing deliberate practice. Twenty percent with a blind audit, which is the whole of the protection and costs real released capacity.",
  },
];

const RULES: { rule: string; because: string }[] = [
  {
    rule: "Unreviewed AI output under a licensed stamp is DO_NOT_DEPLOY, at any margin",
    because:
      "Professional responsibility is not delegable. No financial result makes this signable, so it is checked before the arithmetic rather than weighed against it.",
  },
  {
    rule: "Review above the sustainable weekly load fails the review pillar",
    because:
      "A result that depends on one licensed desk working past capacity is a result with a person inside it.",
  },
  {
    rule: "Zero deep-practice hours is never signable",
    because:
      "A firm can be more profitable this month and have stopped producing the engineers who will hold the licence in ten years. The model refuses to call that a success.",
  },
  {
    rule: "A missing answer blocks rather than averages",
    because:
      "Used throughout: the evidence chain, the workflow triage, the sourcing screen. An unknown is not a middle value between yes and no.",
  },
  {
    rule: "The recommendation is never the highest-margin configuration",
    because:
      "Held by test rather than by intent. If a future change makes the best-margin option signable, the suite fails.",
  },
];

export default function EngineerPage() {
  const naive = runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT);
  const naiveLens = computeIndexLens(naive, NAIVE_DEPLOYMENT);
  const governedLens = computeIndexLens(
    runEngine(ATLAS_BASELINE, GOVERNED_LEVERS),
    GOVERNED_LEVERS,
  );

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
              // Engineer view
            </span>
          </div>
          <nav aria-label="Site" className="flex items-center gap-2.5">
            <CommandHint />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] font-medium text-ink-4 transition-colors hover:border-line-strong hover:text-ink-2"
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">The run</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-24">
        <section className="relative pt-16 sm:pt-20">
          <div className="hero-decor" aria-hidden />
          <p className="micro-label fade-up">The second altitude</p>
          <h1
            className="fade-up mt-5 max-w-3xl text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-ink-1 sm:text-[44px]"
            style={{ animationDelay: "80ms" }}
          >
            The arithmetic, the rules on top of it,
            <span className="block text-ink-4">and what holds both.</span>
          </h1>
          <p
            className="fade-up mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-3"
            style={{ animationDelay: "160ms" }}
          >
            Everything else here is built to be understood in ten seconds. This
            is built to be argued with for two hours. It is not a simplified
            view and not a restatement: it is the model, without the drawing.
          </p>
          <p
            className="fade-up mt-4 max-w-2xl text-[13px] leading-relaxed text-ink-4"
            style={{ animationDelay: "220ms" }}
          >
            No language model is in any path that produces a number. Every
            figure on this site is arithmetic over the assumptions below, and{" "}
            <span className="text-ink-2">
              {INVARIANT_COUNT} invariants across {SUITE_FILE_COUNT} files
            </span>{" "}
            hold it to that. The count is read from the suite at build time
            rather than typed here.
          </p>
        </section>

        <section className="mt-14">
          <p className="micro-label">The arithmetic</p>
          <div className="mt-4 space-y-2.5">
            {FORMULAS.map((f) => (
              <div key={f.name} className="card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-[15px] font-semibold text-ink-1">{f.name}</p>
                  <code className="mono-num rounded-md border border-line bg-canvas/60 px-2.5 py-1 text-[12px] text-ink-2">
                    {f.expr}
                  </code>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-4">
                  {f.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <p className="micro-label">The rules that sit on top</p>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-4">
            These are positions, not standards. They are written by one person,
            they are visible here, and a firm that disagreed with any of them
            would change it and get a different answer. That argument is the
            useful part.
          </p>
          <div className="mt-4 space-y-2.5">
            {RULES.map((r) => (
              <div key={r.rule} className="rounded-xl border border-line bg-surface-1 p-5">
                <p className="text-[15px] font-medium leading-snug text-ink-1">
                  {r.rule}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-4">
                  {r.because}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <p className="micro-label">The baseline, in full</p>
          <div className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(ATLAS_BASELINE).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-3 border-t border-line py-1.5">
                <span className="font-mono text-[11.5px] text-ink-4">{k}</span>
                <span className="mono-num text-[13px] text-ink-2">{String(v)}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-ink-4">
            Inputs informed by published state DOT consultant fee schedules,
            which are the only non-vendor source that breaks staff hours out by
            class. Across nine Ohio DOT packages the preparer share averages
            72.8%; this model sits at 76.9%. That makes it plausible. It does
            not make it predictive for any real firm.
          </p>
        </section>

        <section className="mt-14">
          <p className="micro-label">One run, end to end</p>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-4">
            The untouched operating model, every intermediate value the engine
            produces, so the drawings can be checked against the arithmetic.
          </p>
          <div className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(naive)
              .filter(([, v]) => typeof v === "number" || typeof v === "boolean" || typeof v === "string")
              .map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 border-t border-line py-1.5">
                  <span className="font-mono text-[11.5px] text-ink-4">{k}</span>
                  <span className="mono-num text-[13px] text-ink-2">
                    {typeof v === "number" ? Math.round(v * 100) / 100 : String(v)}
                  </span>
                </div>
              ))}
          </div>
        </section>

        {/*
          The one place this model touches somebody else published work, so
          it is the one mapping most worth contesting and it belongs here
          rather than only in a comment.
        */}
        <section className="mt-14">
          <p className="micro-label">
            The one borrowed scale, and where it stops
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-4">
            The four dimensions, their weights and the stage bands are read
            from a published assessment scoring script and are not mine. The
            mapping from wind-tunnel output onto its one-to-five scale is
            mine, is deterministic, and is the part to argue with.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Operating model untouched", lens: naiveLens },
              { label: "Every lever this recommends", lens: governedLens },
            ].map((c) => (
              <div key={c.label} className="card p-5">
                <p className="micro-label">{c.label}</p>
                <p className="mono-num mt-1.5 text-[26px] font-semibold text-ink-1">
                  {c.lens.scorePct.toFixed(1)}%
                  <span className="ml-2 text-[13px] font-normal text-ink-3">
                    {c.lens.stage}
                  </span>
                </p>
                <dl className="mt-3.5 space-y-1 border-t border-line pt-3 text-[12.5px]">
                  {c.lens.dimensions.map((d) => (
                    <div key={d.name} className="flex justify-between gap-3">
                      <dt className="text-ink-4">
                        {d.name}{" "}
                        <span className="mono-num text-[11px]">w {d.weight}</span>
                      </dt>
                      <dd className="mono-num text-ink-2">{d.rating} / 5</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <p className="mt-5 max-w-3xl border-l-2 border-line-strong pl-4 text-[13px] leading-relaxed text-ink-3">
            Fixing every condition this instrument can reach moves the firm{" "}
            <span className="font-semibold text-ink-1">
              {(governedLens.scorePct - naiveLens.scorePct).toFixed(1)} points
            </span>{" "}
            and then stops, half a point short of the top band. Culture carries
            a fifth of that scale and is held at a flat three throughout,
            because this measures economics and will not score what it cannot
            see. The remaining distance is not a gap in the model. It is the
            part of the work that was never economic.
          </p>
        </section>

        <section className="mt-14">
          <p className="micro-label">
            {INVARIANT_COUNT} invariants, and what each file holds
          </p>
          <div className="mt-4 space-y-1.5">
            {SUITE.map((g) => (
              <div
                key={g.file}
                className="flex items-baseline gap-4 border-t border-line py-2"
              >
                <span className="mono-num w-8 shrink-0 text-[13px] font-semibold text-ink-2">
                  {g.count}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[11.5px] text-ink-3">
                    {g.file}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-4">
                    {g.subject}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-ink-4">
            Run them with <code className="mono-num text-ink-2">npm test</code>.
            They are not coverage. Each one is a property the model is supposed
            to have, written so that losing the property fails the build rather
            than quietly changing a number on a page.
          </p>
        </section>

      </main>
      <footer>
        <p className="mt-14 text-[11.5px] leading-relaxed text-ink-4">
          Built by Pavan Kalyan as an independent prototype, not affiliated with
          YegaTech. Atlas Structural &amp; Civil is synthetic. Illustrative
          economics, not a forecast: replace with firm evidence before any real
          decision.
        </p>
      </footer>
    </div>
  );
}
