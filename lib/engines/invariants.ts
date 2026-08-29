import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * The test suite, counted from the test suite.
 *
 * A page that says "208 invariants" and gets the number from a constant is
 * making exactly the kind of unverifiable claim the rest of this site exists
 * to argue against. This reads the files at build time, so the figure on the
 * engineer page is the figure the suite actually contains, and it moves when
 * the suite does without anybody remembering to update prose.
 */

export interface SuiteGroup {
  /** Path relative to the repository root. */
  file: string;
  /** What this file holds the engine to. */
  subject: string;
  count: number;
}

const SUBJECTS: Record<string, string> = {
  "engine.test.ts": "The causal core: revenue, cost, review load, apprenticeship, liability",
  "demand.test.ts": "Market absorption held apart from the levers a firm controls",
  "configurations.test.ts": "That optimising the headline number walks into a refusal",
  "triage-engine.test.ts": "Workflow selection, and the refusal to rank unmeasured work",
  "sourcing-engine.test.ts": "Build or buy decided on market size, not price",
  "progress-engine.test.ts": "The evidence chain: an unknown link blocks rather than passes",
  "proof-engine.test.ts": "Whether an authorisation still holds",
  "record-engine.test.ts": "Decision records and what voids them",
  "agent-engine.test.ts": "The working agent's own boundaries",
  "prep-engine.test.ts": "Engagement preparation",
  "patterns.test.ts": "Recurring failure shapes",
  "index-lens.test.ts": "The maturity-index reading",
  "model-boundary.test.ts": "That no language model touches any number",
  "act-data.test.ts": "One lever change per act, and no act repeating a lever state",
  "act-count.test.ts": "That copy naming a count agrees with the data",
  "screen-data.test.ts": "That the return threshold and the outcome differ in sign",
  "sourcing-data.test.ts": "That sourcing moves the cost line and nothing else",
};

function walk(dir: string, found: string[] = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry.startsWith(".")) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, found);
    else if (entry.endsWith(".test.ts")) found.push(path);
  }
  return found;
}

function read(): SuiteGroup[] {
  const files = ["lib", "components"].flatMap((d) => {
    try {
      return walk(d);
    } catch {
      return [] as string[];
    }
  });

  return files
    .map((file) => {
      const src = readFileSync(file, "utf8");
      // Counts `it(` at a statement position. Deliberately simple: an
      // over-clever parser here would be a second thing to trust.
      const count = (src.match(/(^|\s)it\(/g) ?? []).length;
      const base = file.split(/[\\/]/).pop() ?? file;
      return {
        file: file.replace(/\\/g, "/"),
        subject: SUBJECTS[base] ?? "Behaviour of this module",
        count,
      };
    })
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count);
}

export const SUITE: SuiteGroup[] = read();

export const INVARIANT_COUNT = SUITE.reduce((n, g) => n + g.count, 0);

export const SUITE_FILE_COUNT = SUITE.length;
