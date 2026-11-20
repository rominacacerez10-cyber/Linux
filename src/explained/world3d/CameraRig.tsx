import React, { useLayoutEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { interpolate, random } from 'remotion';

export interface CameraShot {
  from: number;
  to: number;
  posStart: [number, number, number];
  posEnd: [number, number, number];
  lookStart: [number, number, number];
  lookEnd: [number, number, number];
  fovStart?: number;
  fovEnd?: number;
  rollStart?: number;
  rollEnd?: number;
  shake?: number;
}

interface CameraRigProps {
  frame: number;
  shots: CameraShot[];
}

export const CameraRig: React.FC<CameraRigProps> = ({ frame, shots }) => {
  const { camera } = useThree();

  // Encontrar el shot activo o usar el primero/último
  const activeShot = useMemo(() => {
    if (shots.length === 0) {
      return {
        from: 0,
        to: 300,
        posStart: [0, 5, 20] as [number, number, number],
        posEnd: [0, 5, -20] as [number, number, number],
        lookStart: [0, 2, 0] as [number, number, number],
        lookEnd: [0, 2, -40] as [number, number, number],
        fovStart: 45,
        fovEnd: 45,
      };
    }
    const found = shots.find((s) => frame >= s.from && frame <= s.to);
    if (found) return found;
    if (frame < shots[0].from) return shots[0];
    return shots[shots.length - 1];
  }, [shots, frame]);

  const duration = Math.max(1, activeShot.to - activeShot.from);
  const shotProgress = Math.min(
    1,
    Math.max(0, (frame - activeShot.from) / duration)
  );

  // Posición interpolada
  const posX = interpolate(
    shotProgress,
    [0, 1],
    [activeShot.posStart[0], activeShot.posEnd[0]]
  );
  const posY = interpolate(
    shotProgress,
    [0, 1],
    [activeShot.posStart[1], activeShot.posEnd[1]]
  );
  const posZ = interpolate(
    shotProgress,
    [0, 1],
    [activeShot.posStart[2], activeShot.posEnd[2]]
  );

  // Look-at interpolado
  const lookX = interpolate(
    shotProgress,
    [0, 1],
    [activeShot.lookStart[0], activeShot.lookEnd[0]]
  );
  const lookY = interpolate(
    shotProgress,
    [0, 1],
    [activeShot.lookStart[1], activeShot.lookEnd[1]]
  );
  const lookZ = interpolate(
    shotProgress,
    [0, 1],
    [activeShot.lookStart[2], activeShot.lookEnd[2]]
  );

  // FOV
  const fov = interpolate(
    shotProgress,
    [0, 1],
    [activeShot.fovStart ?? 45, activeShot.fovEnd ?? 45]
  );

  // Roll (tilt holandés)
  const roll = interpolate(
    shotProgress,
    [0, 1],
    [activeShot.rollStart ?? 0, activeShot.rollEnd ?? 0]
  );

  // Shake determinista con decaimiento
  const shakeIntensity = activeShot.shake ?? 0;
  const shakeX =
    shakeIntensity > 0
      ? (random(`cam-sx-${frame}`) * 2 - 1) * shakeIntensity
      : 0;
  const shakeY =
    shakeIntensity > 0
      ? (random(`cam-sy-${frame}`) * 2 - 1) * shakeIntensity
      : 0;

  const camPos: [number, number, number] = [
    posX + shakeX,
    posY + shakeY,
    posZ,
  ];
  const camLook: [number, number, number] = [lookX, lookY, lookZ];

  // Matriz de vista y rotación
  const matrix = useMemo(() => {
    const eye = new THREE.Vector3(...camPos);
    const target = new THREE.Vector3(...camLook);
    const up = new THREE.Vector3(
      Math.sin(roll),
      Math.cos(roll),
      0
    ).normalize();
    const m = new THREE.Matrix4();
    m.lookAt(eye, target, up);
    return m;
  }, [camPos, camLook, roll]);

  // Aplicar rotación Euler calculada a partir de la matriz
  const rotation = useMemo(() => {
    const rot = new THREE.Euler(0, 0, 0, 'YXZ');
    rot.setFromRotationMatrix(matrix);
    return [rot.x, rot.y, rot.z] as [number, number, number];
  }, [matrix]);

  useLayoutEffect(() => {
    camera.position.set(camPos[0], camPos[1], camPos[2]);
    camera.rotation.set(rotation[0], rotation[1], rotation[2]);
    if ('fov' in camera && typeof (camera as THREE.PerspectiveCamera).fov === 'number') {
      (camera as THREE.PerspectiveCamera).fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, camPos, rotation, fov, frame]);

  return null;
};
