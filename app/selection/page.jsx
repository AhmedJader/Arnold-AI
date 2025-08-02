// app/SelectionPage.tsx (Refactored Modular Version)

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MuscleCanvas from "@/components/SelectionPage/MuscleCanvas";
import MuscleSidebar from "@/components/SelectionPage/MuscleSidebar";
import WorkoutDetailPanel from "@/components/SelectionPage/WorkoutDetailPanel";
import HeaderBar from "@/components/SelectionPage/HeaderBar";
import ExportButton from "@/components/SelectionPage/ExportButton";

export default function SelectionPage() {
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedWorkout, setSelectedWorkout] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("selectedMuscles");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedMuscles(parsed);
          return;
        }
      } catch {}
    }
    router.push("/");
  }, [router]);

  const handleBack = () => router.push("/");
  const clearSelection = () => {
    localStorage.removeItem("selectedMuscles");
    router.push("/");
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
      <HeaderBar
        selectedMuscles={selectedMuscles}
        handleBack={handleBack}
        clearSelection={clearSelection}
      />

      <div className="flex-1 flex relative z-10">
        <MuscleCanvas
          selectedMuscles={selectedMuscles}
          activeTab={activeTab}
        />

        <div className="w-96 backdrop-blur-xl bg-white/5 border-l border-white/10 flex flex-col">
          <MuscleSidebar
            selectedMuscles={selectedMuscles}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setSelectedWorkout={setSelectedWorkout}
          />

          <WorkoutDetailPanel
            currentMuscle={currentMuscle}
            currentWorkout={currentWorkout}
            selectedWorkout={selectedWorkout}
            setSelectedWorkout={setSelectedWorkout}
          />

          <div className="p-6 border-t border-white/10">
            <ExportButton selectedMuscles={selectedMuscles} />
          </div>
        </div>
      </div>
    </div>
  );
}
