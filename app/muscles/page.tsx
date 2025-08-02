// app/muscles/page.tsx
"use client";

import React, { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { MUSCLE_GROUPS } from "@/lib/constants/muscleGroups";

interface MuscleConfig {
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  opacity: number;
}

interface SelectableMuscleMeshProps {
  muscleKey: string;
  config: MuscleConfig;
  isSelected: boolean;
  onSelect: (key: string) => void;
}

function SelectableMuscleMesh({
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

interface ManModelProps {
  selectedMuscles: Set<string>;
  onMuscleSelect: (key: string) => void;
}

function ManModel({ selectedMuscles, onMuscleSelect }: ManModelProps) {
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
      scene.position.y -= (size.y * scale) / 2;

      modelRef.current.add(scene);
    }
  }, [scene]);

  return (
    <group ref={modelRef}>
      {(Object.entries(MUSCLE_GROUPS) as [string, MuscleConfig][]).map(
        ([key, config]) => (
          <SelectableMuscleMesh
            key={key}
            muscleKey={key}
            config={config}
            isSelected={selectedMuscles.has(key)}
            onSelect={onMuscleSelect}
          />
        )
      )}
    </group>
  );
}

function LoadingFallback() {
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

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(3, 1, 3);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

export default function MuscleSelectorPage() {
  const [selectedMuscles, setSelectedMuscles] = useState<Set<string>>(new Set());
  const [showInstructions, setShowInstructions] = useState(true);
  const router = useRouter();

  const handleMuscleSelect = (muscleKey: string) => {
    setSelectedMuscles((prev) => {
      const newSet = new Set(prev);
      newSet.has(muscleKey) ? newSet.delete(muscleKey) : newSet.add(muscleKey);
      return newSet;
    });
  };

  const handleNext = () => {
    const selectedData = Array.from(selectedMuscles).map((key) => ({
      key,
      ...MUSCLE_GROUPS[key as keyof typeof MUSCLE_GROUPS],
    }));
    localStorage.setItem("selectedMuscles", JSON.stringify(selectedData));
    router.push("/selection");
  };

  const clearAll = () => setSelectedMuscles(new Set());

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden animate-in fade-in duration-500">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-8 animate-in fade-in slide-in-from-top">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
              Target Muscle Groups
            </h1>
            <p className="text-slate-300 text-lg font-light">
              Interactive selection for your personalized workout
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white mb-1">
              {selectedMuscles.size}
            </div>
            <div className="text-sm text-slate-400 uppercase tracking-wider">
              Selected
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [3, 1, 3], fov: 50 }}
          className="rounded-none"
        >
          <CameraController />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={0.3} />
          <Suspense fallback={<LoadingFallback />}>
            <ManModel
              selectedMuscles={selectedMuscles}
              onMuscleSelect={handleMuscleSelect}
            />
          </Suspense>
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={1}
            maxDistance={10}
          />
        </Canvas>

        {/* Instructions */}
        {showInstructions && (
          <div className="absolute top-6 left-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 max-w-sm shadow-2xl animate-in slide-in-from-left duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-lg">How to Use</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-sm">
                  Click colored areas to select muscles
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm">
                  Selected muscles pulse and turn white
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span className="text-sm">Drag to rotate • Scroll to zoom</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-6 right-6 flex flex-col gap-3">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 text-white transition-all duration-200 hover:scale-105 shadow-lg"
            title="Toggle Instructions"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          {selectedMuscles.size > 0 && (
            <button
              onClick={clearAll}
              className="backdrop-blur-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-xl p-3 text-red-200 transition-all duration-200 hover:scale-105 shadow-lg"
              title="Clear All"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="backdrop-blur-xl bg-white/5 border-t border-white/10 px-6 py-6 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white mb-3 text-lg">
              Selected Muscles
              <span className="ml-2 text-sm text-slate-400 font-normal">
                ({selectedMuscles.size} of {Object.keys(MUSCLE_GROUPS).length})
              </span>
            </h3>
            {selectedMuscles.size > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {Array.from(selectedMuscles).map((key) => (
                  <div
                    key={key}
                    className="group backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  >
                    <div
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: MUSCLE_GROUPS[key].color }}
                    />
                    <span className="text-white text-sm font-medium">
                      {MUSCLE_GROUPS[key].name}
                    </span>
                    <button
                      onClick={() => handleMuscleSelect(key)}
                      className="text-slate-400 hover:text-red-400 transition-colors ml-1 opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 italic py-4 text-center border-2 border-dashed border-slate-600 rounded-xl">
                No muscles selected yet. Click on the 3D model to get started!
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={handleNext}
              disabled={selectedMuscles.size === 0}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed px-8 py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <span>Continue</span>
                <div className="bg-white/20 rounded-full px-2 py-1 text-sm">
                  {selectedMuscles.size}
                </div>
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}