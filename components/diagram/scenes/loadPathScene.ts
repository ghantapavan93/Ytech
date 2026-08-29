import type * as ThreeNS from "three";
import { frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * The value load path.
 *
 * An engineer reads a load path as force entering a structure, travelling
 * through members, and reaching the foundation only where something carries
 * it. The same drawing works for released capacity, and it is honest in a
 * way a flow chart is not: members have capacity, and a member past its
 * capacity does not simply turn red. It buckles.
 *
 * Two things are deliberately different in kind here, because conflating
 * them would misstate the mechanism:
 *
 *   The released hours split. Redeployed plus unused equals released, and
 *   the widths of those members are that conservation, drawn.
 *
 *   The review load is induced, not a share. Automating the drafting does
 *   not move hours onto the licensed desk from the released pool; it creates
 *   new verification work. So review stands as its own member under its own
 *   load, and it is the one that fails first.
 */

export interface LoadPathData {
  /** Hours the agent frees each month. */
  releasedHours: number;
  /** Of those, hours that reached billable backlog. */
  redeployedHours: number;
  /** Of those, hours that became slack. */
  unusedHours: number;
  /** Licensed review hours per week, and what the desk can sustain. */
  peHoursPerWeek: number;
  peSustainablePerWeek: number;
  /** Share of baseline deep practice retained, 0 to 1. */
  practiceRetained: number;
  /** Does the fee model let the firm keep what it saves? */
  keepsTheSaving: boolean;
}

const SEGMENTS = 7;

export function buildLoadPathScene(): SceneBuilder<LoadPathData> {
  return ({ THREE, scene, camera, getData, reducedMotion }) => {
    const group = new THREE.Group();
    scene.add(group);
    const disposers: (() => void)[] = [];

    const unit = new THREE.BoxGeometry(1, 1, 1);
    disposers.push(() => unit.dispose());

    const member = (color: number, ghost = false) => {
      const { group: g, dispose } = solidWithEdges(THREE, unit, { color, ghost });
      group.add(g);
      disposers.push(dispose);
      return g;
    };

    // Load enters here.
    const source = member(DIAGRAM_COLOR.claim);
    // The split: what is carried, and what runs to ground unused.
    const carried = member(DIAGRAM_COLOR.live);
    const lost = member(DIAGRAM_COLOR.zinc700, true);
    // The fee gate decides whether carried load reaches the foundation.
    const gate = member(DIAGRAM_COLOR.ok);
    // What actually arrives.
    const foundation = member(DIAGRAM_COLOR.ok);
    // The member that fails first, drawn in segments so it can bow.
    const reviewSegments = Array.from({ length: SEGMENTS }, () =>
      member(DIAGRAM_COLOR.ok),
    );
    // The talent pipeline, which loses section rather than bending.
    const practice = member(DIAGRAM_COLOR.ok);

    // Capacity ghosts. A member carrying nothing has no width, and a
    // drawing of four zero-width members reads as debris rather than as a
    // structure that failed. The ghost is the section each member could
    // have carried, so an empty outline says "nothing came through here"
    // where an absent member said nothing at all.
    const carriedGhost = member(DIAGRAM_COLOR.zinc700, true);
    const foundationGhost = member(DIAGRAM_COLOR.zinc700, true);
    const practiceGhost = member(DIAGRAM_COLOR.zinc700, true);
    const reviewGhost = member(DIAGRAM_COLOR.zinc700, true);

    standardLights(THREE, scene);
    frameSubject(camera, 2.95, { azimuth: 0.3, elevation: 0.17 });

    // Widths ease so a lever change reads as load redistributing.
    const eased = { released: 0, carried: 0, lost: 0, arrived: 0, buckle: 0, practice: 1 };
    const W = 3.6;

    const tint = (m: ThreeNS.Object3D, hex: number) =>
      m.children.forEach((child) => {
        const mat = (child as ThreeNS.Mesh).material as
          | ThreeNS.MeshStandardMaterial
          | ThreeNS.LineBasicMaterial;
        if (mat && "color" in mat) mat.color.setHex(hex);
      });

    return {
      update: (t) => {
        const d = getData();
        if (!d) return;

        const scale = Math.max(d.releasedHours, 1);
        const target = {
          released: 1,
          carried: d.redeployedHours / scale,
          lost: d.unusedHours / scale,
          // Load only reaches the foundation if the fee model lets it.
          arrived: d.keepsTheSaving ? d.redeployedHours / scale : 0.04,
          buckle: Math.max(0, d.peHoursPerWeek / d.peSustainablePerWeek - 1),
          practice: d.practiceRetained,
        };
        for (const k of Object.keys(eased) as (keyof typeof eased)[]) {
          eased[k] += (target[k] - eased[k]) * 0.09;
        }

        const w = (v: number) => Math.max(0.05, v * W);

        // The source spans the full width, and the two members below tile
        // that same width between them. Conservation is the drawing: what
        // is carried plus what runs to ground is exactly what was released.
        const carriedW = w(eased.carried);
        const lostW = w(eased.lost);
        const leftEdge = -W / 2;
        const carriedX = leftEdge + carriedW / 2;
        const lostX = leftEdge + carriedW + lostW / 2;

        source.scale.set(W, 0.46, 1.15);
        source.position.set(0, 2.05, 0);

        carriedGhost.scale.set(W, 0.42, 1.15);
        carriedGhost.position.set(0, 1.15, 0);
        carried.scale.set(carriedW, 0.42, 1.15);
        carried.position.set(carriedX, 1.15, 0);

        lost.scale.set(lostW, 0.42, 1.15);
        lost.position.set(lostX, 1.15, 0);

        gate.scale.set(carriedW, 0.4, 1.15);
        gate.position.set(carriedX, 0.25, 0);
        tint(gate, d.keepsTheSaving ? DIAGRAM_COLOR.ok : DIAGRAM_COLOR.crit);

        foundationGhost.scale.set(W, 0.5, 1.3);
        foundationGhost.position.set(0, -0.75, 0);
        foundation.scale.set(w(eased.arrived), 0.5, 1.3);
        foundation.position.set(leftEdge + w(eased.arrived) / 2, -0.75, 0);
        tint(foundation, eased.arrived > 0.1 ? DIAGRAM_COLOR.ok : DIAGRAM_COLOR.crit);

        // The review member: a column in compression. Past its capacity it
        // bows, and the bow is the overload rather than a colour change.
        // Capacity, drawn where it ends. The bowing segments above this
        // line are the load the desk cannot take.
        const capacityFraction = Math.min(
          1,
          d.peSustainablePerWeek / Math.max(d.peHoursPerWeek, 0.01),
        );
        reviewGhost.scale.set(0.58, 2.4 * capacityFraction, 0.58);
        reviewGhost.position.set(2.75, -0.95 + (2.4 * capacityFraction) / 2, 0);

        const buckle = Math.min(eased.buckle, 1.4);
        const hex =
          buckle > 0.45
            ? DIAGRAM_COLOR.crit
            : buckle > 0.05
              ? DIAGRAM_COLOR.warn
              : DIAGRAM_COLOR.ok;
        reviewSegments.forEach((seg, i) => {
          const f = i / (SEGMENTS - 1);
          const bow = Math.sin(f * Math.PI) * buckle * 1.15;
          seg.scale.set(0.5, 0.34, 0.5);
          seg.position.set(2.75 + bow, -0.95 + f * 2.4, bow * 0.28);
          seg.rotation.z = -bow * 0.42;
          tint(seg, hex);
        });

        // The talent pipeline loses section instead of bending.
        practiceGhost.scale.set(0.52, 2.2, 0.52);
        practiceGhost.position.set(-2.75, -0.95 + 1.1, 0);
        const practiceH = Math.max(0.1, eased.practice * 2.2);
        practice.scale.set(0.52, practiceH, 0.52);
        practice.position.set(-2.75, -0.95 + practiceH / 2, 0);
        tint(
          practice,
          eased.practice > 0.5
            ? DIAGRAM_COLOR.ok
            : eased.practice > 0.1
              ? DIAGRAM_COLOR.warn
              : DIAGRAM_COLOR.crit,
        );

        group.rotation.y = reducedMotion ? -0.18 : -0.18 + Math.sin(t * 0.13) * 0.16;
      },
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
