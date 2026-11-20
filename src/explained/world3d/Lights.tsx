import React from 'react';

interface LightsProps {
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
}

export const Lights: React.FC<LightsProps> = ({
  fogColor = '#170326',
  fogNear = 38,
  fogFar = 300,
}) => {
  return (
    <>
      {/* Fondo y niebla púrpura profunda para contraste cinematográfico */}
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* Atmósfera Vice City: cielo ámbar cálido sobre suelo púrpura nocturno */}
      <hemisphereLight args={['#ff9a4d', '#0d0018', 0.72]} />

      {/* Relleno ambiental muy bajo para conservar negros profundos */}
      <ambientLight color="#120022" intensity={0.34} />

      {/* Sol poniente magenta: key light frontal que esculpe los volúmenes */}
      <directionalLight
        position={[-30, 45, 60]}
        color="#ff2e93"
        intensity={2.35}
      />

      {/* Rim light cian lateral para separar siluetas del fondo */}
      <directionalLight
        position={[35, 25, -40]}
        color="#00e5ff"
        intensity={1.85}
      />

      {/* Contraluz magenta bajo para rebotes neón en asfalto y carrocerías */}
      <pointLight
        position={[-28, 8, -34]}
        color="#ff2e93"
        intensity={2.6}
        distance={120}
        decay={2}
      />

      {/* Reflejos cian fríos sobre la calzada */}
      <pointLight
        position={[25, 15, -20]}
        color="#00e5ff"
        intensity={4.2}
        distance={140}
        decay={2}
      />

      {/* Relleno cálido frontal rasante sobre personajes y vehículos */}
      <pointLight
        position={[0, 2.5, 10]}
        color="#ff7a3d"
        intensity={2.1}
        distance={80}
        decay={2}
      />
    </>
  );
};
