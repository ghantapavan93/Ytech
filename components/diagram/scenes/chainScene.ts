import type { Layer } from "@/lib/engines/progress-engine";
import { connector, driftRotation, frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * The evidence chain, and where it stops carrying weight.
 *
 * Seven links descending, one per question the claim has to answer. A solid
 * plate is a link that was measured. A plate drawn as an outline is one that
 * never was, and the load line running down the side stops at the first of
 * them, because a claim inherits the weakest evidence beneath it.
 *
 * The gap under that line is the argument: everything below it may well be
 * fine, and none of it can be relied on.
 */

const STATE_COLOR = {
  proven: DIAGRAM_COLOR.ok,
  adverse: DIAGRAM_COLOR.crit,
  unknown: DIAGRAM_COLOR.warn,
} as const;

export function buildChainScene(layers: Layer[]): SceneBuilder {
  return ({ THREE, scene, camera, reducedMotion }) => {
    const group = new THREE.Group();
    scene.add(group);

    const plateH = 0.26;
    const pitch = 0.62;
    const total = layers.length * pitch;
    const topY = total / 2;

    const geometry = new THREE.BoxGeometry(3.5, plateH, 2.2);
    const disposers: (() => void)[] = [() => geometry.dispose()];

    // The chain reads downward, so link one sits at the top.
    layers.forEach((layer, i) => {
      const unmeasured = layer.state === "unknown";
      const { group: plate, dispose } = solidWithEdges(THREE, geometry, {
        color: STATE_COLOR[layer.state],
        ghost: unmeasured,
      });
      plate.position.y = topY - i * pitch - pitch / 2;
      group.add(plate);
      disposers.push(dispose);
    });

    // The load line, stopping where the evidence does.
    const firstBlocking = layers.findIndex((l) => l.state === "unknown");
    const stopIndex = firstBlocking === -1 ? layers.length : firstBlocking;
    const lineTop = topY;
    const lineBottom = topY - stopIndex * pitch;

    const load = connector(
      THREE,
      new THREE.Vector3(-2.15, lineTop, 0),
      new THREE.Vector3(-2.15, lineBottom, 0),
      { color: DIAGRAM_COLOR.zinc300, opacity: 0.85 },
    );
    group.add(load.line);
    disposers.push(load.dispose);

    // What the line would have covered had every link been measured.
    if (stopIndex < layers.length) {
      const unsupported = connector(
        THREE,
        new THREE.Vector3(-2.15, lineBottom, 0),
        new THREE.Vector3(-2.15, topY - total, 0),
        { color: DIAGRAM_COLOR.warn, opacity: 0.22 },
      );
      group.add(unsupported.line);
      disposers.push(unsupported.dispose);
    }

    standardLights(THREE, scene);
    frameSubject(camera, Math.max(total / 2, 2.4), { azimuth: 0.66 });
    group.rotation.y = -0.35;

    return {
      update: reducedMotion ? undefined : driftRotation(group, -0.35),
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
