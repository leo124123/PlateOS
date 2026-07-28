import React from 'react';

// 1. Street Outside & Outdoor Sidewalk (Calle y Acera de la Ciudad)
export const OutdoorStreetArea3D: React.FC = () => {
  return (
    <group position={[0, 0, 20]}>
      {/* Asphalt Street Road (Calle exterior) */}
      <mesh position={[0, -0.05, 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 10]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Street Road Yellow Divider Line */}
      <mesh position={[0, 0.01, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 0.2]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>

      {/* Sidewalk Pavement (Acera peatonal) */}
      <mesh position={[0, 0.02, -2]} receiveShadow>
        <boxGeometry args={[44, 0.12, 4]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Outdoor Street Lamps (Faroles de calle 3D iluminados) */}
      {[-16, -6, 6, 16].map((x, idx) => (
        <group key={idx} position={[x, 0.08, -1]}>
          {/* Lamp Pole */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 3.6, 16]} />
            <meshStandardMaterial color="#020617" metalness={0.9} />
          </mesh>
          {/* Lamp Head Lantern */}
          <mesh position={[0, 3.6, 0]}>
            <coneGeometry args={[0.35, 0.4, 16]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.1} />
          </mesh>
          {/* Light Bulb Glow */}
          <pointLight position={[0, 3.4, 0]} intensity={1.8} color="#fbbf24" distance={8} />
        </group>
      ))}

      {/* Potted Palm Trees on Sidewalk */}
      {[-18, 18].map((x, idx) => (
        <group key={idx} position={[x, 0.08, -2.5]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.45, 0.35, 1.0, 16]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <sphereGeometry args={[0.85, 16, 16]} />
            <meshStandardMaterial color="#15803d" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// 2. Entrance Glass Facade & Restaurant Signboard (Fachada Frontal y Letrero)
export const EntranceArea3D: React.FC = () => {
  return (
    <group position={[0, 0, 15]}>
      {/* Front Exterior Glass Windows Wall Facade */}
      <mesh position={[-9, 1.6, 0]}>
        <boxGeometry args={[11, 3.2, 0.15]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.25} roughness={0.1} />
      </mesh>
      <mesh position={[9, 1.6, 0]}>
        <boxGeometry args={[11, 3.2, 0.15]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.25} roughness={0.1} />
      </mesh>

      {/* Main Glass Double Doors */}
      <mesh position={[-1.75, 1.5, 0]}>
        <boxGeometry args={[3.4, 3.0, 0.12]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      <mesh position={[1.75, 1.5, 0]}>
        <boxGeometry args={[3.4, 3.0, 0.12]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} roughness={0.1} />
      </mesh>

      {/* Metallic Door Frames */}
      <mesh position={[-3.5, 1.5, 0]}>
        <boxGeometry args={[0.15, 3.1, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[3.5, 1.5, 0]}>
        <boxGeometry args={[0.15, 3.1, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>

      {/* Door Handles */}
      <mesh position={[-0.5, 1.4, 0.12]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.5, 1.4, 0.12]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Restaurant Illuminated Front Signboard (Letrero "PLATEOS GOURMET") */}
      <group position={[0, 3.4, 0.2]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[12, 0.9, 0.25]} />
          <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
          <boxGeometry args={[11.6, 0.7, 0.04]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.1} />
        </mesh>
      </group>

      {/* Welcome Red Carpet Mat */}
      <mesh position={[0, 0.02, -1.2]}>
        <boxGeometry args={[4.5, 0.03, 2.2]} />
        <meshStandardMaterial color="#991b1b" roughness={0.9} />
      </mesh>

      {/* Reception Host Desk & Tablet Stand */}
      <group position={[5, 0, -2.5]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[1.8, 1.2, 1.0]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.22, 0]}>
          <boxGeometry args={[2.0, 0.08, 1.2]} />
          <meshStandardMaterial color="#b45309" roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.45, 0]} rotation={[-0.3, 0, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.04]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
      </group>
    </group>
  );
};

// 3. Waiter POS Touch Computer Station (Puesto del Mesero y Computadora POS)
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
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 0.3, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.7, 0.5, 0.08]} />
          <meshStandardMaterial color="#020617" metalness={0.9} />
        </mesh>
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

      <mesh position={[0.7, 1.48, 0.2]}>
        <boxGeometry args={[0.12, 0.06, 0.02]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
};

// 4. Open Kitchen & Chef Pass (Cocina Abierta 3D Completa)
export const OpenKitchen3D: React.FC = () => {
  return (
    <group position={[0, 0, -14.5]}>
      {/* Full Back Partition Wall */}
      <mesh position={[0, 1.6, -0.2]}>
        <boxGeometry args={[30, 3.2, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Stainless Steel Prep Counter */}
      <mesh position={[0, 0.55, 1.5]}>
        <boxGeometry args={[14, 1.1, 1.4]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Cooking Pots & Pans on Counter */}
      {[-4, -1, 2, 5].map((x, idx) => (
        <group key={idx} position={[x, 1.15, 1.5]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.25, 0.22, 0.2, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
        </group>
      ))}

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
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Kitchen Entrance / Exit Doors */}
      <group position={[-10, 0, 0]}>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[2.2, 2.4, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 1.6, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
};

// 5. Fully Stocked Bar & Lounge Counter
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

      {/* Backlit Liquor Bottle Display Shelves with Glass Bottles */}
      <group position={[0, 1.5, -1.8]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[6.2, 1.4, 0.4]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Glowing Shelves */}
        {[-0.2, 0.4, 1.0].map((y, idx) => (
          <group key={idx}>
            <mesh position={[0, y, 0.25]}>
              <boxGeometry args={[6.0, 0.05, 0.35]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} />
            </mesh>

            {/* Glass Liquor Bottles on Shelf */}
            {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((bx, bidx) => (
              <mesh key={bidx} position={[bx, y + 0.22, 0.25]}>
                <cylinderGeometry args={[0.06, 0.08, 0.38, 16]} />
                <meshStandardMaterial
                  color={bidx % 3 === 0 ? '#10b981' : bidx % 2 === 0 ? '#f59e0b' : '#ef4444'}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            ))}
          </group>
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
