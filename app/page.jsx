// app/page.jsx
"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white px-4">
      {/* Sketchfab animation background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <iframe
          src="https://sketchfab.com/models/db7be21587804a32ab3a99e165c56e19/embed?autostart=1&transparent=1&ui_controls=0&ui_infos=0&ui_stop=0&ui_hint=0&ui_watermark=0&ui_inspector=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_help=0&ui_logo=0&ui_sharing=0&ui_sidebar=0&ui_ar=0&ui_animations=0&ui_sound=0"
          className="w-full h-full absolute inset-0 opacity-80 scale-120"
          frameBorder="0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        />

        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      </div>

      {/* Hero content */}
      <div className="z-10 text-center max-w-2xl space-y-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-400 to-purple-400 text-transparent bg-clip-text drop-shadow-md">
          Welcome to FitAtlas
        </h1>
        <p className="text-lg text-gray-300 font-light leading-relaxed">
          An intelligent, interactive 3D muscle selector that builds workouts in seconds.
        </p>
        <button
          onClick={() => router.push("/muscles")}
          className="mt-6 inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-transform hover:cursor-pointer ease-in-out duration-300 hover:scale-105 shadow-xl"
        >
          Enter App
        </button>
      </div>
    </div>
  );
}
