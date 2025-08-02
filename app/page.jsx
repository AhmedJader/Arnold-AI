"use client";
import React, { useRef, useEffect, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

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
    description: 'Major upper-body muscle involved in pushing movements.',
    primaryFunctions: ['Horizontal adduction of the arm', 'Shoulder flexion', 'Stabilization during press movements'],
    workouts: [
      {
        name: 'Barbell Bench Press',
        type: 'Compound',
        equipment: 'Barbell, bench',
        cues: 'Keep shoulder blades pinched, drive through chest, full range of motion.',
        sampleSetsReps: '4 sets x 6–8 reps',
      },
      {
        name: 'Incline Dumbbell Press',
        type: 'Compound',
        equipment: 'Dumbbells, incline bench',
        cues: 'Slight arch in lower back, press diagonally upward, control descent.',
        sampleSetsReps: '3 sets x 8–12 reps',
      },
      {
        name: 'Cable Fly',
        type: 'Isolation',
        equipment: 'Cable machine',
        cues: 'Elbows slightly bent, squeeze at peak, slow return.',
        sampleSetsReps: '3 sets x 12–15 reps',
      },
    ],
  },
  biceps_left: {
    name: 'Left Bicep',
    color: '#44ff44',
    position: [0.32, 0.48, 0.04],
    scale: [0.08, 0.05, 0.03],
    rotation: [0, 0, 0],
    opacity: 0.5,
    modelPath: '/3D/Arm.glb',
    description: 'Anterior upper-arm muscle responsible for elbow flexion and forearm supination.',
    primaryFunctions: ['Elbow flexion', 'Forearm supination'],
    workouts: [
      {
        name: 'Standing Dumbbell Curl',
        type: 'Isolation',
        equipment: 'Dumbbells',
        cues: 'Keep elbows fixed at sides, avoid swinging, squeeze at top.',
        sampleSetsReps: '3 sets x 10–12 reps',
      },
      {
        name: 'Hammer Curl',
        type: 'Isolation',
        equipment: 'Dumbbells',
        cues: 'Neutral grip, control both concentric and eccentric phases.',
        sampleSetsReps: '3 sets x 10 reps',
      },
    ],
  },
  biceps_right: {
    name: 'Right Bicep',
    color: '#44ff44',
    position: [-0.32, 0.48, 0.04],
    scale: [0.08, 0.05, 0.03],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Arm.glb',
    description: 'Anterior upper-arm muscle responsible for elbow flexion and forearm supination.',
    primaryFunctions: ['Elbow flexion', 'Forearm supination'],
    workouts: [
      {
        name: 'EZ-Bar Curl',
        type: 'Isolation',
        equipment: 'EZ bar',
        cues: 'Grip width comfortable, avoid swinging, full contraction.',
        sampleSetsReps: '4 sets x 8–10 reps',
      },
      {
        name: 'Concentration Curl',
        type: 'Isolation',
        equipment: 'Dumbbell',
        cues: 'Slow controlled reps, focus on peak squeeze.',
        sampleSetsReps: '3 sets x 12 reps',
      },
    ],
  },
  shoulders_left: {
    name: 'Left Shoulder',
    color: '#4444ff',
    position: [0.28, 0.59, -0.06],
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Upperarm.glb',
    description: 'Deltoid complex responsible for arm abduction and stabilization.',
    primaryFunctions: ['Arm abduction', 'Shoulder flexion/extension', 'Rotation'],
    workouts: [
      {
        name: 'Seated Dumbbell Press',
        type: 'Compound',
        equipment: 'Dumbbells, bench',
        cues: 'Keep back neutral, press overhead without flaring elbows too wide.',
        sampleSetsReps: '4 sets x 8 reps',
      },
      {
        name: 'Lateral Raise',
        type: 'Isolation',
        equipment: 'Dumbbells',
        cues: 'Slight bend in elbow, raise to shoulder height, avoid momentum.',
        sampleSetsReps: '3 sets x 12–15 reps',
      },
    ],
  },
  shoulders_right: {
    name: 'Right Shoulder',
    color: '#4444ff',
    position: [-0.28, 0.59, -0.06],
    scale: [0.05, 0.05, 0.05],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Upperarm.glb',
    description: 'Deltoid complex responsible for arm abduction and stabilization.',
    primaryFunctions: ['Arm abduction', 'Shoulder flexion/extension', 'Rotation'],
    workouts: [
      {
        name: 'Arnold Press',
        type: 'Compound',
        equipment: 'Dumbbells',
        cues: 'Rotate wrists during press for full deltoid engagement.',
        sampleSetsReps: '3 sets x 10 reps',
      },
      {
        name: 'Front Raise',
        type: 'Isolation',
        equipment: 'Plate or dumbbell',
        cues: 'Lift with shoulders, not momentum; pause at top.',
        sampleSetsReps: '3 sets x 12 reps',
      },
    ],
  },
  abs: {
    name: 'Abs',
    color: '#ffff44',
    position: [-0.01, 0.29, 0.18],
    scale: [0.11, 0.18, 0.04],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Abs.glb',
    description: 'Core muscles that stabilize the trunk and assist in flexion.',
    primaryFunctions: ['Spinal flexion', 'Core stabilization', 'Intra-abdominal pressure control'],
    workouts: [
      {
        name: 'Hanging Leg Raise',
        type: 'Core',
        equipment: 'Pull-up bar',
        cues: 'Avoid swinging, lead with hips, control descent.',
        sampleSetsReps: '3 sets x 10–15 reps',
      },
      {
        name: 'Plank',
        type: 'Isometric',
        equipment: 'Bodyweight',
        cues: 'Neutral spine, squeeze glutes and abs, breathe steadily.',
        sampleSetsReps: '3 x 45–60 seconds',
      },
    ],
  },
  back: {
    name: 'Back',
    color: '#ffb144',
    position: [0.00, 0.46, -0.15],
    scale: [0.15, 0.24, 0.04],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Back.glb',
    description: 'Posterior chain component involved in pulling and posture support.',
    primaryFunctions: ['Spinal extension', 'Scapular retraction', 'Arm adduction'],
    workouts: [
      {
        name: 'Bent-over Barbell Row',
        type: 'Compound',
        equipment: 'Barbell',
        cues: 'Hinge at hips, pull to lower ribs, keep torso stable.',
        sampleSetsReps: '4 sets x 6–8 reps',
      },
      {
        name: 'Pull-up / Chin-up',
        type: 'Bodyweight',
        equipment: 'Pull-up bar',
        cues: 'Full range, avoid kipping (unless intended), squeeze back at top.',
        sampleSetsReps: '3 sets to failure or 6–10 reps weighted',
      },
    ],
  },
  quads_left: {
    name: 'Left Quadriceps',
    color: '#ff44ff',
    position: [0.15, -0.15, 0.15],
    scale: [0.08, 0.23, 0.05],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Upperleg.glb',
    description: 'Front thigh muscles responsible for knee extension and hip flexion.',
    primaryFunctions: ['Knee extension', 'Hip flexion (rectus femoris)'],
    workouts: [
      {
        name: 'Back Squat',
        type: 'Compound',
        equipment: 'Barbell',
        cues: 'Drive through heels, knees tracking toes, full depth as mobility allows.',
        sampleSetsReps: '5 sets x 5 reps',
      },
      {
        name: 'Leg Extension',
        type: 'Isolation',
        equipment: 'Machine',
        cues: 'Controlled squeeze at top, avoid locking out violently.',
        sampleSetsReps: '3 sets x 12–15 reps',
      },
    ],
  },
  quads_right: {
    name: 'Right Quadriceps',
    color: '#ff44ff',
    position: [-0.15, -0.15, 0.15],
    scale: [0.08, 0.23, 0.05],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Upperleg.glb',
    description: 'Front thigh muscles responsible for knee extension and hip flexion.',
    primaryFunctions: ['Knee extension', 'Hip flexion (rectus femoris)'],
    workouts: [
      {
        name: 'Front Squat',
        type: 'Compound',
        equipment: 'Barbell',
        cues: 'Upright torso, elbow high, drive through mid-foot.',
        sampleSetsReps: '4 sets x 6–8 reps',
      },
      {
        name: 'Walking Lunges',
        type: 'Compound',
        equipment: 'Bodyweight or dumbbells',
        cues: 'Long stride, knee tracking, core tight.',
        sampleSetsReps: '3 sets x 10 steps per leg',
      },
    ],
  },
  calves_left: {
    name: 'Left Calf',
    color: '#44ffff',
    position: [0.18, -0.57, -0.18],
    scale: [0.06, 0.15, 0.04],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Calves.glb',
    description: 'Lower leg muscles responsible for plantarflexion of the foot.',
    primaryFunctions: ['Plantarflexion', 'Ankle stabilization'],
    workouts: [
      {
        name: 'Standing Calf Raise',
        type: 'Isolation',
        equipment: 'Machine or bodyweight',
        cues: 'Full stretch and contraction, pause at top.',
        sampleSetsReps: '4 sets x 15–20 reps',
      },
    ],
  },
  calves_right: {
    name: 'Right Calf',
    color: '#44ffff',
    position: [-0.18, -0.57, -0.18],
    scale: [0.06, 0.15, 0.04],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Calves.glb',
    description: 'Lower leg muscles responsible for plantarflexion of the foot.',
    primaryFunctions: ['Plantarflexion', 'Ankle stabilization'],
    workouts: [
      {
        name: 'Seated Calf Raise',
        type: 'Isolation',
        equipment: 'Machine',
        cues: 'Focus on soleus engagement, slow negative.',
        sampleSetsReps: '3 sets x 20 reps',
      },
    ],
  },
  forearm_right: {
    name: 'Right Forearm',
    color: '#44ffff',
    position: [-0.48, 0.26, 0.04],
    scale: [0.11, 0.07, 0.07],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Forearm.glb',
    description: 'Muscles involved in wrist flexion/extension and grip strength.',
    primaryFunctions: ['Wrist movement', 'Grip stabilization'],
    workouts: [
      {
        name: 'Wrist Curl',
        type: 'Isolation',
        equipment: 'Dumbbell or barbell',
        cues: 'Slow controlled reps, full range.',
        sampleSetsReps: '3 sets x 15 reps',
      },
      {
        name: 'Farmer\'s Carry',
        type: 'Grip/Compound',
        equipment: 'Heavy dumbbells or kettlebells',
        cues: 'Neutral spine, steady walk, strong grip.',
        sampleSetsReps: '3 x 30 seconds walks',
      },
    ],
  },
  forearm_left: {
    name: 'Left Forearm',
    color: '#44ffff',
    position: [0.48, 0.26, 0.04],
    scale: [0.11, 0.07, 0.07],
    rotation: [0, 0, 0],
    opacity: 0.6,
    modelPath: '/3D/Forearm.glb',
    description: 'Muscles involved in wrist flexion/extension and grip strength.',
    primaryFunctions: ['Wrist movement', 'Grip stabilization'],
    workouts: [
      {
        name: 'Reverse Curl',
        type: 'Isolation',
        equipment: 'EZ bar or dumbbell',
        cues: 'Pronated grip, control eccentric portion.',
        sampleSetsReps: '3 sets x 12 reps',
      },
    ],
  },
};


function SelectableMuscleMesh({ muscleKey, config, isSelected, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && (isSelected || hovered)) {
      // Pulse effect for selected/hovered muscles
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
      scale={config.scale}
      rotation={config.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(muscleKey);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={isSelected ? '#ffffff' : hovered ? '#ffcc00' : config.color}
        transparent
        opacity={isSelected ? 0.9 : hovered ? 0.8 : config.opacity}
        roughness={0.3}
        metalness={0.1}
        emissive={isSelected ? config.color : hovered ? '#444400' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0}
      />
    </mesh>
  );
}

function ManModel({ selectedMuscles, onMuscleSelect }) {
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

export default function MainPage() {
  const [selectedMuscles, setSelectedMuscles] = useState(new Set());
  const [showInstructions, setShowInstructions] = useState(true);
  const router = useRouter();

  const handleMuscleSelect = (muscleKey) => {
    setSelectedMuscles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(muscleKey)) {
        newSet.delete(muscleKey);
      } else {
        newSet.add(muscleKey);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    const selectedData = Array.from(selectedMuscles).map(key => ({
      key,
      ...MUSCLE_GROUPS[key]
    }));
    
    // Store selection in localStorage for the next page
    localStorage.setItem('selectedMuscles', JSON.stringify(selectedData));
    router.push('/selection');
  };

  const clearAll = () => {
    setSelectedMuscles(new Set());
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                Target Muscle Groups
              </h1>
              <p className="text-slate-300 text-lg font-light">
                Interactive selection for your personalized workout
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">{selectedMuscles.size}</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">Selected</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [3, 1, 3], fov: 50 }} className="rounded-none">
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
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true} 
            minDistance={1} 
            maxDistance={10} 
          />
        </Canvas>

        {/* Instructions Card */}
        {showInstructions && (
          <div className="absolute top-6 left-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 max-w-sm shadow-2xl animate-in slide-in-from-left duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white text-lg">How to Use</h3>
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 text-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Click colored areas to select muscles</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Selected muscles pulse and turn white</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {selectedMuscles.size > 0 && (
            <button 
              onClick={clearAll}
              className="backdrop-blur-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-xl p-3 text-red-200 transition-all duration-200 hover:scale-105 shadow-lg"
              title="Clear All"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="backdrop-blur-xl bg-white/5 border-t border-white/10 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-6">
            {/* Selected Muscles */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white mb-3 text-lg">
                Selected Muscles
                <span className="ml-2 text-sm text-slate-400 font-normal">
                  ({selectedMuscles.size} of {Object.keys(MUSCLE_GROUPS).length})
                </span>
              </h3>
              
              {selectedMuscles.size > 0 ? (
                <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                  {Array.from(selectedMuscles).map(key => (
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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

            {/* Action Button */}
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
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}