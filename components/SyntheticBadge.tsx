/**
 * The caveat, in the header rather than the footer.
 *
 * Atlas is calibrated against published DOT fee schedules and A&E benchmarks,
 * which makes it plausible. It does not make any figure here predictive for a
 * real firm, and the distance between those two things is exactly where an
 * instrument like this loses people's trust if it is coy about it.
 *
 * A footnote at the bottom of a long page is not visible; it is discoverable.
 * This sits beside the wordmark on every route, so nobody reaches a number
 * without having passed it. Saying so plainly costs nothing and is the reason
 * the rest of the numbers can be taken at face value.
 */
export function SyntheticBadge() {
  return (
    <span
      className="shrink-0 rounded border border-warn/30 bg-warn/[0.07] px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-warn/90"
      title="Illustrative synthetic economics. Replace with firm evidence before any real decision."
    >
      <span className="md:hidden">Synthetic</span>
      <span className="hidden md:inline">Synthetic · not a forecast</span>
    </span>
  );
}
