"use client";

import type { EngineOutput, FirmBaseline, Levers } from "@/lib/engines/engine";
import {
  ATLAS_FACETS,
  compilePatternNode,
  libraryFindings,
  SYNTHETIC_LIBRARY,
  type EvidenceNode,
} from "@/lib/engines/patterns";
import {
  Download,
  FlaskConical,
  Lock,
  Network,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { useMemo } from "react";

interface Stage5Props {
  base: FirmBaseline;
  levers: Levers;
  out: EngineOutput;
}

const VERDICT_DOT: Record<
  EvidenceNode["outcomes"]["verdict"],
  { hex: string; label: string }
> = {
  OPTIMAL_GOVERNANCE: { hex: "#10b981", label: "OPTIMAL" },
  WARNING_FRICTION: { hex: "#f59e0b", label: "FRICTION" },
  CRITICAL_REJECTION: { hex: "#f43f5e", label: "REJECTED" },
};

const PRICING_SHORT: Record<Levers["pricingModel"], string> = {
  TM_100: "T&M",
  BLENDED_50: "Blended",
  FIXED_FEE: "Fixed",
};

const GATE_SHORT: Record<Levers["reviewArchitecture"], string> = {
  FULL_MANUAL: "Full manual",
  RAW_AI_UNGOVERNED: "Ungoverned",
  TIERED_DELTA_GATE: "Tiered gate",
};

const SAFEGUARD_SHORT: Record<Levers["apprenticeshipSafeguard"], string> = {
  NONE: "None",
  BLIND_AUDIT_20_PCT: "20% audit",
};

type ShiftStatus = "EVIDENCED" | "DIRECTIONAL" | "HYPOTHESIS";

const SHIFT_STYLE: Record<ShiftStatus, { text: string; bg: string }> = {
  EVIDENCED: { text: "text-emerald-400", bg: "bg-emerald-500/12" },
  DIRECTIONAL: { text: "text-amber-400", bg: "bg-amber-500/12" },
  HYPOTHESIS: { text: "text-cyan-400", bg: "bg-cyan-500/12" },
};

interface Shift {
  claim: string;
  status: ShiftStatus;
  basis: string;
}

const STRUCTURAL_SHIFTS: Shift[] = [
  {
    claim: "AI ideas and agents are becoming abundant",
    status: "EVIDENCED",
    basis:
      "88% of organizations use AI regularly (McKinsey, Nov 2025); 74% of leaders expect at least moderate agent use by 2027 (Deloitte).",
  },
  {
    claim: "Reliable business outcomes remain scarce",
    status: "EVIDENCED",
    basis:
      "Only 39% report enterprise EBIT impact; ~6% are high performers (McKinsey, Nov 2025). In A&E specifically: 70% adoption, 38% measurable impact (Deltek Clarity, 2026).",
  },
  {
    claim: "Consulting is moving from recommendations toward executable systems",
    status: "DIRECTIONAL",
    basis:
      "BCG sizes an ~$200B agentic shift in tech services; YegaTech's own cohort ships working agents, not slide decks.",
  },
  {
    claim: "Small firms can increasingly assemble their own internal software",
    status: "EVIDENCED",
    basis:
      "A quarter of YC's W25 startups ran ~95% AI-generated codebases; prompt-to-app platforms hit $100M ARR within months; YegaTech's own cohort promises small firms 2–3 working agents.",
  },
  {
    claim: "Leaders need evidence for deciding what to stop, redesign, or scale",
    status: "EVIDENCED",
    basis:
      "AIA's AI Firm Toolkit prescribes 90-day review cycles; McKinsey shows agent economics 'evolve continuously', yesterday's pass can be today's loss.",
  },
  {
    claim: "Human professional judgment grows in importance as execution automates",
    status: "EVIDENCED",
    basis:
      "ASCE Policy 573 and NSPE BER Case 24-2: responsibility for sealed work is non-delegable, whatever the tooling.",
  },
  {
    claim: "Firms will need records of how AI was used and who approved its work",
    status: "EVIDENCED",
    basis:
      "EU AI Act Articles 12 & 26, event logging plus six-month retention, apply from Aug 2026; 80% of A/E professional-liability insurers call AI a potential market disruptor and now probe AI controls at renewal (Ames & Gough 2026).",
  },
  {
    claim: "AEC advantage shifts to proprietary data, workflows, and decision knowledge",
    status: "DIRECTIONAL",
    basis:
      "Models commoditize, YegaTech's own reading of the Stanford HAI index: advantage comes from execution, not model choice.",
  },
  {
    claim: "The strongest consultancies compound intelligence across engagements",
    status: "EVIDENCED",
    basis:
      "McKinsey's Lilli reaches 70%+ of 45,000 staff across 100,000+ internal documents; ~40% of BCG associates use Deckster weekly. Boutique AEC consultancies mostly still start blank, the open flank.",
  },
  {
    claim: "YegaTech could know which transformations work under which conditions",
    status: "HYPOTHESIS",
    basis:
      "The bet this instrument exists to test, one anonymized fit-pattern per run, compounding across a cohort.",
  },
];

const ROADMAP: { horizon: string; title: string; body: string }[] = [
  {
    horizon: "72 hours",
    title: "One trustworthy evidence object",
    body: "One firm, one workflow, one deterministic wind tunnel. The operating-model argument becomes visible in 90 seconds and compiles into a bounded experiment.",
  },
  {
    horizon: "One cohort",
    title: "The first real nodes",
    body: "Every participant runs the stress test before building agents one through three. YegaTech learns which incentive contradictions recur in firms under 75 people.",
  },
  {
    horizon: "One year",
    title: "Evidence-led delivery",
    body: "Keynotes, workshops, and advisory open with pattern evidence instead of anecdote. The pre-build stress test becomes a paid, standard gate.",
  },
  {
    horizon: "Three years",
    title: "The AEC Transformation Graph",
    body: "Verified organizational-fit patterns across firm archetypes, knowledge no foundation model, registry vendor, or generalist consultancy can reproduce.",
  },
];

const RESTRAINTS: string[] = [
  "Never automate the deploy-or-kill decision, charters are signed by humans.",
  "Never claim real-world ROI from synthetic propagation.",
  "Never centralize raw client economics, nodes carry coarse bands and ratios only.",
  "Never share patterns across clients without explicit consent; isolation is the default.",
  "Never optimize away the refusal, 'do not deploy' stays a first-class output.",
];

/**
 * Stage 5, Horizon Two. The subtle glimpse of the larger future: this run's
 * anonymized evidence node, the library it would join, the questions a
 * library can answer, and an honest account of which structural shifts are
 * evidence and which are still the bet.
 */
export function Stage5Horizon({ base, levers, out }: Stage5Props) {
  const node = useMemo(
    () => compilePatternNode(base, levers, out, ATLAS_FACETS),
    [base, levers, out]);

  const libraryWithRun = useMemo(
    () => [...SYNTHETIC_LIBRARY, { label: "THIS RUN", node }],
    [node]);

  const findings = useMemo(() => libraryFindings(libraryWithRun), [libraryWithRun]);

  const downloadNode = () => {
    const blob = new Blob([JSON.stringify(node, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `valueshift-pattern-${node.assumptionHash}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="stage-5"
      className="print-hidden mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-14"
    >
      <div className="fade-up">
        <p className="micro-label">Stage 05 · Horizon Two</p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-ink-1 sm:text-3xl">
          One run is a demo.{" "}
          <span className="text-ink-4">A library is a moat.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-3">
          Every wind-tunnel run compiles one anonymized evidence node as a side
          effect of normal use, no extra documentation, no client data. Across
          a cohort, the nodes become the beginning of an AEC Transformation
          Graph: which fee structures, review gates, and incentive designs let
          AI value survive inside which kinds of firms.
        </p>

        {/* Row A: the node + the library */}
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
          {/* Evidence node */}
          <div className="card flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2 text-cyan-300">
                <FlaskConical size={14} />
                <span className="micro-label !text-cyan-300/80">
                  This run's evidence node
                </span>
              </div>
              <span className="mono-num text-[10px] text-ink-4">
                valueshift.pattern/v1
              </span>
            </div>
            <pre className="flex-1 overflow-x-auto p-5 font-mono text-[11.5px] leading-[1.7] text-ink-3">
              {JSON.stringify(node, null, 2)}
            </pre>
            <div className="border-t border-line p-4">
              <div className="flex flex-wrap gap-1.5">
                {["no names", "no dollars", "coarse bands", "normalized ratios"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-medium tracking-wide text-ink-3"
                    >
                      <Lock size={9} />
                      {chip}
                    </span>
                  ))}
              </div>
              <button
                onClick={downloadNode}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/12 px-4 py-2.5 text-[13px] font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/25"
              >
                <Download size={14} />
                Download evidence node (.json)
              </button>
              <p className="mt-2.5 text-[10px] leading-relaxed text-ink-4">
                Anonymized by construction, not redaction, and pinned by unit
                tests that fail if a name or dollar figure ever enters the node.
              </p>
            </div>
          </div>

          {/* Pattern library */}
          <div className="card flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-2 text-ink-2">
                <Network size={14} />
                <span className="micro-label !text-ink-3">
                  Pattern library · spec-QA workflow
                </span>
              </div>
              <span className="mono-num text-[10px] text-ink-4">
                {libraryWithRun.length} nodes
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-left">
                <thead>
                  <tr className="border-b border-line">
                    {["Node", "Pricing", "Review", "Safeguard", "Margin Δ", "PE load", "Verdict"].map(
                      (h) => (
                        <th key={h} className="micro-label px-4 py-2.5 font-semibold">
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {libraryWithRun.map(({ label, node: n }) => {
                    const dot = VERDICT_DOT[n.outcomes.verdict];
                    const isRun = label === "THIS RUN";
                    return (
                      <tr
                        key={label}
                        className={`border-b border-line/55 last:border-0 ${
                          isRun ? "bg-cyan-500/[0.10]" : ""
                        }`}
                      >
                        <td
                          className={`mono-num px-4 py-2.5 text-[11.5px] ${
                            isRun ? "font-bold text-cyan-300" : "text-ink-4"
                          }`}
                        >
                          {label}
                        </td>
                        <td className="px-4 py-2.5 text-[13px] text-ink-3">
                          {PRICING_SHORT[n.facets.pricingRegime]}
                        </td>
                        <td className="px-4 py-2.5 text-[13px] text-ink-3">
                          {GATE_SHORT[n.facets.reviewGate]}
                        </td>
                        <td className="px-4 py-2.5 text-[13px] text-ink-3">
                          {SAFEGUARD_SHORT[n.facets.apprenticeshipSafeguard]}
                        </td>
                        <td
                          className={`mono-num px-4 py-2.5 text-[13px] font-semibold ${
                            n.outcomes.marginDeltaPctOfBaseline >= 0
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          {n.outcomes.marginDeltaPctOfBaseline > 0 ? "+" : ""}
                          {n.outcomes.marginDeltaPctOfBaseline.toFixed(1)}%
                        </td>
                        <td className="mono-num px-4 py-2.5 text-[13px] text-ink-3">
                          {n.outcomes.peLoadVsSustainable.toFixed(2)}×
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className="mono-num inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.1em]"
                            style={{ color: dot.hex }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: dot.hex, boxShadow: `0 0 6px 1px ${dot.hex}` }}
                            />
                            {dot.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-auto border-t border-line p-4">
              <p className="text-[10px] leading-relaxed text-ink-4">
                SYN-001…005 are synthetic prior engagements, computed live by the
                same deterministic engine, no client data exists yet; the
                aggregation mechanics are real. Change a lever above and watch
                THIS RUN re-file itself.
              </p>
            </div>
          </div>
        </div>

        {/* Row B: what the library answers */}
        <div className="card mt-5 p-6">
          <div className="flex items-center gap-2 text-ink-2">
            <Sparkles size={14} />
            <span className="micro-label !text-ink-3">
              Questions this library already answers, derived, never asserted
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {findings.map((f) => (
              <div
                key={f}
                className="rounded-xl border border-line bg-canvas/55 p-4 text-[13px] leading-relaxed text-ink-3"
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Row C: roadmap */}
        <div className="mt-10">
          <p className="micro-label">The compounding path</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((m, i) => (
              <div key={m.horizon} className="card relative p-5">
                <span className="mono-num text-[11.5px] font-semibold text-cyan-400/80">
                  {String(i + 1).padStart(2, "0")} · {m.horizon}
                </span>
                <h3 className="mt-2.5 text-[15px] font-semibold text-ink-1">
                  {m.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-4">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Row D: structural shifts ledger */}
        <div className="mt-10">
          <p className="micro-label">
            The ten structural shifts, what is evidence, what is still the bet
          </p>
          <div className="mt-4 grid gap-2.5 lg:grid-cols-2">
            {STRUCTURAL_SHIFTS.map((s) => {
              const style = SHIFT_STYLE[s.status];
              return (
                <div
                  key={s.claim}
                  className="card flex items-start justify-between gap-4 p-4"
                >
                  <div>
                    <p className="text-[13px] font-medium text-ink-2">
                      {s.claim}
                    </p>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-4">
                      {s.basis}
                    </p>
                  </div>
                  <span
                    className={`mono-num shrink-0 rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.12em] ${style.text} ${style.bg}`}
                  >
                    {s.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row E: restraint + future test */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="card p-6">
            <div className="flex items-center gap-2 text-ink-2">
              <Lock size={14} />
              <span className="micro-label !text-ink-3">The restraint</span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {RESTRAINTS.map((r) => (
                <li
                  key={r}
                  className="flex gap-2.5 text-[13px] leading-relaxed text-ink-3"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="card border-cyan-500/25 bg-cyan-500/[0.06] p-6">
            <div className="flex items-center gap-2 text-cyan-300">
              <ScrollText size={14} />
              <span className="micro-label !text-cyan-300/80">The future test</span>
            </div>
            <dl className="mt-4 space-y-3.5 text-[13px] leading-relaxed">
              <div>
                <dt className="font-semibold text-ink-1">
                  Today, this helps YegaTech
                </dt>
                <dd className="mt-0.5 text-ink-3">
                  make the operating-model argument visible in 90 seconds, in
                  keynotes, cohort sessions, and client rooms, instead of
                  rebuilding it verbally every time.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink-1">
                  Every time it is used, YegaTech learns
                </dt>
                <dd className="mt-0.5 text-ink-3">
                  one more anonymized fit-pattern: which fee structures, review
                  gates, and incentive designs let AI value survive in which
                  kind of firm.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink-1">
                  In two years, that could allow YegaTech to
                </dt>
                <dd className="mt-0.5 text-ink-3">
                  answer &ldquo;will this agent survive your operating
                  model?&rdquo; from accumulated evidence, and sell that answer
                  as the standard gate before any build.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-ink-1">
                  General AI tools cannot easily reproduce this because
                </dt>
                <dd className="mt-0.5 text-ink-3">
                  they hold no verified AEC fit-patterns, and they will happily
                  invent the numbers this instrument refuses to.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
