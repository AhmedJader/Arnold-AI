// components/ui/LoadingFallback.tsx

"use client";
import React from "react";

export default function LoadingFallback() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4a5568" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#4a5568" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
