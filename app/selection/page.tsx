// app/SelectionPage.tsx (With Spotlight - Original Layout Preserved)

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MuscleCanvas from "@/components/SelectionPage/MuscleCanvas";
import MuscleSidebar from "@/components/SelectionPage/MuscleSidebar";
import WorkoutDetailPanel from "@/components/SelectionPage/WorkoutDetailPanel";
import HeaderBar from "@/components/SelectionPage/HeaderBar";
import ExportButton from "@/components/SelectionPage/ExportButton";
import { Spotlight } from "@/components/ui/spotlight-new";

// Type definitions matching ExportButton's expected interface
interface Workout {
  name: string;
  type: string;
  equipment: string;
  sampleSetsReps: string;
  cues: string;
}

interface Muscle {
  name: string;
  description: string;
  primaryFunctions: string[];
  workouts: Workout[];
}

// Extended interfaces for internal use (if you need additional properties)
interface ExtendedWorkout extends Workout {
  id?: string | number;
  // Add other properties you might need internally
}

interface ExtendedMuscle extends Muscle {
  id?: string | number;
  workouts: ExtendedWorkout[];
  // Add other properties you might need internally
}

export default function SelectionPage(): React.JSX.Element {
  const [selectedMuscles, setSelectedMuscles] = useState<ExtendedMuscle[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedWorkout, setSelectedWorkout] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("selectedMuscles");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure workouts array exists and is not undefined
          const processedMuscles = parsed.map(muscle => ({
            ...muscle,
            workouts: muscle.workouts || [] // Provide default empty array if undefined
          }));
          setSelectedMuscles(processedMuscles);
          return;
        }
      } catch (error) {
        console.error("Error parsing stored muscles:", error);
      }
    }
    router.push("/");
  }, [router]);

  const handleBack = (): void => router.push("/");
  
  const clearSelection = (): void => {
    localStorage.removeItem("selectedMuscles");
    router.push("/");
  };

  if (selectedMuscles.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Animated Spotlight Background */}
        <Spotlight />
        
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 pointer-events-none" />
        
        <div className="text-center text-white relative z-10">
          {/* Modern loading spinner */}
          <div className="relative mx-auto mb-8 w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-gray-800"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-blue-500 animate-spin"></div>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Loading...
          </h2>
          <p className="text-gray-400 text-sm tracking-wide">
            Preparing your selected muscles...
          </p>
        </div>
      </div>
    );
  }

  const currentMuscle: ExtendedMuscle | undefined = selectedMuscles[activeTab];
  const currentWorkout: ExtendedWorkout | undefined = currentMuscle?.workouts?.[selectedWorkout];

  // Convert ExtendedMuscle[] to Muscle[] for ExportButton
  const musclesForExport: Muscle[] = selectedMuscles.map(muscle => ({
    name: muscle.name,
    description: muscle.description,
    primaryFunctions: muscle.primaryFunctions,
    workouts: muscle.workouts.map(workout => ({
      name: workout.name,
      type: workout.type,
      equipment: workout.equipment,
      sampleSetsReps: workout.sampleSetsReps,
      cues: workout.cues
    }))
  }));

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Animated Spotlight Background */}
      <Spotlight />
      
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Header Bar - keeping original functionality */}
      <HeaderBar
        selectedMuscles={selectedMuscles}
        handleBack={handleBack}
        clearSelection={clearSelection}
      />

      {/* Main content area - EXACT original layout structure */}
      <div className="flex-1 flex relative z-10">
        {/* 3D Canvas area - full width minus sidebar */}
        <MuscleCanvas
          selectedMuscles={selectedMuscles}
          activeTab={activeTab}
        />

        {/* Right Sidebar - exact original width and structure */}
        <div className="w-96 backdrop-blur-xl bg-gray-900/20 border-l border-gray-700/30 flex flex-col">
          {/* Muscle Sidebar */}
          <MuscleSidebar
            selectedMuscles={selectedMuscles}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSelectedWorkout={setSelectedWorkout}
          />

          {/* Workout Detail Panel */}
          <WorkoutDetailPanel
            currentWorkout={currentWorkout}
          />

          {/* Export Button Section - exact original structure */}
          <div className="p-6 border-t border-gray-700/30">
            <ExportButton selectedMuscles={musclesForExport} />
          </div>
        </div>
      </div>

      {/* Custom animations - minimal and non-intrusive */}
      <style jsx>{`
        @keyframes subtleFloat {
          0%, 100% { 
            transform: translateY(0px); 
            opacity: 0.1;
          }
          50% { 
            transform: translateY(-10px); 
            opacity: 0.15;
          }
        }
        
        :global(.animate-subtle-float) {
          animation: subtleFloat 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}