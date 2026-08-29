import { connector, driftRotation, frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * Two facts that most systems report as one.
 *
 * Time runs along one axis and the two tracks run parallel down the other:
 * the agent in front, the authorization behind. The agent's track holds its
 * height across all three readings. The authorization's drops away at week
 * six and, when every broken condition is repaired, comes back part of the
 * way and no further.
 *
 * The height it never regains is the one-way door. Evidence gathered under
 * conditions that no longer hold cannot be spent twice.
 */

export interface DivergenceNode {
  /** 0 to 1. How much of the original standing this reading holds. */
  level: number;
  tone: "ok" | "warn" | "crit" | "idle";
}

const TONE_COLOR = {
  ok: DIAGRAM_COLOR.ok,
  warn: DIAGRAM_COLOR.warn,
  crit: DIAGRAM_COLOR.crit,
  idle: DIAGRAM_COLOR.zinc700,
} as const;

export function buildDivergenceScene(
  agent: DivergenceNode[],
  authorization: DivergenceNode[],
): SceneBuilder {
  return ({ THREE, scene, camera, reducedMotion }) => {
    const group = new THREE.Group();
    scene.add(group);

    const spacing = 2.3;
    const maxH = 2.4;
    const geometry = new THREE.BoxGeometry(0.9, 1, 0.9);
    const disposers: (() => void)[] = [() => geometry.dispose()];

    const drawTrack = (nodes: DivergenceNode[], z: number) => {
      nodes.forEach((node, i) => {
        const x = (i - (nodes.length - 1) / 2) * spacing;
        const h = Math.max(0.12, node.level * maxH);

        const { group: block, dispose } = solidWithEdges(THREE, geometry, {
          color: TONE_COLOR[node.tone],
          ghost: node.tone === "idle",
        });
        block.scale.y = h;
        block.position.set(x, h / 2, z);
        group.add(block);
        disposers.push(dispose);

        // The track itself, joining this reading to the next.
        if (i < nodes.length - 1) {
          const next = nodes[i + 1];
          const nextH = Math.max(0.12, next.level * maxH);
          const link = connector(
            THREE,
            new THREE.Vector3(x, h, z),
            new THREE.Vector3(x + spacing, nextH, z),
            { color: TONE_COLOR[node.tone], opacity: 0.6 },
          );
          group.add(link.line);
          disposers.push(link.dispose);
        }
      });
    };

    drawTrack(agent, 1.4);
    drawTrack(authorization, -1.4);

    standardLights(THREE, scene);
    frameSubject(camera, 4.0, { azimuth: 0.78, elevation: 0.32 });
    group.rotation.y = -0.32;

    return {
      update: reducedMotion ? undefined : driftRotation(group, -0.32),
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
