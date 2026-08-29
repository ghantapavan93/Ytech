"use client";

import { BEST, BEST_SIGNED, BEST_SIGNED_RANK, CONFIGURATIONS } from "@/lib/engines/configurations";
import {
  ATLAS_BASELINE,
  NAIVE_DEPLOYMENT,
  runEngine,
  type Levers,
} from "@/lib/engines/engine";
import { buildCharter, evaluateProgress } from "@/lib/engines/progress-engine";
import { SNAP } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Printer, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { loadPath, verdictLine } from "./load-path-state";
import { ValueLoadPath } from "./ValueLoadPath";

/**
 * Room Mode: one screen, five minutes, one decision.
 *
 * Everything else on this site is a page somebody reads. This is the version
 * that runs in front of a room, so it obeys different rules: it never
 * scrolls, it never explains the software, and it advances on a single key.
 * The fifteen routes become the machinery underneath rather than fifteen
 * places to go.
 *
 * It also has to work at two altitudes at once. A principal has to
 * understand the picture in ten seconds; an engineer has to be able to open
 * the same numbers and audit them for two hours. So nothing here is a
 * simplification of the model. It is the same engine, drawn larger, with the
 * inspection routes one link away rather than in the way.
 */

const BEATS = ["open", "ask", "reveal", "attack", "tempt", "decide"] as const;
type Beat = (typeof BEATS)[number];

const money = (n: number) =>
  `${n < 0 ? "−" : "+"}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
const plain = (n: number) => `$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

/** The four things a room can say, before it has seen anything. */
const CHOICES = [
  { id: "deploy", label: "Deploy it" },
  { id: "test", label: "Run a bounded test" },
  { id: "redesign", label: "Redesign the system around it" },
  { id: "stop", label: "Stop" },
] as const;

/**
 * The five assumptions a sceptic reaches for first, each phrased as the
 * objection rather than as a setting.
 */
const ATTACKS = [
  {
    id: "market",
    ask: "The labour market is doing the work, not the agent",
    on: "Market set to zero",
    off: "Market absorbing everything",
  },
  {
    id: "fee",
    ask: "A real firm would move off hourly billing",
    on: "Fixed fee per package",
    off: "Billed hourly",
  },
  {
    id: "redeploy",
    ask: "Freed hours would obviously be redeployed",
    on: "Every freed hour routed",
    off: "Nothing routed",
  },
  {
    id: "review",
    ask: "Nobody re-reads whole packages by hand",
    on: "Risk-tiered delta gate",
    off: "Full manual re-verification",
  },
  {
    id: "juniors",
    ask: "Juniors would still get the reps",
    on: "20% manual first pass kept",
    off: "No safeguard",
  },
] as const;

type AttackId = (typeof ATTACKS)[number]["id"];

export function RoomMode() {
  const [beat, setBeat] = useState<Beat>("open");
  const [choice, setChoice] = useState<string | null>(null);
  const [on, setOn] = useState<Record<AttackId, boolean>>({
    market: false,
    fee: false,
    redeploy: false,
    review: false,
    juniors: false,
  });

  const levers: Levers = useMemo(
    () => ({
      ...NAIVE_DEPLOYMENT,
      pricingModel: on.fee ? "FIXED_FEE" : "TM_100",
      backlogRedeploymentPct: on.redeploy ? 1 : 0,
      reviewArchitecture: on.review ? "TIERED_DELTA_GATE" : "FULL_MANUAL",
      apprenticeshipSafeguard: on.juniors ? "BLIND_AUDIT_20_PCT" : "NONE",
    }),
    [on],
  );

  const out = useMemo(
    () =>
      runEngine(ATLAS_BASELINE, levers, {
        demandAbsorption: on.market ? 0 : 1,
      }),
    [levers, on.market],
  );

  // The opening number is the untouched operating model, always, whatever
  // the room has since changed.
  const opening = useMemo(() => runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT), []);
  const openingReleased = Math.round(
    opening.jrRedeployedHours + opening.jrSavedHoursUnused,
  );
  /* Nothing survives the fee gate under hourly billing, routed or not. */
  const openingArriving = Math.round(
    NAIVE_DEPLOYMENT.pricingModel === "TM_100" ? 0 : opening.jrRedeployedHours,
  );
  const members = useMemo(() => loadPath(out, levers), [out, levers]);
  const charter = useMemo(() => buildCharter(evaluateProgress([])), []);

  const index = BEATS.indexOf(beat);
  const go = useCallback((d: 1 | -1) => {
    setBeat((b) => BEATS[Math.min(BEATS.length - 1, Math.max(0, BEATS.indexOf(b) + d))]);
  }, []);

  /* A room is driven from a clicker, which sends arrow keys and space. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) { e.preventDefault(); go(1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const showSection = beat === "reveal" || beat === "attack";

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-canvas">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-line px-5">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-bold tracking-[-0.01em] text-ink-1">
            VALUE&nbsp;SHIFT
          </span>
          <span className="hidden font-mono text-[10.5px] text-ink-4 sm:inline">
            // Room mode
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {BEATS.map((b, i) => (
            <button
              key={b}
              onClick={() => setBeat(b)}
              aria-label={`Beat ${i + 1}`}
              aria-current={b === beat ? "step" : undefined}
              className="group -my-2.5 px-1 py-2.5"
            >
              <span
                className={`block h-1 rounded-full transition-all ${
                  i === index ? "w-8 bg-zinc-300" : i < index ? "w-3.5 bg-zinc-600" : "w-3.5 bg-zinc-800"
                }`}
              />
            </button>
          ))}
          <Link
            href="/"
            className="ml-3 inline-flex items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-[11px] text-ink-4 transition-colors hover:border-line-strong hover:text-ink-2"
          >
            <X size={11} />
            <span className="hidden sm:inline">Leave</span>
          </Link>
        </div>
      </header>

      <main className="relative min-h-0 flex-1">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={beat}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={SNAP}
            className="absolute inset-0"
          >
            {beat === "open" && (
              <Centered>
                <p className="micro-label">Atlas Structural &amp; Civil</p>
                <h1 className="mt-6 max-w-4xl text-[clamp(30px,6.2vw,68px)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink-1">
                  The agent passed.
                  <span className="mt-2 block text-crit">
                    The firm ends the month {plain(opening.deltaMargin)} worse.
                  </span>
                </h1>
                {/*
                  Both figures come from the same run as the headline. The
                  second one is zero rather than small, because under the
                  untouched operating model nothing routes the freed hours and
                  the hourly fee gate keeps none of the saving. A near-miss
                  would be an easier line to read and it would not be true.
                */}
                <p className="mt-7 max-w-2xl text-[clamp(15px,1.9vw,21px)] leading-[1.4] text-ink-2">
                  {openingReleased} hours were released.{" "}
                  <span className="text-ink-4">
                    {openingArriving === 0
                      ? "None of them reached business value."
                      : `Only ${openingArriving} reached business value.`}
                  </span>
                </p>
                <p className="mt-5 text-[12.5px] text-ink-4">
                  Atlas Civil is a synthetic AEC scenario. Every result here is
                  illustrative and editable, and none of it is a forecast.
                </p>
                <button
                  onClick={() => go(1)}
                  className="group mt-10 inline-flex items-center gap-2.5 rounded-xl border border-line-strong bg-surface-1 px-6 py-3.5 text-[16px] font-medium text-ink-1 transition-colors hover:border-white/25 hover:bg-surface-2"
                >
                  Try to prove the model wrong
                  <ArrowRight size={16} className="text-ink-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Centered>
            )}

            {beat === "ask" && (
              <Centered>
                <p className="micro-label">Before anybody sees the model</p>
                <h2 className="mt-5 max-w-3xl text-[clamp(24px,3.6vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink-1">
                  The agent cut production time by{" "}
                  {Math.round(NAIVE_DEPLOYMENT.aiSpeedupPct * 100)}%, and every
                  technical test passed. What should Atlas do?
                </h2>
                <div className="mt-9 grid w-full max-w-3xl gap-2.5 sm:grid-cols-2">
                  {CHOICES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setChoice(c.id); go(1); }}
                      className={`rounded-xl border px-5 py-4 text-left text-[15px] font-medium transition-colors ${
                        choice === c.id
                          ? "border-white/30 bg-surface-2 text-ink-1"
                          : "border-line bg-surface-1 text-ink-2 hover:border-line-strong hover:bg-surface-2"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <p className="mt-6 text-[13px] text-ink-4">
                  Nothing is recorded. The point is that the room commits before
                  it is shown anything.
                </p>
              </Centered>
            )}

            {showSection && (
              <div className="grid h-full grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex min-h-0 items-center justify-center px-4 py-3">
                  <ValueLoadPath members={members} />
                </div>
                <aside className="hidden min-h-0 flex-col justify-center gap-4 overflow-hidden border-l border-line px-6 lg:flex">
                  {beat === "reveal" ? (
                    <>
                      <p className="micro-label">What the load does</p>
                      <p className="text-[19px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink-1">
                        {verdictLine(out)}
                      </p>
                      <Reading label="Monthly position" value={money(out.deltaMargin)} tone={out.deltaMargin > 0 ? "ok" : "crit"} />
                      <Reading label="Freed capacity" value={`${Math.round(out.jrRedeployedHours + out.jrSavedHoursUnused)}h`} />
                      <Reading label="Reached business value" value={`${Math.round(out.jrRedeployedHours * (levers.pricingModel === "TM_100" ? 0 : 1))}h`} tone="crit" />
                      <p className="text-[13px] leading-relaxed text-ink-4">
                        Every technical test passed. Nothing above is a claim
                        about the agent.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="micro-label">Change what you do not believe</p>
                      <div className="space-y-1.5">
                        {ATTACKS.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => setOn((p) => ({ ...p, [a.id]: !p[a.id] }))}
                            className="w-full rounded-lg border border-line bg-surface-1 px-3 py-2.5 text-left transition-colors hover:border-line-strong"
                          >
                            <span className="block text-[12.5px] leading-snug text-ink-2">
                              {a.ask}
                            </span>
                            <span
                              className={`mono-num mt-1 block text-[10.5px] uppercase tracking-wide ${
                                on[a.id] ? "text-ok" : "text-ink-4"
                              }`}
                            >
                              {on[a.id] ? a.on : a.off}
                            </span>
                          </button>
                        ))}
                      </div>
                      <Reading label="Monthly position" value={money(out.deltaMargin)} tone={out.deltaMargin > 0 ? "ok" : "crit"} />
                    </>
                  )}
                </aside>
              </div>
            )}

            {beat === "tempt" && (
              <Centered>
                <p className="micro-label">Eighteen operating models, best number first</p>
                <div className="mt-6 w-full max-w-3xl space-y-2.5">
                  <Row
                    rank={1}
                    money={money(BEST.position)}
                    label={BEST.label}
                    verdict="Not signable"
                    detail="Accepted-output quality was never measured, and unreviewed output ships under a licensed stamp."
                    tone="crit"
                  />
                  <Row
                    rank={2}
                    money={money(CONFIGURATIONS[1].position)}
                    label={CONFIGURATIONS[1].label}
                    verdict="Redesign first"
                    detail="More profitable this month, and no junior is learning the work any more."
                    tone="warn"
                  />
                  <Row
                    rank={BEST_SIGNED_RANK}
                    money={money(BEST_SIGNED.position)}
                    label={BEST_SIGNED.label}
                    verdict="First it will sign"
                    detail="Fourth-best financial result, and the first one the evidence supports."
                    tone="ok"
                  />
                </div>
                <p className="mt-7 max-w-2xl text-[15px] leading-relaxed text-ink-3">
                  The instrument is not an optimiser. It will not hand back the
                  biggest number it can find.
                </p>
              </Centered>
            )}

            {beat === "decide" && (
              <div
                /* id="charter-sheet" hands this to the print rules in
                   globals.css, which hide everything else on the page, so one
                   click leaves the room with the decision and its conditions
                   rather than with a screenshot of a slide. */
                id="charter-sheet"
                className="flex h-full flex-col justify-center px-6 py-4 sm:px-10"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="micro-label">The decision</p>
                  <button
                    onClick={() => window.print()}
                    className="print-hidden inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[11.5px] text-ink-4 transition-colors hover:border-line-strong hover:text-ink-2"
                  >
                    <Printer size={11} />
                    Print or save the charter
                  </button>
                </div>
                <h2 className="mt-3 text-[clamp(20px,2.8vw,32px)] font-semibold leading-[1.12] tracking-[-0.028em] text-ink-1">
                  Run a bounded thirty-day experiment. Do not deploy.
                </h2>
                <div className="mt-5 grid min-h-0 gap-x-8 gap-y-2 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
                  {charter.map((f) => (
                    <div key={f.label} className="border-t border-line pt-1.5">
                      <p className="micro-label">{f.label}</p>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-ink-3">
                        {f.value}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[clamp(15px,1.8vw,20px)] font-medium leading-[1.35] tracking-[-0.02em] text-ink-1">
                  The best number did not win. The first defensible decision did.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="flex h-9 shrink-0 items-center justify-between border-t border-line px-5">
        <p className="text-[10.5px] text-ink-4">
          Atlas Civil · Synthetic scenario · Illustrative economics, not a
          forecast · Replace with firm evidence before any real decision
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Previous"
            className="rounded-md border border-line p-1 text-ink-4 transition-colors hover:border-line-strong hover:text-ink-2 disabled:opacity-30"
          >
            <ArrowLeft size={12} />
          </button>
          <button
            onClick={() => go(1)}
            disabled={index === BEATS.length - 1}
            aria-label="Next"
            className="rounded-md border border-line p-1 text-ink-4 transition-colors hover:border-line-strong hover:text-ink-2 disabled:opacity-30"
          >
            <ArrowRight size={12} />
          </button>
        </div>
      </footer>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      {children}
    </div>
  );
}

function Reading({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "ok" | "crit";
}) {
  const c = tone === "ok" ? "text-ok" : tone === "crit" ? "text-crit" : "text-ink-1";
  return (
    <div className="border-t border-line pt-2.5">
      <p className="micro-label">{label}</p>
      <p className={`mono-num mt-0.5 text-[22px] font-semibold ${c}`}>{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-4">
        Synthetic scenario, not a forecast
      </p>
    </div>
  );
}

function Row({
  rank,
  money: m,
  label,
  verdict,
  detail,
  tone,
}: {
  rank: number;
  money: string;
  label: string;
  verdict: string;
  detail: string;
  tone: "ok" | "warn" | "crit";
}) {
  const t =
    tone === "ok"
      ? { border: "border-ok/40", bg: "bg-ok/[0.06]", text: "text-ok" }
      : tone === "warn"
        ? { border: "border-warn/40", bg: "bg-warn/[0.06]", text: "text-warn" }
        : { border: "border-crit/40", bg: "bg-crit/[0.06]", text: "text-crit" };
  return (
    <div className={`flex items-start gap-4 rounded-xl border p-4 text-left ${t.border} ${t.bg}`}>
      <span className="mono-num w-5 shrink-0 pt-1 text-[12px] text-ink-4">{rank}</span>
      <span className={`mono-num w-24 shrink-0 text-[19px] font-semibold ${t.text}`}>{m}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-ink-1">{label}</span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-3">{detail}</span>
      </span>
      <span className={`hidden shrink-0 text-[11.5px] font-medium sm:block ${t.text}`}>
        {verdict}
      </span>
    </div>
  );
}
