"use client";
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Define types
interface MuscleConfig {
  name: string;
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  opacity: number;
}

type MuscleKey = keyof typeof MUSCLE_GROUPS;

// Muscle groups with proper typing
const MUSCLE_GROUPS = {
  chest: {
    name: 'Chest',
    color: '#ff4444',
    position: [-0.03, 0.56, 0.12] as [number, number, number],
    scale: [0.19, 0.08, 0.07] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    opacity: 0.5,
  },
  biceps_left: {
    name: 'Left Bicep',
    color: '#44ff44',
    position: [-0.3, 0.2, 0.1] as [number, number, number],
    scale: [0.15, 0.25, 0.15] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    opacity: 0.6,
  },
  biceps_right: {
    name: 'Right Bicep',
    color: '#44ff44',
    position: [0.3, 0.2, 0.1] as [number, number, number],
    scale: [0.15, 0.25, 0.15] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    opacity: 0.6,
  },
  shoulders_left: {
    name: 'Left Shoulder',
    color: '#4444ff',
    position: [-0.35, 0.45, 0.05] as [number, number, number],
    scale: [0.2, 0.2, 0.2] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    opacity: 0.6,
  },
  shoulders_right: {
    name: 'Right Shoulder',
    color: '#4444ff',
    position: [0.35, 0.45, 0.05] as [number, number, number],
    scale: [0.2, 0.2, 0.2] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    opacity: 0.6,
  },
  abs: {
    name: 'Abs',
    color: '#ffff44',
    position: [0, 0.1, 0.25] as [number, number, number],
    scale: [0.25, 0.4, 0.15] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    opacity: 0.6,
  },
  quads_left: {
    name: 'Left Quadriceps',
    color: '#ff44ff',
    position: [-0.15, -0.3, 0.15] as [number, number, number],
    scale: [0.2, 0.4, 0.2] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    opacity: 0.6,
  },
  quads_right: {
    name: 'Right Quadriceps',
    color: '#ff44ff',
    position: [0.15, -0.3, 0.15] as [number, number, number],
    scale: [0.2, 0.4, 0.2] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    opacity: 0.6,
  },
  calves_left: {
    name: 'Left Calf',
    color: '#44ffff',
    position: [-0.12, -0.8, 0.1] as [number, number, number],
    scale: [0.15, 0.3, 0.15] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    opacity: 0.6,
  },
  calves_right: {
    name: 'Right Calf',
    color: '#44ffff',
    position: [0.12, -0.8, 0.1] as [number, number, number],
    scale: [0.15, 0.3, 0.15] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    opacity: 0.6,
  },
} satisfies Record<string, MuscleConfig>;

// Ensure type safety for dynamic keys
type MuscleGroups = typeof MUSCLE_GROUPS;

function MuscleMesh({
  muscleKey,
  config,
  visible,
  isSelected,
}: {
  muscleKey: MuscleKey;
  config: MuscleConfig;
  visible: boolean;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      // Pulse effect: animate scale uniformly (not breaking individual axes)
      const scale = 1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      meshRef.current.scale.set(
        config.scale[0] * scale,
        config.scale[1] * scale,
        config.scale[2] * scale
      );
    } else if (meshRef.current) {
      // Reset to original scale
      meshRef.current.scale.set(...config.scale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={config.position}
      scale={config.scale} // Initial scale from config
      rotation={config.rotation}
      visible={visible}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={isSelected ? '#ffffff' : config.color}
        transparent
        opacity={isSelected ? 0.9 : config.opacity}
        roughness={0.3}
        metalness={0.1}
        emissive={isSelected ? config.color : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

function ManModel({
  muscleVisibility,
  muscleConfig,
  selectedMuscle,
}: {
  muscleVisibility: Record<MuscleKey, boolean>;
  muscleConfig: MuscleGroups;
  selectedMuscle: MuscleKey | null;
}) {
  const { scene } = useGLTF('/3D/Man.glb');
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
      {Object.entries(muscleConfig).map(([key, config]) => (
        <MuscleMesh
          key={key}
          muscleKey={key as MuscleKey}
          config={config}
          visible={muscleVisibility[key as MuscleKey]}
          isSelected={selectedMuscle === key}
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
  const [muscleConfig, setMuscleConfig] = useState<MuscleGroups>(MUSCLE_GROUPS);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleKey | null>('chest');
  const [muscleVisibility, setMuscleVisibility] = useState<Record<MuscleKey, boolean>>(
    Object.keys(MUSCLE_GROUPS).reduce((acc, key) => {
      acc[key as MuscleKey] = true;
      return acc;
    }, {} as Record<MuscleKey, boolean>)
  );

  const updateMuscleConfig = <K extends keyof MuscleConfig>(
    muscleKey: MuscleKey,
    property: K,
    value: MuscleConfig[K]
  ) => {
    setMuscleConfig((prev) => ({
      ...prev,
      [muscleKey]: {
        ...prev[muscleKey],
        [property]: value,
      },
    }));
  };

  const updateMusclePosition = (muscleKey: MuscleKey, axis: 'x' | 'y' | 'z', value: string) => {
    const idx = { x: 0, y: 1, z: 2 }[axis];
    const pos = [...muscleConfig[muscleKey].position];
    pos[idx] = parseFloat(value);
    updateMuscleConfig(muscleKey, 'position', pos as [number, number, number]);
  };

  const updateMuscleScale = (muscleKey: MuscleKey, axis: 'x' | 'y' | 'z', value: string) => {
    const idx = { x: 0, y: 1, z: 2 }[axis];
    const scale = [...muscleConfig[muscleKey].scale];
    scale[idx] = Math.max(0.01, parseFloat(value)); // prevent zero scale
    updateMuscleConfig(muscleKey, 'scale', scale as [number, number, number]);
  };

  const updateMuscleRotation = (muscleKey: MuscleKey, axis: 'x' | 'y' | 'z', value: string) => {
    const idx = { x: 0, y: 1, z: 2 }[axis];
    const rot = [...muscleConfig[muscleKey].rotation];
    rot[idx] = parseFloat(value);
    updateMuscleConfig(muscleKey, 'rotation', rot as [number, number, number]);
  };

  const toggleMuscle = (muscleKey: MuscleKey) => {
    setMuscleVisibility((prev) => ({
      ...prev,
      [muscleKey]: !prev[muscleKey],
    }));
  };

  const addNewMuscle = () => {
    const newKey = `muscle_${Object.keys(muscleConfig).length + 1}` as MuscleKey;
    const newMuscle: MuscleConfig = {
      name: `New Muscle ${Object.keys(muscleConfig).length + 1}`,
      color: '#ff0000',
      position: [0, 0, 0],
      scale: [0.2, 0.2, 0.2],
      rotation: [0, 0, 0],
      opacity: 0.6,
    };
    setMuscleConfig((prev) => ({
      ...prev,
      [newKey]: newMuscle,
    }));
    setMuscleVisibility((prev) => ({
      ...prev,
      [newKey]: true,
    }));
    setSelectedMuscle(newKey);
  };

  const deleteMuscle = (muscleKey: MuscleKey) => {
    if (Object.keys(muscleConfig).length <= 1) return;
    const { [muscleKey]: _, ...newConfig } = muscleConfig;
    const { [muscleKey]: __, ...newVisibility } = muscleVisibility;
    setMuscleConfig(newConfig as MuscleGroups);
    setMuscleVisibility(newVisibility);
    if (selectedMuscle === muscleKey) {
      const firstKey = Object.keys(newConfig)[0] as MuscleKey;
      setSelectedMuscle(firstKey);
    }
  };

  const exportConfig = () => {
    console.log('Current muscle configuration:', JSON.stringify(muscleConfig, null, 2));
    alert('Configuration exported to console! Check your browser dev tools.');
  };

  return (
    <div className="w-full h-full flex">
      {/* 3D Viewer */}
      <div className="flex-1 bg-gray-900">
        <Canvas camera={{ position: [3, 1, 3], fov: 50 }}>
          <CameraController />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={0.3} />
          <Suspense fallback={<LoadingFallback />}>
            <ManModel
              muscleVisibility={muscleVisibility}
              muscleConfig={muscleConfig}
              selectedMuscle={selectedMuscle}
            />
          </Suspense>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={1} maxDistance={10} />
        </Canvas>
      </div>

      {/* Control Panel */}
      <div className="w-96 bg-neutral-700 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Muscle Shape Editor</h2>

        {/* Quick Actions */}
        <div className="mb-4 space-y-2">
          <button
            onClick={addNewMuscle}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Add New Muscle
          </button>
          <button
            onClick={exportConfig}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Export Configuration
          </button>
        </div>

        {/* Muscle Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Muscle:</label>
          <div className="flex space-x-2">
            <select
              value={selectedMuscle || ''}
              onChange={(e) => setSelectedMuscle(e.target.value as MuscleKey)}
              className="flex-1 p-2 border rounded"
            >
              {Object.entries(muscleConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => selectedMuscle && deleteMuscle(selectedMuscle)}
              className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              disabled={Object.keys(muscleConfig).length <= 1 || !selectedMuscle}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Muscle Name Editor */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Muscle Name:</label>
          <input
            type="text"
            value={selectedMuscle ? muscleConfig[selectedMuscle]?.name || '' : ''}
            onChange={(e) => selectedMuscle && updateMuscleConfig(selectedMuscle, 'name', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Visibility Toggles */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Visibility:</h3>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {Object.entries(muscleConfig).map(([key, config]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={muscleVisibility[key as MuscleKey]}
                  onChange={() => toggleMuscle(key as MuscleKey)}
                  className="mr-2"
                />
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: config.color }}
                ></div>
                <span
                  className={`text-sm truncate ${selectedMuscle === key ? 'font-bold' : ''}`}
                >
                  {config.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Selected Muscle Controls */}
        {selectedMuscle && (
          <div className="space-y-4">
            <h3 className="font-medium text-blue-600">Editing: {muscleConfig[selectedMuscle].name}</h3>

            {/* Position */}
            <div>
              <h4 className="text-sm font-medium mb-2">Position:</h4>
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="flex items-center mb-1">
                  <label className="w-6 text-xs">{axis.toUpperCase()}:</label>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.01"
                    value={muscleConfig[selectedMuscle].position[{ x: 0, y: 1, z: 2 }[axis]]}
                    onChange={(e) => updateMusclePosition(selectedMuscle, axis, e.target.value)}
                    className="flex-1 mx-2"
                  />
                  <input
                    type="number"
                    value={muscleConfig[selectedMuscle].position[{ x: 0, y: 1, z: 2 }[axis]].toFixed(2)}
                    onChange={(e) => updateMusclePosition(selectedMuscle, axis, e.target.value)}
                    className="w-16 text-xs p-1 border rounded"
                    step="0.01"
                  />
                </div>
              ))}
            </div>

            {/* Scale */}
            <div>
              <h4 className="text-sm font-medium mb-2">Scale:</h4>
              {(['x', 'y', 'z'] as const).map((axis) => (
                <div key={axis} className="flex items-center mb-1">
                  <label className="w-6 text-xs">{axis.toUpperCase()}:</label>
                  <input
                    type="range"
                    min="0.01"
                    max="2"
                    step="0.01"
                    value={muscleConfig[selectedMuscle].scale[{ x: 0, y: 1, z: 2 }[axis]]}
                    onChange={(e) => updateMuscleScale(selectedMuscle, axis, e.target.value)}
                    className="flex-1 mx-2"
                  />
                  <input
                    type="number"
                    value={muscleConfig[selectedMuscle].scale[{ x: 0, y: 1, z: 2 }[axis]].toFixed(2)}
                    onChange={(e) => updateMuscleScale(selectedMuscle, axis, e.target.value)}
                    className="w-16 text-xs p-1 border rounded"
                    step="0.01"
                  />
                </div>
              ))}
            </div>

            {/* Color */}
            <div>
              <h4 className="text-sm font-medium mb-2">Color:</h4>
              <input
                type="color"
                value={muscleConfig[selectedMuscle].color}
                onChange={(e) => updateMuscleConfig(selectedMuscle, 'color', e.target.value)}
                className="w-full h-10 rounded"
              />
            </div>

            {/* Opacity */}
            <div>
              <h4 className="text-sm font-medium mb-2">Opacity:</h4>
              <div className="flex items-center">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={muscleConfig[selectedMuscle].opacity}
                  onChange={(e) => updateMuscleConfig(selectedMuscle, 'opacity', parseFloat(e.target.value))}
                  className="flex-1 mr-2"
                />
                <span className="text-sm w-8">{muscleConfig[selectedMuscle].opacity.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-3 bg-blue-50 rounded text-xs">
          <h4 className="font-medium mb-2">Instructions:</h4>
          <ul className="space-y-1">
            <li>• Your 3D model should now be visible on the left</li>
            <li>• Click and drag to rotate the model</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Selected muscle pulses white in the 3D view</li>
            <li>• Position muscle highlights over the anatomy</li>
            <li>• Export when finished for final implementation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}