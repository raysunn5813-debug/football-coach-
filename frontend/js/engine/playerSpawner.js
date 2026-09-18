import * as THREE from 'three';

export function createPlaceholderPlayers(scene, existingPlayerMap) {
  // 1. Remove old player meshes from Three.js scene to avoid 40+ player stacking
  if (existingPlayerMap) {
    existingPlayerMap.forEach(mesh => scene.remove(mesh));
    existingPlayerMap.clear();
  }

  const playerMeshMap = new Map();

  const offenseGeo = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
  const offenseMat = new THREE.MeshBasicMaterial({ color: 0xcb9b51 }); // Gold/Saints

  const defenseGeo = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
  const defenseMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 }); // Blue/Away

  const spawnPlayer = (id, isDefense, x, z) => {
    const mesh = new THREE.Mesh(
      isDefense ? defenseGeo : offenseGeo,
      isDefense ? defenseMat : offenseMat
    );
    mesh.position.set(x, 0.5, z);
    scene.add(mesh);
    playerMeshMap.set(id, mesh);
  };

  // Spread each side's 11 players evenly across the field width (z),
  // with offense set back on one side of the line of scrimmage (x)
  // and defense mirrored on the other, so nothing overlaps before
  // the first real telemetry frame arrives.
  const offenseRoles = ["C", "OG1", "OG2", "OT1", "OT2", "QB", "RB", "TE", "WR1", "WR2", "WR3"];
  offenseRoles.forEach((role, i) => {
    const z = (i - (offenseRoles.length - 1) / 2) * 4.5;
    spawnPlayer(`OFF_${role}`, false, -3, z);
  });

  const defenseRoles = ["DT1", "DT2", "DE1", "DE2", "MLB", "WLB", "SLB", "CB1", "CB2", "FS", "SS"];
  defenseRoles.forEach((role, i) => {
    const z = (i - (defenseRoles.length - 1) / 2) * 4.5;
    spawnPlayer(`DEF_${role}`, true, 3, z);
  });

  return playerMeshMap;
}
