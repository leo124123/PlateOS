import React from 'react';
import { Text } from '@react-three/drei';

// ─── 1. OUTDOOR STREET & SIDEWALK ────────────────────────────────────────────
export const OutdoorStreetArea3D: React.FC = () => (
  <group position={[0, 0, 20]}>
    {/* Asphalt Road */}
    <mesh position={[0, -0.05, 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 10]} />
      <meshStandardMaterial color="#181825" roughness={0.95} />
    </mesh>
    {/* Road Center Yellow Line */}
    <mesh position={[0, 0.01, 4]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 0.18]} />
      <meshStandardMaterial color="#eab308" />
    </mesh>
    {/* Dashed White Lane Marks */}
    {[-15, -10, -5, 0, 5, 10, 15].map((x, i) => (
      <mesh key={i} position={[x, 0.015, 6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 0.1]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    ))}
    {/* Concrete Sidewalk */}
    <mesh position={[0, 0.04, -1.5]} receiveShadow>
      <boxGeometry args={[40, 0.1, 5]} />
      <meshStandardMaterial color="#475569" roughness={0.7} />
    </mesh>
    {/* Curb Edge */}
    <mesh position={[0, 0.12, 1]}>
      <boxGeometry args={[40, 0.16, 0.25]} />
      <meshStandardMaterial color="#94a3b8" roughness={0.5} />
    </mesh>

    {/* Street Lamps */}
    {[-14, -4, 6, 16].map((x, i) => (
      <group key={i} position={[x, 0, -1.5]}>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 4, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <mesh position={[0.4, 3.8, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        <mesh position={[0.7, 3.9, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={0.9} />
        </mesh>
        <pointLight position={[0.7, 3.6, 0]} intensity={2.5} color="#fbbf24" distance={10} />
      </group>
    ))}

    {/* Trees on Sidewalk */}
    {[-18, -9, 9, 18].map((x, i) => (
      <group key={i} position={[x, 0, -3]}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.8, 0.6, 0.8]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 1.5, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        <mesh position={[0, 2.4, 0]}>
          <sphereGeometry args={[0.75, 12, 12]} />
          <meshStandardMaterial color="#166534" roughness={0.7} />
        </mesh>
        <mesh position={[0.3, 2.6, 0.2]}>
          <sphereGeometry args={[0.55, 12, 12]} />
          <meshStandardMaterial color="#15803d" roughness={0.7} />
        </mesh>
      </group>
    ))}

    {/* Parked Car */}
    <group position={[10, 0.3, 6.5]}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[3.5, 0.7, 1.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[-0.2, 0.85, 0]}>
        <boxGeometry args={[2.0, 0.6, 1.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[1.76, 0.35, 0.5]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fbbf24" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[1.76, 0.35, -0.5]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fbbf24" emissiveIntensity={0.7} />
      </mesh>
    </group>
  </group>
);

// ─── 2. ENTRANCE FACADE & RECEPTION ──────────────────────────────────────────
export const EntranceArea3D: React.FC = () => (
  <group position={[0, 0, 15]}>
    {/* Full Front Facade Wall */}
    <mesh position={[0, 1.6, 0]}>
      <boxGeometry args={[30.2, 3.2, 0.35]} />
      <meshStandardMaterial color="#0f172a" roughness={0.4} />
    </mesh>
    {/* Red Top Accent Trim */}
    <mesh position={[0, 3.22, 0]}>
      <boxGeometry args={[30.2, 0.08, 0.38]} />
      <meshStandardMaterial color="#dc2626" roughness={0.1} emissive="#991b1b" emissiveIntensity={0.3} />
    </mesh>

    {/* Glass Window Panels */}
    {[-11, -8, -5, 5, 8, 11].map((x, i) => (
      <mesh key={i} position={[x, 1.6, 0.2]}>
        <boxGeometry args={[2.4, 2.6, 0.06]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.25} roughness={0.05} />
      </mesh>
    ))}

    {/* Main Double Glass Entrance Doors */}
    <mesh position={[-1.3, 1.5, 0.2]}>
      <boxGeometry args={[2.4, 3.0, 0.08]} />
      <meshStandardMaterial color="#0ea5e9" transparent opacity={0.35} roughness={0.05} />
    </mesh>
    <mesh position={[1.3, 1.5, 0.2]}>
      <boxGeometry args={[2.4, 3.0, 0.08]} />
      <meshStandardMaterial color="#0ea5e9" transparent opacity={0.35} roughness={0.05} />
    </mesh>
    {/* Door Frame */}
    <mesh position={[0, 3.05, 0.2]}>
      <boxGeometry args={[5.2, 0.15, 0.12]} />
      <meshStandardMaterial color="#020617" metalness={0.9} />
    </mesh>
    {/* Gold Door Handles */}
    {[-0.3, 0.3].map((x, i) => (
      <mesh key={i} position={[x, 1.4, 0.3]}>
        <boxGeometry args={[0.04, 0.6, 0.06]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>
    ))}

    {/* Illuminated Main Restaurant Sign */}
    <group position={[0, 3.65, 0.3]}>
      <mesh>
        <boxGeometry args={[11, 0.95, 0.2]} />
        <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.9} />
      </mesh>
      <Text position={[0, 0, 0.12]} fontSize={0.48} color="#f59e0b" fontWeight="bold" anchorX="center" anchorY="middle">
        🍽️  PLATEOS RESTAURANT  🍽️
      </Text>
    </group>

    {/* Entrance Canopy / Awning (Bajado para no tapar el letrero) */}
    <group position={[0, 2.75, 1.1]}>
      <mesh rotation={[0.18, 0, 0]}>
        <boxGeometry args={[7.5, 0.06, 1.8]} />
        <meshStandardMaterial color="#991b1b" roughness={0.4} />
      </mesh>
      {/* Front Awning Edge Trim */}
      <mesh position={[0, -0.1, 0.88]}>
        <boxGeometry args={[7.52, 0.2, 0.04]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.3} />
      </mesh>
      {/* Metallic Support Rods */}
      {[-3.5, 3.5].map((x, i) => (
        <mesh key={i} position={[x, 0.2, -0.3]} rotation={[-0.6, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
      ))}
    </group>

    {/* Plush Red Carpet Foyer Runner */}
    <mesh position={[0, 0.02, -1.8]}>
      <boxGeometry args={[4.2, 0.03, 4]} />
      <meshStandardMaterial color="#991b1b" roughness={0.9} />
    </mesh>
    {/* Carpet Gold Border */}
    <mesh position={[0, 0.025, -1.8]}>
      <boxGeometry args={[4.4, 0.01, 4.2]} />
      <meshStandardMaterial color="#d97706" metalness={0.8} />
    </mesh>

    {/* Stanchions with Velvet Ropes */}
    {[-2.3, 2.3].map((x, i) => (
      <group key={i} position={[x, 0, 0.5]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.0, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.08, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.98, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    ))}

    {/* Reception Podium / Host Desk */}
    <group position={[5.5, 0, -2.5]}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.8, 1.1, 0.9]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[2.0, 0.06, 1.0]} />
        <meshStandardMaterial color="#78350f" roughness={0.2} />
      </mesh>
      {/* Reservation Tablet */}
      <mesh position={[-0.3, 1.25, 0]} rotation={[-0.3, 0.1, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.03]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[-0.3, 1.25, 0.02]} rotation={[-0.3, 0.1, 0]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.3} />
      </mesh>
      {/* Flower Vase with Fresh Red Roses */}
      <mesh position={[0.6, 1.3, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.35, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>
      <mesh position={[0.6, 1.6, 0]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>

    {/* Umbrella Stand */}
    <group position={[-4.5, 0, -1.2]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.7, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      <mesh position={[0.05, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[-0.05, 0.75, 0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>
  </group>
);

// ─── 3. WAITER POS STATION ───────────────────────────────────────────────────
export const WaiterPOSStation3D: React.FC = () => (
  <group position={[-12.5, 0, 5]}>
    {/* POS Counter Desk */}
    <mesh position={[0, 0.55, 0]}>
      <boxGeometry args={[2.4, 1.1, 1.1]} />
      <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
    </mesh>
    <mesh position={[0, 1.12, 0]}>
      <boxGeometry args={[2.6, 0.06, 1.3]} />
      <meshStandardMaterial color="#78350f" roughness={0.2} />
    </mesh>

    {/* Touchscreen Dual POS Monitor */}
    <group position={[-0.4, 1.5, -0.1]} rotation={[0, 0.2, 0]}>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.25, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.7, 0.48, 0.05]} />
        <meshStandardMaterial color="#020617" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0.03]} rotation={[-0.15, 0, 0]}>
        <planeGeometry args={[0.62, 0.4]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.4} />
      </mesh>
    </group>

    {/* Credit Card Datáfono / PIN Pad */}
    <group position={[0.5, 1.2, 0.2]} rotation={[0.2, -0.2, 0]}>
      <mesh>
        <boxGeometry args={[0.2, 0.08, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, -0.05]}>
        <planeGeometry args={[0.16, 0.12]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.3} />
      </mesh>
    </group>

    {/* Thermal Receipt Printer with Paper Slip */}
    <group position={[0.9, 1.25, -0.1]}>
      <mesh>
        <boxGeometry args={[0.3, 0.24, 0.34]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.12, 0.05, 0.18]} />
        <meshStandardMaterial color="#fefce8" />
      </mesh>
    </group>

    {/* Order Notepad & Pen Holder */}
    <group position={[-0.9, 1.18, 0.3]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.02, 0.4]} />
        <meshStandardMaterial color="#fefce8" />
      </mesh>
      <mesh position={[0.25, 0.06, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.12, 10]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
    </group>
  </group>
);

// ─── 4. OPEN KITCHEN & CHEF PASS ─────────────────────────────────────────────
export const OpenKitchen3D: React.FC = () => (
  <group position={[0, 0, -14.5]}>
    {/* Back Wall */}
    <mesh position={[0, 1.6, -0.2]}>
      <boxGeometry args={[30.2, 3.2, 0.4]} />
      <meshStandardMaterial color="#0f172a" roughness={0.4} />
    </mesh>
    {/* Subway Tile Backsplash Panel */}
    <mesh position={[0, 1.4, 0.01]}>
      <planeGeometry args={[20, 2.2]} />
      <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
    </mesh>

    {/* Stainless Steel Kitchen Pass Counter */}
    <mesh position={[0, 0.55, 1.5]}>
      <boxGeometry args={[16, 1.1, 1.4]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.05} />
    </mesh>

    {/* Stainless Steel Cooking Pots & Pans */}
    {[-6, -3.5, -1, 1.5, 4, 6.5].map((x, i) => (
      <group key={i} position={[x, 1.15, 1.2]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.24, 0.22, 0.18, 14]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh position={[0.26, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.14, 6]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>
    ))}

    {/* Order Ticket Rail with Slips */}
    <mesh position={[0, 1.7, 1.5]}>
      <boxGeometry args={[14, 0.04, 0.08]} />
      <meshStandardMaterial color="#475569" metalness={0.9} />
    </mesh>
    {[-5, -3, -1, 1, 3, 5].map((x, i) => (
      <mesh key={i} position={[x, 1.55, 1.55]}>
        <boxGeometry args={[0.32, 0.26, 0.01]} />
        <meshStandardMaterial color="#fefce8" />
      </mesh>
    ))}

    {/* Red Heat Lamp Bar */}
    <mesh position={[0, 1.9, 1.8]}>
      <boxGeometry args={[15, 0.06, 0.2]} />
      <meshStandardMaterial color="#dc2626" emissive="#b91c1c" emissiveIntensity={0.4} />
    </mesh>
    {[-6, -3.5, -1, 1.5, 4, 6.5].map((x, i) => (
      <group key={i} position={[x, 1.75, 1.8]}>
        <mesh>
          <coneGeometry args={[0.2, 0.28, 14]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.8} />
        </mesh>
        <pointLight position={[0, -0.3, 0]} intensity={1.2} color="#fbbf24" distance={4} />
      </group>
    ))}

    {/* Large Industrial Exhaust Hood */}
    <mesh position={[0, 2.6, 0.6]}>
      <boxGeometry args={[17, 0.65, 3.2]} />
      <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
    </mesh>

    {/* Double Swing Service Doors */}
    {[-11, 11].map((x, i) => (
      <group key={i} position={[x, 0, 0.5]}>
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[2.2, 2.3, 0.1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.5, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.04, 16]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>
      </group>
    ))}
  </group>
);

// ─── 5. WINE CELLAR CABINET ──────────────────────────────────────────────────
export const WineRackDisplay3D: React.FC = () => (
  <group position={[14.2, 0, 4]}>
    {/* Cabinet Frame */}
    <mesh position={[0, 1.3, 0]}>
      <boxGeometry args={[0.8, 2.6, 3.5]} />
      <meshStandardMaterial color="#1e1005" roughness={0.3} />
    </mesh>
    {/* Glass Doors */}
    <mesh position={[-0.41, 1.3, 0]}>
      <boxGeometry args={[0.04, 2.4, 3.3]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.2} roughness={0.05} />
    </mesh>
    {/* Warm Interior Wine Light */}
    <pointLight position={[-0.1, 1.3, 0]} intensity={1.8} color="#f59e0b" distance={5} />

    {/* Shelves & Wine Bottle Rows */}
    {[-0.8, -0.3, 0.2, 0.7].map((y, row) => (
      <group key={row} position={[0, 1.3 + y, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 0.04, 3.2]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
        {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((z, col) => (
          <mesh key={col} position={[0, 0.12, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.45, 10]} />
            <meshStandardMaterial color={col % 2 === 0 ? '#450a0a' : '#14532d'} roughness={0.2} />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

// ─── 6. SERVICE CREDENZA & CUTLERY STATION ───────────────────────────────────
export const ServiceCredenza3D: React.FC = () => (
  <group position={[14.2, 0, -5]}>
    {/* Cabinet Base */}
    <mesh position={[0, 0.55, 0]}>
      <boxGeometry args={[0.8, 1.1, 2.8]} />
      <meshStandardMaterial color="#0f172a" roughness={0.3} />
    </mesh>
    <mesh position={[0, 1.12, 0]}>
      <boxGeometry args={[0.9, 0.06, 2.9]} />
      <meshStandardMaterial color="#78350f" roughness={0.2} />
    </mesh>
    {/* Stacks of Clean Porcelain Plates */}
    {[-0.8, -0.3, 0.3, 0.8].map((z, i) => (
      <group key={i} position={[-0.1, 1.25, z]}>
        {[0, 0.03, 0.06, 0.09, 0.12].map((y, p) => (
          <mesh key={p} position={[0, y, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.02, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.1} />
          </mesh>
        ))}
      </group>
    ))}
    {/* Glass Water Carafes */}
    <mesh position={[-0.1, 1.3, -1.1]}>
      <cylinderGeometry args={[0.08, 0.12, 0.35, 12]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} />
    </mesh>
  </group>
);

// ─── 7. INTERIOR DECORATIONS (Wall Art, Wall Sconces, Greenery) ───────────────
export const InteriorDecorations3D: React.FC = () => (
  <group>
    {/* Wall Paintings - Left Wall */}
    {[-10, -3, 4, 10].map((z, i) => (
      <group key={`lw-${i}`} position={[-14.7, 2.0, z]}>
        <mesh>
          <boxGeometry args={[0.06, 1.2, 1.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} />
        </mesh>
        <mesh position={[0.04, 0, 0]}>
          <boxGeometry args={[0.02, 1.0, 1.4]} />
          <meshStandardMaterial color={['#7c2d12', '#1e3a5f', '#14532d', '#701a75'][i]} roughness={0.6} />
        </mesh>
        {/* Frame Spotlight */}
        <pointLight position={[0.3, 0.6, 0]} intensity={0.6} color="#fbbf24" distance={3} />
      </group>
    ))}

    {/* Wall Paintings - Right Wall */}
    {[-10, -3, 4, 10].map((z, i) => (
      <group key={`rw-${i}`} position={[14.7, 2.0, z]}>
        <mesh>
          <boxGeometry args={[0.06, 1.2, 1.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} />
        </mesh>
        <mesh position={[-0.04, 0, 0]}>
          <boxGeometry args={[0.02, 1.0, 1.4]} />
          <meshStandardMaterial color={['#312e81', '#831843', '#365314', '#854d0e'][i]} roughness={0.6} />
        </mesh>
        <pointLight position={[-0.3, 0.6, 0]} intensity={0.6} color="#fbbf24" distance={3} />
      </group>
    ))}

    {/* Lush Potted Plants in Every Corner & Wall Interval */}
    {[
      [-13.8, 0, -13], [-13.8, 0, 13], [13.8, 0, -13], [13.8, 0, 13],
      [-13.8, 0, 0], [13.8, 0, 0], [-6, 0, 13.8], [6, 0, 13.8]
    ].map(([x, y, z], i) => (
      <group key={`plant-${i}`} position={[x, y, z]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.25, 0.2, 0.6, 14]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 14]} />
          <meshStandardMaterial color="#331800" />
        </mesh>

        {/* Dense Leaves Cluster */}
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.42, 12, 12]} />
          <meshStandardMaterial color="#15803d" roughness={0.6} />
        </mesh>
        <mesh position={[0.12, 1.2, 0.08]}>
          <sphereGeometry args={[0.3, 10, 10]} />
          <meshStandardMaterial color="#22c55e" roughness={0.6} />
        </mesh>
        <mesh position={[-0.1, 1.15, -0.1]}>
          <sphereGeometry args={[0.28, 10, 10]} />
          <meshStandardMaterial color="#166534" roughness={0.6} />
        </mesh>
      </group>
    ))}

    {/* Bathroom Door (Back-Left Corner) */}
    <group position={[-13, 0, -12.5]}>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[1.8, 2.3, 0.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.05, 0.06]}>
        <boxGeometry args={[0.6, 0.32, 0.02]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <Text position={[0, 2.05, 0.08]} fontSize={0.16} color="#020617" fontWeight="bold" anchorX="center" anchorY="middle">
        🚻 RESTROOMS
      </Text>
    </group>

    {/* Fire Extinguisher */}
    <group position={[-14.6, 0.6, -9]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.55, 12]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.32, 0.04]}>
        <cylinderGeometry args={[0.02, 0.02, 0.08, 6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>

    {/* Large Decorative Wall Clock */}
    <group position={[14.8, 2.4, 0]}>
      <mesh>
        <cylinderGeometry args={[0.4, 0.4, 0.04, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
      <mesh position={[-0.04, 0, 0]}>
        <cylinderGeometry args={[0.43, 0.43, 0.03, 24]} />
        <meshStandardMaterial color="#78350f" roughness={0.3} />
      </mesh>
      <mesh position={[0.025, 0.09, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.012, 0.22, 0.015]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[0.025, 0.05, 0.02]} rotation={[0, 0, -0.9]}>
        <boxGeometry args={[0.009, 0.15, 0.012]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>
  </group>
);
