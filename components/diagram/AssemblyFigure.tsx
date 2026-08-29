"use client";

import { D, MONO, T, draw, motion, reveal, useReducedMotion } from "./svg-kit";

/**
 * One operational truth: nothing reaches the sheet without a source above it.
 *
 * Six sections, each with the published source it was built from drawn as a
 * line running down into the sheet. A section set aside is drawn hollow and
 * its line goes faint, because keeping a line and dropping one are both
 * decisions the reader makes and the sheet records which.
 */

const LEFT = 26;
const SHEET_Y = 132;
const PART_Y = 58;

export function AssemblyFigure({
  sections,
  kept,
}: {
  /** Section names, in the order they appear on the sheet. */
  sections: string[];
  /** How many of them are still on the sheet. */
  kept: number;
}) {
  const reduced = useReducedMotion();
  const slot = (440 - LEFT * 2) / sections.length;

  return (
    <svg
      viewBox="0 0 440 178"
      className="h-auto w-full"
      role="img"
      aria-label={`${sections.length} sections, ${kept} kept on the sheet, each built from a published source.`}
    >
      <text x={LEFT} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO}>
        PUBLISHED SOURCES
      </text>
      <text x={414} y={12} fontSize={T.label} fill={D.label} fontFamily={MONO} textAnchor="end">
        {kept} OF {sections.length} KEPT
      </text>

      {sections.map((name, i) => {
        const x = LEFT + i * slot + slot / 2;
        const held = i < kept;
        const tone = held ? D.live : D.dim;
        return (
          <motion.g key={name} {...reveal(0.06 + i * 0.07, reduced)}>
            {/* the source feeding this section */}
            <motion.line
              x1={x}
              x2={x}
              y1={22}
              y2={PART_Y - 4}
              stroke={D.trackLine}
              strokeWidth="0.75"
              {...draw(0.1 + i * 0.06, reduced)}
            />
            <rect
              x={x - slot / 2 + 5}
              y={PART_Y}
              width={slot - 10}
              height={22}
              rx="2"
              fill={tone}
              fillOpacity={held ? 0.16 : 0.03}
              stroke={tone}
              strokeOpacity={held ? 0.7 : 0.4}
              strokeWidth="0.75"
              strokeDasharray={held ? undefined : "4 3"}
            />
            <text x={x} y={PART_Y + 14} fontSize={T.micro} fill={held ? D.value : D.label} textAnchor="middle">
              {name}
            </text>
            {/* where it lands, or does not */}
            <line
              x1={x}
              x2={x}
              y1={PART_Y + 26}
              y2={SHEET_Y - 2}
              stroke={tone}
              strokeOpacity={held ? 0.55 : 0.16}
              strokeWidth="1"
              strokeDasharray={held ? undefined : "3 4"}
            />
          </motion.g>
        );
      })}

      <motion.g {...reveal(0.6, reduced)}>
        <rect
          x={LEFT}
          y={SHEET_Y}
          width={440 - LEFT * 2}
          height={28}
          rx="2"
          fill="rgba(255,255,255,0.9)"
          fillOpacity="0.9"
        />
        <text x={LEFT + 10} y={SHEET_Y + 18} fontSize={T.body} fill="#1c1c1e" fontWeight="600">
          The one-page prep sheet
        </text>
        <text x={414} y={SHEET_Y + 18} fontSize={T.micro} fill="#55555c" textAnchor="end" fontFamily={MONO}>
          UNSOURCED LINES: 0
        </text>
      </motion.g>

      <text x={LEFT} y={174} fontSize={T.micro} fill={D.label}>
        built from what YegaTech has published, not from a claim to hold anyone&rsquo;s method
      </text>
    </svg>
  );
}
