// app/page.tsx (Next.js 14+ App Router)
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Dynamically import the 3D component to avoid SSR issues
const AvatarScene = dynamic(() => import("@/components/AvatarScene"), {
  ssr: false,
  loading: () => <p className="text-center mt-10">Loading 3D Avatar...</p>,
});


export default function Home() {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Canvas */}
      <AvatarScene />

      {/* Overlay content */}
      {showOverlay && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white bg-black/40">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to TinyChoices</h1>
          <p className="text-lg mb-8 text-center max-w-md">
            Guide your child avatar through tiny daily choices to shape a healthier future.
          </p>
          <Button size="lg" onClick={() => setShowOverlay(false)}>
            Start Simulation →
          </Button>
        </div>
      )}
    </div>
  );
}