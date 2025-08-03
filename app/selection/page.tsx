"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MuscleCanvas from "@/components/SelectionPage/MuscleCanvas";
import MuscleSidebar from "@/components/SelectionPage/MuscleSidebar";
import WorkoutDetailPanel from "@/components/SelectionPage/WorkoutDetailPanel";
import HeaderBar from "@/components/SelectionPage/HeaderBar";
import ExportButton from "@/components/SelectionPage/ExportButton";
import { Spotlight } from "@/components/ui/spotlight-new";
import { MUSCLE_GROUPS } from "@/lib/constants/muscleGroups";

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

interface ExtendedWorkout extends Workout {
  id?: string | number;
}

interface ExtendedMuscle extends Muscle {
  id?: string | number;
  workouts: ExtendedWorkout[];
}

export default function SelectionPage(): React.JSX.Element {
  const [selectedMuscles, setSelectedMuscles] = useState<ExtendedMuscle[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedWorkout, setSelectedWorkout] = useState<number>(0);
  const [ttsLoading, setTtsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("selectedMuscles");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const processedMuscles = parsed.map(muscle => ({
            ...muscle,
            workouts: muscle.workouts || []
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

  const playWorkoutTTS = async (muscle: ExtendedMuscle) => {
    setTtsLoading(true);
    try {
      const res = await fetch("/api/muscle-workout-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          muscleName: muscle.name,
          workouts: muscle.workouts.map(({ name }) => ({
            name,
            cues: "", // let API generate cues internally
          }))
        }),
      });

      const { base64Audio, error } = await res.json();
      if (error || !base64Audio) throw new Error(error || "No audio returned.");

      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
      audio.play();
    } catch (err) {
      console.error("TTS Error:", err);
    } finally {
      setTtsLoading(false);
    }
  };

  const handleBack = (): void => router.push("/");
  const clearSelection = (): void => {
    localStorage.removeItem("selectedMuscles");
    router.push("/");
  };

  if (selectedMuscles.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <Spotlight />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 pointer-events-none" />
        <div className="text-center text-white relative z-10">
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

  const currentMuscle = selectedMuscles[activeTab];
  const currentWorkout = currentMuscle?.workouts?.[selectedWorkout];

  const musclesForExport: Muscle[] = selectedMuscles.map(muscle => ({
    name: muscle.name,
    description: muscle.description,
    primaryFunctions: muscle.primaryFunctions,
    workouts: muscle.workouts.map(workout => ({
      name: workout.name,
      type: workout.type,
      equipment: workout.equipment,
      sampleSetsReps: workout.sampleSetsReps,
      cues: workout.cues,
    })),
  }));

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <Spotlight />
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 pointer-events-none" />
      <HeaderBar
        selectedMuscles={selectedMuscles}
        handleBack={handleBack}
        clearSelection={clearSelection}
      />
      <div className="flex-1 flex relative z-10">
        <MuscleCanvas selectedMuscles={selectedMuscles} activeTab={activeTab} />
        <div className="w-96 backdrop-blur-xl bg-gray-900/20 border-l border-gray-700/30 flex flex-col">
          <MuscleSidebar
            selectedMuscles={selectedMuscles}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSelectedWorkout={setSelectedWorkout}
          />
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            {currentMuscle?.workouts.map((workout, i) => (
              <WorkoutDetailPanel key={i} currentWorkout={workout} />
            ))}
          </div>
          {currentMuscle && (
            <button
              onClick={() => playWorkoutTTS(currentMuscle)}
              disabled={ttsLoading}
              className="mx-6 mt-4 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium shadow-lg transition"
            >
              {ttsLoading ? "Generating tips..." : `🎧 Form Tips for ${currentMuscle.name}`}
            </button>
          )}
          <div className="p-6 border-t border-gray-700/30">
            <ExportButton selectedMuscles={musclesForExport} />
          </div>
        </div>
      </div>
    </div>
  );
}
