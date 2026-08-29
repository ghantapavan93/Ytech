"use client";

import { useEffect, useRef, useState } from "react";
import type * as ThreeNS from "three";

/**
 * The shared runtime behind every diagram on the site.
 *
 * Three.js is large, so none of it belongs in the bundle a reader downloads
 * to read a page. It is imported on demand, and only once the diagram is
 * actually approaching the viewport, so a page that is never scrolled that
 * far never pays for it.
 *
 * The other half of the job is giving the memory back. A WebGL context holds
 * geometries, materials and textures that garbage collection will not
 * reclaim on its own, and ten scenes across ten routes is exactly the
 * situation where that becomes a leak. Everything created here is tracked
 * and disposed on unmount.
 */

export interface SceneContext<D = unknown> {
  THREE: typeof ThreeNS;
  scene: ThreeNS.Scene;
  camera: ThreeNS.PerspectiveCamera;
  width: number;
  height: number;
  /** True when the reader has asked for less movement. Build a still frame. */
  reducedMotion: boolean;
  /**
   * The latest data, read fresh each frame.
   *
   * A scene is built once, so anything that changes while it is on screen
   * has to be pulled rather than passed. The wind tunnel needs this: its
   * levers move under the diagram and the geometry has to follow.
   */
  getData: () => D;
}

export interface SceneHandle {
  /** Called per frame with elapsed seconds. Omit for a static scene. */
  update?: (elapsed: number) => void;
  /** Anything the builder allocated that the walker cannot find. */
  dispose?: () => void;
}

export type SceneBuilder<D = unknown> = (ctx: SceneContext<D>) => SceneHandle | void;

export type DiagramStatus = "idle" | "loading" | "ready" | "unsupported";

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

export function useDiagramScene<D = unknown>(
  build: SceneBuilder<D>,
  { height = 320, data }: { height?: number; data?: D } = {},
) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<DiagramStatus>("idle");

  // The builder is captured once per mount on purpose. A scene is built from
  // a snapshot of its data; rebuilding it mid-animation would restart the
  // whole thing every time a parent re-rendered.
  const buildRef = useRef(build);

  // Live values the scene pulls each frame. Updated on every render so a
  // scene built once still sees current numbers.
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (!webglAvailable()) {
      setStatus("unsupported");
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    const startWhenVisible = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        startWhenVisible.disconnect();
        void boot();
      },
      { rootMargin: "200px" },
    );
    startWhenVisible.observe(mount);

    async function boot() {
      if (cancelled) return;
      setStatus("loading");

      const THREE = await import("three");
      if (cancelled || !mount) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const width = mount.clientWidth || 640;
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = `${height}px`;
      renderer.domElement.style.display = "block";
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 200);

      const handle =
        buildRef.current({
          THREE,
          scene,
          camera,
          width,
          height,
          reducedMotion,
          getData: () => dataRef.current as D,
        }) ?? {};

      let raf = 0;
      const clock = new THREE.Clock();

      const renderFrame = () => {
        renderer.render(scene, camera);
      };

      if (handle.update && !reducedMotion) {
        const loop = () => {
          handle.update?.(clock.getElapsedTime());
          renderFrame();
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      } else {
        // Still frame. A reader who asked for less movement still gets the
        // diagram, just not the drift.
        handle.update?.(0);
        renderFrame();
      }

      const resize = new ResizeObserver(() => {
        const w = mount!.clientWidth || width;
        renderer.setSize(w, height, false);
        camera.aspect = w / height;
        camera.updateProjectionMatrix();
        renderFrame();
      });
      resize.observe(mount!);

      setStatus("ready");

      cleanup = () => {
        cancelAnimationFrame(raf);
        resize.disconnect();
        handle.dispose?.();

        // Walk what is left and hand every buffer back.
        scene.traverse((obj) => {
          const mesh = obj as Partial<ThreeNS.Mesh>;
          mesh.geometry?.dispose?.();
          const material = mesh.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material?.dispose?.();
        });
        scene.clear();

        renderer.dispose();
        renderer.forceContextLoss();
        if (renderer.domElement.parentNode === mount) {
          mount!.removeChild(renderer.domElement);
        }
      };
    }

    return () => {
      cancelled = true;
      startWhenVisible.disconnect();
      cleanup?.();
    };
  }, [height]);

  return { mountRef, status };
}
