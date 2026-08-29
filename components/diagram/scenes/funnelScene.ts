import { driftRotation, frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * The evidence ladder, as the funnel it is.
 *
 * Every decision enters at the top claimed. Fewer are observed, fewer still
 * verified, and almost none are still true a quarter later. Each stage is a
 * plate whose width is the count that survived it, so the narrowing is the
 * shape of the drawing rather than something to be read off numbers.
 *
 * The outline around each plate is the width the stage would have had if
 * nothing was lost, which is where the loss becomes visible.
 */

export interface FunnelStage {
  label: string;
  count: number;
  color: number;
}

export function buildFunnelScene(stages: FunnelStage[]): SceneBuilder {
  return ({ THREE, scene, camera, reducedMotion }) => {
    const group = new THREE.Group();
    scene.add(group);

    const entering = Math.max(...stages.map((s) => s.count), 1);
    const maxW = 4.6;
    const plateH = 0.34;
    const pitch = 0.86;
    const total = stages.length * pitch;

    const disposers: (() => void)[] = [];

    stages.forEach((stage, i) => {
      const y = total / 2 - i * pitch - pitch / 2;
      const width = Math.max(0.35, (stage.count / entering) * maxW);

      const geometry = new THREE.BoxGeometry(width, plateH, width * 0.55);
      const { group: plate, dispose } = solidWithEdges(THREE, geometry, {
        color: stage.color,
      });
      plate.position.y = y;
      group.add(plate);
      disposers.push(dispose, () => geometry.dispose());

      // The width this stage would have had with nothing lost.
      if (i > 0) {
        const fullGeo = new THREE.BoxGeometry(maxW, plateH, maxW * 0.55);
        const ghost = solidWithEdges(THREE, fullGeo, {
          color: DIAGRAM_COLOR.zinc700,
          ghost: true,
        });
        ghost.group.position.y = y;
        group.add(ghost.group);
        disposers.push(ghost.dispose, () => fullGeo.dispose());
      }
    });

    standardLights(THREE, scene);
    frameSubject(camera, Math.max(total / 2, 2.8), { azimuth: 0.6, elevation: 0.36 });
    group.rotation.y = -0.4;

    return {
      update: reducedMotion ? undefined : driftRotation(group, -0.4),
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
