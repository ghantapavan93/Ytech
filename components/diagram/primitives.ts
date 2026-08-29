import type * as ThreeNS from "three";
import { DIAGRAM_COLOR } from "./theme";

/**
 * The parts every diagram is built from.
 *
 * Ten scenes would otherwise repeat the same lighting rig, the same
 * solid-plus-edges construction and the same camera framing ten times. Each
 * scene should only contain the thing it is actually saying.
 */

/** Solid form with a hard outline. Reads as drawn rather than rendered. */
export function solidWithEdges(
  THREE: typeof ThreeNS,
  geometry: ThreeNS.BufferGeometry,
  {
    color,
    opacity = 0.92,
    ghost = false,
  }: { color: number; opacity?: number; ghost?: boolean },
): {
  group: ThreeNS.Group;
  dispose: () => void;
} {
  const group = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.62,
    metalness: 0.08,
    transparent: true,
    // A ghost is something present in the design and absent in fact.
    opacity: ghost ? 0.14 : opacity,
  });
  const mesh = new THREE.Mesh(geometry, material);

  const edgeGeometry = new THREE.EdgesGeometry(geometry);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: ghost ? 0.8 : 0.45,
  });
  const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

  group.add(mesh, edges);

  return {
    group,
    dispose: () => {
      material.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
    },
  };
}

/** A line between two points, for anything that flows or connects. */
export function connector(
  THREE: typeof ThreeNS,
  from: ThreeNS.Vector3,
  to: ThreeNS.Vector3,
  { color, opacity = 0.5 }: { color: number; opacity?: number },
) {
  const geometry = new THREE.BufferGeometry().setFromPoints([from, to]);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });
  const line = new THREE.Line(geometry, material);
  return {
    line,
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}

/** The standard three-light rig: flat enough to read, lit enough to have form. */
export function standardLights(THREE: typeof ThreeNS, scene: ThreeNS.Scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 1.3);
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(5, 8, 6);
  const rim = new THREE.DirectionalLight(DIAGRAM_COLOR.live, 0.65);
  rim.position.set(-6, -2, -4);
  scene.add(ambient, key, rim);
}

/**
 * Put the camera where the whole subject fits.
 *
 * `radius` is the half-extent of what has to be visible. The padding is
 * generous on purpose: a diagram clipped by its own frame looks like a bug,
 * and the first version of the stack scene clipped its top plate.
 */
export function frameSubject(
  camera: ThreeNS.PerspectiveCamera,
  radius: number,
  { azimuth = 0.72, elevation = 0.34 }: { azimuth?: number; elevation?: number } = {},
) {
  const fov = (camera.fov * Math.PI) / 180;
  const distance = (radius * 1.5) / Math.tan(fov / 2);

  camera.position.set(
    distance * Math.cos(elevation) * Math.sin(azimuth),
    distance * Math.sin(elevation),
    distance * Math.cos(elevation) * Math.cos(azimuth),
  );
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}

/** The slow drift that tells the eye a scene is solid. */
export function driftRotation(group: ThreeNS.Object3D, base = -0.4) {
  return (t: number) => {
    group.rotation.y = base + Math.sin(t * 0.17) * 0.38;
  };
}
