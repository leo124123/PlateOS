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
      avatarGroupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.06;
      avatarGroupRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.01 + 0.88;
    }
  });

  const getShirtColor = () => {
    switch (status) {
      case 'ORDER_PENDING': return '#f97316';
      case 'EATING':
      case 'OCCUPIED': return '#2563eb';
      case 'BILL_REQUESTED': return '#eab308';
      default: return '#10b981';
    }
  };

  const shirtColor = getShirtColor();
  const hairColors = ['#451a03', '#1e1b4b', '#78350f'];
  const skinColors = ['#fcd34d', '#fbbf24', '#d4a574'];

  return (
    <group ref={avatarGroupRef} position={[0, 0.88, 0]}>
      {/* Two Seated Diners */}
      {[[-0.55, -0.4], [0.55, -0.4]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Head */}
          <mesh position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color={skinColors[i % skinColors.length]} roughness={0.5} />
          </mesh>
          {/* Hair */}
          <mesh position={[0, 0.5, -0.03]}>
            <sphereGeometry args={[0.15, 10, 10]} />
            <meshStandardMaterial color={hairColors[i % hairColors.length]} roughness={0.7} />
          </mesh>
          {/* Torso */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 0.3, 12]} />
            <meshStandardMaterial color={shirtColor} roughness={0.4} />
          </mesh>
          {/* Arms */}
          <mesh position={[0.16, 0.2, 0.08]} rotation={[0.5, 0, 0.3]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 6]} />
            <meshStandardMaterial color={shirtColor} roughness={0.4} />
          </mesh>
          <mesh position={[-0.16, 0.2, 0.08]} rotation={[0.5, 0, -0.3]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 6]} />
            <meshStandardMaterial color={shirtColor} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Table Accessories */}
      {/* White Dinner Plate */}
      <mesh position={[-0.25, 0.02, 0.1]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>
      {/* Food on plate */}
      <mesh position={[-0.25, 0.04, 0.1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#92400e" roughness={0.5} />
      </mesh>
      {/* Garnish */}
      <mesh position={[-0.15, 0.06, 0.15]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Second Plate */}
      <mesh position={[0.25, 0.02, 0.1]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>
      <mesh position={[0.25, 0.04, 0.1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#b45309" roughness={0.5} />
      </mesh>

      {/* Wine Glass */}
      <mesh position={[0.4, 0.1, -0.15]}>
        <cylinderGeometry args={[0.04, 0.02, 0.14, 8]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.4, 0.06, -0.15]}>
        <cylinderGeometry args={[0.035, 0.015, 0.08, 8]} />
        <meshStandardMaterial color="#881337" />
      </mesh>
      {/* Water Glass */}
      <mesh position={[-0.4, 0.06, -0.15]}>
        <cylinderGeometry args={[0.04, 0.035, 0.1, 8]} />
        <meshStandardMaterial color="#bfdbfe" transparent opacity={0.4} />
      </mesh>

      {/* Salt & Pepper */}
      <mesh position={[0, 0.06, -0.2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0.07, 0.06, -0.2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Napkin */}
      <mesh position={[-0.45, 0.02, 0.1]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.14, 0.01, 0.18]} />
        <meshStandardMaterial color="#fecaca" />
      </mesh>
    </group>
  );
};

// ─── STAFF AVATARS ───────────────────────────────────────────────────────────

const StaffPerson: React.FC<{
  position: [number, number, number];
  shirtColor: string;
  pantsColor: string;
  accessory?: 'chef_hat' | 'apron' | 'tie' | 'vest';
  accessoryColor?: string;
  skinColor?: string;
  hairColor?: string;
}> = ({ position, shirtColor, pantsColor, accessory, accessoryColor = '#ffffff', skinColor = '#fcd34d', hairColor = '#451a03' }) => (
  <group position={position}>
    {/* Legs */}
    <mesh position={[-0.06, 0.22, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.44, 8]} />
      <meshStandardMaterial color={pantsColor} roughness={0.4} />
    </mesh>
    <mesh position={[0.06, 0.22, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.44, 8]} />
      <meshStandardMaterial color={pantsColor} roughness={0.4} />
    </mesh>
    {/* Shoes */}
    <mesh position={[-0.06, 0.03, 0.04]}>
      <boxGeometry args={[0.1, 0.06, 0.16]} />
      <meshStandardMaterial color="#0f172a" roughness={0.3} />
    </mesh>
    <mesh position={[0.06, 0.03, 0.04]}>
      <boxGeometry args={[0.1, 0.06, 0.16]} />
      <meshStandardMaterial color="#0f172a" roughness={0.3} />
    </mesh>
    {/* Torso */}
    <mesh position={[0, 0.65, 0]}>
      <cylinderGeometry args={[0.16, 0.18, 0.5, 12]} />
      <meshStandardMaterial color={shirtColor} roughness={0.3} />
    </mesh>
    {/* Arms */}
    <mesh position={[0.2, 0.65, 0]} rotation={[0, 0, -0.15]}>
      <cylinderGeometry args={[0.05, 0.04, 0.4, 8]} />
      <meshStandardMaterial color={shirtColor} roughness={0.3} />
    </mesh>
    <mesh position={[-0.2, 0.65, 0]} rotation={[0, 0, 0.15]}>
      <cylinderGeometry args={[0.05, 0.04, 0.4, 8]} />
      <meshStandardMaterial color={shirtColor} roughness={0.3} />
    </mesh>
    {/* Head */}
    <mesh position={[0, 1.0, 0]}>
      <sphereGeometry args={[0.14, 12, 12]} />
      <meshStandardMaterial color={skinColor} roughness={0.5} />
    </mesh>
    {/* Hair */}
    <mesh position={[0, 1.08, -0.02]}>
      <sphereGeometry args={[0.15, 10, 10]} />
      <meshStandardMaterial color={hairColor} roughness={0.7} />
    </mesh>

    {/* Accessories */}
    {accessory === 'chef_hat' && (
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.14, 0.12, 0.3, 12]} />
        <meshStandardMaterial color={accessoryColor} roughness={0.2} />
      </mesh>
    )}
    {accessory === 'apron' && (
      <mesh position={[0, 0.55, 0.1]}>
        <boxGeometry args={[0.3, 0.4, 0.03]} />
        <meshStandardMaterial color={accessoryColor} />
      </mesh>
    )}
    {accessory === 'tie' && (
      <mesh position={[0, 0.72, 0.1]}>
        <boxGeometry args={[0.06, 0.3, 0.02]} />
        <meshStandardMaterial color={accessoryColor} metalness={0.6} />
      </mesh>
    )}
    {accessory === 'vest' && (
      <mesh position={[0, 0.65, 0.09]}>
        <boxGeometry args={[0.28, 0.35, 0.02]} />
        <meshStandardMaterial color={accessoryColor} roughness={0.3} />
      </mesh>
    )}
  </group>
);

export const StaffAvatars3D: React.FC = () => (
  <group>
    {/* Chef in Kitchen */}
    <StaffPerson position={[0, 0, -13.2]} shirtColor="#f8fafc" pantsColor="#1e293b" accessory="chef_hat" accessoryColor="#ffffff" />
    {/* Second Chef */}
    <StaffPerson position={[3, 0, -13.2]} shirtColor="#f8fafc" pantsColor="#1e293b" accessory="chef_hat" accessoryColor="#ffffff" hairColor="#78350f" />

    {/* Bartender */}
    <StaffPerson position={[-11, 0, 5.8]} shirtColor="#020617" pantsColor="#020617" accessory="apron" accessoryColor="#dc2626" skinColor="#d4a574" />

    {/* Host at Reception */}
    <StaffPerson position={[5.5, 0, 12]} shirtColor="#1e293b" pantsColor="#0f172a" accessory="vest" accessoryColor="#dc2626" hairColor="#1e1b4b" />

    {/* Waiter at POS */}
    <StaffPerson position={[-12.5, 0, -1]} shirtColor="#1e293b" pantsColor="#0f172a" accessory="tie" accessoryColor="#f59e0b" />

    {/* Waiter on Floor */}
    <StaffPerson position={[2, 0, -3]} shirtColor="#1e293b" pantsColor="#0f172a" accessory="tie" accessoryColor="#f59e0b" hairColor="#78350f" skinColor="#d4a574" />
  </group>
);
