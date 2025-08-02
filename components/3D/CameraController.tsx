// components/3D/CameraController.tsx

"use client";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export default function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(3, 1, 3);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}
