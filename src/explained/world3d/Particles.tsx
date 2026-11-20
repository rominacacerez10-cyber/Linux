import React, { useMemo } from 'react';
import * as THREE from 'three';
import { interpolate, random } from 'remotion';

export type ParticleKind = 'smoke' | 'sparks' | 'confetti' | 'debris';

export interface ParticlesProps {
  frame: number;
  count?: number;
  kind?: ParticleKind;
  origin?: [number, number, number];
  spread?: [number, number, number];
  seed?: string;
  speed?: number;
  lifeTime?: number;
}

export const Particles: React.FC<ParticlesProps> = ({
  frame,
  count = 24,
  kind = 'smoke',
  origin = [0, 0, 0],
  spread = [2, 1, 2],
  seed = 'part',
  speed = 1.0,
  lifeTime = 30,
}) => {
  // Materiales según tipo
  const smokeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff2e93',
        transparent: true,
        opacity: 0.45,
      }),
    []
  );

  const sparkMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffdd00',
      }),
    []
  );

  const debrisMat = useMemo(
    () =>
      new THREE.MeshLambertMaterial({
        color: '#ff7a3d',
        flatShading: true,
      }),
    []
  );

  // Paleta de confeti neón
  const confettiColors = useMemo(
    () => ['#ff2e93', '#00e5ff', '#ff7a3d', '#ffffff', '#b300ff'],
    []
  );

  const confettiMaterials = useMemo(
    () =>
      confettiColors.map(
        (c) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })
      ),
    [confettiColors]
  );

  // Geometrías
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.3, 6, 6), []);
  const sparkGeo = useMemo(() => new THREE.BoxGeometry(0.08, 0.08, 0.25), []);
  const confettiGeo = useMemo(() => new THREE.PlaneGeometry(0.18, 0.18), []);
  const debrisGeo = useMemo(() => new THREE.BoxGeometry(0.2, 0.2, 0.2), []);

  const particlesData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const pSeed = `${seed}-${i}`;
      const dx = (random(`${pSeed}-dx`) * 2 - 1) * spread[0];
      const dy = (random(`${pSeed}-dy`) + 0.3) * spread[1];
      const dz = (random(`${pSeed}-dz`) * 2 - 1) * spread[2];
      const birthOffset = Math.floor(random(`${pSeed}-offset`) * lifeTime);
      const scaleBase = 0.5 + random(`${pSeed}-sc`) * 0.8;
      const rotSpeedX = random(`${pSeed}-rx`) * 4;
      const rotSpeedY = random(`${pSeed}-ry`) * 4;
      const colorIdx = Math.floor(random(`${pSeed}-ci`) * confettiColors.length);

      return {
        dx,
        dy,
        dz,
        birthOffset,
        scaleBase,
        rotSpeedX,
        rotSpeedY,
        colorIdx,
      };
    });
  }, [count, spread, seed, lifeTime, confettiColors.length]);

  return (
    <group position={origin}>
      {particlesData.map((p, idx) => {
        // Ciclo de vida determinista
        const age = (frame * speed + p.birthOffset) % lifeTime;
        const progress = age / lifeTime; // 0 -> 1

        let posX = p.dx * progress;
        let posY = 0;
        let posZ = p.dz * progress;
        let scale = p.scaleBase;
        let rotX = p.rotSpeedX * age;
        let rotY = p.rotSpeedY * age;

        if (kind === 'smoke') {
          // El humo sube, se expande y se desacelera
          posY = p.dy * Math.pow(progress, 0.7);
          scale = interpolate(progress, [0, 0.3, 1], [0.2, p.scaleBase * 1.5, p.scaleBase * 2.8]);
        } else if (kind === 'sparks') {
          // Chispas parabólicas rápidas
          posY = p.dy * progress * 2 - 4.9 * Math.pow(progress, 2);
          scale = interpolate(progress, [0, 0.8, 1], [p.scaleBase, p.scaleBase * 0.7, 0]);
        } else if (kind === 'confetti') {
          // Confeti flotando cayendo en espiral
          posY = p.dy * 1.5 - progress * 3;
          posX += Math.sin(age * 0.3) * 0.5;
          posZ += Math.cos(age * 0.3) * 0.5;
          scale = p.scaleBase;
        } else if (kind === 'debris') {
          // Escombros con gravedad
          posY = p.dy * progress * 2.5 - 5.5 * Math.pow(progress, 2);
          scale = p.scaleBase;
        }

        // Si cayó por debajo del piso
        if (posY < -1) return null;

        return (
          <group
            key={`part-${idx}`}
            position={[posX, posY, posZ]}
            rotation={[rotX, rotY, 0]}
            scale={[scale, scale, scale]}
          >
            {kind === 'smoke' && (
              <mesh geometry={sphereGeo} material={smokeMat} />
            )}
            {kind === 'sparks' && (
              <mesh geometry={sparkGeo} material={sparkMat} />
            )}
            {kind === 'confetti' && (
              <mesh
                geometry={confettiGeo}
                material={confettiMaterials[p.colorIdx]}
              />
            )}
            {kind === 'debris' && (
              <mesh geometry={debrisGeo} material={debrisMat} />
            )}
          </group>
        );
      })}
    </group>
  );
};
