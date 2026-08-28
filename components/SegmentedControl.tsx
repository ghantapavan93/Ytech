"use client";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** Small second line under the label, e.g. a rate or risk note. */
  detail?: string;
  /** Marks the option visually as a hazard (e.g. ungoverned review). */
  hazard?: boolean;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
}

/**
 * Stepped, tactile selector, the "physical instrument" control for the
 * wind tunnel levers. Fully keyboard-accessible radio group semantics.
 */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid gap-1.5 rounded-xl border border-line bg-canvas/60 p-1.5 sm:grid-cols-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`group flex items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-left transition-all duration-200 ${
              active
                ? opt.hazard
                  ? "bg-rose-500/15 shadow-[inset_0_0_0_1px_rgba(244,63,94,0.5)]"
                  : "bg-cyan-500/10 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.45)]"
                : "hover:bg-white/[0.04]"
            }`}
          >
            <span
              className={`text-[13px] font-medium transition-colors ${
                active
                  ? opt.hazard
                    ? "text-rose-300"
                    : "text-cyan-200"
                  : "text-zinc-400 group-hover:text-zinc-200"
              }`}
            >
              {opt.label}
            </span>
            {opt.detail && (
              <span
                className={`mono-num text-[11px] ${
                  active ? "text-zinc-300" : "text-zinc-600"
                }`}
              >
                {opt.detail}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
