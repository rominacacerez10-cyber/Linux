import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { random } from 'remotion';

interface PalmsProps {
  offsetZ?: number;
  count?: number;
  spacing?: number;
}

export const Palms: React.FC<PalmsProps> = ({
  offsetZ = 0,
  count = 18,
  spacing = 18,
}) => {
  const trunkMeshRef = useRef<THREE.InstancedMesh>(null);
  const crownMeshRef = useRef<THREE.InstancedMesh>(null);

  const totalInstances = count * 2; // izquierda y derecha de la avenida

  // Geometrías y materiales compartidos
  const trunkGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.18, 0.32, 7, 5),
    []
  );
  const trunkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2a173b',
        roughness: 0.85,
        metalness: 0.1,
        flatShading: true,
      }),
    []
  );

  const crownGeometry = useMemo(
    () => new THREE.ConeGeometry(2.4, 1.8, 6),
    []
  );
  const crownMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#00e5ff',
        emissive: '#003344',
        emissiveIntensity: 0.45,
        roughness: 0.42,
        metalness: 0.25,
        flatShading: true,
      }),
    []
  );

  const totalRun = count * spacing;

  useEffect(() => {
    if (!trunkMeshRef.current || !crownMeshRef.current) return;

    const dummy = new THREE.Object3D();
    let idx = 0;

    for (let i = 0; i < count; i++) {
      // Posición cíclica en Z con offset
      const baseZ = ((i * spacing + offsetZ) % totalRun) - totalRun / 2;

      // Palmera izquierda y derecha
      const sides = [-9.5, 9.5];

      for (const sideX of sides) {
        const leanAngle =
          sideX > 0
            ? 0.12 + random(`palm-lean-${i}-r`) * 0.08
            : -0.12 - random(`palm-lean-${i}-l`) * 0.08;
        const scaleY = 0.85 + random(`palm-h-${i}-${sideX}`) * 0.3;

        // Tronco
        dummy.position.set(sideX, (7 * scaleY) / 2, baseZ);
        dummy.rotation.set(0, 0, leanAngle);
        dummy.scale.set(1, scaleY, 1);
        dummy.updateMatrix();
        trunkMeshRef.current.setMatrixAt(idx, dummy.matrix);

        // Copa de la palmera
        dummy.position.set(
          sideX + Math.sin(-leanAngle) * 6.5 * scaleY,
          6.8 * scaleY,
          baseZ
        );
        dummy.rotation.set(Math.PI, 0, leanAngle * 0.5);
        dummy.scale.set(1.2, 0.9, 1.2);
        dummy.updateMatrix();
        crownMeshRef.current.setMatrixAt(idx, dummy.matrix);

        idx++;
      }
    }

    trunkMeshRef.current.instanceMatrix.needsUpdate = true;
    crownMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, offsetZ, spacing, totalRun]);

  return (
    <group>
      <instancedMesh
        ref={trunkMeshRef}
        args={[trunkGeometry, trunkMaterial, totalInstances]}
      />
      <instancedMesh
        ref={crownMeshRef}
        args={[crownGeometry, crownMaterial, totalInstances]}
      />
    </group>
  );
};
