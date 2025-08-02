'use client';

import React from 'react';
import { useState } from 'react';

// Spotlight component
const Spotlight = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, 0.12) 0%, hsla(210, 100%, 55%, 0.05) 50%, hsla(210, 100%, 45%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, 0.12) 0%, hsla(210, 100%, 55%, 0.08) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, 0.08) 0%, hsla(210, 100%, 45%, 0.08) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
} = {}) => {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full filter brightness-125 lg:brightness-150">
      {/* Left spotlight group with blur */}
      <div
        className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none animate-pulse"
        style={{ filter: "blur(80px)" }}
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`, 
            height: `${height}px`,
          }}
          className="absolute top-0 left-0"
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`, 
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`, 
            height: `${height}px`,
          }}
          className="absolute top-0 left-0 origin-top-left"
        />
      </div>
       
      {/* Right spotlight group with blur */}
      <div
        className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none animate-pulse"
        style={{ filter: "blur(80px)" }}
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`, 
            height: `${height}px`,
          }}
          className="absolute top-0 right-0"
        />
        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`, 
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`, 
            height: `${height}px`,
          }}
          className="absolute top-0 right-0 origin-top-right"
        />
      </div>
    </div>
  );
};

export default function Arnold() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Spotlight Background */}
      <Spotlight />
      
      {/* Header */}
      <div className="relative z-50 text-center px-4 sm:px-6 md:px-8 max-w-sm sm:max-w-md w-full mx-auto pt-8 sm:pt-12 md:pt-16 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          ARNOLD
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-neutral-400 font-light tracking-wide">
          Your Fitness Companion
        </p>
      </div>

      {/* Full Screen 3D Model */}
      <div className="absolute inset-0 z-10">
        <iframe 
          title="Human Anatomy 3D Model" 
          frameBorder="0" 
          allowFullScreen 
          mozallowfullscreen="true" 
          webkitallowfullscreen="true" 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          xr-spatial-tracking="true"
          execution-while-out-of-viewport="true"
          execution-while-not-rendered="true" 
          web-share="true"
          src="https://sketchfab.com/models/db7be21587804a32ab3a99e165c56e19/embed?ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&preload=1&autostart=1&ui_hint=0&ui_loading=0&ui_general=0&ui_sharing=0&ui_logo=0&ui_ar=0&transparent=1&background=000000&ui_animations=0&ui_sound=0&ui_fade=0&ui_theme=dark&camera=0&ui_related=0&ui_sidebar=0"
          className="w-full h-full opacity-80"
        />
        
        {/* Mobile-optimized black overlay borders */}
        {/* Top border - responsive height */}
        <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 md:h-20 bg-black z-20 pointer-events-none"></div>
        
        {/* Left border - hidden on mobile, visible on larger screens */}
        <div className="absolute top-0 left-0 bottom-0 w-0 sm:w-4 md:w-6 bg-black z-20 pointer-events-none"></div>
        
        {/* Right border - hidden on mobile, visible on larger screens */}
        <div className="absolute top-0 right-0 bottom-0 w-0 sm:w-16 md:w-20 lg:w-24 bg-black z-20 pointer-events-none"></div>
        
        {/* Bottom border - responsive height */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-black z-20 pointer-events-none"></div>
        
        {/* Bottom left corner - responsive size */}
        <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 bg-black z-20 pointer-events-none"></div>
        
        {/* Additional mobile-specific overlays for better UI hiding */}
        {/* Top right corner - covers share/profile buttons */}
        <div className="absolute top-0 right-0 w-16 sm:w-20 md:w-24 h-12 sm:h-16 md:h-20 bg-black z-20 pointer-events-none"></div>
        
        {/* Bottom right corner - covers additional controls */}
        <div className="absolute bottom-0 right-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-black z-20 pointer-events-none"></div>
      </div>
    </div>
  );
}