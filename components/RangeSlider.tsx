"use client";

interface RangeSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Rendered at the right edge, e.g. "100%" or "168h". */
  display: string;
  ariaLabel: string;
  leftHint?: string;
  rightHint?: string;
}

/** Cyan-filled tactile slider with live mono readout. */
export function RangeSlider({
  value,
  min,
  max,
  step,
  onChange,
  display,
  ariaLabel,
  leftHint,
  rightHint,
}: RangeSliderProps) {
  const fillPct = ((value - min) / (max - min)) * 100;

  return (
    <div className="rounded-xl border border-line bg-canvas/60 p-3">
      <div className="flex items-center gap-3">
        <input
          type="range"
          className="lever flex-1"
          aria-label={ariaLabel}
          min={min}
          max={max}
          step={step}
          value={value}
          style={{ "--fill": `${fillPct}%` } as React.CSSProperties}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="mono-num w-14 text-right text-[13px] font-medium text-cyan-200">
          {display}
        </span>
      </div>
      {(leftHint || rightHint) && (
        <div className="mt-1.5 flex justify-between">
          <span className="text-[10px] text-zinc-600">{leftHint}</span>
          <span className="text-[10px] text-zinc-600">{rightHint}</span>
        </div>
      )}
    </div>
  );
}
