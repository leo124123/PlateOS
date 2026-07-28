import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CustomerAvatar3DProps {
  status: string;
  tableNumber: number;
}

export const CustomerAvatar3D: React.FC<CustomerAvatar3DProps> = ({ status }) => {
  const avatarGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (avatarGroupRef.current) {
      avatarGroupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.1;
      avatarGroupRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.02 + 0.9;
    }
  });

  const getAvatarShirtColor = () => {
    switch (status) {
      case 'ORDER_PENDING':
        return '#f59e0b';
      case 'EATING':
        return '#3b82f6';
      case 'BILL_REQUESTED':
        return '#eab308';
      default:
        return '#10b981';
    }
  };

  return (
    <group ref={avatarGroupRef} position={[0, 0.9, 0]}>
      {/* Customer Head */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.3} />
      </mesh>

      {/* Customer Torso */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.36, 16]} />
        <meshStandardMaterial color={getAvatarShirtColor()} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Plate on Table */}
      <mesh position={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
    </group>
  );
};
