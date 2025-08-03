// app/rehab/page.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import PoseClient correctly
const PoseClient = dynamic(() => import("@/components/PoseClient"), {
  ssr: false,
  loading: () => <p className="text-white text-lg p-6">Loading Pose Detector...</p>,
});

export default function RehabPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-xl border border-white/10">
        <PoseClient />
      </div>
    </main>
  );
}
