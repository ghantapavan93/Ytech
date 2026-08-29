import { driftRotation, frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * What compounds, and what only accumulates.
 *
 * The grid is engagements across one axis and workflows across the other.
 * Every run deposits one node. A single engagement fills a column and
 * teaches you about one firm; the same count of nodes spread across many
 * firms fills a plane, and only the plane supports a claim about the field.
 *
 * The filled cells are what the library holds. The outlines are the rest of
 * the space, which is the honest size of what is not yet known.
 */

export function buildLatticeScene({
  columns,
  rows,
  filled,
}: {
  columns: number;
  rows: number;
  /** Cells that hold a node, as [column, row] pairs. */
  filled: [number, number][];
}): SceneBuilder {
  return ({ THREE, scene, camera, reducedMotion }) => {
    const group = new THREE.Group();
    scene.add(group);

    const pitch = 0.78;
    const cell = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const disposers: (() => void)[] = [() => cell.dispose()];
    const has = new Set(filled.map(([c, r]) => `${c},${r}`));

    for (let c = 0; c < columns; c++) {
      for (let r = 0; r < rows; r++) {
        const present = has.has(`${c},${r}`);
        const { group: node, dispose } = solidWithEdges(THREE, cell, {
          color: present ? DIAGRAM_COLOR.live : DIAGRAM_COLOR.zinc700,
          ghost: !present,
        });
        node.position.set(
          (c - (columns - 1) / 2) * pitch,
          present ? 0.16 : 0,
          (r - (rows - 1) / 2) * pitch,
        );
        group.add(node);
        disposers.push(dispose);
      }
    }

    standardLights(THREE, scene);
    frameSubject(camera, (Math.max(columns, rows) * pitch) / 2 + 0.6, {
      azimuth: 0.7,
      elevation: 0.55,
    });
    group.rotation.y = -0.3;

    return {
      update: reducedMotion ? undefined : driftRotation(group, -0.3),
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
