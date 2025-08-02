// components/SelectionPage/MuscleCanvas.tsx

"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function MuscleModel({ modelPath, isVisible }: { modelPath: string; isVisible: boolean }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef<THREE.Group>(new THREE.Group());

  useEffect(() => {
    if (scene && modelRef.current) {
      const group = modelRef.current;
      group.clear(); // ✅ Valid now

      if (isVisible) {
        const box = new THREE.Box3().setFromObject(scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        const clonedScene = scene.clone();
        clonedScene.scale.setScalar(scale);
        clonedScene.position.copy(center).multiplyScalar(-scale);
        clonedScene.position.y -= (size.y * scale) / 2;
        group.add(clonedScene); // ✅ Valid now
      }
    }
  }, [scene, isVisible]);

  return <group ref={modelRef} />;
}


function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#4a5568" wireframe />
    </mesh>
  );
}

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(3, 1, 3);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

export default function MuscleCanvas({ selectedMuscles, activeTab }: { selectedMuscles: any[]; activeTab: number }) {
  const currentMuscle = selectedMuscles[activeTab];

  return (
    <div className="flex-1 relative">
      <Canvas camera={{ position: [3, 1, 3], fov: 50 }} className="rounded-none">
        <CameraController />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        <spotLight position={[0, 10, 0]} intensity={0.2} />

        <Suspense fallback={<LoadingFallback />}>
          {selectedMuscles.map((muscle, index) => (
            <MuscleModel
              key={muscle.key}
              modelPath={muscle.modelPath}
              isVisible={index === activeTab}
            />
          ))}
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={8}
          maxPolarAngle={Math.PI}
        />
      </Canvas>

      <div className="absolute bottom-6 left-6 backdrop-blur-xl bg-white/10 border border-white/20 text-white p-3 rounded-xl">
        <div className="text-xs text-slate-300 space-y-1">
          <p>• Drag to rotate</p>
          <p>• Scroll to zoom</p>
          <p>• Right-click to pan</p>
        </div>
      </div>
    </div>
  );
}
