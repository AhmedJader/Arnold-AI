// components/SelectionPage/MuscleSidebar.tsx

import React from "react";

interface MuscleSidebarProps {
  selectedMuscles: any[];
  activeTab: number;
  setActiveTab: (index: number) => void;
  setSelectedWorkout: (index: number) => void;
}

export default function MuscleSidebar({
  selectedMuscles,
  activeTab,
  setActiveTab,
  setSelectedWorkout,
}: MuscleSidebarProps) {
  return (
    <div className="border-b border-white/10 px-3 pb-3 max-h-48 overflow-y-auto">
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
                ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-400/30 shadow-lg"
                : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-transparent"
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
                {(muscle.workouts?.length || 0) !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="text-xs opacity-50 bg-white/20 px-2 py-1 rounded-full">
              {index + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
