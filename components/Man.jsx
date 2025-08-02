"use client";
import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Muscle groups with their corresponding 3D models
const MUSCLE_GROUPS = {
  chest: {
    name: 'Chest',
    color: '#ff4444',
    position: [-0.03, 0.56, 0.12],
    scale: [0.19, 0.08, 0.07],
    rotation: [0, 0, 0],
    opacity: 0.5,
    modelPath: '/3D/Chest.glb',
  },
  biceps_left: {
    name: 'Left Bicep',
    color: '#44ff44',
    position: [0.32, 0.48, 0.04],
    scale: [0.08, 0.05, 0.03],
    rotation: [0, 0, 0],
    opacity: 0.5,
    modelPath: '/3D/Arm.glb',
  },
  biceps_right: {
    name: 'Right Bicep',
    color: '#44ff44',
    position: [-0.32, 0.48, 0.04],
    scale: [0.08, 0.05, 0.03],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Arm.glb',
  },
  shoulders_left: {
    name: 'Left Shoulder',
    color: '#4444ff',
    position: [0.28, 0.59, -0.06],
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Upperarm.glb',
  },
  shoulders_right: {
    name: 'Right Shoulder',
    color: '#4444ff',
    position: [-0.28, 0.59, -0.06],
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Upperarm.glb',
  },
  abs: {
    name: 'Abs',
    color: '#ffff44',
    position: [-0.01, 0.29, 0.18],
    scale: [0.11, 0.18, 0.04],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Abs.glb',
  },
  back: {
    name: 'Back',
    color: '#ffb144',
    position: [0.00, 0.46, -0.15],
    scale: [0.15, 0.24, 0.04],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Back.glb',
  },
  quads_left: {
    name: 'Left Quadriceps',
    color: '#ff44ff',
    position: [0.15, -0.15, 0.15],
    scale: [0.08, 0.23, 0.05],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Upperleg.glb',
  },
  quads_right: {
    name: 'Right Quadriceps',
    color: '#ff44ff',
    position: [-0.15, -0.15, 0.15],
    scale: [0.08, 0.23, 0.05],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Upperleg.glb',
  },
  calves_left: {
    name: 'Left Calf',
    color: '#44ffff',
    position: [0.18, -0.57, -0.18],
    scale: [0.06, 0.15, 0.04],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Calves.glb',
  },
  calves_right: {
    name: 'Right Calf',
    color: '#44ffff',
    position: [-0.18, -0.57, -0.18],
    scale: [0.06, 0.15, 0.04],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Calves.glb',
  },
  forearm_right: {
    name: 'Right Forearm',
    color: '#44ffff',
    position: [-0.48, 0.26, 0.04],
    scale: [0.11, 0.07, 0.07],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Forearm.glb',
  },
  forearm_left: {
    name: 'Left Forearm',
    color: '#44ffff',
    position: [0.48, 0.26, 0.04],
    scale: [0.11, 0.07, 0.07],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Forearm.glb',
  },
};

function MuscleMesh({ config }) {
  return (
    <mesh
      position={config.position}
      scale={config.scale}
      rotation={config.rotation}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={config.color}
        transparent
        opacity={config.opacity}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

function ManModel() {
  const { scene } = useGLTF('/3D/Man.glb');
  const modelRef = useRef();

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
        <MuscleMesh
          key={key}
          config={config}
        />
      ))}
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#666666" />
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

export default function Man() {
  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas camera={{ position: [3, 1, 3], fov: 50 }}>
        <CameraController />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <spotLight position={[0, 10, 0]} intensity={0.3} />
        <Suspense fallback={<LoadingFallback />}>
          <ManModel />
        </Suspense>
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true} 
          minDistance={1} 
          maxDistance={10} 
        />
      </Canvas>
    </div>
  );
}