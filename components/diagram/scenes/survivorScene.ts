import { driftRotation, frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * The concept graveyard, and the one thing left standing.
 *
 * Every idea that went into the review is here. The ones that failed are
 * drawn where they fell, flat and grey. The survivor is the only form still
 * upright, and it is deliberately not much taller than the rest, because
 * surviving a review is not the same as being proven right.
 */

export interface Concept {
  label: string;
  survived: boolean;
}

export function buildSurvivorScene(concepts: Concept[]): SceneBuilder {
  return ({ THREE, scene, camera, reducedMotion }) => {
    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BoxGeometry(0.85, 2.1, 0.85);
    const disposers: (() => void)[] = [() => geometry.dispose()];
    const spacing = 1.5;

    concepts.forEach((concept, i) => {
      const x = (i - (concepts.length - 1) / 2) * spacing;
      const { group: form, dispose } = solidWithEdges(THREE, geometry, {
        color: concept.survived ? DIAGRAM_COLOR.ok : DIAGRAM_COLOR.zinc700,
        ghost: !concept.survived,
      });

      if (concept.survived) {
        form.position.set(x, 1.05, 0);
      } else {
        // Fallen: laid on its side where it dropped.
        form.rotation.z = Math.PI / 2;
        form.position.set(x, 0.42, (i % 2 === 0 ? 1 : -1) * 0.35);
      }

      group.add(form);
      disposers.push(dispose);
    });

    standardLights(THREE, scene);
    frameSubject(camera, (concepts.length * spacing) / 2 + 0.6, {
      azimuth: 0.62,
      elevation: 0.3,
    });
    group.rotation.y = -0.3;

    return {
      update: reducedMotion ? undefined : driftRotation(group, -0.3),
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
