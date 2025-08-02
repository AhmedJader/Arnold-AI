// components/SelectionPage/ExportButton.tsx
"use client";
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import WorkoutPlanPDF from "@/components/pdf/WorkoutPlanPDF";

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

interface ExportButtonProps {
  selectedMuscles: Muscle[];
}

export default function ExportButton({ selectedMuscles }: ExportButtonProps) {
  const exportDate = new Date().toISOString();

  return (
    <PDFDownloadLink
      document={<WorkoutPlanPDF muscles={selectedMuscles} exportDate={exportDate} />}
      fileName="workout-plan.pdf"
    >
      {({ loading }) => (
        <button
          disabled={loading}
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
          {loading ? "Generating PDF..." : "Export Workout Plan"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
