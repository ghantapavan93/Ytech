import { describe, expect, it } from "vitest";
import { NAV_ITEMS, scoreItem, searchNav } from "./nav-data";

describe("the route list", () => {
  it("describes every route in one line", () => {
    for (const item of NAV_ITEMS) {
      expect(item.blurb.length).toBeGreaterThan(30);
      expect(item.blurb.length).toBeLessThan(110);
      expect(item.name.length).toBeLessThan(32);
    }
  });

  it("offers exactly three ways in, and names them", () => {
    /*
     * primary marks the three doors under the run, which are the only
     * navigation a first-time reader is given: the room to watch it in, the
     * evidence to check it against, and the engineer view to argue with it.
     * The count is not the point on its own; a fourth door is how a clear
     * entrance quietly becomes a menu, so the identities are pinned too.
     */
    const doors = NAV_ITEMS.filter((i) => i.primary).map((i) => i.href).sort();
    expect(doors).toEqual(["/engineer", "/room", "/thesis"]);
  });

  it("has no duplicate destinations", () => {
    const hrefs = NAV_ITEMS.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("search finds the obvious things", () => {
  const first = (q: string) => searchNav(q)[0]?.href;

  it("matches a name directly", () => {
    expect(first("prep")).toBe("/prep");
    expect(first("vision")).toBe("/vision");
    expect(first("kill")).toBe("/review");
  });

  it("separates the two pages whose names both start with proof", () => {
    // A prefix hit outranks a substring hit, so the bare word goes to the
    // page actually named for it.
    expect(first("proof")).toBe("/progress");
    expect(first("proof office")).toBe("/proof");
    expect(first("progress")).toBe("/progress");
    expect(first("expire")).toBe("/proof");
  });

  it("matches on what a page is about, not just its title", () => {
    expect(first("expire")).toBe("/proof");
    expect(first("adversarial")).toBe("/review");
    expect(first("autopilot")).toBe("/engine?run=1");
  });

  it("finds the wind tunnel by its old product name", () => {
    expect(first("value shift")).toBe("/engine");
  });

  it("survives a badly typed query", () => {
    expect(searchNav("wndtnl").length).toBeGreaterThan(0);
  });

  it("offers only the path when the query is empty", () => {
    const listed = NAV_ITEMS.filter((i) => i.listed !== false);
    expect(searchNav("")).toHaveLength(listed.length);
    expect(searchNav("   ")).toHaveLength(listed.length);
    expect(listed.length).toBeLessThan(NAV_ITEMS.length);
  });

  it("still finds an unlisted route when someone asks for it by name", () => {
    // Unlisted is not hidden. The work is intact and the URL resolves; it
    // is simply not put in front of a reader who has not asked for it.
    expect(first("kill review")).toBe("/review");
    expect(first("capability stack")).toBe("/stack");
    expect(first("prep board")).toBe("/prep");
    expect(first("working agent")).toBe("/agent");
  });

  it("returns nothing rather than guessing on nonsense", () => {
    expect(searchNav("zzzzqqqq")).toHaveLength(0);
  });

  it("puts a name match first even across groups", () => {
    // "stack" is an evidence page; several instrument pages match weakly.
    // Relevance must win, or grouping quietly reorders the answer.
    expect(first("stack")).toBe("/stack");
    expect(first("receipts")).toBe("/thesis");
    expect(first("kill")).toBe("/review");
  });

  it("ranks a title hit above a body hit", () => {
    const nameHit = scoreItem(NAV_ITEMS.find((i) => i.href === "/stack")!, "stack");
    const bodyHit = scoreItem(NAV_ITEMS.find((i) => i.href === "/vision")!, "stack");
    expect(nameHit).toBeGreaterThan(bodyHit);
  });
});
