// app/muscles/page.tsx
"use client";

import React, { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { MUSCLE_GROUPS } from "@/lib/constants/muscleGroups";
import { Spotlight } from "@/components/ui/spotlight-new";

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
        color={isSelected ? "#60a5fa" : hovered ? "#fbbf24" : config.color}
        transparent
        opacity={isSelected ? 0.95 : hovered ? 0.85 : config.opacity}
        roughness={0.2}
        metalness={0.3}
        emissive={isSelected ? "#1e40af" : hovered ? "#f59e0b" : "#000000"}
        emissiveIntensity={isSelected ? 0.4 : hovered ? 0.3 : 0}
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
      const scale = 3.5 / maxDim; // Increased from 2 to 3.5 for larger model

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
        <meshStandardMaterial color="#374151" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#374151" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(2, 0.8, 2); // Moved closer: was (3, 1, 3)
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
    <div className="w-full h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Animated Spotlight Background */}
      <Spotlight />
      
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 backdrop-blur-2xl bg-black/30 border-b border-white/10 px-6 py-8"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent pb-6">
              Select Muscle Groups
            </h1>
            <p className="text-gray-300 text-lg font-light tracking-wide">
              Interactive selection for your personalized workout
            </p>
          </div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-right bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="text-4xl font-bold text-white mb-2">
              {selectedMuscles.size}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
              Selected
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [2, 0.8, 2], fov: 50 }} // Updated to match CameraController
          className="rounded-none"
        >
          <CameraController />
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <pointLight position={[-10, -10, -5]} intensity={0.4} />
          <spotLight position={[0, 15, 0]} intensity={0.5} color="#60a5fa" />
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
            minDistance={0.5} // Reduced from 1 to allow closer zoom
            maxDistance={8}   // Reduced from 10 for better control
          />
        </Canvas>

        {/* Instructions */}
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute top-6 left-6 backdrop-blur-2xl bg-black/40 border border-white/20 rounded-3xl p-8 max-w-sm shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-white text-xl">How to Use</h3>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-400 hover:text-white transition-all duration-300 p-2 hover:bg-white/10 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
                <span className="text-sm font-medium">Click colored areas to select muscles</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50" />
                <span className="text-sm font-medium">Selected muscles pulse and glow</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50" />
                <span className="text-sm font-medium">Drag to rotate • Scroll to zoom</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute top-6 right-6 flex flex-col gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInstructions(!showInstructions)}
            className="backdrop-blur-2xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-4 text-white transition-all duration-300 shadow-xl"
            title="Toggle Instructions"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.button>
          {selectedMuscles.size > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAll}
              className="backdrop-blur-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-2xl p-4 text-red-200 transition-all duration-300 shadow-xl"
              title="Clear All"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Bottom Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-50 backdrop-blur-2xl bg-black/30 border-t border-white/10 px-6 py-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white mb-4 text-xl">
              Selected Muscles
              <span className="ml-3 text-base text-gray-400 font-normal">
                ({selectedMuscles.size} of {Object.keys(MUSCLE_GROUPS).length})
              </span>
            </h3>
            {selectedMuscles.size > 0 ? (
              <motion.div 
                layout
                className="flex flex-wrap gap-3 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              >
                {Array.from(selectedMuscles).map((key, index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl px-5 py-3 flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ 
                        backgroundColor: MUSCLE_GROUPS[key].color,
                        boxShadow: `0 0 15px ${MUSCLE_GROUPS[key].color}50`
                      }}
                    />
                    <span className="text-white text-sm font-medium">
                      {MUSCLE_GROUPS[key].name}
                    </span>
                    <button
                      onClick={() => handleMuscleSelect(key)}
                      className="text-gray-400 hover:text-red-400 transition-all duration-300 ml-2 opacity-0 group-hover:opacity-100 hover:scale-110"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-gray-400 italic py-6 text-center border-2 border-dashed border-gray-600/50 rounded-2xl bg-black/20">
                No muscles selected yet. Click on the 3D model to get started!
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <motion.button
              whileHover={{ scale: selectedMuscles.size > 0 ? 1.05 : 1 }}
              whileTap={{ scale: selectedMuscles.size > 0 ? 0.95 : 1 }}
              onClick={handleNext}
              disabled={selectedMuscles.size === 0}
              className="group relative bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 disabled:from-gray-700 disabled:via-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-10 py-5 rounded-2xl font-bold text-xl text-white shadow-2xl transition-all duration-300 disabled:opacity-50 border border-white/10"
            >
              <div className="flex items-center ">
                <span>Continue</span>
                <div className="bg-white/20 rounded-xl px-3 py-1 text-base font-bold text-center">
                  {selectedMuscles.size}
                </div>
                <svg
                  className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}