import { connector, driftRotation, frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * Published claim on one plane, working mechanism on the other.
 *
 * Nothing in the instrument is a new theory. Every mechanism operationalises
 * something already written down, and the line between the two planes is
 * that debt made visible. A mechanism with no line above it would be an
 * invention, and there are none.
 */

export function buildBipartiteScene({
  pairs,
}: {
  /** One entry per claim, naming the mechanism index it drives. */
  pairs: { claim: number; mechanism: number }[];
}): SceneBuilder {
  return ({ THREE, scene, camera, reducedMotion }) => {
    const group = new THREE.Group();
    scene.add(group);

    const claims = Math.max(...pairs.map((p) => p.claim)) + 1;
    const mechanisms = Math.max(...pairs.map((p) => p.mechanism)) + 1;
    const spread = 6.4;
    const gap = 2.4;

    const node = new THREE.BoxGeometry(0.34, 0.34, 0.34);
    const disposers: (() => void)[] = [() => node.dispose()];

    const xOf = (i: number, count: number) =>
      count <= 1 ? 0 : (i / (count - 1) - 0.5) * spread;

    for (let i = 0; i < claims; i++) {
      const { group: n, dispose } = solidWithEdges(THREE, node, {
        color: DIAGRAM_COLOR.live,
      });
      n.position.set(xOf(i, claims), gap / 2, 0);
      group.add(n);
      disposers.push(dispose);
    }

    for (let i = 0; i < mechanisms; i++) {
      const { group: n, dispose } = solidWithEdges(THREE, node, {
        color: DIAGRAM_COLOR.claim,
      });
      n.position.set(xOf(i, mechanisms), -gap / 2, 0);
      group.add(n);
      disposers.push(dispose);
    }

    pairs.forEach((p) => {
      const link = connector(
        THREE,
        new THREE.Vector3(xOf(p.claim, claims), gap / 2, 0),
        new THREE.Vector3(xOf(p.mechanism, mechanisms), -gap / 2, 0),
        { color: DIAGRAM_COLOR.lineStrong, opacity: 0.5 },
      );
      group.add(link.line);
      disposers.push(link.dispose);
    });

    standardLights(THREE, scene);
    frameSubject(camera, 3.9, { azimuth: 0.42, elevation: 0.24 });
    group.rotation.y = -0.22;

    return {
      update: reducedMotion ? undefined : driftRotation(group, -0.22),
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
