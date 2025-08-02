"use client";
import React, { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

function MuscleModel({ modelPath, isVisible }) {
  const { scene, error } = useGLTF(modelPath);
  const modelRef = useRef();

  useEffect(() => {
    if (scene && modelRef.current) {
      modelRef.current.clear();

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

        modelRef.current.add(clonedScene);
      }
    }
  }, [scene, isVisible]);

  if (error && isVisible) {
    return (
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#666666" transparent opacity={0.7} />
      </mesh>
    );
  }

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

export default function SelectionPage() {
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedWorkout, setSelectedWorkout] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('selectedMuscles');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedMuscles(parsed);
          return;
        }
      } catch {}
    }
    router.push('/');
  }, [router]);

  const handleBack = () => {
    router.push('/');
  };

  const clearSelection = () => {
    localStorage.removeItem('selectedMuscles');
    router.push('/');
  };

  if (selectedMuscles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-slate-400">Preparing your selected muscles...</p>
        </div>
      </div>
    );
  }

  const currentMuscle = selectedMuscles[activeTab];
  const currentWorkout = currentMuscle?.workouts?.[selectedWorkout];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                Muscle Analysis
              </h1>
              <p className="text-slate-300 text-lg">
                {selectedMuscles.length} selected muscle
                {selectedMuscles.length > 1 ? 's' : ''} • Detailed view & workouts
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={clearSelection}
                className="backdrop-blur-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 px-4 py-2 text-red-200 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                Clear All
              </button>
              <button
                onClick={handleBack}
                className="backdrop-blur-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 px-4 py-2 text-blue-200 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative z-10">
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

          <div className="absolute top-6 left-6 backdrop-blur-xl bg-white/10 border border-white/20 text-white p-6 rounded-2xl shadow-2xl max-w-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 shadow-lg"
                style={{ backgroundColor: currentMuscle?.color }}
              />
              <div>
                <h3 className="font-bold text-xl">{currentMuscle?.name}</h3>
                <p className="text-slate-300 text-sm">
                  Model {activeTab + 1} of {selectedMuscles.length}
                </p>
              </div>
            </div>

            {currentMuscle?.description && (
              <p className="text-slate-200 text-sm leading-relaxed mb-4">
                {currentMuscle.description}
              </p>
            )}

            {currentMuscle?.primaryFunctions && (
              <div>
                <h4 className="font-semibold text-white mb-2 text-sm uppercase tracking-wider">
                  Primary Functions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentMuscle.primaryFunctions.map((func, i) => (
                    <span
                      key={i}
                      className="backdrop-blur-sm bg-white/20 px-2 py-1 rounded-lg text-xs font-medium"
                    >
                      {func}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-6 backdrop-blur-xl bg-white/10 border border-white/20 text-white p-3 rounded-xl">
            <div className="text-xs text-slate-300 space-y-1">
              <p>• Drag to rotate</p>
              <p>• Scroll to zoom</p>
              <p>• Right-click to pan</p>
            </div>
          </div>
        </div>

        <div className="w-96 backdrop-blur-xl bg-white/5 border-l border-white/10 flex flex-col">
          <div className="border-b border-white/10">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2">Selected Muscles</h2>
              <p className="text-slate-300 text-sm">Click to view details</p>
            </div>

            <div className="px-3 pb-3 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {selectedMuscles.map((muscle, index) => (
                  <button
                    key={muscle.key}
                    onClick={() => {
                      setActiveTab(index);
                      setSelectedWorkout(0);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === index
                        ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-400/30 shadow-lg'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-transparent'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: muscle.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{muscle.name}</div>
                      <div className="text-xs opacity-75">
                        {muscle.workouts?.length || 0} workout
                        {(muscle.workouts?.length || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-xs opacity-50 bg-white/20 px-2 py-1 rounded-full">
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {currentMuscle?.workouts && currentMuscle.workouts.length > 0 ? (
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Recommended Workouts</h3>

                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {currentMuscle.workouts.map((workout, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedWorkout(index)}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedWorkout === index
                          ? 'bg-gradient-to-r from-green-500/30 to-teal-500/30 text-white border border-green-400/30'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {workout.name}
                    </button>
                  ))}
                </div>

                {currentWorkout && (
                  <div className="space-y-4">
                    <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
                      <h4 className="font-bold text-white mb-3 text-lg">
                        {currentWorkout.name}
                      </h4>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                            Type
                          </span>
                          <span
                            className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${
                              currentWorkout.type === 'Compound'
                                ? 'bg-orange-500/20 text-orange-200'
                                : 'bg-blue-500/20 text-blue-200'
                            }`}
                          >
                            {currentWorkout.type}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                            Equipment
                          </span>
                          <span className="text-white text-sm font-medium">
                            {currentWorkout.equipment}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                          Form Cues
                        </span>
                        <p className="text-slate-200 text-sm leading-relaxed">
                          {currentWorkout.cues}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                          Sample Sets & Reps
                        </span>
                        <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border border-green-400/30 rounded-lg p-3">
                          <span className="text-green-200 font-bold text-lg">
                            {currentWorkout.sampleSetsReps}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="text-slate-400 text-sm">
                  No workout data available for this muscle group.
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/10">
            <button
              onClick={() => {
                const exportData = {
                  muscles: selectedMuscles,
                  exportDate: new Date().toISOString(),
                  totalCount: selectedMuscles.length,
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'selected-muscles.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 px-4 py-3 text-white rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Workout Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
