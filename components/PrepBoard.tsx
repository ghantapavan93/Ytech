"use client";

import { PrepAssemblyDiagram } from "./diagram/PrepAssemblyDiagram";
import {
  buildPrepSheet,
  DEFAULT_FIRM,
  stageOf,
  TRIGGER_LABELS,
  type Discipline,
  type FirmInput,
  type PrepLine,
  type Pricing,
  type SizeBand,
  type Trigger,
} from "@/lib/engines/prep-engine";
import { motion } from "framer-motion";
import { Check, Printer, RotateCcw, Undo2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Mark = "kept" | "dropped";
type Marks = Record<string, Mark>;

const STORAGE_KEY = "valueshift.prep.marks.v1";

const SIZES: { value: SizeBand; label: string }[] = [
  { value: "under-25", label: "Under 25" },
  { value: "25-75", label: "25 to 75" },
  { value: "75-250", label: "75 to 250" },
  { value: "over-250", label: "Over 250" },
];

const DISCIPLINES: { value: Discipline; label: string }[] = [
  { value: "architecture", label: "Architecture" },
  { value: "civil", label: "Civil" },
  { value: "structural", label: "Structural" },
  { value: "mep", label: "MEP" },
  { value: "multi", label: "Multi-discipline" },
];

const PRICINGS: { value: Pricing; label: string }[] = [
  { value: "hourly", label: "Mostly hourly" },
  { value: "mixed", label: "Mixed" },
  { value: "fixed", label: "Mostly fixed fee" },
];

const DIMENSIONS: { key: keyof FirmInput["maturity"]; label: string; weight: string }[] = [
  { key: "culture", label: "Culture", weight: "20%" },
  { key: "adoption", label: "Adoption", weight: "15%" },
  { key: "operating", label: "Operating model", weight: "35%" },
  { key: "business", label: "Business model", weight: "30%" },
];

function Pills<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div>
      <p className="micro-label">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={o.value === value}
            className={`rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              o.value === value
                ? "bg-cyan-500/15 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.45)]"
                : "border border-line text-zinc-400 hover:border-line-strong hover:text-zinc-200"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  lines,
  marks,
  onMark,
}: {
  title: string;
  hint: string;
  lines: PrepLine[];
  marks: Marks;
  onMark: (id: string, mark: Mark | null) => void;
}) {
  const visible = lines.filter((l) => marks[l.id] !== "dropped");
  const dropped = lines.filter((l) => marks[l.id] === "dropped");

  return (
    <div className="border-b border-line py-5 last:border-0">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[13.5px] font-semibold text-zinc-200">{title}</h3>
        <span className="text-[11px] text-zinc-600">{hint}</span>
      </div>
      <div className="mt-3 space-y-2.5">
        {visible.map((line) => {
          const kept = marks[line.id] === "kept";
          return (
            <motion.div
              key={line.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className={`group rounded-xl border p-3.5 transition-colors ${
                kept
                  ? "border-emerald-500/35 bg-emerald-500/[0.05]"
                  : "border-line bg-canvas/40"
              }`}
            >
              <p className="text-[13px] leading-relaxed text-zinc-300">{line.text}</p>
              <div className="mt-2.5 flex items-center justify-between gap-3">
                {line.href ? (
                  <a
                    href={line.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10.5px] text-zinc-600 transition-colors hover:text-zinc-400"
                  >
                    {line.source}
                  </a>
                ) : (
                  <span className="text-[10.5px] text-zinc-600">{line.source}</span>
                )}
                <div className="print-hidden flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <button
                    onClick={() => onMark(line.id, kept ? null : "kept")}
                    title="Keep this one"
                    className={`rounded-md p-1.5 transition-colors ${
                      kept
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-zinc-600 hover:bg-white/[0.06] hover:text-zinc-300"
                    }`}
                  >
                    <Check size={12} />
                  </button>
                  <button
                    onClick={() => onMark(line.id, "dropped")}
                    title="Not for this firm"
                    className="rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-white/[0.06] hover:text-rose-400"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {dropped.length > 0 && (
          <div className="print-hidden flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10.5px] text-zinc-600">
              {dropped.length} set aside
            </span>
            {dropped.map((line) => (
              <button
                key={line.id}
                onClick={() => onMark(line.id, null)}
                className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[10.5px] text-zinc-500 transition-colors hover:text-zinc-300"
              >
                <Undo2 size={9} />
                bring back
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PrepBoard() {
  const [firm, setFirm] = useState<FirmInput>(DEFAULT_FIRM);
  const [marks, setMarks] = useState<Marks>({});
  const [loaded, setLoaded] = useState(false);

  // Her judgment persists in this browser. Nothing leaves it.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMarks(JSON.parse(raw));
    } catch {
      // Private windows and blocked storage are fine. The board still works.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(marks));
    } catch {
      // Same as above. Persistence is a convenience, not a requirement.
    }
  }, [marks, loaded]);

  const sheet = useMemo(() => buildPrepSheet(firm), [firm]);
  const { score } = useMemo(() => stageOf(firm.maturity), [firm.maturity]);

  const onMark = useCallback((id: string, mark: Mark | null) => {
    setMarks((prev) => {
      const next = { ...prev };
      if (mark === null) delete next[id];
      else next[id] = mark;
      return next;
    });
  }, []);

  const set = <K extends keyof FirmInput>(key: K, value: FirmInput[K]) =>
    setFirm((prev) => ({ ...prev, [key]: value }));

  const toggleTrigger = (t: Trigger) =>
    setFirm((prev) => ({
      ...prev,
      triggers: prev.triggers.includes(t)
        ? prev.triggers.filter((x) => x !== t)
        : [...prev.triggers, t],
    }));

  const sheetSections = [
    sheet.openWith,
    sheet.contradiction,
    sheet.doNotBuild,
    sheet.guardrails,
    sheet.firstExperiment,
    sheet.watchFor,
  ];
  // A section is still on the sheet unless every line in it was set aside.
  const sectionsHeld = sheetSections.filter((lines) =>
    lines.some((line) => marks[line.id] !== "dropped"),
  ).length;

  const keptCount = Object.values(marks).filter((m) => m === "kept").length;
  const droppedCount = Object.values(marks).filter((m) => m === "dropped").length;

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
      {/* What she knows so far */}
      <div className="print-hidden space-y-5 self-start lg:sticky lg:top-20">
        <div className="card space-y-5 p-5">
          <div>
            <p className="micro-label">Firm</p>
            <input
              value={firm.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Name it, or leave blank"
              className="mt-2 w-full rounded-lg border border-line bg-canvas/60 px-3 py-2 text-[13px] text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan-500/50"
            />
          </div>

          <Pills label="Size" value={firm.size} options={SIZES} onChange={(v) => set("size", v)} />
          <Pills
            label="Discipline"
            value={firm.discipline}
            options={DISCIPLINES}
            onChange={(v) => set("discipline", v)}
          />
          <Pills
            label="How they bill"
            value={firm.pricing}
            options={PRICINGS}
            onChange={(v) => set("pricing", v)}
          />

          <div>
            <div className="flex items-baseline justify-between">
              <p className="micro-label">Where you'd put them</p>
              <span className="mono-num text-[11px] text-cyan-300">{score.toFixed(0)}</span>
            </div>
            <div className="mt-2.5 space-y-3">
              {DIMENSIONS.map((d) => (
                <div key={d.key}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-[11.5px] text-zinc-400">
                      {d.label}
                      <span className="mono-num ml-1.5 text-[10px] text-zinc-600">{d.weight}</span>
                    </span>
                    <span className="mono-num text-[11px] text-zinc-500">
                      {firm.maturity[d.key]}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="lever w-full"
                    aria-label={d.label}
                    min={1}
                    max={5}
                    step={1}
                    value={firm.maturity[d.key]}
                    style={
                      {
                        "--fill": `${((firm.maturity[d.key] - 1) / 4) * 100}%`,
                      } as React.CSSProperties
                    }
                    onChange={(e) =>
                      set("maturity", { ...firm.maturity, [d.key]: Number(e.target.value) })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="micro-label">What brought them to the call</p>
            <div className="mt-2 space-y-1.5">
              {TRIGGER_LABELS.map((t) => {
                const on = firm.triggers.includes(t.value);
                return (
                  <button
                    key={t.value}
                    onClick={() => toggleTrigger(t.value)}
                    aria-pressed={on}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12.5px] transition-colors ${
                      on
                        ? "bg-cyan-500/10 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.35)]"
                        : "text-zinc-400 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        on ? "bg-cyan-400" : "bg-zinc-700"
                      }`}
                    />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="micro-label">Your edits</p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400">
            {keptCount === 0 && droppedCount === 0
              ? "Keep the lines that sound like you. Set aside the ones that don't. The board remembers both, in this browser only."
              : `${keptCount} kept, ${droppedCount} set aside. Nothing leaves this browser.`}
          </p>
          {(keptCount > 0 || droppedCount > 0) && (
            <button
              onClick={() => setMarks({})}
              className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <RotateCcw size={11} />
              clear edits
            </button>
          )}
        </div>
      </div>

      <PrepAssemblyDiagram
        sections={sheetSections.length}
        kept={sectionsHeld}
      />

      {/* The sheet */}
      <div id="prep-sheet" className="card p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="micro-label">Prep sheet</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-zinc-100">
              {firm.name.trim() || "Unnamed firm"}
            </h2>
            <p className="mt-1.5 text-[12.5px] text-zinc-500">
              {SIZES.find((s) => s.value === firm.size)?.label} staff,{" "}
              {DISCIPLINES.find((d) => d.value === firm.discipline)?.label.toLowerCase()},{" "}
              {PRICINGS.find((p) => p.value === firm.pricing)?.label.toLowerCase()}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="mono-num text-[11px] text-zinc-600">Where they sit</p>
            <p className="mt-1 text-lg font-semibold text-cyan-300">{sheet.stage}</p>
          </div>
        </div>

        <p className="border-b border-line py-4 text-[13px] leading-relaxed text-zinc-400">
          {sheet.stageNote}
        </p>

        <Section
          title="Open with this"
          hint="inside out, always"
          lines={sheet.openWith}
          marks={marks}
          onMark={onMark}
        />
        <Section
          title="The contradiction to surface"
          hint="say it early, say it kindly"
          lines={sheet.contradiction}
          marks={marks}
          onMark={onMark}
        />
        <Section
          title="What to tell them not to build"
          hint="the advice they won't get elsewhere"
          lines={sheet.doNotBuild}
          marks={marks}
          onMark={onMark}
        />
        <Section
          title="Guardrails to put in writing"
          hint="team, firm, industry"
          lines={sheet.guardrails}
          marks={marks}
          onMark={onMark}
        />
        <Section
          title="The one experiment to propose"
          hint="thirty days, one owner"
          lines={sheet.firstExperiment}
          marks={marks}
          onMark={onMark}
        />
        <Section
          title="Watch for this in the room"
          hint="what the deck won't tell you"
          lines={sheet.watchFor}
          marks={marks}
          onMark={onMark}
        />

        <div className="print-hidden mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2.5 text-[13px] font-semibold text-zinc-950 transition-colors hover:bg-white"
          >
            <Printer size={14} />
            Print for the meeting
          </button>
          <p className="text-[11px] text-zinc-600">
            Every line above comes from something YegaTech has published. No model wrote them.
          </p>
        </div>
      </div>
    </div>
  );
}
