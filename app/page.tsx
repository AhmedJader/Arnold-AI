// app/page.tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Spotlight } from "../components/ui/spotlight-new";

export default function LandingPage(): React.JSX.Element {
  const router = useRouter();

  const handleLogin = (): void => {
    // Add your login logic here
    console.log("Login clicked");
    // router.push("/login");
  };

  const handleSignup = (): void => {
    // Add your signup logic here
    console.log("Signup clicked");
    // router.push("/signup");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden bg-black text-white">
      {/* Spotlight background */}
      <Spotlight />
      
      {/* Top Right Auth Buttons */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2 
        }}
        className="absolute top-6 right-6 z-50 flex items-center space-x-4"
      >
        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="px-6 hover:cursor-pointer py-2.5 text-xs font-medium text-white/90 hover:text-white transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-full bg-white/5 hover:bg-white/10"
        >
          Login
        </button>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="px-6 hover:cursor-pointer py-2.5 text-xs font-medium text-white bg-gradient-to-r from-gray-600/80 to-neutral-600/80 hover:from-neutral-600/80 hover:to-neutral-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm rounded-full border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl"
        >
          Sign Up
        </button>
      </motion.div>
      
      {/* 3D Model background - rotatable with user controls */}
      <div className="absolute inset-0 z-0">
        <div className="sketchfab-embed-wrapper w-full h-full">
          <iframe 
            title="Muscles and Bones Anatomy body Animation" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; fullscreen; xr-spatial-tracking" 
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
            src="https://sketchfab.com/models/db7be21587804a32ab3a99e165c56e19/embed?autospin=1&autostart=1&transparent=1"
            className="w-full h-full absolute inset-0 opacity-60 pointer-events-auto scale-120"
          />
        </div>
        
        {/* Dark overlay for better text readability - with pointer events disabled */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>

      {/* Main content */}
      <div className="relative z-50 flex flex-col items-center justify-center flex-1 px-6 sm:px-8 md:px-0 max-w-md w-full space-y-8 pointer-events-none">
        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1 
          }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"
        >
          ARNOLD
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.3 
          }}
          className="text-lg sm:text-xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500"
        >
          Your Fitness Companion
        </motion.p>

        {/* Next Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.5 
          }}
          onClick={() => router.push("/muscles")}
          className="mt-8 inline-flex items-center justify-center px-10 py-4 rounded-full text-white font-medium bg-black/60 hover:bg-black/80 hover:cursor-pointer transition-all duration-300 hover:scale-105 shadow-2xl backdrop-blur-lg border border-white/10 hover:border-white/20 pointer-events-auto group"
        >
          <span className="relative z-10">Explore</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neutral-800/50 to-neutral-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.7 
        }}
        className="relative z-50 pb-6 text-center pointer-events-none"
      >
        <p className="text-xs animate-pulse sm:text-base bg-clip-text text-transparent bg-gradient-to-b from-neutral-300 to-neutral-600">
          Terrahacks 2025 - By Omid Latifi & Ahmed Abduljader
        </p>
      </motion.footer>
    </div>
  );
}