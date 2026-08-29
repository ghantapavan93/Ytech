import type * as ThreeNS from "three";
import type { EngineOutput } from "@/lib/engines/engine";
import { connector, frameSubject, solidWithEdges, standardLights } from "../primitives";
import { DIAGRAM_COLOR } from "../theme";
import type { SceneBuilder } from "../useDiagramScene";

/**
 * Where the saved hour actually goes.
 *
 * The agent frees junior production hours. Those hours do not evaporate,
 * they land somewhere, and the four columns are the four places a firm can
 * absorb them: the fee model decides who keeps the money, the review gate
 * takes on the verification, utilization records whether the capacity was
 * used, and the practice floor is what pays for it in three years.
 *
 * Each column stands at its own baseline, so a full column is a pillar
 * holding where it started and a stub is one that has collapsed. The heights
 * follow the levers live, which is the point of the page underneath.
 */

const STATUS_COLOR = {
  OK: DIAGRAM_COLOR.ok,
  WARN: DIAGRAM_COLOR.warn,
  CRITICAL: DIAGRAM_COLOR.crit,
} as const;

/** Every pillar expressed against its own baseline, so the four compare. */
export function pillarHealth(out: EngineOutput): number[] {
  const baselineRevenue = out.revenue - out.deltaRevenue;
  const clamp = (n: number) => Math.max(0.06, Math.min(1.35, n));

  return [
    clamp(baselineRevenue === 0 ? 1 : out.revenue / baselineRevenue),
    // More licensed review is worse, so the ratio inverts.
    clamp(
      out.peHoursPerWeek === 0
        ? 1
        : out.baselinePeHoursPerWeek / out.peHoursPerWeek,
    ),
    clamp(
      out.baselineJrUtilizationPct === 0
        ? 1
        : out.jrUtilizationPct / out.baselineJrUtilizationPct,
    ),
    clamp(out.learningIndexPct / 100),
  ];
}

export function buildWindTunnelScene(): SceneBuilder<EngineOutput> {
  return ({ THREE, scene, camera, getData, reducedMotion }) => {
    const group = new THREE.Group();
    scene.add(group);

    const disposers: (() => void)[] = [];
    const maxH = 3.2;
    const spacing = 1.9;
    const columnGeo = new THREE.BoxGeometry(1.05, 1, 1.05);
    disposers.push(() => columnGeo.dispose());

    // The change entering the system.
    const sourceGeo = new THREE.BoxGeometry(5.4, 0.3, 1.5);
    const source = solidWithEdges(THREE, sourceGeo, {
      color: DIAGRAM_COLOR.claim,
      opacity: 0.85,
    });
    source.group.position.y = maxH + 0.9;
    group.add(source.group);
    disposers.push(source.dispose, () => sourceGeo.dispose());

    const columns = [0, 1, 2, 3].map((i) => {
      const x = (i - 1.5) * spacing;
      const { group: col, dispose } = solidWithEdges(THREE, columnGeo, {
        color: DIAGRAM_COLOR.ok,
      });
      col.position.set(x, 0, 0);
      group.add(col);
      disposers.push(dispose);

      const link = connector(
        THREE,
        new THREE.Vector3(x, maxH + 0.75, 0),
        new THREE.Vector3(x, maxH + 0.1, 0),
        { color: DIAGRAM_COLOR.claim, opacity: 0.45 },
      );
      group.add(link.line);
      disposers.push(link.dispose);

      return col;
    });

    standardLights(THREE, scene);
    frameSubject(camera, 4.4, { azimuth: 0.62, elevation: 0.3 });

    // Heights ease toward the live values rather than snapping, so moving a
    // lever on the page reads as the pillar responding.
    const current = [1, 1, 1, 1];

    const applyFrame = (t: number) => {
      const out = getData();
      if (!out) return;

      const target = pillarHealth(out);
      const statuses = [
        out.pillars.revenue.status,
        out.pillars.reviewGate.status,
        out.pillars.incentives.status,
        out.pillars.apprenticeship.status,
      ];

      columns.forEach((col, i) => {
        current[i] += (target[i] - current[i]) * 0.08;
        const h = Math.max(0.08, current[i] * maxH);
        col.scale.y = h;
        col.position.y = h / 2;

        const color = STATUS_COLOR[statuses[i]];
        col.children.forEach((child) => {
          const mat = (child as ThreeNS.Mesh).material as
            | ThreeNS.MeshStandardMaterial
            | ThreeNS.LineBasicMaterial;
          if (mat && "color" in mat) mat.color.setHex(color);
        });
      });

      group.rotation.y = reducedMotion ? -0.35 : -0.35 + Math.sin(t * 0.15) * 0.3;
    };

    return {
      update: applyFrame,
      dispose: () => disposers.forEach((d) => d()),
    };
  };
}
