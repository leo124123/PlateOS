import React from 'react';
import { Text } from '@react-three/drei';

// ─── 1. OUTDOOR STREET & SIDEWALK ────────────────────────────────────────────
export const OutdoorStreetArea3D: React.FC = () => (
  <group position={[0, 0, 20]}>
    {/* Asphalt Road */}
    <mesh position={[0, -0.05, 4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 10]} />
      <meshStandardMaterial color="#1e1e2e" roughness={0.95} />
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
      <meshStandardMaterial color="#64748b" roughness={0.7} />
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
        {/* Lamp Arm */}
        <mesh position={[0.4, 3.8, 0]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.03, 0.03, 1, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>
        {/* Lamp Globe */}
        <mesh position={[0.7, 3.9, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0.7, 3.6, 0]} intensity={2.5} color="#fbbf24" distance={10} />
      </group>
    ))}

    {/* Trees on Sidewalk */}
    {[-18, -9, 9, 18].map((x, i) => (
      <group key={i} position={[x, 0, -3]}>
        {/* Planter Box */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.8, 0.6, 0.8]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[0.7, 0.04, 0.7]} />
          <meshStandardMaterial color="#422006" />
        </mesh>
        {/* Trunk */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 1.5, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.6} />
        </mesh>
        {/* Foliage Layers */}
        <mesh position={[0, 2.4, 0]}>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshStandardMaterial color="#166534" roughness={0.7} />
        </mesh>
        <mesh position={[0.3, 2.6, 0.2]}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial color="#15803d" roughness={0.7} />
        </mesh>
        <mesh position={[-0.2, 2.7, -0.1]}>
          <sphereGeometry args={[0.45, 12, 12]} />
          <meshStandardMaterial color="#22c55e" roughness={0.7} />
        </mesh>
      </group>
    ))}

    {/* Parked Car silhouette on road */}
    <group position={[10, 0.3, 6.5]}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[3.5, 0.7, 1.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[-0.2, 0.85, 0]}>
        <boxGeometry args={[2.0, 0.6, 1.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Headlights */}
      <mesh position={[1.76, 0.35, 0.5]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fbbf24" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[1.76, 0.35, -0.5]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fbbf24" emissiveIntensity={0.6} />
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
      <meshStandardMaterial color="#1e293b" roughness={0.4} />
    </mesh>
    {/* Red accent trim top of front wall */}
    <mesh position={[0, 3.22, 0]}>
      <boxGeometry args={[30.2, 0.08, 0.38]} />
      <meshStandardMaterial color="#ef4444" roughness={0.1} />
    </mesh>

    {/* Large Glass Window Panels (left & right of doors) */}
    {[-8, -5, 5, 8, 11, -11].map((x, i) => (
      <mesh key={i} position={[x, 1.6, 0.2]}>
        <boxGeometry args={[2.4, 2.6, 0.06]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.2} roughness={0.05} />
      </mesh>
    ))}

    {/* Main Double Glass Doors */}
    <mesh position={[-1.3, 1.5, 0.2]}>
      <boxGeometry args={[2.4, 3.0, 0.08]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} roughness={0.05} />
    </mesh>
    <mesh position={[1.3, 1.5, 0.2]}>
      <boxGeometry args={[2.4, 3.0, 0.08]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.35} roughness={0.05} />
    </mesh>
    {/* Door Frame */}
    <mesh position={[0, 3.05, 0.2]}>
      <boxGeometry args={[5.2, 0.15, 0.12]} />
      <meshStandardMaterial color="#0f172a" metalness={0.8} />
    </mesh>
    {/* Door Handles */}
    <mesh position={[-0.3, 1.4, 0.3]}>
      <boxGeometry args={[0.04, 0.6, 0.06]} />
      <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
    </mesh>
    <mesh position={[0.3, 1.4, 0.3]}>
      <boxGeometry args={[0.04, 0.6, 0.06]} />
      <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
    </mesh>

    {/* Illuminated Restaurant Sign */}
    <group position={[0, 3.6, 0.3]}>
      <mesh>
        <boxGeometry args={[10, 0.9, 0.2]} />
        <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
      </mesh>
      <Text position={[0, 0, 0.12]} fontSize={0.45} color="#f59e0b" fontWeight="bold" anchorX="center" anchorY="middle">
        🍽️  PLATEOS GOURMET  🍽️
      </Text>
    </group>

    {/* Awning / Canopy */}
    <mesh position={[0, 3.3, 1.2]} rotation={[0.25, 0, 0]}>
      <boxGeometry args={[8, 0.06, 2]} />
      <meshStandardMaterial color="#991b1b" roughness={0.5} />
    </mesh>

    {/* Welcome Mat */}
    <mesh position={[0, 0.02, -1]}>
      <boxGeometry args={[4, 0.03, 2]} />
      <meshStandardMaterial color="#7f1d1d" roughness={0.9} />
    </mesh>

    {/* Umbrella Stand near door */}
    <group position={[-4, 0, -1.2]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.7, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.7} />
      </mesh>
      {/* Umbrellas */}
      <mesh position={[0.05, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[-0.05, 0.75, 0.05]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>

    {/* Coat Rack */}
    <group position={[4.5, 0, -1.5]}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.8, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 12]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Hooks */}
      {[0, Math.PI / 2, Math.PI, 1.5 * Math.PI].map((a, i) => (
        <mesh key={i} position={[Math.sin(a) * 0.15, 1.75, Math.cos(a) * 0.15]} rotation={[0, a, Math.PI / 4]}>
          <cylinderGeometry args={[0.015, 0.015, 0.18, 6]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
      ))}
    </group>

    {/* Reception / Host Stand */}
    <group position={[6, 0, -2.5]}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.6, 1.1, 0.9]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[1.8, 0.06, 1.0]} />
        <meshStandardMaterial color="#92400e" roughness={0.2} />
      </mesh>
      {/* iPad / Reservation Tablet */}
      <mesh position={[0, 1.35, 0]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.03]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.35, 0.02]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      {/* Flower Vase */}
      <mesh position={[0.6, 1.3, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.3, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>
      <mesh position={[0.6, 1.55, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#f43f5e" />
      </mesh>
    </group>
  </group>
);

// ─── 3. WAITER POS STATION ───────────────────────────────────────────────────
export const WaiterPOSStation3D: React.FC = () => (
  <group position={[-13, 0, -2]}>
    {/* Desk */}
    <mesh position={[0, 0.55, 0]}>
      <boxGeometry args={[2, 1.1, 1]} />
      <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
    </mesh>
    <mesh position={[0, 1.12, 0]}>
      <boxGeometry args={[2.2, 0.06, 1.2]} />
      <meshStandardMaterial color="#b45309" roughness={0.2} />
    </mesh>

    {/* Monitor */}
    <group position={[0, 1.5, -0.1]} rotation={[0, 0.2, 0]}>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.25, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.65, 0.45, 0.05]} />
        <meshStandardMaterial color="#020617" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.15, 0.03]} rotation={[-0.15, 0, 0]}>
        <planeGeometry args={[0.58, 0.38]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.3} />
      </mesh>
    </group>

    {/* Keyboard */}
    <mesh position={[0, 1.16, 0.35]}>
      <boxGeometry args={[0.5, 0.03, 0.2]} />
      <meshStandardMaterial color="#1e293b" roughness={0.4} />
    </mesh>

    {/* Thermal Printer */}
    <mesh position={[0.75, 1.24, 0]}>
      <boxGeometry args={[0.28, 0.22, 0.32]} />
      <meshStandardMaterial color="#334155" roughness={0.4} />
    </mesh>
    {/* Receipt Paper */}
    <mesh position={[0.75, 1.37, -0.05]}>
      <boxGeometry args={[0.1, 0.04, 0.15]} />
      <meshStandardMaterial color="#fefce8" />
    </mesh>

    {/* Cash Drawer below desk */}
    <mesh position={[0, 0.08, 0.55]}>
      <boxGeometry args={[1.2, 0.14, 0.5]} />
      <meshStandardMaterial color="#1e293b" metalness={0.5} />
    </mesh>
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
    {/* Red accent trim top */}
    <mesh position={[0, 3.22, -0.2]}>
      <boxGeometry args={[30.2, 0.08, 0.44]} />
      <meshStandardMaterial color="#ef4444" roughness={0.1} />
    </mesh>

    {/* Stainless Steel Pass Counter */}
    <mesh position={[0, 0.55, 1.5]}>
      <boxGeometry args={[14, 1.1, 1.3]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.05} />
    </mesh>

    {/* Cooking Pots */}
    {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
      <group key={i} position={[x, 1.15, 1.2]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.22, 0.2, 0.16, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>
        {/* Pot Handle */}
        <mesh position={[0.25, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.12, 6]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Steam effect - small translucent sphere */}
        <mesh position={[0, 0.22, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.25} />
        </mesh>
      </group>
    ))}

    {/* Order Ticket Rail */}
    <mesh position={[0, 1.7, 1.5]}>
      <boxGeometry args={[12, 0.04, 0.08]} />
      <meshStandardMaterial color="#475569" metalness={0.9} />
    </mesh>
    {/* Hanging Tickets */}
    {[-4, -2, 0, 2, 4].map((x, i) => (
      <mesh key={i} position={[x, 1.55, 1.55]}>
        <boxGeometry args={[0.3, 0.25, 0.01]} />
        <meshStandardMaterial color="#fefce8" />
      </mesh>
    ))}

    {/* Heat Lamp Bar */}
    <mesh position={[0, 1.9, 1.8]}>
      <boxGeometry args={[13, 0.06, 0.2]} />
      <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.3} />
    </mesh>
    {/* Individual Heat Lamps */}
    {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
      <group key={i} position={[x, 1.75, 1.8]}>
        <mesh>
          <coneGeometry args={[0.18, 0.25, 12]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.7} />
        </mesh>
        <pointLight position={[0, -0.3, 0]} intensity={0.6} color="#fbbf24" distance={3} />
      </group>
    ))}

    {/* Exhaust Hood */}
    <mesh position={[0, 2.6, 0.5]}>
      <boxGeometry args={[15, 0.6, 3]} />
      <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
    </mesh>

    {/* Kitchen Swing Doors */}
    {[-10, 10].map((x, i) => (
      <group key={i} position={[x, 0, 0.5]}>
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[2, 2.3, 0.1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.5, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} />
        </mesh>
        {/* Push plate */}
        <mesh position={[0.5 * (i === 0 ? 1 : -1), 1.2, 0.06]}>
          <boxGeometry args={[0.12, 0.3, 0.02]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>
    ))}
  </group>
);

// ─── 5. BAR & LOUNGE ─────────────────────────────────────────────────────────
export const BarLoungeArea3D: React.FC = () => (
  <group position={[-11, 0, 7]}>
    {/* Bar Counter Base */}
    <mesh position={[0, 0.55, 0]}>
      <boxGeometry args={[6, 1.1, 1.6]} />
      <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
    </mesh>
    {/* Counter Top */}
    <mesh position={[0, 1.12, 0]}>
      <boxGeometry args={[6.4, 0.08, 1.9]} />
      <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.8} />
    </mesh>
    {/* Glowing LED strip under counter */}
    <mesh position={[0, 0.04, 0.82]}>
      <boxGeometry args={[5.8, 0.04, 0.04]} />
      <meshStandardMaterial color="#2563eb" emissive="#3b82f6" emissiveIntensity={0.8} />
    </mesh>

    {/* Items on Bar Counter */}
    {/* Beer Taps */}
    <group position={[-1, 1.16, -0.3]}>
      {[-0.25, 0, 0.25].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
            <meshStandardMaterial color={['#fbbf24', '#94a3b8', '#020617'][i]} metalness={0.9} />
          </mesh>
          <mesh position={[0.06, 0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.015, 0.015, 0.12, 6]} />
            <meshStandardMaterial color={['#fbbf24', '#94a3b8', '#020617'][i]} metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>

    {/* Glasses rack on counter */}
    {[1, 2].map((x, i) => (
      <mesh key={i} position={[x, 1.28, -0.2]}>
        <cylinderGeometry args={[0.06, 0.04, 0.2, 8]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.5} />
      </mesh>
    ))}

    {/* Backlit Bottle Display Shelf */}
    <group position={[0, 1.3, -1.6]}>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[5.8, 1.6, 0.35]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* LED-lit Glass Shelves + Bottles */}
      {[0, 0.5, 1.0].map((y, si) => (
        <group key={si}>
          <mesh position={[0, y, 0.2]}>
            <boxGeometry args={[5.6, 0.04, 0.3]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.4} transparent opacity={0.7} />
          </mesh>
          {[-2.2, -1.6, -1, -0.4, 0.2, 0.8, 1.4, 2.0].map((bx, bi) => (
            <group key={bi} position={[bx, y + 0.2, 0.2]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.06, 0.35, 8]} />
                <meshStandardMaterial
                  color={['#10b981', '#ef4444', '#f59e0b', '#a855f7', '#0ea5e9', '#f43f5e', '#eab308', '#2563eb'][bi]}
                  transparent opacity={0.85}
                />
              </mesh>
              {/* Bottle Cap */}
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.03, 0.05, 0.06, 8]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* LED accent strip behind shelves */}
      <mesh position={[0, 0.7, 0.05]}>
        <boxGeometry args={[5.6, 1.4, 0.02]} />
        <meshStandardMaterial color="#1e3a5f" emissive="#0ea5e9" emissiveIntensity={0.15} />
      </mesh>
    </group>

    {/* Bar Stools */}
    {[-2.2, -1.1, 0, 1.1, 2.2].map((x, i) => (
      <group key={i} position={[x, 0, 1.4]}>
        {/* Stool Leg */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.76, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Foot ring */}
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.15, 0.015, 8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        {/* Seat */}
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* Seat cushion */}
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#ef4444" roughness={0.5} />
        </mesh>
      </group>
    ))}
  </group>
);

// ─── 6. INTERIOR DECORATIONS ─────────────────────────────────────────────────
export const InteriorDecorations3D: React.FC = () => (
  <group>
    {/* ── Wall Art / Paintings on side walls ── */}
    {/* Left Wall Paintings */}
    {[-10, -4, 4].map((z, i) => (
      <group key={`lw-${i}`} position={[-14.7, 2.0, z]}>
        {/* Frame */}
        <mesh>
          <boxGeometry args={[0.06, 1.2, 1.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} />
        </mesh>
        {/* Canvas */}
        <mesh position={[0.04, 0, 0]}>
          <boxGeometry args={[0.02, 1.0, 1.4]} />
          <meshStandardMaterial color={['#7c2d12', '#1e3a5f', '#14532d'][i]} roughness={0.6} />
        </mesh>
      </group>
    ))}
    {/* Right Wall Paintings */}
    {[-10, -4, 4].map((z, i) => (
      <group key={`rw-${i}`} position={[14.7, 2.0, z]}>
        <mesh>
          <boxGeometry args={[0.06, 1.2, 1.6]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} />
        </mesh>
        <mesh position={[-0.04, 0, 0]}>
          <boxGeometry args={[0.02, 1.0, 1.4]} />
          <meshStandardMaterial color={['#312e81', '#831843', '#365314'][i]} roughness={0.6} />
        </mesh>
      </group>
    ))}

    {/* ── Indoor Plants / Ferns near walls ── */}
    {[
      [-13.5, 0, -8], [-13.5, 0, 5], [13.5, 0, -8], [13.5, 0, 5],
      [-6, 0, 13.5], [6, 0, 13.5],
    ].map(([x, y, z], i) => (
      <group key={`plant-${i}`} position={[x, y, z]}>
        {/* Terracotta Pot */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.22, 0.18, 0.5, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.51, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.03, 12]} />
          <meshStandardMaterial color="#422006" />
        </mesh>
        {/* Plant Foliage */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.35, 10, 10]} />
          <meshStandardMaterial color="#15803d" roughness={0.6} />
        </mesh>
        <mesh position={[0.1, 0.95, 0.05]}>
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial color="#22c55e" roughness={0.6} />
        </mesh>
      </group>
    ))}

    {/* ── VIP Zone Rope Stanchions ── */}
    {[[4, 0, 0.5], [11, 0, 0.5]].map(([x, y, z], i) => (
      <group key={`stan-${i}`} position={[x, y, z]}>
        {/* Gold pole */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.9, 12]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Base */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 12]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Gold ball top */}
        <mesh position={[0, 0.92, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} />
        </mesh>
      </group>
    ))}
    {/* Velvet Rope between stanchions */}
    <mesh position={[7.5, 0.75, 0.5]}>
      <cylinderGeometry args={[0.025, 0.025, 7, 8]} />
      <meshStandardMaterial color="#991b1b" roughness={0.6} />
    </mesh>

    {/* ── Bathroom Door (back left corner) ── */}
    <group position={[-13, 0, -12]}>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[1.6, 2.3, 0.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      {/* WC sign */}
      <mesh position={[0, 2.0, 0.06]}>
        <boxGeometry args={[0.5, 0.3, 0.02]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.55, 1.1, 0.08]}>
        <boxGeometry args={[0.06, 0.2, 0.06]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
    </group>

    {/* ── Terraza Plants / Pergola Hints (top right area) ── */}
    {[5.5, 8, 10.5].map((x, i) => (
      <group key={`terr-${i}`} position={[x, 0, -11]}>
        {/* Large Planter Box */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 1.0, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.55, 10, 10]} />
          <meshStandardMaterial color="#166534" roughness={0.7} />
        </mesh>
        <mesh position={[0.2, 2.2, 0.15]}>
          <sphereGeometry args={[0.35, 8, 8]} />
          <meshStandardMaterial color="#22c55e" roughness={0.7} />
        </mesh>
      </group>
    ))}
  </group>
);
