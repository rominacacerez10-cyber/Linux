import React from 'react';

interface LightsProps {
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
}

export const Lights: React.FC<LightsProps> = ({
  fogColor = '#2a0845',
  fogNear = 35,
  fogFar = 280,
}) => {
  return (
    <>
      {/* Niebla púrpura para ocultar el fondo y dar profundidad volumétrica */}
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* Luz hemisférica atardecer Vice City: cielo dorado/ámbar cálido, suelo púrpura profundo */}
      <hemisphereLight args={['#ffbe53', '#1e053a', 0.95]} />

      {/* Luz ambiente complementaria baja */}
      <ambientLight color="#150528" intensity={0.5} />

      {/* Luz direccional sol poniente (magenta / atardecer) */}
      <directionalLight
        position={[-30, 45, 60]}
        color="#ff2e93"
        intensity={2.8}
      />

      {/* Rim light cian lateral para acentuar siluetas y filos PBR */}
      <directionalLight
        position={[35, 25, -40]}
        color="#00e5ff"
        intensity={2.2}
      />

      {/* Point light cian para contraste y reflejos en asfalto/vehículos */}
      <pointLight
        position={[25, 15, -20]}
        color="#00e5ff"
        intensity={3.8}
        distance={130}
        decay={2}
      />

      {/* Relleno cálido frontal rasante */}
      <pointLight
        position={[0, 2.5, 10]}
        color="#ff7a3d"
        intensity={1.5}
        distance={70}
        decay={2}
      />
    </>
  );
};
