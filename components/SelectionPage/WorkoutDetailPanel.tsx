// components/SelectionPage/WorkoutDetailPanel.tsx

import React from "react";

export default function WorkoutDetailPanel({ currentWorkout }: { currentWorkout: any }) {
  if (!currentWorkout) return null;

  return (
    <div className="space-y-4">
      <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
        <h4 className="font-bold text-white mb-3 text-lg">{currentWorkout.name}</h4>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
              Type
            </span>
            <span
              className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${
                currentWorkout.type === "Compound"
                  ? "bg-orange-500/20 text-orange-200"
                  : "bg-blue-500/20 text-blue-200"
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
  );
}
