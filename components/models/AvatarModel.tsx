// components/models/AvatarModel.tsx
"use client";

export function AvatarModel() {
  return (
    <mesh position={[0, 1, 0]}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
}
