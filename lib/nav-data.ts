/**
 * The command surface.
 *
 * Ten routes is more than a horizontal nav can carry honestly, and the
 * previous header had eight links hiding themselves at different
 * breakpoints, which is the tell of a menu that has outgrown its shape.
 *
 * So the routes live here once, described in a sentence each, and the
 * palette and the header both read from this list.
 */

export type Group = "instrument" | "evidence" | "action";

export interface NavItem {
  href: string;
  name: string;
  /** One line. If it needs two, the page needs a better name. */
  blurb: string;
  group: Group;
  /** Extra words that should match in search but need not be shown. */
  keywords: string[];
  /** Shown in the header for the two or three that earn it. */
  primary?: boolean;
  /**
   * Offered on the path, or reachable only if you already know it exists.
   *
   * The run now carries the whole argument, so everything it absorbed is
   * unlisted rather than deleted: the work is intact and the URLs still
   * resolve, they are simply not put in front of a first-time reader. An
   * explicit search still finds them, which is the difference between
   * unlisted and hidden.
   */
  listed?: boolean;
}

export const GROUP_LABEL: Record<Group, string> = {
  instrument: "Instruments",
  evidence: "Evidence",
  action: "Actions",
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    name: "The run",
    blurb: "One load travelling through a firm that cannot carry it, in eight acts.",
    group: "instrument",
    keywords: [
      "load path",
      "acts",
      "walkthrough",
      "composed",
      "story",
      "reroute",
      "buckle",
      "structure",
    ],
  },
  {
    href: "/triage",
    name: "Which workflow",
    blurb: "Rank the candidates, and refuse to rank the ones nobody has measured.",
    group: "instrument",
    keywords: [
      "triage",
      "diagnosis",
      "which workflow",
      "candidates",
      "before",
      "choose",
      "exposure",
      "analysis",
      "data",
    ],
  },
  {
    href: "/room",
    primary: true,
    name: "Run the room",
    blurb:
      "One screen, five minutes, one decision. The version that runs in front of people.",
    group: "instrument",
    keywords: ["room","present","keynote","live","demo","session","five minutes","executive","full screen"],
  },
  {
    href: "/engineer",
    primary: true,
    name: "Engineer view",
    blurb:
      "The formulas, the decision rules, the full baseline and every invariant the suite holds them to.",
    group: "instrument",
    keywords: ["engineer","formulas","arithmetic","invariants","tests","audit","assumptions","baseline","rules"],
  },
  {
    href: "/sourcing",
    name: "Build it or buy it",
    blurb:
      "A sourcing screen that asks about the size of the market rather than the size of the invoice.",
    group: "instrument",
    keywords: [
      "build",
      "buy",
      "sourcing",
      "vendor",
      "off the shelf",
      "in house",
      "moat",
      "market size",
      "tam",
      "subscription",
      "maintain",
    ],
  },
  {
    href: "/refusal",
    name: "The number it will not sign",
    blurb:
      "Every operating model ranked by the number a dashboard would celebrate. The best three are refused.",
    group: "instrument",
    keywords: [
      "refusal",
      "refuse",
      "gaming",
      "gameable",
      "dashboard",
      "metric",
      "manage the number",
      "stop condition",
      "ranking",
      "liability",
    ],
  },
  {
    href: "/demand",
    name: "What the shortage is worth",
    blurb:
      "Turn down the one condition nobody at the firm decides, and see how much of the result was the labour market.",
    group: "instrument",
    keywords: [
      "demand",
      "backlog",
      "labour shortage",
      "labor shortage",
      "market",
      "normalizes",
      "absorption",
      "redeployment",
      "subsidy",
      "hourly",
      "fixed fee",
    ],
  },
  {
    href: "/engine",
    name: "The wind tunnel",
    blurb: "Run a technically perfect agent through the operating model that has to absorb it.",
    group: "instrument",
    keywords: ["value shift", "home", "economics", "levers", "charter", "pricing", "review gate"],
  },
  {
    href: "/progress",
    listed: false,
    name: "Proof of Progress",
    blurb: "Trace a green pilot down seven links until it stops being able to prove anything.",
    group: "instrument",
    keywords: [
      "activity",
      "evidence chain",
      "measure",
      "roi",
      "pilot",
      "board",
      "scale",
      "bounded experiment",
      "unproven",
    ],
  },
  {
    href: "/proof",
    listed: false,
    name: "The Proof Office",
    blurb: "Decisions expire. Watch an authorization go void while the agent keeps working.",
    group: "instrument",
    keywords: ["expire", "recommission", "conditions", "owner", "living decision", "void"],
  },
  {
    href: "/agent",
    listed: false,
    name: "The working agent",
    blurb: "Type a task. It does the preparation and hands the judgment back.",
    group: "instrument",
    keywords: ["assistant", "task", "plays", "refuse", "routing"],
  },
  {
    href: "/prep",
    listed: false,
    name: "The prep board",
    blurb: "Fifteen minutes before a client call, sourced from published writing.",
    group: "instrument",
    keywords: ["meeting", "firm", "questions", "contradiction", "sheet"],
  },
  {
    href: "/record",
    listed: false,
    name: "Decision records",
    blurb: "Claimed, observed, verified, sustained. Most decisions never leave the first rung.",
    group: "instrument",
    keywords: ["evidence", "ladder", "portfolio", "retire", "twelve"],
  },
  {
    href: "/thesis",
    primary: true,
    name: "The receipts",
    blurb: "Every mechanism mapped to the published claim it operationalizes.",
    group: "evidence",
    keywords: ["sources", "quotes", "citations", "index lens", "room", "weak", "bibliography"],
  },
  {
    href: "/stack",
    listed: false,
    name: "The capability stack",
    blurb: "Ten layers, eight priced offers, and what the whole category cannot say.",
    group: "evidence",
    keywords: ["gap", "competitors", "pricing", "benchmarks", "calculators", "floor", "refusal"],
  },
  {
    href: "/review",
    listed: false,
    name: "The kill review",
    blurb: "The adversarial review that killed four earlier ideas before this one survived.",
    group: "evidence",
    keywords: ["adversarial", "prosecution", "tournament", "fatal", "graveyard"],
  },
  {
    href: "/vision",
    name: "The vision",
    blurb: "First principles and a working compounding simulator. Written as a proposal.",
    group: "evidence",
    keywords: ["future", "moat", "learning rate", "stack", "horizon", "services"],
  },
  {
    href: "/engine?run=1",
    name: "Watch the 90-second run",
    blurb: "The instrument performs the whole argument by itself, live.",
    group: "action",
    keywords: ["demo", "autopilot", "play", "presentation", "show"],
  },
];

/** Simple subsequence match, which is enough and stays predictable. */
export function scoreItem(item: NavItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;

  const name = item.name.toLowerCase();
  const haystack = `${name} ${item.blurb} ${item.keywords.join(" ")}`.toLowerCase();

  if (name.startsWith(q)) return 100;
  if (name.includes(q)) return 80;
  if (item.keywords.some((k) => k.toLowerCase().startsWith(q))) return 60;
  if (haystack.includes(q)) return 40;

  // Fall back to letters in order, so "wndtnl" still finds the wind tunnel.
  let i = 0;
  for (const ch of haystack) {
    if (ch === q[i]) i++;
    if (i === q.length) return 10;
  }
  return 0;
}

export function searchNav(query: string): NavItem[] {
  // With no query, offer the path. With a query, search everything, because
  // someone typing "kill review" knows what they are looking for.
  const pool = query.trim() ? NAV_ITEMS : NAV_ITEMS.filter((i) => i.listed !== false);

  return pool
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item);
}
