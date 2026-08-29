import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ACTS } from "./act-data";

/**
 * Copy that counts the acts has to agree with the acts.
 *
 * This exists because it did not. The landing eyebrow read "six acts" while
 * the act counter one line below it read "1 / 8". Nobody is going to trust
 * the arithmetic further down the page after catching a contradiction that
 * cheap in the first line, so it is worth a test rather than a habit.
 *
 * Written as a substring scan rather than a regex on purpose. The first
 * version of this test built its pattern in a template literal, where \b is
 * a backspace character and \d is the letter d, so it compiled to something
 * that matched nothing and passed against the very bug it was written for.
 */

const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve",
];

function sources(dir: string, found: string[] = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry.startsWith(".")) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) sources(path, found);
    else if (/\.tsx?$/.test(entry) && !entry.includes(".test.")) found.push(path);
  }
  return found;
}

/**
 * Comments are not copy.
 *
 * Several files carry docstrings about the four-act run on the Proof of
 * Progress page, which is a different run and correctly says four. Only
 * text a reader can see has to agree with this one. A second visible run
 * with its own act count would need its own allowance here.
 */
function withoutComments(text: string) {
  return text.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
}

/** Occurrences of `phrase` that start a word, so "someone acts" is not "one acts". */
function standalone(text: string, phrase: string) {
  const hits: number[] = [];
  for (let i = text.indexOf(phrase); i !== -1; i = text.indexOf(phrase, i + 1)) {
    if (i === 0 || !/[a-z0-9]/.test(text[i - 1])) hits.push(i);
  }
  return hits;
}

describe("copy that counts the acts", () => {
  it("never names a count that disagrees with the run", () => {
    const wrong: string[] = [];

    for (const file of ["app", "components", "lib"].flatMap((d) => sources(d))) {
      const text = withoutComments(readFileSync(file, "utf8")).toLowerCase();
      for (const [n, word] of WORDS.entries()) {
        if (n === ACTS.length) continue;
        for (const phrase of [`${n} acts`, `${word} acts`]) {
          if (standalone(text, phrase).length > 0) wrong.push(`${file}: "${phrase}"`);
        }
      }
    }

    expect(wrong, `the run has ${ACTS.length} acts`).toEqual([]);
  });

  it("can actually see a wrong count", () => {
    // The guard above is only worth having if it fails on the real thing.
    const decoy = "One load, one structure, six acts".toLowerCase();
    expect(standalone(decoy, "six acts")).toHaveLength(1);
    expect(standalone(decoy, "eight acts")).toHaveLength(0);
    expect(standalone("someone acts oddly", "one acts")).toHaveLength(0);
  });
});
