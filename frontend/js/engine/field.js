import * as THREE from 'three';

export function createField(scene) {
  // 1. Field Turf Plane (53.3 yards wide x 120 yards long with endzones)
  const fieldGeo = new THREE.PlaneGeometry(53.3, 120);
  const fieldMat = new THREE.MeshBasicMaterial({ color: 0x1b4d2e, side: THREE.DoubleSide });
  const field = new THREE.Mesh(fieldGeo, fieldMat);
  field.rotation.x = -Math.PI / 2; // Lay flat, normal facing up
  field.position.set(0, -0.01, 50); // Center field near origin
  scene.add(field);

  // 2. Yard Line Grid Helper (100 yard field markers)
  const grid = new THREE.GridHelper(120, 24, 0xffffff, 0x3a7d52);
  grid.position.set(0, 0, 50);
  scene.add(grid);

  return { field, grid };
}
