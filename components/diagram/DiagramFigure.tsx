"use client";

import { useDiagramScene, type SceneBuilder } from "./useDiagramScene";

/**
 * The frame every diagram sits in.
 *
 * A canvas is opaque: a screen reader sees nothing in it, a printer prints a
 * blank rectangle, and a machine without WebGL gets an empty box. So the
 * scene is treated as the presentation of something, never as the something
 * itself. Each diagram states its reading in text, that text is what
 * assistive technology and paper receive, and the canvas is marked decorative
 * on top of it.
 *
 * The rule this enforces: if a diagram is the only place a fact appears, the
 * fact is not on the page.
 */

export interface DiagramFigureProps<D = unknown> {
  /** Shown under the frame. Says what the diagram is. */
  caption: string;
  /**
   * The reading, in words. Reaches screen readers and print, and stands in
   * when WebGL is unavailable. Write it so it survives alone.
   */
  description: string;
  /** Key values the diagram encodes, so the numbers are never trapped in pixels. */
  readout?: { label: string; value: string }[];
  build: SceneBuilder<D>;
  /** Live values for scenes whose subject changes while it is on screen. */
  data?: D;
  height?: number;
  className?: string;
}

export function DiagramFigure<D = unknown>({
  caption,
  description,
  readout,
  build,
  data,
  height = 320,
  className = "",
}: DiagramFigureProps<D>) {
  const { mountRef, status } = useDiagramScene<D>(build, { height, data });

  return (
    <figure className={`card overflow-hidden ${className}`}>
      <div className="relative">
        {/* The scene. Decorative by construction, because everything it
            shows is also written below. */}
        <div
          ref={mountRef}
          aria-hidden
          className="diagram-canvas w-full"
          style={{ height }}
        />

        {status !== "ready" && (
          <div
            className="absolute inset-0 flex items-center justify-center px-6"
            aria-hidden
          >
            <p className="text-center text-[12px] text-zinc-600">
              {status === "unsupported"
                ? "This view needs WebGL. The reading is written below."
                : "Rendering the diagram"}
            </p>
          </div>
        )}
      </div>

      {readout && readout.length > 0 && (
        <dl className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
          {readout.map((r) => (
            <div key={r.label} className="bg-surface-1 px-3.5 py-2.5">
              <dt className="text-[10px] uppercase tracking-[0.13em] text-zinc-600">
                {r.label}
              </dt>
              <dd className="mono-num mt-1 text-[14px] font-semibold text-zinc-200">
                {r.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <figcaption className="border-t border-line px-5 py-4">
        <p className="text-[12.5px] font-medium text-zinc-300">{caption}</p>
        {/* Visible on paper and to screen readers; the sighted reader has
            the scene above saying the same thing. */}
        <p className="diagram-reading mt-1.5 text-[12.5px] leading-relaxed text-zinc-500">
          {description}
        </p>
      </figcaption>
    </figure>
  );
}
