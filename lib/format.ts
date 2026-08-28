/** Formatting + hashing helpers. Pure, deterministic, no locale surprises. */

export function fmtMoney(n: number, opts: { sign?: boolean } = {}): string {
  const sign = n < 0 ? "-" : opts.sign ? "+" : "";
  const abs = Math.abs(Math.round(n));
  return `${sign}$${abs.toLocaleString("en-US")}`;
}

export function fmtMoneyK(n: number, opts: { sign?: boolean } = {}): string {
  const sign = n < 0 ? "-" : opts.sign ? "+" : "";
  const abs = Math.abs(n);
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}k`;
  return `${sign}$${Math.round(abs)}`;
}

export function fmtPct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function fmtHours(n: number, digits = 1): string {
  const rounded = n.toFixed(digits);
  return `${rounded.replace(/\.0$/, "")}h`;
}

/**
 * FNV-1a hash of the full input state, rendered as an 8-char hex tag.
 * Printed on the experiment charter so any recipient can confirm two
 * charters were compiled from identical assumptions.
 */
export function assumptionHash(state: unknown): string {
  const json = JSON.stringify(state);
  let hash = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    hash ^= json.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").toUpperCase();
}
