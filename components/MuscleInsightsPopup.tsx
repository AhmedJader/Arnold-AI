// components/MuscleInsightsPopup.tsx
"use client";
import { motion } from "framer-motion";
import React from "react";

interface MuscleInsightsPopupProps {
  muscleKey: string;
  summary: string;
  onClose: () => void;
}

export default function MuscleInsightsPopup({
  muscleKey,
  summary,
  onClose,
}: MuscleInsightsPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="fixed top-20 left-1/2 z-[999] w-[90vw] max-w-xl -translate-x-1/2 backdrop-blur-2xl bg-black/80 border border-white/20 rounded-3xl p-6 shadow-2xl"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{muscleKey} Summary</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>
      <p className="text-gray-300 whitespace-pre-wrap">{summary}</p>
    </motion.div>
  );
}
