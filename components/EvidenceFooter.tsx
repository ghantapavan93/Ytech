"use client";

import { CollapseStrip } from "./CollapseStrip";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface Citation {
  label: string;
  source: string;
  href: string;
}

const CITATIONS: Citation[] = [
  {
    label:
      "The State of AI in 2025, 88% of orgs use AI, 39% see EBIT impact, ~6% are high performers",
    source: "McKinsey, Nov 2025",
    href: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
  },
  {
    label:
      "Clarity A&E Study, AI adoption at 70%, measurable business impact at 38%, utilization under 60%",
    source: "Deltek, May 2026",
    href: "https://www.deltek.com/company/news/latest-deltek-clarity-industry-studies-highlight-ai-challenges/",
  },
  {
    label:
      "Where AI agents pay off, agent economics evolve continuously; oversight is a key variable cost",
    source: "McKinsey, Aug 2026",
    href: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/where-ai-agents-pay-off-a-practical-guide-to-the-economics-of-agentic-workflows",
  },
  {
    label: "AI Firm Toolkit, risk tiers, named owners, contract precedence for AEC",
    source: "AIA AI Task Force, Aug 2026",
    href: "https://aifirmtoolkit.aia.org/",
  },
  {
    label: "Policy 573, AI cannot replace the licensed engineer's judgment or accountability",
    source: "ASCE, 2024",
    href: "https://www.asce.org/advocacy/policy-statements/ps573---artificial-intelligence-and-engineering-responsibility",
  },
  {
    label: "BER Case 24-2, the PE stays responsible for sealed work regardless of AI use",
    source: "NSPE",
    href: "https://www.nspe.org/career-growth/ethics/board-ethical-review-cases/use-artificial-intelligence-engineering-practice",
  },
  {
    label:
      "2026 A/E professional-liability survey, 80% of insurers see AI as a potential market disruptor",
    source: "Ames & Gough",
    href: "https://amesgough.com/ames-gough-2026-a-e-pl-survey-results/",
  },
  {
    label: "AI Act Articles 12 & 26, event logging and retention duties for high-risk AI",
    source: "EU, applying Aug 2026",
    href: "https://artificialintelligenceact.eu/article/26/",
  },
  {
    label: "AI got good fast, organizations didn't (review of Stanford HAI reports)",
    source: "YegaTech",
    href: "https://yegatech.com/ai-got-good-fast-organizations-didnt-review-of-hai-reports/",
  },
  {
    label: "If your board is pushing on ROI, ask them this one question (RONI)",
    source: "YegaTech",
    href: "https://yegatech.com/if-your-board-is-pushing-on-roi-ask-them-this-one-question/",
  },
];

/**
 * Why this instrument exists, the intellectual grounding, the mapping onto
 * YegaTech's published frameworks, and the honesty statement.
 */
export function EvidenceFooter() {
  return (
    <footer className="print-hidden border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-5 py-14">
        <CollapseStrip />

        <div className="mt-14 grid gap-5 border-t border-line pt-10 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-[13px] font-semibold text-zinc-200">
              The thesis, made operable
            </h3>
            <p className="mt-3 text-[12.5px] leading-relaxed text-zinc-400">
              YegaTech's argument, <em>AI won't disrupt AEC; organizations
              that redesign work will</em>, and their observation that
              &ldquo;everyone is experimenting. Everyone is learning. But very
              few are redesigning&rdquo; describe exactly what this wind
              tunnel simulates. The four levers map onto Dr. Sam
              Zolfagharian's published triad: business model (pricing),
              operating model (review &amp; capacity), and the talent system
              (incentives &amp; apprenticeship).
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-[13px] font-semibold text-zinc-200">
              What this is not
            </h3>
            <p className="mt-3 text-[12.5px] leading-relaxed text-zinc-400">
              Not an ROI predictor, not a dashboard, not an agent registry.
              Every figure is synthetic and editable; every calculation is
              deterministic TypeScript with no AI-generated numbers. The
              instrument sharpens human judgment about whether a workflow
              should exist. It never replaces the decision.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-x-10 gap-y-2 sm:grid-cols-2">
          {CITATIONS.map((c) => (
            <a
              key={c.href}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline gap-2 py-1"
            >
              <ExternalLink
                size={11}
                className="translate-y-[1px] text-zinc-600 transition-colors group-hover:text-cyan-400"
              />
              <span className="text-[12px] leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-300">
                {c.label}
                <span className="text-zinc-600"> · {c.source}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-zinc-600">
            Built by Pavan Kalyan as a working prototype in the spirit of
            YegaTech's research. Independent work, not affiliated with or
            endorsed by YegaTech.{" "}
            <Link
              href="/progress"
              className="text-zinc-400 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-zinc-200"
            >
              Proof of Progress →
            </Link>{" "}
            <Link
              href="/vision"
              className="text-zinc-400 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-zinc-200"
            >
              The vision →
            </Link>{" "}
            <Link
              href="/thesis"
              className="text-zinc-400 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-zinc-200"
            >
              The receipts →
            </Link>{" "}
            <Link
              href="/review"
              className="text-zinc-400 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-zinc-200"
            >
              The kill review →
            </Link>
          </p>
          <p className="mono-num text-[11px] text-zinc-600">
            deterministic engine v1 · 137 invariant tests
          </p>
        </div>
      </div>
    </footer>
  );
}
