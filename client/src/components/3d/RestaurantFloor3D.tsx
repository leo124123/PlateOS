import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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

// ─── SMOOTH CAMERA CONTROLLER ────────────────────────────────────────────────
interface CameraTargetProps {
  target: THREE.Vector3;
  controlsRef: React.RefObject<any>;
}

const SmoothCameraTarget: React.FC<CameraTargetProps> = ({ target, controlsRef }) => {
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (!controlsRef.current) return;
    currentTarget.current.lerp(target, 0.04);
    controlsRef.current.target.copy(currentTarget.current);
    controlsRef.current.update();
  });

  return null;
};

// ─── RESTAURANT INTERIOR ─────────────────────────────────────────────────────
const RestaurantBuilding: React.FC<{ showCeiling: boolean }> = ({ showCeiling }) => (
  <group>
    {/* ── FLOOR: Warm hardwood parquet ────────────────────────────── */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#c9976b" roughness={0.55} metalness={0.05} />
    </mesh>
    {/* Wood plank lines */}
    {Array.from({ length: 16 }, (_, i) => (
      <mesh key={`pl-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -15 + i * 2]}>
        <planeGeometry args={[30, 0.03]} />
        <meshStandardMaterial color="#a07040" />
      </mesh>
    ))}
    {/* Cross plank lines */}
    {Array.from({ length: 16 }, (_, i) => (
      <mesh key={`plx-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-15 + i * 2, 0.001, 0]}>
        <planeGeometry args={[0.015, 30]} />
        <meshStandardMaterial color="#a07040" transparent opacity={0.3} />
      </mesh>
    ))}

    {/* ── WALLS ───────────────────────────────────────────────────── */}
    {/* Left Wall */}
    <mesh position={[-15, 1.6, 0]}>
      <boxGeometry args={[0.3, 3.2, 30.2]} />
      <meshStandardMaterial color="#1e293b" roughness={0.4} />
    </mesh>
    {/* Right Wall */}
    <mesh position={[15, 1.6, 0]}>
      <boxGeometry args={[0.3, 3.2, 30.2]} />
      <meshStandardMaterial color="#1e293b" roughness={0.4} />
    </mesh>

    {/* Wall Windows - Left */}
    {[-10, -3, 4, 10].map((z, i) => (
      <mesh key={`wl-${i}`} position={[-14.82, 1.8, z]}>
        <boxGeometry args={[0.05, 1.5, 2.6]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.15} roughness={0.05} />
      </mesh>
    ))}
    {/* Wall Windows - Right */}
    {[-10, -3, 4, 10].map((z, i) => (
      <mesh key={`wr-${i}`} position={[14.82, 1.8, z]}>
        <boxGeometry args={[0.05, 1.5, 2.6]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.15} roughness={0.05} />
      </mesh>
    ))}

    {/* Red Accent Trim at top of walls */}
    {[-15, 15].map((x, i) => (
      <mesh key={`trim-${i}`} position={[x, 3.22, 0]}>
        <boxGeometry args={[0.34, 0.06, 30.2]} />
        <meshStandardMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.2} />
      </mesh>
    ))}

    {/* ── CEILING (toggleable) ────────────────────────────────────── */}
    {showCeiling && (
      <mesh position={[0, 3.28, 0]}>
        <boxGeometry args={[30.2, 0.06, 30.2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} />
      </mesh>
    )}

    {/* ── CEILING PENDANT LIGHTS ─────────────────────────────────── */}
    {[
      [-7, -7], [0, -7], [7, -7],
      [-7, 0],  [0, 0],  [7, 0],
      [-7, 7],  [0, 7],  [7, 7],
    ].map(([x, z], i) => (
      <group key={`lamp-${i}`} position={[x, 3.24, z]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.5, 6]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <coneGeometry args={[0.3, 0.18, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.66, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, -0.8, 0]} intensity={2} color="#fbbf24" distance={8} />
      </group>
    ))}

    {/* ── SUBTLE ZONE DIVIDERS (brass inlay lines on floor) ──────── */}
    <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 0.06]} />
      <meshStandardMaterial color="#b45309" transparent opacity={0.25} />
    </mesh>
    <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
      <planeGeometry args={[30, 0.06]} />
      <meshStandardMaterial color="#b45309" transparent opacity={0.25} />
    </mesh>

    {/* ── ZONE LABELS ────────────────────────────────────────────── */}
    <Text position={[-7.5, 0.015, -7.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.9} color="#92400e" anchorX="center" anchorY="middle">
      SALA PRINCIPAL
    </Text>
    <Text position={[7.5, 0.015, -7.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.9} color="#92400e" anchorX="center" anchorY="middle">
      TERRAZA
    </Text>
    <Text position={[-7.5, 0.015, 7.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.9} color="#92400e" anchorX="center" anchorY="middle">
      BAR & LOUNGE
    </Text>
    <Text position={[7.5, 0.015, 7.5]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.9} color="#92400e" anchorX="center" anchorY="middle">
      ZONA VIP
    </Text>

    {/* ── EXTRA DETAILS: Wall Clock ──────────────────────────────── */}
    <group position={[14.8, 2.5, 0]}>
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 0.04, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>
      <mesh position={[-0.04, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.03, 24]} />
        <meshStandardMaterial color="#78350f" roughness={0.3} />
      </mesh>
      {/* Clock hands */}
      <mesh position={[0.025, 0.08, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.01, 0.2, 0.015]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      <mesh position={[0.025, 0.04, 0.02]} rotation={[0, 0, -0.8]}>
        <boxGeometry args={[0.008, 0.14, 0.012]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>

    {/* ── FIRE EXTINGUISHER (near kitchen) ────────────────────────── */}
    <group position={[-14.6, 0.5, -10]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.5, 12]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0.04]}>
        <cylinderGeometry args={[0.02, 0.02, 0.08, 6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>

    {/* ── MENU BOARD (near kitchen pass) ──────────────────────────── */}
    <group position={[14.8, 2.0, -10]}>
      <mesh>
        <boxGeometry args={[0.05, 1.2, 1.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      <mesh position={[0.03, 0, 0]}>
        <boxGeometry args={[0.02, 1.0, 1.6]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      {/* Menu text lines */}
      {[-0.3, -0.1, 0.1, 0.3].map((y, i) => (
        <mesh key={i} position={[0.04, y, 0]}>
          <boxGeometry args={[0.01, 0.04, 1.2]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      ))}
    </group>

    {/* ── VIP CANDLES on tables (emissive glow) ──────────────────── */}
    {[[9, 0.88, 5], [6, 0.88, 9], [10, 0.88, 10]].map(([x, y, z], i) => (
      <group key={`candle-${i}`} position={[x, y, z]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.2} />
        </mesh>
        <pointLight position={[0, 0.22, 0]} intensity={0.4} color="#f59e0b" distance={3} />
      </group>
    ))}
  </group>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export const RestaurantFloor3D: React.FC<RestaurantFloor3DProps> = ({ tables, onSelectTable }) => {
  const [activeZone, setActiveZone] = useState('TODAS');
  const [showCeiling, setShowCeiling] = useState(false);
  const controlsRef = useRef<any>(null);
  const [cameraTarget] = useState(() => new THREE.Vector3(0, 0, 0));

  const handleZoneChange = useCallback((zone: string) => {
    setActiveZone(zone);

    const targets: Record<string, [number, number, number]> = {
      TODAS:    [0, 0, 0],
      ENTRADA:  [0, 0.5, 13],
      POS:      [-12, 0.5, -2],
      COCINA:   [0, 0.5, -12],
      BAR:      [-10, 0.5, 7],
      'SALA 1': [-7, 0.5, -7],
      TERRAZA:  [7, 0.5, -7],
      VIP:      [7, 0.5, 7],
    };
    const [tx, ty, tz] = targets[zone] ?? [0, 0, 0];
    cameraTarget.set(tx, ty, tz);
  }, [cameraTarget]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col">
      {/* ── TOP ZONE TABS ──────────────────────────────────────── */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-auto overflow-x-auto gap-2">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/75 backdrop-blur-md text-white shadow-2xl border border-white/10">
          {[
            { id: 'TODAS', label: '🌐 Todo', emoji: '🌐' },
            { id: 'ENTRADA', label: '🚪 Entrada', emoji: '🚪' },
            { id: 'POS', label: '💻 POS', emoji: '💻' },
            { id: 'COCINA', label: '🔥 Cocina', emoji: '🔥' },
            { id: 'BAR', label: '🍸 Bar', emoji: '🍸' },
            { id: 'SALA 1', label: '🍷 Sala', emoji: '🍷' },
            { id: 'TERRAZA', label: '🌿 Terraza', emoji: '🌿' },
            { id: 'VIP', label: '👑 VIP', emoji: '👑' },
          ].map((z) => (
            <button
              key={z.id}
              onClick={() => handleZoneChange(z.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all duration-300 shrink-0 ${
                activeZone === z.id
                  ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white shadow-2xl border border-white/10 text-[10px] font-bold shrink-0">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-emerald-400">Libre</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span className="text-red-400">Ocupada</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-amber-400">Comanda</span>
          </div>
        </div>
      </div>

      {/* ── 3D VIEWPORT ────────────────────────────────────────── */}
      <Canvas shadows className="w-full h-full" onCreated={({ scene }) => { scene.background = new THREE.Color('#08080f'); }}>
        {/* Camera INSIDE the restaurant — eye-level elevated view */}
        <PerspectiveCamera makeDefault position={[0, 14, 14]} fov={50} near={0.1} far={200} />
        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={3}
          maxDistance={30}
          enableDamping
          dampingFactor={0.08}
        />

        {/* Smooth camera target animation */}
        <SmoothCameraTarget target={cameraTarget} controlsRef={controlsRef} />

        {/* ── LIGHTING RIG ── */}
        <ambientLight intensity={0.5} color="#f1f5f9" />
        <directionalLight
          position={[10, 20, 12]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {/* Warm fill from entrance */}
        <pointLight position={[0, 2.5, 13]} intensity={1.2} color="#fbbf24" distance={12} />
        {/* Cool fill from kitchen */}
        <pointLight position={[0, 2.5, -12]} intensity={0.8} color="#38bdf8" distance={10} />
        {/* Accent from bar */}
        <pointLight position={[-12, 2.5, 7]} intensity={0.6} color="#3b82f6" distance={8} />

        {/* ── SKY DOME (dark night) ── */}
        <mesh>
          <sphereGeometry args={[80, 24, 12]} />
          <meshBasicMaterial color="#050510" side={THREE.BackSide} />
        </mesh>

        {/* ── GROUND BEYOND RESTAURANT ── */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 10]} receiveShadow>
          <planeGeometry args={[100, 60]} />
          <meshStandardMaterial color="#0f172a" roughness={0.95} />
        </mesh>

        {/* ── ALL RESTAURANT ELEMENTS ── */}
        <RestaurantBuilding showCeiling={showCeiling} />
        <OutdoorStreetArea3D />
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

      {/* ── BOTTOM HUD ─────────────────────────────────────────── */}
      <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-auto">
        <div className="bg-black/75 backdrop-blur-md text-slate-300 px-3 py-1.5 rounded-xl text-[10px] flex items-center gap-3 border border-white/10 shadow-2xl pointer-events-none">
          <div>🖱️ <b>Arrastrar:</b> Rotar</div>
          <div>📜 <b>Scroll:</b> Zoom</div>
          <div>👆 <b>Clic:</b> Comanda</div>
        </div>
        <button
          onClick={() => setShowCeiling((v) => !v)}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border shadow-2xl backdrop-blur-md transition-all duration-300 ${
            showCeiling
              ? 'bg-amber-500/80 text-black border-amber-400/40 shadow-amber-500/20'
              : 'bg-black/75 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          {showCeiling ? '🏠 Ocultar Techo' : '🏠 Mostrar Techo'}
        </button>
        <div className="bg-black/75 backdrop-blur-md text-amber-400 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-white/10 shadow-2xl pointer-events-none">
          🍽️ PlateOS 3D — Vista Interior
        </div>
      </div>
    </div>
  );
};
