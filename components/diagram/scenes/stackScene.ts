import type { Layer } from "@/lib/content/stack-data";
import { driftRotation, frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * The capability stack, built.
 *
 * Ten layers an advisory practice runs on, stacked the way the page argues
 * they are. Height carries nothing, so the eye is free to read the two
 * things that do: colour is standing, and a plate drawn as an outline is a
 * layer that only exists at a scale this practice does not have.
 */

const STANDING_COLOR = {
  owned: DIAGRAM_COLOR.ok,
  partial: DIAGRAM_COLOR.warn,
  open: DIAGRAM_COLOR.zinc700,
} as const;

export function buildStackScene(layers: Layer[]): SceneBuilder {
  return ({ THREE, scene, camera, reducedMotion }) => {
    const plateH = 0.3;
    const pitch = plateH + 0.24;
    const stackH = layers.length * pitch;

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BoxGeometry(4.4, plateH, 2.6);
    const disposers: (() => void)[] = [() => geometry.dispose()];

    layers.forEach((layer, i) => {
      const { group: plate, dispose } = solidWithEdges(THREE, geometry, {
        color: STANDING_COLOR[layer.standing],
        ghost: layer.needsScale,
      });
      // Layer one at the base, so the drawing reads upward as the list reads down.
      plate.position.y = i * pitch - stackH / 2 + pitch / 2;
      group.add(plate);
      disposers.push(dispose);
    });

    standardLights(THREE, scene);
    frameSubject(camera, Math.max(stackH / 2, 2.6));
    group.rotation.y = -0.4;

    return {
      update: reducedMotion ? undefined : driftRotation(group),
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
