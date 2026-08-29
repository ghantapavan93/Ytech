"use client";

import { PLAYS, runAgent, type AgentRun, type StepKind } from "@/lib/engines/agent-engine";
import { getDrafter, MODE_NOTE } from "@/lib/engines/model-boundary";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CircleSlash,
  CornerDownLeft,
  FileText,
  Hand,
  Layers,
  Play,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const KIND_STYLE: Record<
  StepKind,
  { icon: React.ReactNode; hex: string; label: string }
> = {
  read: { icon: <BookOpen size={13} />, hex: "#71717a", label: "read" },
  run: { icon: <Layers size={13} />, hex: "#06b6d4", label: "ran" },
  assemble: { icon: <FileText size={13} />, hex: "#06b6d4", label: "assembled" },
  refuse: { icon: <CircleSlash size={13} />, hex: "#f43f5e", label: "refused" },
  handoff: { icon: <Hand size={13} />, hex: "#f59e0b", label: "handed over" },
};

export function AgentConsole() {
  const [task, setTask] = useState("");
  const [run, setRun] = useState<AgentRun | null>(null);
  const [missed, setMissed] = useState(false);
  const drafterMode = getDrafter().mode;

  const go = (value: string) => {
    const result = runAgent(value);
    setRun(result);
    setMissed(result === null && value.trim().length > 0);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    go(task);
  };

  return (
    <div className="space-y-5">
      {/* Where the model is, and is not */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border border-line bg-canvas/55 px-4 py-2.5">
        <span className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
          </span>
          <span className="mono-num text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400">
            {drafterMode}
          </span>
        </span>
        <span className="text-[11.5px] leading-relaxed text-ink-4">
          {MODE_NOTE[drafterMode]}
        </span>
      </div>

      {/* Task bar */}
      <form onSubmit={submit} className="card p-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="ml-2.5 shrink-0 text-cyan-400/80" />
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What needs doing before your next meeting?"
            className="flex-1 bg-transparent px-1 py-3 text-[15px] text-ink-1 outline-none placeholder:text-ink-4"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-[13px] font-semibold text-zinc-950 transition-colors hover:bg-white"
          >
            Run
            <CornerDownLeft size={13} />
          </button>
        </div>
      </form>

      {/* What it can do */}
      {!run && (
        <div className="space-y-3">
          <p className="micro-label">Five jobs it knows</p>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {PLAYS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setTask(p.example);
                  go(p.example);
                }}
                className="card group p-4 text-left transition-colors hover:border-line-strong"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[13px] font-semibold text-ink-1">{p.name}</h3>
                  <Play
                    size={11}
                    className="mt-1 shrink-0 text-ink-4 transition-colors group-hover:text-cyan-400"
                  />
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-ink-4">
                  Replaces: {p.replaces.toLowerCase()}
                </p>
                <p className="mt-2.5 font-mono text-[10px] leading-relaxed text-ink-4">
                  &ldquo;{p.example}&rdquo;
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {missed && (
        <div className="card border-amber-500/25 bg-amber-500/[0.06] p-5">
          <p className="text-[13px] leading-relaxed text-amber-200">
            No play matched that, so nothing ran.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
            It knows five jobs and does not improvise past them. Guessing at a
            sixth would be the exact failure this whole thing argues against.
          </p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {run && (
          <motion.div
            key={run.play.id + run.artifact.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-5"
          >
            {/* Routing, shown rather than hidden */}
            <div className="card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="micro-label">Routed to</p>
                  <h3 className="mt-1.5 text-[15px] font-semibold text-ink-1">
                    {run.play.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="mono-num text-[11.5px] text-ink-4">match</p>
                  <p className="mono-num text-[15px] font-semibold text-cyan-300">
                    {Math.round(run.match * 100)}%
                  </p>
                </div>
              </div>
              {run.alternatives.length > 0 && (
                <p className="mt-3 border-t border-line pt-3 text-[11.5px] text-ink-4">
                  Also scored: {run.alternatives.map((a) => a.play.name).join(", ")}.
                  Routing is keyword matching, not a model, so you can audit why it
                  chose this.
                </p>
              )}
            </div>

            {/* Steps */}
            <div className="card overflow-hidden">
              <p className="micro-label border-b border-line px-5 py-3">
                What it did
              </p>
              <div className="divide-y divide-line">
                {run.steps.map((s, i) => {
                  const style = KIND_STYLE[s.kind];
                  return (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className={`flex gap-3.5 p-5 ${
                        s.kind === "refuse" ? "bg-rose-500/[0.06]" : ""
                      }`}
                    >
                      <span
                        className="mt-0.5 shrink-0 rounded-lg p-1.5"
                        style={{ color: style.hex, background: `${style.hex}18` }}
                      >
                        {style.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2.5">
                          <h4 className="text-[13px] font-semibold text-ink-1">
                            {s.title}
                          </h4>
                          <span
                            className="mono-num text-[10px] font-bold uppercase tracking-[0.14em]"
                            style={{ color: style.hex }}
                          >
                            {style.label}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-3">
                          {s.detail}
                        </p>
                        <p className="mt-1.5 text-[10px] text-ink-4">via {s.via}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Artifact */}
            <div className="card overflow-hidden">
              <p className="micro-label border-b border-line px-5 py-3">
                {run.artifact.title}
              </p>
              <ul className="divide-y divide-line">
                {run.artifact.lines.map((line) => (
                  <li
                    key={line}
                    className="px-5 py-3.5 text-[13px] leading-relaxed text-ink-2"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* The point of the whole thing */}
            <div className="card border-amber-500/25 bg-amber-500/[0.06] p-5">
              <div className="flex items-center gap-2 text-amber-300">
                <Hand size={14} />
                <p className="micro-label !text-amber-300/80">Your call, not its call</p>
              </div>
              <ul className="mt-3 space-y-2">
                {run.handBack.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-400/80" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Assumptions */}
            {run.assumed.length > 0 && (
              <div className="card p-5">
                <p className="micro-label">What it had to assume</p>
                <ul className="mt-2.5 space-y-1.5">
                  {run.assumed.map((a) => (
                    <li key={a} className="text-[13px] leading-relaxed text-ink-4">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => {
                setRun(null);
                setTask("");
                setMissed(false);
              }}
              className="text-[13px] text-ink-4 transition-colors hover:text-ink-2"
            >
              new task
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
