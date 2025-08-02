"use client";

import React from 'react';
import Man from '../components/Man';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            3D Muscle Anatomy
          </h1>
          <div className="space-x-6 text-white">
            <button className="hover:text-blue-300 transition-colors">About</button>
            <button className="hover:text-blue-300 transition-colors">Features</button>
            <button className="hover:text-blue-300 transition-colors">Contact</button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative h-[calc(100vh-120px)]">
        <Man />
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black bg-opacity-50 text-black text-center py-6">
        <p>&copy; 2025 3D Muscle Anatomy. Interactive learning made simple.</p>
      </footer>
    </div>
  );
}