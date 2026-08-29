import { connector, driftRotation, frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * A prep sheet, assembled from sources rather than written.
 *
 * The plate at the base is the sheet someone carries into a call. Every part
 * above it is one section, and every line running down is the published
 * source that section was built from. Nothing arrives on the sheet without a
 * line above it, which is the whole reason the board can be trusted fifteen
 * minutes before a meeting.
 */

export function buildAssemblyScene({
  sections,
  kept,
}: {
  sections: number;
  /** How many sections the reader has kept rather than set aside. */
  kept: number;
}): SceneBuilder {
  return ({ THREE, scene, camera, reducedMotion }) => {
    const group = new THREE.Group();
    scene.add(group);

    const disposers: (() => void)[] = [];

    const sheetGeo = new THREE.BoxGeometry(5.0, 0.16, 3.2);
    const sheet = solidWithEdges(THREE, sheetGeo, {
      color: DIAGRAM_COLOR.zinc300,
      opacity: 0.7,
    });
    sheet.group.position.y = -1.5;
    group.add(sheet.group);
    disposers.push(sheet.dispose, () => sheetGeo.dispose());

    const partGeo = new THREE.BoxGeometry(0.62, 0.42, 0.62);
    disposers.push(() => partGeo.dispose());

    for (let i = 0; i < sections; i++) {
      const held = i < kept;
      const x = sections <= 1 ? 0 : (i / (sections - 1) - 0.5) * 4.2;
      const y = 0.7;

      const { group: part, dispose } = solidWithEdges(THREE, partGeo, {
        color: held ? DIAGRAM_COLOR.live : DIAGRAM_COLOR.zinc700,
        ghost: !held,
      });
      part.position.set(x, y, 0);
      group.add(part);
      disposers.push(dispose);

      // The source this section came from, and the sheet it lands on.
      const feed = connector(
        THREE,
        new THREE.Vector3(x, y + 0.9, 0),
        new THREE.Vector3(x, y + 0.25, 0),
        { color: DIAGRAM_COLOR.lineStrong, opacity: 0.55 },
      );
      const drop = connector(
        THREE,
        new THREE.Vector3(x, y - 0.25, 0),
        new THREE.Vector3(x, -1.4, 0),
        {
          color: held ? DIAGRAM_COLOR.live : DIAGRAM_COLOR.zinc700,
          opacity: held ? 0.5 : 0.18,
        },
      );
      group.add(feed.line, drop.line);
      disposers.push(feed.dispose, drop.dispose);
    }

    standardLights(THREE, scene);
    frameSubject(camera, 3.4, { azimuth: 0.6, elevation: 0.32 });
    group.rotation.y = -0.3;

    return {
      update: reducedMotion ? undefined : driftRotation(group, -0.3),
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
