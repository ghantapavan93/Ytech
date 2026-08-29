"use client";

import { LEGACY, SUBSIDY, at } from "@/components/demand/demand-data";
import { DemandFigure } from "@/components/diagram/DemandFigure";
import { RangeSlider } from "@/components/RangeSlider";
import { useMemo, useState } from "react";

/**
 * The dial the instrument was missing.
 *
 * Every other control on this site is a lever: something a principal decides
 * on a Monday. This one is not. It is the share of freed capacity the market
 * will buy, and no operating model recovers an hour nobody wants. It is set
 * to full everywhere else on the site, which is the honest reading of a year
 * when roughly a third of firms are turning work away, and it is also the
 * assumption every pilot running right now is making without saying so.
 */

const money = (n: number) =>
  `${n < 0 ? "−" : "+"}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

const hrs = (n: number) => `${Math.round(n)}h`;

export function DemandBoard() {
  const [pct, setPct] = useState(100);
  const absorption = pct / 100;

  const rows = useMemo(
    () =>
      SUBSIDY.map((m) => {
        const out = at(m.id, absorption);
        return { ...m, out, position: out.margin - LEGACY.margin };
      }),
    [absorption],
  );

  const hourly = rows.find((r) => r.id === "TM_100")!;
  const fixed = rows.find((r) => r.id === "FIXED_FEE")!;

  /*
   * How much of the fixed-fee gain is the market rather than the operating
   * model. This is the number a pilot report should carry and none of them
   * do: at today's setting more than half of a good result was handed to the
   * firm by a labour shortage it did not create and cannot hold.
   */
  const fromMarket = absorption * fixed.worth;
  const marketShare = fixed.position > 0 ? (fromMarket / fixed.position) * 100 : 0;

  return (
    <div className="space-y-5">
      <figure className="card overflow-hidden">
        <div className="figure-pan px-4 pt-5 sm:px-6">
          <DemandFigure absorption={absorption} />
        </div>
        <figcaption className="mt-2 border-t border-line px-5 py-4">
          <p className="text-[13px] font-medium text-ink-2">
            What the market is worth, and what it is holding up
          </p>
          <p className="diagram-reading mt-1.5 text-[13px] leading-relaxed text-ink-4">
            Both lines are straight and parallel. A market that absorbs nothing
            costs an hourly firm and a fixed-fee firm the same{" "}
            {money(Math.abs(SUBSIDY[0].worth)).replace("+", "")} a month, because
            a redeployed hour bills at the junior rate however the packages are
            priced. Neither line crosses no change. There is no market this firm
            could be handed that makes the hourly result positive, and none that
            makes the fixed-fee result negative.
          </p>
        </figcaption>
      </figure>

      <div className="card p-5 sm:p-6">
        <p className="micro-label">
          Share of freed hours the market will actually buy
        </p>
        <div className="mt-3">
          <RangeSlider
            ariaLabel="Share of freed hours the market will actually buy"
            min={0}
            max={100}
            step={5}
            value={pct}
            display={`${pct}%`}
            onChange={setPct}
            leftHint="a normal book of work"
            rightHint="turning work away, as now"
          />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-4">
          This is not a lever. Nobody at the firm decides it, and the rest of
          this site holds it at 100%, which is the honest reading of the market
          the industry is in and the unstated premise under every pilot result
          being measured this year.
        </p>
        <p className="mt-2.5 text-[13px] leading-relaxed text-ink-4">
          <span className="font-medium text-ink-2">
            Scenario attribution, not causal identification.
          </span>{" "}
          Moving this dial says what the model does under a different market.
          It is not evidence that any share of an observed result was caused by
          the labour market, and no arrangement of this page could be. Doing
          that needs firm data across a demand cycle, which is a study rather
          than an instrument.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((r) => {
          const good = r.position > 0;
          return (
            <div
              key={r.id}
              className={`status-surface rounded-xl border p-5 ${
                good ? "border-ok/40 bg-ok/[0.06]" : "border-crit/40 bg-crit/[0.06]"
              }`}
            >
              <p className="micro-label">{r.name}</p>
              <p
                className={`mono-num mt-2 text-[30px] font-semibold tracking-tight ${
                  good ? "text-ok" : "text-crit"
                }`}
              >
                {money(r.position)}
              </p>
              <p className="mt-1 text-[13px] text-ink-4">
                a month against the firm before the agent
              </p>

              <dl className="mt-4 space-y-1.5 border-t border-line pt-3.5 text-[13px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-4">Freed hours sold</dt>
                  <dd className="mono-num text-ink-2">
                    {hrs(r.out.jrRedeployedHours)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-4">Nobody would buy</dt>
                  <dd className="mono-num text-ink-2">{hrs(r.out.jrHoursUnsold)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-4">Market is worth</dt>
                  <dd className="mono-num text-ink-2">{money(r.worth)}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      <p className="border-l-2 border-line-strong pl-4 text-[13px] leading-relaxed text-ink-3">
        {marketShare >= 1 ? (
          <>
            In this synthetic scenario{" "}
            <span className="font-semibold text-ink-1">
              {Math.round(marketShare)}% of the modelled fixed-fee gain depends
              on assumed market demand
            </span>{" "}
            rather than on anything the firm designed, and the agent is identical
            at both ends of the dial. Billed hourly the same subsidy is the only
            thing between a bad month and a much worse one, and it was never
            going to make the month good.
          </>
        ) : (
          <>
            With nothing absorbing the freed hours, the whole of the fixed-fee
            gain is the operating model: it comes from keeping what the agent
            saves rather than from selling the time again. The hourly firm has
            nothing left to sell and finishes{" "}
            <span className="font-semibold text-ink-1">
              {money(Math.abs(hourly.position)).replace("+", "")} down
            </span>
            .
          </>
        )}
      </p>
    </div>
  );
}
