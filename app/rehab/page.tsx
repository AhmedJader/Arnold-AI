"use client";

import dynamic from "next/dynamic";

// Dynamically import PoseClient correctly
const PoseClient = dynamic(() => import("@/components/PoseClient"), {
  ssr: false,
  loading: () => <p className="text-white text-lg p-6">Loading Pose Detector...</p>,
});

export default function RehabPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-5xl aspect-video relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
        <PoseClient />
      </div>
    </main>
  );
}
