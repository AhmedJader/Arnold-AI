"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AvatarModel } from "@/components/models/AvatarModel";  
export default function AvatarScene() {
  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 1]} intensity={1.2} />

      {/* Avatar Model */}
      <AvatarModel />

      {/* Controls */}
      <OrbitControls enablePan={false} enableZoom={true} />
    </Canvas>
  );
}
