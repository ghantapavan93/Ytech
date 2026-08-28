"use client";

import { useEffect, useRef, useState } from "react";

interface TickerProps {
  value: number;
  format: (n: number) => string;
  /** Animation duration in ms. */
  duration?: number;
  className?: string;
}

/**
 * Bloomberg-style rolling number: eases from the previously displayed value
 * to the new target on every change. Tabular numerals prevent jitter.
 */
export function Ticker({ value, format, duration = 700, className = "" }: TickerProps) {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const from = displayRef.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const current = from + (to - from) * easeOutCubic(t);
      displayRef.current = current;
      setDisplay(current);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <span className={`mono-num ${className}`}>{format(display)}</span>;
}
