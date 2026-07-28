import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TableItem } from '../../types';
import { Table3D } from './Table3D';
import {
  OutdoorStreetArea3D,
  EntranceArea3D,
  WaiterPOSStation3D,
  OpenKitchen3D,
  BarLoungeArea3D,
  InteriorDecorations3D,
} from './RestaurantProps3D';
import { StaffAvatars3D } from './CustomerAvatar3D';

interface RestaurantFloor3DProps {
  tables: TableItem[];
  onSelectTable: (table: TableItem) => void;
}

// ─── ENCLOSED BUILDING SHELL ─────────────────────────────────────────────────
const RestaurantBuilding: React.FC = () => (
  <group>
    {/* ── FLOOR ── Warm hardwood parquet ─────────────────────────── */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#d4a574" roughness={0.55} metalness={0.05} />
    </mesh>
    {/* Subtle wood plank lines */}
    {Array.from({ length: 15 }, (_, i) => (
      <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -14 + i * 2]}>
        <planeGeometry args={[30, 0.02]} />
        <meshStandardMaterial color="#a0764a" />
      </mesh>
    ))}

    {/* ── LEFT WALL ──────────────────────────────────────────────── */}
    <mesh position={[-15, 1.6, 0]}>
      <boxGeometry args={[0.35, 3.2, 30.2]} />
      <meshStandardMaterial color="#1e293b" roughness={0.4} />
    </mesh>
    {/* Wall windows */}
    {[-10, -3, 4, 10].map((z, i) => (
      <mesh key={i} position={[-14.78, 1.8, z]}>
        <boxGeometry args={[0.06, 1.6, 2.8]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.18} roughness={0.05} />
      </mesh>
    ))}

    {/* ── RIGHT WALL ─────────────────────────────────────────────── */}
    <mesh position={[15, 1.6, 0]}>
      <boxGeometry args={[0.35, 3.2, 30.2]} />
      <meshStandardMaterial color="#1e293b" roughness={0.4} />
    </mesh>
    {/* Wall windows */}
    {[-10, -3, 4, 10].map((z, i) => (
      <mesh key={i} position={[14.78, 1.8, z]}>
        <boxGeometry args={[0.06, 1.6, 2.8]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.18} roughness={0.05} />
      </mesh>
    ))}

    {/* ── RED ACCENT TRIM (top of all walls) ─────────────────────── */}
    <mesh position={[-15, 3.22, 0]}>
      <boxGeometry args={[0.38, 0.08, 30.2]} />
      <meshStandardMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.15} roughness={0.1} />
    </mesh>
    <mesh position={[15, 3.22, 0]}>
      <boxGeometry args={[0.38, 0.08, 30.2]} />
      <meshStandardMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.15} roughness={0.1} />
    </mesh>

    {/* ── CEILING ────────────────────────────────────────────────── */}
    <mesh position={[0, 3.3, 0]}>
      <boxGeometry args={[30.2, 0.12, 30.2]} />
      <meshStandardMaterial color="#1e293b" roughness={0.5} />
    </mesh>

    {/* ── CEILING PENDANT LIGHTS ─────────────────────────────────── */}
    {[
      [-7.5, -7.5], [7.5, -7.5], [-7.5, 7.5], [7.5, 7.5],
      [0, -7.5], [0, 7.5], [-7.5, 0], [7.5, 0],
    ].map(([x, z], i) => (
      <group key={i} position={[x, 3.24, z]}>
        {/* Wire */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.6, 6]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        {/* Shade */}
        <mesh position={[0, -0.65, 0]}>
          <coneGeometry args={[0.35, 0.22, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} />
        </mesh>
        {/* Bulb */}
        <mesh position={[0, -0.78, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0, -0.9, 0]} intensity={1.8} color="#fbbf24" distance={9} />
      </group>
    ))}

    {/* ── INTERIOR ZONE DIVIDER LINES (subtle on floor) ──────────── */}
    <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 0.08]} />
      <meshStandardMaterial color="#92400e" transparent opacity={0.3} />
    </mesh>
    <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
      <planeGeometry args={[30, 0.08]} />
      <meshStandardMaterial color="#92400e" transparent opacity={0.3} />
    </mesh>

    {/* ── ZONE LABELS (rotated correctly to face user looking down) ── */}
    <Text position={[-7.5, 0.02, -7.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.1} color="#92400e" anchorX="center" anchorY="middle">
      SALA PRINCIPAL
    </Text>
    <Text position={[7.5, 0.02, -7.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.1} color="#92400e" anchorX="center" anchorY="middle">
      TERRAZA
    </Text>
    <Text position={[-7.5, 0.02, 7.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.1} color="#92400e" anchorX="center" anchorY="middle">
      BAR & LOUNGE
    </Text>
    <Text position={[7.5, 0.02, 7.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.1} color="#92400e" anchorX="center" anchorY="middle">
      ZONA VIP
    </Text>
  </group>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export const RestaurantFloor3D: React.FC<RestaurantFloor3DProps> = ({ tables, onSelectTable }) => {
  const [activeZone, setActiveZone] = useState('TODAS');
  const controlsRef = useRef<any>(null);

  const handleZoneChange = (zone: string) => {
    setActiveZone(zone);
    if (!controlsRef.current) return;

    const targets: Record<string, [number, number, number]> = {
      TODAS: [0, 0, 0],
      ENTRADA: [0, 0, 16],
      POS: [-13, 0, -2],
      COCINA: [0, 0, -13],
      BAR: [-11, 0, 7],
      'SALA 1': [-7.5, 0, -7.5],
      TERRAZA: [7.5, 0, -7.5],
      VIP: [7.5, 0, 7.5],
    };
    const [tx, ty, tz] = targets[zone] ?? [0, 0, 0];
    controlsRef.current.target.set(tx, ty, tz);
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col">
      {/* ── TOP ZONE TABS ──────────────────────────────────────── */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto overflow-x-auto gap-2">
        <div className="flex items-center gap-1 p-1.5 rounded-xl bg-black/80 backdrop-blur-sm text-white shadow-xl border border-slate-700/60">
          {[
            { id: 'TODAS', label: '🌐 Ver Todo' },
            { id: 'ENTRADA', label: '🚪 Entrada' },
            { id: 'POS', label: '💻 POS' },
            { id: 'COCINA', label: '👨‍🍳 Cocina' },
            { id: 'BAR', label: '🍸 Bar' },
            { id: 'SALA 1', label: '🍷 Sala 1' },
            { id: 'TERRAZA', label: '🌿 Terraza' },
            { id: 'VIP', label: '👑 VIP' },
          ].map((z) => (
            <button
              key={z.id}
              onClick={() => handleZoneChange(z.id)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 shrink-0 ${
                activeZone === z.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-sm text-white shadow-xl border border-slate-700/60 text-[10px] font-bold shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400">Libre</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-red-400">Ocupada</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-orange-400">Comanda</span>
          </div>
        </div>
      </div>

      {/* ── 3D VIEWPORT ────────────────────────────────────────── */}
      <Canvas shadows className="w-full h-full" onCreated={({ scene }) => { scene.background = new THREE.Color('#0a0a0f'); }}>
        <PerspectiveCamera makeDefault position={[0, 28, 22]} fov={42} />
        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={4}
          maxDistance={45}
        />

        {/* ── LIGHTING RIG ── */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[18, 30, 20]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <pointLight position={[-12, 8, -12]} intensity={0.5} color="#0ea5e9" />
        <pointLight position={[12, 8, 12]} intensity={0.5} color="#fbbf24" />

        {/* ── SKY DOME (dark night gradient) ── */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[80, 32, 16]} />
          <meshBasicMaterial color="#050510" side={THREE.BackSide} />
        </mesh>

        {/* ── GROUND PLANE (extends beyond restaurant) ── */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 10]} receiveShadow>
          <planeGeometry args={[100, 60]} />
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        </mesh>

        {/* ── RESTAURANT BUILDING ── */}
        <RestaurantBuilding />

        {/* ── OUTDOOR AREA ── */}
        <OutdoorStreetArea3D />

        {/* ── ARCHITECTURAL FEATURES ── */}
        <EntranceArea3D />
        <WaiterPOSStation3D />
        <OpenKitchen3D />
        <BarLoungeArea3D />
        <InteriorDecorations3D />
        <StaffAvatars3D />

        {/* ── TABLES ── */}
        {tables.map((table) => (
          <Table3D key={table.id} table={table} onSelectTable={onSelectTable} />
        ))}
      </Canvas>

      {/* ── BOTTOM LEGEND ──────────────────────────────────────── */}
      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm text-slate-300 px-4 py-1.5 rounded-xl text-[10px] pointer-events-none flex items-center gap-4 border border-slate-700/60 shadow-xl z-10">
        <div>🖱️ <b>Arrastrar:</b> Mover</div>
        <div>📜 <b>Scroll:</b> Zoom</div>
        <div>👆 <b>Clic Mesa:</b> Comanda</div>
      </div>
    </div>
  );
};
