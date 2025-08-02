// components/3D/SelectableMuscleMesh.tsx

"use client";
import { MUSCLE_GROUPS } from "@/lib/constants/muscleGroups";
import * as THREE from "three";
import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

type MuscleConfig = typeof MUSCLE_GROUPS[keyof typeof MUSCLE_GROUPS];

interface SelectableMuscleMeshProps {
  muscleKey: string;
  config: MuscleConfig;
  isSelected: boolean;
  onSelect: (muscleKey: string) => void;
}


export default function SelectableMuscleMesh({
  muscleKey,
  config,
  isSelected,
  onSelect,
}: SelectableMuscleMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && (isSelected || hovered)) {
      const scale = 1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      meshRef.current.scale.set(
        config.scale[0] * scale,
        config.scale[1] * scale,
        config.scale[2] * scale
      );
    } else if (meshRef.current) {
      meshRef.current.scale.set(...config.scale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={config.position}
      scale={config.scale}
      rotation={config.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(muscleKey);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={isSelected ? "#ffffff" : hovered ? "#ffcc00" : config.color}
        transparent
        opacity={isSelected ? 0.9 : hovered ? 0.8 : config.opacity}
        roughness={0.3}
        metalness={0.1}
        emissive={isSelected ? config.color : hovered ? "#444400" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0}
      />
    </mesh>
  );
}
