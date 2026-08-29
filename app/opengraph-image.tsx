import { ATLAS_BASELINE, NAIVE_DEPLOYMENT, runEngine } from "@/lib/engines/engine";
import { ImageResponse } from "next/og";

/**
 * The card this site shows when its link is pasted somewhere.
 *
 * The whole point of the project is that somebody opens a link, so the link
 * had no business rendering as a bare URL. What the card has to do in one
 * frame is state the contradiction the site spends eight acts on: the agent
 * did what it promised and the firm is worse off.
 *
 * The three readings are run through the same engine the site is, at the same
 * naive-deployment levers act two uses. Typing them here would have made this
 * the one surface where the numbers could quietly stop being true.
 */

export const alt =
  "Value Shift. The agent worked and the firm ended the month worse off.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CANVAS = "#090a0f";
const INK = "#f4f4f5";
const DIM = "#8a8a94";
const LINE = "rgba(255,255,255,0.10)";
const CLAIM = "#cdf94a";
const CRIT = "#f43f5e";
const WARN = "#f59e0b";

const money = (n: number) =>
  `${n < 0 ? "−" : "+"}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

function Reading({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 8 }}>
      <div style={{ fontSize: 15, letterSpacing: 2.4, color: DIM }}>{label}</div>
      <div style={{ fontSize: 52, fontWeight: 700, color: tone, letterSpacing: -1.5 }}>
        {value}
      </div>
      <div style={{ fontSize: 17, color: DIM }}>{note}</div>
    </div>
  );
}

export default function OpengraphImage() {
  const naive = runEngine(ATLAS_BASELINE, NAIVE_DEPLOYMENT);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CANVAS,
          padding: "64px 72px",
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.4 }}>
            VALUE SHIFT
          </div>
          <div style={{ width: 1, height: 22, background: LINE }} />
          <div style={{ fontSize: 16, letterSpacing: 2.4, color: DIM }}>
            DETERMINISTIC MODEL · NO LANGUAGE MODEL IN ANY NUMBER
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 56, fontWeight: 600, letterSpacing: -1.8 }}>
            The agent worked.
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 600,
              letterSpacing: -1.8,
              color: DIM,
            }}
          >
            The firm ended the month worse off.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 48,
            borderTop: `1px solid ${LINE}`,
            paddingTop: 34,
          }}
        >
          <Reading
            label="PRODUCTION TIME"
            value={`−${Math.round(NAIVE_DEPLOYMENT.aiSpeedupPct * 100)}%`}
            note="every technical test passed"
            tone={CLAIM}
          />
          <Reading
            label="MONTHLY MARGIN"
            value={money(naive.deltaMargin)}
            note="the business result"
            tone={CRIT}
          />
          <Reading
            label="LICENSED REVIEW"
            value={`${naive.peHoursPerWeek.toFixed(1)}h`}
            note={`against ${ATLAS_BASELINE.pePillarSustainableHrsPerWeek}h the desk can carry`}
            tone={WARN}
          />
        </div>
      </div>
    ),
    size,
  );
}
