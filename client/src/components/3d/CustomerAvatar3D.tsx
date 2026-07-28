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
      avatarGroupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.08;
      avatarGroupRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.015 + 0.88;
    }
  });

  const getAvatarShirtColor = () => {
    switch (status) {
      case 'ORDER_PENDING':
        return '#f97316';
      case 'EATING':
      case 'OCCUPIED':
        return '#2563eb';
      case 'BILL_REQUESTED':
        return '#eab308';
      default:
        return '#10b981';
    }
  };

  const shirtColor = getAvatarShirtColor();

  return (
    <group ref={avatarGroupRef} position={[0, 0.88, 0]}>
      {/* Seated Diners around Table */}
      {[-0.6, 0.6].map((xOffset, idx) => (
        <group key={idx} position={[xOffset, 0, -0.45]}>
          {/* Head & Hair */}
          <mesh position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.52, -0.02]}>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#451a03" roughness={0.6} />
          </mesh>

          {/* Torso Shirt */}
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.35, 16]} />
            <meshStandardMaterial color={shirtColor} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Gourmet Food Plate on Table */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.02, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>

      {/* Gourmet Dish Food Mesh */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#b45309" roughness={0.5} />
      </mesh>

      {/* Wine Glass on Table */}
      <group position={[0.35, 0.08, 0.2]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.05, 0.02, 0.16, 16]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        {/* Red Wine inside Glass */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.04, 0.015, 0.1, 16]} />
          <meshStandardMaterial color="#881337" />
        </mesh>
      </group>
    </group>
  );
};

// Staff 3D Avatars (Chef in Kitchen, Bartender at Bar, Waiter at POS)
export const StaffAvatars3D: React.FC = () => {
  return (
    <group>
      {/* 👨‍🍳 Chef Ramón in Open Kitchen */}
      <group position={[0, 0.6, -13.2]}>
        {/* Chef Hat (Toque) */}
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.18, 0.16, 0.4, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        {/* White Chef Coat */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.7, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
      </group>

      {/* 🍸 Bartender at Bar */}
      <group position={[-11, 0.6, 6]}>
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.7, 16]} />
          <meshStandardMaterial color="#020617" roughness={0.2} />
        </mesh>
        {/* Red Apron */}
        <mesh position={[0, 0.4, 0.12]}>
          <boxGeometry args={[0.36, 0.5, 0.04]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* 🕺 Waiter Carlos at POS Computer Station */}
      <group position={[-12, 0.6, -1.8]}>
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.7, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* Golden Tie */}
        <mesh position={[0, 0.6, 0.14]}>
          <boxGeometry args={[0.08, 0.35, 0.02]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} />
        </mesh>
      </group>
    </group>
  );
};
