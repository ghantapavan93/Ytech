"use client";

import { ScreenFigure } from "@/components/diagram/ScreenFigure";
import { RangeSlider } from "@/components/RangeSlider";
import {
  BAR,
  CARRIED_ANNUAL,
  FREED_HOURS,
  GAP,
  GROSS_ANNUAL,
  GROSS_AT_COST,
  GROSS_PASSES_UNDER,
  screen,
} from "@/components/triage/screen-data";
import { useMemo, useState } from "react";

/**
 * The screen, with its own build cost in the reader's hands.
 *
 * The dial exists to be moved and to change nothing that matters. Whatever
 * the reader believes an agent costs to build, the gross screen passes below
 * a tenth of the gross value and the carried result fails everywhere,
 * including at zero. Letting someone prove that to themselves is worth more
 * than asserting it, and it is the honest way to present a conclusion that
 * happens not to depend on the input.
 */

const money = (n: number) =>
  `${n < 0 ? "−" : ""}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

const mult = (n: number) =>
  Number.isFinite(n)
    ? `${n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)}×`
    : `${n < 0 ? "−" : ""}∞×`;

export function TenXScreen() {
  const [cost, setCost] = useState(60_000);
  const s = useMemo(() => screen(cost), [cost]);

  return (
    <div className="space-y-5">
      <figure className="card overflow-hidden">
        <div className="figure-pan px-4 pt-5 sm:px-6">
          <ScreenFigure />
        </div>
        <figcaption className="mt-2 border-t border-line px-5 py-4">
          <p className="text-[13px] font-medium text-ink-2">
            The same workflow, valued twice
          </p>
          <p className="diagram-reading mt-1.5 text-[13px] leading-relaxed text-ink-4">
            A screen prices the {Math.round(FREED_HOURS)} hours a month the agent
            frees and reaches {money(GROSS_ANNUAL)} a year. The
            wind tunnel runs the same workflow through the fee model, the
            routing decision and the review gate it actually has to pass
            through, and reaches {money(CARRIED_ANNUAL)}. The two are{" "}
            {money(GAP)} apart and on opposite sides of zero. Pricing the freed
            hours at loaded cost instead of billing rate lowers the screen to{" "}
            {money(GROSS_AT_COST)} and changes nothing about which side of the
            line it lands on.
          </p>
        </figcaption>
      </figure>

      <div className="card p-5 sm:p-6">
        <p className="micro-label">What you think this agent costs to build</p>
        <div className="mt-3">
          <RangeSlider
            ariaLabel="Assumed build cost for the agent"
            min={0}
            max={200_000}
            step={5_000}
            value={cost}
            display={money(cost)}
            onChange={setCost}
            leftHint="free"
            rightHint="a funded internal project"
          />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div
            className={`status-surface rounded-xl border p-4 ${
              s.grossPasses ? "border-ok/40 bg-ok/[0.06]" : "border-warn/40 bg-warn/[0.06]"
            }`}
          >
            <p className="micro-label">Screened on freed hours</p>
            <p
              className={`mono-num mt-1.5 text-[26px] font-semibold ${
                s.grossPasses ? "text-ok" : "text-warn"
              }`}
            >
              {mult(s.grossMultiple)}
            </p>
            <p className="mt-1 text-[13px] text-ink-4">
              {s.free
                ? `nothing to divide by, so it clears the ${BAR}× bar`
                : s.grossPasses
                  ? `clears the ${BAR}× bar`
                  : `under the ${BAR}× bar, on cost alone`}
            </p>
          </div>

          <div className="status-surface rounded-xl border border-crit/40 bg-crit/[0.06] p-4">
            <p className="micro-label">Measured on what the firm keeps</p>
            <p className="mono-num mt-1.5 text-[26px] font-semibold text-crit">
              {mult(s.carriedMultiple)}
            </p>
            <p className="mt-1 text-[13px] text-ink-4">
              {s.free
                ? "free, and still on the wrong side of zero"
                : "below zero, so no build cost reaches the bar"}
            </p>
          </div>
        </div>
      </div>

      <p className="border-l-2 border-line-strong pl-4 text-[13px] leading-relaxed text-ink-3">
        The screen clears {BAR}× at any build cost under{" "}
        <span className="font-semibold text-ink-1">
          {money(GROSS_PASSES_UNDER)}
        </span>
        . The outcome clears it at none, including free, because it is on the
        other side of zero and no denominator moves a number across zero. The
        threshold is not the thing that is wrong here. What it is being applied
        to is.
      </p>
    </div>
  );
}
