// components/3D/ManModel.tsx

"use client";
import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import SelectableMuscleMesh from "./SelectableMuscleMesh";
import { MUSCLE_GROUPS } from "@/lib/constants/muscleGroups";


interface ManModelProps {
  selectedMuscles: Set<string>;
  onMuscleSelect: (key: string) => void;
}

export default function ManModel({ selectedMuscles, onMuscleSelect }: ManModelProps) {
  const { scene } = useGLTF("/3D/Man.glb");
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene && modelRef.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;

      scene.scale.setScalar(scale);
      scene.position.copy(center).multiplyScalar(-scale);
      scene.position.y -= size.y * scale / 2;

      modelRef.current.add(scene);
    }
  }, [scene]);

  return (
    <group ref={modelRef}>
      {Object.entries(MUSCLE_GROUPS).map(([key, config]) => (
        <SelectableMuscleMesh
          key={key}
          muscleKey={key}
          config={config}
          isSelected={selectedMuscles.has(key)}
          onSelect={onMuscleSelect}
        />
      ))}
    </group>
  );
}
