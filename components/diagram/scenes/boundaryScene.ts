import { driftRotation, frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * What the agent does, and what it hands back.
 *
 * The frame is the boundary. Inside it are the jobs the agent will run
 * without asking. Outside are the calls it refuses on every single run, and
 * they are drawn outside rather than dimmed inside, because a refusal is not
 * a weaker version of doing the work. It is a different category.
 *
 * The frame is the product. Anything that quietly moved a red form inside it
 * would be a worse tool wearing the same name.
 */

export function buildBoundaryScene({
  plays,
  refusals,
}: {
  plays: number;
  refusals: number;
}): SceneBuilder {
  return ({ THREE, scene, camera, reducedMotion }) => {
    const group = new THREE.Group();
    scene.add(group);

    const disposers: (() => void)[] = [];
    const halfW = 3.0;
    const halfD = 1.9;

    // The boundary itself.
    const frameGeo = new THREE.BoxGeometry(halfW * 2, 1.5, halfD * 2);
    const frame = solidWithEdges(THREE, frameGeo, {
      color: DIAGRAM_COLOR.live,
      ghost: true,
    });
    group.add(frame.group);
    disposers.push(frame.dispose, () => frameGeo.dispose());

    const playGeo = new THREE.BoxGeometry(0.66, 0.66, 0.66);
    disposers.push(() => playGeo.dispose());

    for (let i = 0; i < plays; i++) {
      const { group: node, dispose } = solidWithEdges(THREE, playGeo, {
        color: DIAGRAM_COLOR.ok,
      });
      const x = plays <= 1 ? 0 : (i / (plays - 1) - 0.5) * (halfW * 1.5);
      node.position.set(x, 0, 0);
      group.add(node);
      disposers.push(dispose);
    }

    // Refusals sit beyond the frame on both sides.
    for (let i = 0; i < refusals; i++) {
      const { group: node, dispose } = solidWithEdges(THREE, playGeo, {
        color: DIAGRAM_COLOR.crit,
      });
      const side = i % 2 === 0 ? 1 : -1;
      const rank = Math.floor(i / 2);
      node.position.set(side * (halfW + 1.1), 0, (rank - 0.5) * 1.15);
      group.add(node);
      disposers.push(dispose);
    }

    standardLights(THREE, scene);
    frameSubject(camera, halfW + 2.0, { azimuth: 0.6, elevation: 0.4 });
    group.rotation.y = -0.3;

    return {
      update: reducedMotion ? undefined : driftRotation(group, -0.3),
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
