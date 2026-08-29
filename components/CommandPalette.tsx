"use client";

import {
  GROUP_LABEL,
  NAV_ITEMS,
  searchNav,
  type Group,
  type NavItem,
} from "@/lib/nav-data";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Command palette, opened with the usual key.
 *
 * The routes outgrew a horizontal nav, and the honest fix is a surface
 * that can hold all of them without shrinking any of them. Keyboard first,
 * because the people this is for are on a laptop between meetings.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchNav(query), [query]);

  // Group, but never let grouping outrank relevance. With a query, the
  // group holding the best match comes first, otherwise searching for a
  // page by name can surface a different page above it purely because of
  // which bucket it sits in. With no query, use the canonical order.
  const grouped = useMemo(() => {
    const canonical: Group[] = ["instrument", "evidence", "action"];
    const groups = canonical
      .map((g) => ({ group: g, items: results.filter((r) => r.group === g) }))
      .filter((g) => g.items.length > 0);

    if (!query.trim()) return groups;

    return groups.sort(
      (a, b) => results.indexOf(a.items[0]) - results.indexOf(b.items[0]),
    );
  }, [results, query]);

  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  const go = useCallback(
    (item: NavItem) => {
      setOpen(false);
      setQuery("");
      router.push(item.href);
    },
    [router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
      }
      if (e.key === "Enter" && flat[active]) {
        e.preventDefault();
        go(flat[active]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, active, go]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (open) {
      // One frame so the input exists before we reach for it.
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let runningIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="print-hidden fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-surface-1 shadow-[0_28px_90px_-20px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={15} className="shrink-0 text-ink-4" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to an instrument, or search what it does"
                className="command-input w-full bg-transparent py-4 text-[15px] text-ink-1 outline-none placeholder:text-ink-4"
              />
              <kbd className="mono-num shrink-0 rounded border border-line px-1.5 py-0.5 text-[10px] text-ink-4">
                esc
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
              {grouped.length === 0 && (
                <p className="px-3 py-8 text-center text-[13px] text-ink-4">
                  Nothing matches that. There are {NAV_ITEMS.length} places here,
                  and it will not invent an extra one.
                </p>
              )}
              {grouped.map((g) => (
                <div key={g.group} className="mb-1">
                  <p className="micro-label px-3 pb-1.5 pt-3">
                    {GROUP_LABEL[g.group]}
                  </p>
                  {g.items.map((item) => {
                    runningIndex += 1;
                    const i = runningIndex;
                    const isActive = i === active;
                    return (
                      <button
                        key={item.href}
                        data-index={i}
                        onClick={() => go(item)}
                        onMouseMove={() => setActive(i)}
                        className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                          isActive ? "bg-white/[0.10]" : ""
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[15px] font-medium ${
                              isActive ? "text-ink-1" : "text-ink-2"
                            }`}
                          >
                            {item.name}
                          </p>
                          <p className="mt-0.5 truncate text-[13px] text-ink-4">
                            {item.blurb}
                          </p>
                        </div>
                        {isActive && (
                          <CornerDownLeft
                            size={13}
                            className="mt-1 shrink-0 text-ink-4"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
              <span className="text-[11.5px] text-ink-4">
                {flat.length} {flat.length === 1 ? "place" : "places"}
              </span>
              <span className="flex items-center gap-3 text-[11.5px] text-ink-4">
                <span className="flex items-center gap-1">
                  <kbd className="mono-num rounded border border-line px-1 text-[10px]">
                    ↑
                  </kbd>
                  <kbd className="mono-num rounded border border-line px-1 text-[10px]">
                    ↓
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="mono-num rounded border border-line px-1 text-[10px]">
                    ↵
                  </kbd>
                  open
                </span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** The affordance that tells people the palette exists. */
export function CommandHint() {
  const [mac, setMac] = useState(true);
  useEffect(() => {
    setMac(/mac|iphone|ipad/i.test(navigator.userAgent));
  }, []);

  const open = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
    );
  };

  return (
    <button
      onClick={open}
      title="Search everything"
      className="group inline-flex items-center gap-2 rounded-lg border border-line px-2.5 py-1.5 transition-colors hover:border-line-strong"
    >
      <Search size={12} className="text-ink-4 transition-colors group-hover:text-ink-3" />
      <span className="hidden text-[11.5px] text-ink-4 transition-colors group-hover:text-ink-2 sm:inline">
        Search
      </span>
      <kbd className="mono-num hidden rounded border border-line px-1 text-[10px] text-ink-4 sm:inline">
        {mac ? "⌘" : "Ctrl"}K
      </kbd>
    </button>
  );
}
