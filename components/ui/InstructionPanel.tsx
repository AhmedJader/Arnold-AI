// components/ui/InstructionPanel.tsx

"use client";
import React from "react";

interface InstructionPanelProps {
  onClose: () => void;
}

export default function InstructionPanel({ onClose }: InstructionPanelProps) {
  return (
    <div className="absolute top-6 left-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 max-w-sm shadow-2xl animate-in slide-in-from-left duration-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-lg">How to Use</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-3 text-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
          <span className="text-sm">Click colored areas to select muscles</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-sm">Selected muscles pulse and turn white</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full" />
          <span className="text-sm">Drag to rotate • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}
