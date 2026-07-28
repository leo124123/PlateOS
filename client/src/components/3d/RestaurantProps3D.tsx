import React from 'react';

// 1. Entrance Doors & Reception Desk (Entrada Principal del Local)
export const EntranceArea3D: React.FC = () => {
  return (
    <group position={[0, 0, 15]}>
      {/* Glass Entrance Double Doors */}
      <mesh position={[-2, 1.6, 0]}>
        <boxGeometry args={[3.2, 3.2, 0.15]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} roughness={0.1} />
      </mesh>
      <mesh position={[2, 1.6, 0]}>
        <boxGeometry args={[3.2, 3.2, 0.15]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} roughness={0.1} />
      </mesh>

      {/* Metal Door Frames */}
      <mesh position={[-3.6, 1.6, 0]}>
        <boxGeometry args={[0.2, 3.4, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[3.6, 1.6, 0]}>
        <boxGeometry args={[0.2, 3.4, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <boxGeometry args={[7.4, 0.2, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>

      {/* Door Handles */}
      <mesh position={[-0.6, 1.5, 0.15]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.6, 1.5, 0.15]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Welcome Mat */}
      <mesh position={[0, 0.02, -1.2]}>
        <boxGeometry args={[4.5, 0.03, 2.2]} />
        <meshStandardMaterial color="#991b1b" roughness={0.9} />
      </mesh>

      {/* Reception Host Desk & iPad Stand */}
      <group position={[4.5, 0, -2]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.8, 1.2, 1.0]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* Desk Top */}
        <mesh position={[0, 1.22, 0]}>
          <boxGeometry args={[2.0, 0.08, 1.2]} />
          <meshStandardMaterial color="#b45309" roughness={0.2} />
        </mesh>
        {/* Host iPad Screen */}
        <mesh position={[0, 1.45, 0]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.04]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
      </group>
    </group>
  );
};

// 2. Waiter POS Touch Computer Station (Puesto del Mesero y Computadora POS)
export const WaiterPOSStation3D: React.FC = () => {
  return (
    <group position={[-12, 0, 0]}>
      {/* POS Station Desk */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[2.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 1.22, 0]}>
        <boxGeometry args={[2.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.7} />
      </mesh>

      {/* POS Touch Terminal Screen (BeatlePOS Monitor 3D) */}
      <group position={[0, 1.6, 0]} rotation={[0, Math.PI / 4, 0]}>
        {/* Monitor Base Stand */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.3, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        {/* Screen Frame */}
        <mesh position={[0, 0.1, 0]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.7, 0.5, 0.08]} />
          <meshStandardMaterial color="#020617" metalness={0.9} />
        </mesh>
        {/* Glowing Touch Screen Surface */}
        <mesh position={[0, 0.1, 0.045]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[0.62, 0.42]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} />
        </mesh>
      </group>

      {/* Receipt Thermal Printer */}
      <mesh position={[0.7, 1.34, 0.2]}>
        <boxGeometry args={[0.3, 0.25, 0.35]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* Paper Receipt Roll Output */}
      <mesh position={[0.7, 1.48, 0.2]}>
        <boxGeometry args={[0.12, 0.06, 0.02]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
};

// 3. Open Kitchen & Chef Pass (Cocina Abierta 3D con Campana e Iluminación de Pase)
export const OpenKitchen3D: React.FC = () => {
  return (
    <group position={[0, 0, -14.5]}>
      {/* Stainless Steel Prep Counter */}
      <mesh position={[0, 0.55, 1.5]}>
        <boxGeometry args={[14, 1.1, 1.4]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Chef Pass Heating Bar */}
      <mesh position={[0, 1.5, 1.5]}>
        <boxGeometry args={[13.8, 0.1, 0.3]} />
        <meshStandardMaterial color="#ef4444" roughness={0.2} />
      </mesh>

      {/* Warm Heat Lamps */}
      {[-5, -2.5, 0, 2.5, 5].map((x, idx) => (
        <mesh key={idx} position={[x, 1.35, 1.5]}>
          <coneGeometry args={[0.2, 0.3, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.1} />
        </mesh>
      ))}

      {/* Kitchen Industrial Exhaust Hood */}
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[15, 0.8, 2.5]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Kitchen Entrance / Exit Doors */}
      <group position={[-9, 0, 0]}>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[2.2, 2.4, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Porthole Window */}
        <mesh position={[0, 1.6, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
};

// 4. Bar & Lounge counter with Backlit Bottle Shelves
export const BarLoungeArea3D: React.FC = () => {
  return (
    <group position={[-11, 0, 7]}>
      {/* Curved Bar Counter Desk */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[6.5, 1.2, 1.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[6.9, 0.1, 2.1]} />
        <meshStandardMaterial color="#2563eb" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Backlit Liquor Bottle Display Shelf */}
      <group position={[0, 1.5, -1.8]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[6.2, 1.4, 0.4]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Glowing Shelves */}
        {[-0.2, 0.4, 1.0].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.25]}>
            <boxGeometry args={[6.0, 0.05, 0.35]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* Bar Stools */}
      {[-2.2, -0.7, 0.7, 2.2].map((x, idx) => (
        <group key={idx} position={[x, 0, 1.6]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.8, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.08, 16]} />
            <meshStandardMaterial color="#2563eb" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
