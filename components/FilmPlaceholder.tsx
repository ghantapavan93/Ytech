import { BEST } from "@/lib/engines/configurations";
import { Film } from "lucide-react";
import type { ReactNode } from "react";

/**
 * A hole shaped exactly like the film that will fill it.
 *
 * Two things this deliberately does not do. It does not autoplay, and it
 * does not show a spinner or a play control that goes nowhere. A play button
 * that does nothing is a small lie, and this is a site whose entire argument
 * is about not making claims you cannot support. Until the asset exists the
 * frame says so plainly, and the poster carries enough of the film's content
 * that the space is not wasted while it waits.
 *
 * The 16:9 box, the caption row and the reduced-motion note are all here now
 * so that dropping the real file in changes one element rather than the
 * layout around it.
 */

const money = (n: number) =>
  `+$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

export function FilmPlaceholder({
  eyebrow,
  title,
  supporting,
  runtime,
  poster,
}: {
  eyebrow: string;
  title: string;
  supporting: string;
  runtime: string;
  poster: "loadpath" | "refusal";
}) {
  return (
    <figure className="card overflow-hidden">
      <div className="relative aspect-video w-full bg-canvas">
        {poster === "loadpath" ? <LoadPathPoster /> : <RefusalPoster />}

        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7">
          <p className="micro-label">{eyebrow}</p>
          <p className="mt-2 max-w-xl text-[clamp(17px,2.4vw,26px)] font-semibold leading-[1.15] tracking-[-0.025em] text-ink-1">
            {title}
          </p>
          <p className="mt-1.5 text-[13px] text-ink-3">{supporting}</p>
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-lg border border-line bg-canvas/70 px-2.5 py-1.5 backdrop-blur-sm">
          <Film size={11} className="text-ink-4" />
          <span className="font-mono text-[10.5px] text-ink-4">{runtime}</span>
        </div>
      </div>

      <figcaption className="border-t border-line px-5 py-3.5">
        <p className="text-[12.5px] leading-relaxed text-ink-4">
          <span className="font-medium text-ink-2">Not recorded yet.</span> This
          frame is the shape the film will occupy, not a player waiting on a
          file. It will carry captions, and a reader with reduced motion turned
          on will get the still and the transcript rather than the animation.
        </p>
      </figcaption>
    </figure>
  );
}

/** A structural grid with one sound member and one overloaded column. */
function LoadPathPoster() {
  return (
    <Poster>
      <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={270} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 40} x2={480} y2={i * 40} />
        ))}
      </g>

      {/* The member that worked. */}
      <rect x={120} y={44} width={240} height={22} rx="2" fill="#10b981" fillOpacity="0.28" stroke="#10b981" />
      <text x={132} y={59} fontSize={10} fill="#10b981" fontFamily="var(--font-geist-mono), monospace" fontWeight="700">
        AGENT · PASSED
      </text>

      {/* Load leaving the structure sideways. */}
      <path d="M240,66 L240,110" stroke="#cdf94a" strokeWidth="9" strokeOpacity="0.5" />
      <path d="M244,104 L360,132" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />

      {/* The column that buckles. */}
      <path
        d="M120,120 Q240,134 360,120 L360,146 Q240,160 120,146 Z"
        fill="#f43f5e"
        fillOpacity="0.2"
        stroke="#f43f5e"
        strokeWidth="2"
      />
      <text x={132} y={139} fontSize={10} fill="#f43f5e" fontFamily="var(--font-geist-mono), monospace" fontWeight="700">
        LICENSED REVIEW · BUCKLING
      </text>

      <rect x={120} y={196} width={240} height={20} rx="2" fill="none" stroke="#f43f5e" strokeOpacity="0.5" strokeDasharray="4 3" />
      <text x={132} y={210} fontSize={9.5} fill="rgba(255,255,255,0.42)" fontFamily="var(--font-geist-mono), monospace">
        BUSINESS VALUE · NOTHING ARRIVED
      </text>
    </Poster>
  );
}

/** The most profitable configuration, stamped. */
function RefusalPoster() {
  return (
    <Poster>
      <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 40} x2={480} y2={i * 40} />
        ))}
      </g>

      <rect x={72} y={54} width={336} height={72} rx="6" fill="#f43f5e" fillOpacity="0.08" stroke="#f43f5e" strokeOpacity="0.45" />
      <text x={92} y={84} fontSize={26} fill="#f43f5e" fontFamily="var(--font-geist-mono), monospace" fontWeight="700">
        {money(BEST.position)}
      </text>
      <text x={92} y={104} fontSize={9.5} fill="rgba(255,255,255,0.52)">
        the best month this model can produce
      </text>

      <g transform="rotate(-7 300 92)">
        <rect x={236} y={70} width={148} height={30} rx="3" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
        <text x={310} y={90} fontSize={13} fill="#f43f5e" fontFamily="var(--font-geist-mono), monospace" fontWeight="700" textAnchor="middle">
          NOT SIGNABLE
        </text>
      </g>

      <text x={72} y={166} fontSize={10} fill="rgba(255,255,255,0.42)" fontFamily="var(--font-geist-mono), monospace">
        ACCEPTED-OUTPUT QUALITY WAS NEVER MEASURED
      </text>
    </Poster>
  );
}

function Poster({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 480 270"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="480" height="270" fill="#090a0f" />
      {children}
    </svg>
  );
}
