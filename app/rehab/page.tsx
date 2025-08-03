"use client";

import dynamic from "next/dynamic";

// Dynamically import PoseClient correctly
const PoseClient = dynamic(() => import("@/components/PoseClient").then(mod => mod.default), {
  ssr: false,
  loading: () => <p className="text-white text-lg p-6">Loading Pose Detector...</p>,
});

export default function RehabPage() {
  return <PoseClient />;
}
