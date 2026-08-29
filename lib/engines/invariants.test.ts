import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { INVARIANT_COUNT, SUITE, SUITE_FILE_COUNT } from "./invariants";

/**
 * The generated count has to agree with the suite it counts.
 *
 * Two pages state this number out loud. It is generated at build time rather
 * than read at request time, which buys a client-safe import and costs the
 * possibility of the file going stale. This is the payment: a stale generated
 * file fails here rather than misreporting on a page, which is the same rule
 * the rest of the project applies to every other claim.
 */

function walk(dir: string, found: string[] = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry.startsWith(".")) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, found);
    else if (entry.endsWith(".test.ts")) found.push(path);
  }
  return found;
}

describe("the invariant count", () => {
  it("matches a live count of the suite", () => {
    const live = ["lib", "components"]
      .flatMap((d) => walk(d))
      .reduce((n, f) => n + (readFileSync(f, "utf8").match(/(^|\s)it\(/g) ?? []).length, 0);

    expect(INVARIANT_COUNT, "run `npm run count:invariants`").toBe(live);
  });

  it("counts itself, so the guard is inside what it guards", () => {
    expect(SUITE.some((g) => g.file.endsWith("invariants.test.ts"))).toBe(true);
    expect(SUITE_FILE_COUNT).toBe(SUITE.length);
  });

  it("gives every counted file a subject rather than a fallback", () => {
    const vague = SUITE.filter((g) => g.subject === "Behaviour of this module");
    expect(vague.map((g) => g.file)).toEqual([]);
  });
});
