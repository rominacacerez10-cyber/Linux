import React from 'react';

interface LightsProps {
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
}

export const Lights: React.FC<LightsProps> = ({
  fogColor = '#2a0845',
  fogNear = 40,
  fogFar = 320,
}) => {
  return (
    <>
      {/* Niebla púrpura para ocultar el fondo y dar atmósfera */}
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />

      {/* Luz ambiente baja */}
      <ambientLight color="#18052e" intensity={0.8} />

      {/* Luz direccional magenta atardecer */}
      <directionalLight
        position={[-30, 45, 60]}
        color="#ff2e93"
        intensity={2.2}
      />

      {/* Luz point cian para contraste y rim lighting */}
      <pointLight
        position={[25, 15, -20]}
        color="#00e5ff"
        intensity={3.5}
        distance={120}
        decay={2}
      />

      {/* Relleno cálido frontal/suelo */}
      <pointLight
        position={[0, 2, 10]}
        color="#ff7a3d"
        intensity={1.2}
        distance={60}
        decay={2}
      />
    </>
  );
};
