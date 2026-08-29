"use client";

import { useEffect, useState } from "react";

/**
 * A way into a long page.
 *
 * The receipts page runs to roughly nineteen thousand words, which is correct
 * for a page whose job is "check my work" and wrong for a page with no map. A
 * reader landing on card one has no idea that the conceded challenges, the
 * room's own words, and the grounding table are further down.
 *
 * So the length stops being a wall and becomes the headline: here is how much
 * there is, here is what each part holds, jump to any of it. It also tracks
 * which section is on screen, so scrolling tells you where you are.
 */

export interface ContentsEntry {
  id: string;
  label: string;
  /** The count that makes the section worth opening. */
  count: string;
}

export function PageContents({
  entries,
  summary,
}: {
  entries: ContentsEntry[];
  summary: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (records) => {
        // The topmost section currently intersecting wins, so the marker
        // does not flicker between two that overlap the viewport.
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [entries]);

  return (
    <nav
      aria-label="Page contents"
      className="print-hidden rounded-2xl border border-line bg-surface-1 p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="micro-label">What is on this page</p>
        <p className="text-[13px] text-ink-4">{summary}</p>
      </div>

      <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((e) => {
          const on = active === e.id;
          return (
            <a
              key={e.id}
              href={`#${e.id}`}
              className={`group flex items-baseline gap-3 px-3.5 py-3 transition-colors ${
                on ? "bg-surface-3" : "bg-surface-1 hover:bg-surface-2"
              }`}
            >
              <span
                className={`mono-num shrink-0 text-[13px] font-semibold tabular-nums ${
                  on ? "text-cyan-300" : "text-ink-4"
                }`}
              >
                {e.count}
              </span>
              <span
                className={`text-[13px] leading-tight ${
                  on ? "text-ink-1" : "text-ink-3 group-hover:text-ink-1"
                }`}
              >
                {e.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
