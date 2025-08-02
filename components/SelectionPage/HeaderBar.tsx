// components/SelectionPage/HeaderBar.tsx

import React from "react";

interface HeaderBarProps {
  selectedMuscles: any[];
  handleBack: () => void;
  clearSelection: () => void;
}

export default function HeaderBar({
  selectedMuscles,
  handleBack,
  clearSelection,
}: HeaderBarProps) {
  return (
    <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
              Muscle Analysis
            </h1>
            <p className="text-slate-300 text-lg">
              {selectedMuscles.length} selected muscle
              {selectedMuscles.length > 1 ? "s" : ""} • Detailed view & workouts
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
