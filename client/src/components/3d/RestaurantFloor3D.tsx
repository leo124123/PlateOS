import React, { useRef, useState, useCallback, useMemo } from 'react';
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
  WineRackDisplay3D,
  ServiceCredenza3D,
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
  cameraPosition: THREE.Vector3 | null;
  controlsRef: React.RefObject<any>;
}

const SmoothCameraController: React.FC<CameraTargetProps> = ({ target, cameraPosition, controlsRef }) => {
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ camera }) => {
    if (!controlsRef.current) return;

    // Smoothly interpolate camera target
    currentTarget.current.lerp(target, 0.05);
    controlsRef.current.target.copy(currentTarget.current);

    // Smoothly interpolate camera position if preset requested
    if (cameraPosition) {
      camera.position.lerp(cameraPosition, 0.05);
    }

    controlsRef.current.update();
  });

  return null;
};

// ─── RESTAURANT BUILDING STRUCTURE & SLEEK BLACK MARBLE FLOOR ─────────────────
const RestaurantBuilding: React.FC<{ showCeiling: boolean }> = ({ showCeiling }) => (
  <group>
    {/* ── 1. MAIN RESTAURANT FLOOR (Sleek Polished Black Marble Tiles) ─────── */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#0d111d" roughness={0.15} metalness={0.4} />
    </mesh>

    {/* Gold Brass Tile Grid Inlay (Negro Elegante con Líneas Doradas) */}
    {Array.from({ length: 16 }, (_, i) => (
      <mesh key={`grid-z-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -15 + i * 2]}>
        <planeGeometry args={[30, 0.04]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>
    ))}
    {Array.from({ length: 16 }, (_, i) => (
      <mesh key={`grid-x-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-15 + i * 2, 0.002, 0]}>
        <planeGeometry args={[0.04, 30]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
      </mesh>
    ))}

    {/* ── 2. BASEBOARDS / SKIRTING BOARDS (Rodapiés Elegantes) ────────────── */}
    {/* Left Wall Baseboard */}
    <mesh position={[-14.8, 0.12, 0]}>
      <boxGeometry args={[0.1, 0.24, 30.0]} />
      <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
    </mesh>
    {/* Right Wall Baseboard */}
    <mesh position={[14.8, 0.12, 0]}>
      <boxGeometry args={[0.1, 0.24, 30.0]} />
      <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
    </mesh>
    {/* Back Wall Baseboard */}
    <mesh position={[0, 0.12, -14.8]}>
      <boxGeometry args={[30.0, 0.24, 0.1]} />
      <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
    </mesh>
    {/* Gold Trim Line along baseboards */}
    {[-14.75, 14.75].map((x, i) => (
      <mesh key={`gold-base-${i}`} position={[x, 0.24, 0]}>
        <boxGeometry args={[0.02, 0.02, 30.0]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} />
      </mesh>
    ))}

    {/* ── 3. STRUCTURAL ARCHITECTURAL COLUMNS ──────────────────────────── */}
    {[
      [-8, -5], [8, -5],
      [-8, 5],  [8, 5],
    ].map(([x, z], i) => (
      <group key={`col-${i}`} position={[x, 0, z]}>
        {/* Column Base */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.75, 0.2, 0.75]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Main Black Marble Column Pillar */}
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[0.65, 3.0, 0.65]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* Gold Accent Bands */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.67, 0.08, 0.67]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>
        <mesh position={[0, 2.0, 0]}>
          <boxGeometry args={[0.67, 0.08, 0.67]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} />
        </mesh>

        {/* Wall Sconce Lights on Column sides */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((rot, s) => (
          <group key={s} rotation={[0, rot, 0]}>
            <mesh position={[0, 2.2, 0.34]}>
              <boxGeometry args={[0.12, 0.22, 0.08]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.9} />
            </mesh>
            <pointLight position={[0, 2.2, 0.45]} intensity={0.9} color="#fbbf24" distance={6} />
          </group>
        ))}
      </group>
    ))}

    {/* ── 4. OUTER WALLS ────────────────────────────────────────────────── */}
    {/* Left Wall */}
    <mesh position={[-15, 1.6, 0]}>
      <boxGeometry args={[0.35, 3.2, 30.2]} />
      <meshStandardMaterial color="#0b0f19" roughness={0.4} />
    </mesh>
    {/* Right Wall */}
    <mesh position={[15, 1.6, 0]}>
      <boxGeometry args={[0.35, 3.2, 30.2]} />
      <meshStandardMaterial color="#0b0f19" roughness={0.4} />
    </mesh>

    {/* Glass Windows - Left Wall */}
    {[-10, -3, 4, 10].map((z, i) => (
      <mesh key={`wl-${i}`} position={[-14.8, 1.8, z]}>
        <boxGeometry args={[0.08, 1.5, 2.6]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.2} roughness={0.05} />
      </mesh>
    ))}
    {/* Glass Windows - Right Wall */}
    {[-10, -3, 4, 10].map((z, i) => (
      <mesh key={`wr-${i}`} position={[14.8, 1.8, z]}>
        <boxGeometry args={[0.08, 1.5, 2.6]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.2} roughness={0.05} />
      </mesh>
    ))}

    {/* Red Top Accent Trim along perimeter */}
    {[-15, 15].map((x, i) => (
      <mesh key={`trim-${i}`} position={[x, 3.22, 0]}>
        <boxGeometry args={[0.38, 0.08, 30.2]} />
        <meshStandardMaterial color="#dc2626" emissive="#991b1b" emissiveIntensity={0.3} />
      </mesh>
    ))}

    {/* ── 5. CEILING (Toggleable Coffered Ceiling) ────────────────────── */}
    {showCeiling && (
      <group position={[0, 3.28, 0]}>
        <mesh>
          <boxGeometry args={[30.2, 0.06, 30.2]} />
          <meshStandardMaterial color="#060913" roughness={0.6} />
        </mesh>
        {/* Coffered Ceiling Beams */}
        {[-10, -5, 0, 5, 10].map((x, i) => (
          <mesh key={`beam-x-${i}`} position={[x, -0.06, 0]}>
            <boxGeometry args={[0.3, 0.12, 30]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        ))}
      </group>
    )}

    {/* ── 6. CEILING PENDANT LIGHT CHANDELIERS ───────────────────────── */}
    {[
      [-9, -7], [0, -7], [9, -7],
      [-9, 0],  [0, 0],  [9, 0],
      [-9, 7],  [0, 7],  [9, 7],
    ].map(([x, z], i) => (
      <group key={`lamp-${i}`} position={[x, 3.24, z]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <coneGeometry args={[0.35, 0.22, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.78, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={1.0} />
        </mesh>
        <pointLight position={[0, -0.9, 0]} intensity={2.2} color="#fbbf24" distance={9} />
      </group>
    ))}

    {/* ── 7. MAIN SALON ZONE LABEL IN 3D FLOOR ───────────────────────── */}
    <Text position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.1} color="#f59e0b" anchorX="center" anchorY="middle">
      SALÓN PRINCIPAL — PLATEOS GOURMET
    </Text>
  </group>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export const RestaurantFloor3D: React.FC<RestaurantFloor3DProps> = ({ tables, onSelectTable }) => {
  const [activeZone, setActiveZone] = useState('TODAS');
  const [showCeiling, setShowCeiling] = useState(false);
  const [is2DMode, setIs2DMode] = useState(false);
  const controlsRef = useRef<any>(null);

  const [cameraTarget] = useState(() => new THREE.Vector3(0, 0, 0));
  const [presetCameraPos, setPresetCameraPos] = useState<THREE.Vector3 | null>(null);

  // Table Statistics Calculation
  const tableStats = useMemo(() => {
    const total = tables.length;
    const available = tables.filter((t) => t.status === 'AVAILABLE').length;
    const occupied = tables.filter((t) => t.status === 'OCCUPIED' || t.status === 'EATING').length;
    const pending = tables.filter((t) => t.status === 'ORDER_PENDING' || t.status === 'BILL_REQUESTED').length;
    return { total, available, occupied, pending };
  }, [tables]);

  const handleZoneChange = useCallback((zoneId: string) => {
    setActiveZone(zoneId);
    setIs2DMode(false);

    const targets: Record<string, { target: [number, number, number]; pos: [number, number, number] }> = {
      TODAS:   { target: [0, 0, 0],    pos: [0, 15, 15] },
      ENTRADA: { target: [0, 0.5, 12], pos: [0, 6, 18] },
      POS:     { target: [-12, 0.5, 5], pos: [-12, 5, 10] },
      COCINA:  { target: [0, 0.5, -13], pos: [0, 6, -6] },
      SALA:    { target: [0, 0.5, 0],   pos: [0, 10, 8] },
    };

    const config = targets[zoneId] ?? targets.TODAS;
    cameraTarget.set(...config.target);
    setPresetCameraPos(new THREE.Vector3(...config.pos));
  }, [cameraTarget]);

  const toggle2DView = useCallback(() => {
    setIs2DMode((prev) => {
      const next = !prev;
      if (next) {
        cameraTarget.set(0, 0, 0);
        setPresetCameraPos(new THREE.Vector3(0, 26, 0.01));
      } else {
        cameraTarget.set(0, 0, 0);
        setPresetCameraPos(new THREE.Vector3(0, 15, 15));
      }
      return next;
    });
  }, [cameraTarget]);

  const resetCamera = useCallback(() => {
    setActiveZone('TODAS');
    setIs2DMode(false);
    cameraTarget.set(0, 0, 0);
    setPresetCameraPos(new THREE.Vector3(0, 15, 15));
  }, [cameraTarget]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col select-none">
      {/* ── TOP ZONE TABS (Glassmorphism & Active Glow) ────────────────────── */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto gap-3">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/80 backdrop-blur-xl text-white shadow-2xl border border-white/10 overflow-x-auto">
          {[
            { id: 'TODAS', label: '🌐 Todo', emoji: '🌐' },
            { id: 'ENTRADA', label: '🚪 Entrada', emoji: '🚪' },
            { id: 'POS', label: '💻 Estación POS', emoji: '💻' },
            { id: 'COCINA', label: '🔥 Cocina', emoji: '🔥' },
            { id: 'SALA', label: '🍷 Salón Principal', emoji: '🍷' },
          ].map((z) => (
            <button
              key={z.id}
              onClick={() => handleZoneChange(z.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shrink-0 flex items-center gap-1.5 ${
                activeZone === z.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/40 scale-105 border border-blue-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* Live Table Stats Widget */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-black/80 backdrop-blur-xl text-white shadow-2xl border border-white/10 text-xs font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
            <span className="text-emerald-400">{tableStats.available} Libres</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span className="text-red-400">{tableStats.occupied} Ocupadas</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-amber-400">{tableStats.pending} Comandas</span>
          </div>
        </div>
      </div>

      {/* ── 3D VIEWPORT ────────────────────────────────────────────────────── */}
      <Canvas shadows className="w-full h-full" onCreated={({ scene }) => { scene.background = new THREE.Color('#04060d'); }}>
        <PerspectiveCamera makeDefault position={[0, 15, 15]} fov={48} near={0.1} far={200} />
        <OrbitControls
          ref={controlsRef}
          enablePan
          enableZoom
          enableRotate={!is2DMode}
          minPolarAngle={is2DMode ? 0.01 : 0.2}
          maxPolarAngle={is2DMode ? 0.05 : Math.PI / 2.15}
          minDistance={2}
          maxDistance={35}
          enableDamping
          dampingFactor={0.07}
        />

        {/* Smooth camera animation controller */}
        <SmoothCameraController target={cameraTarget} cameraPosition={presetCameraPos} controlsRef={controlsRef} />

        {/* ── AMBIENT & LIGHTING RIG ── */}
        <ambientLight intensity={0.65} color="#f8fafc" />
        <directionalLight
          position={[12, 22, 14]}
          intensity={0.9}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Warm & Cool Accent Fill Lights */}
        <pointLight position={[0, 2.8, 12]} intensity={1.5} color="#fbbf24" distance={14} />
        <pointLight position={[0, 2.8, -13]} intensity={1.2} color="#38bdf8" distance={12} />
        <pointLight position={[-12, 2.8, 5]} intensity={0.9} color="#6366f1" distance={10} />
        <pointLight position={[14, 2.8, 4]} intensity={0.9} color="#f59e0b" distance={8} />

        {/* Sky Box Background */}
        <mesh>
          <sphereGeometry args={[85, 24, 12]} />
          <meshBasicMaterial color="#020308" side={THREE.BackSide} />
        </mesh>

        {/* Ground Terrain Outer Boundary */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 10]} receiveShadow>
          <planeGeometry args={[110, 70]} />
          <meshStandardMaterial color="#05070f" roughness={0.95} />
        </mesh>

        {/* ── RESTAURANT 3D ELEMENTS & DECORATIONS ── */}
        <RestaurantBuilding showCeiling={showCeiling} />
        <OutdoorStreetArea3D />
        <EntranceArea3D />
        <WaiterPOSStation3D />
        <OpenKitchen3D />
        <WineRackDisplay3D />
        <ServiceCredenza3D />
        <InteriorDecorations3D />
        <StaffAvatars3D />

        {/* ── TABLES ── */}
        {tables.map((table) => (
          <Table3D key={table.id} table={table} onSelectTable={onSelectTable} />
        ))}
      </Canvas>

      {/* ── BOTTOM HUD CONTROLS ────────────────────────────────────────────── */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto gap-3">
        {/* Interaction Legend */}
        <div className="bg-black/80 backdrop-blur-xl text-slate-300 px-3.5 py-1.5 rounded-2xl text-xs flex items-center gap-3 border border-white/10 shadow-2xl pointer-events-none font-medium">
          <div>🖱️ <b>Arrastrar:</b> Rotar</div>
          <div>📜 <b>Scroll:</b> Zoom</div>
          <div>👆 <b>Clic Mesa:</b> Abrir Comanda</div>
        </div>

        {/* Camera Control Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle2DView}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-2xl backdrop-blur-xl transition-all duration-300 flex items-center gap-1.5 ${
              is2DMode
                ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-indigo-500/30'
                : 'bg-black/80 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {is2DMode ? '🎥 Vista 3D' : '🗺️ Planta 2D'}
          </button>

          <button
            onClick={resetCamera}
            className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-black/80 text-slate-300 border border-white/10 shadow-2xl backdrop-blur-xl hover:bg-white/10 hover:text-white transition-all"
          >
            🔄 Reset Cámara
          </button>

          <button
            onClick={() => setShowCeiling((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              showCeiling
                ? 'bg-amber-500 text-black border-amber-400/50 shadow-amber-500/30 font-extrabold'
                : 'bg-black/80 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {showCeiling ? '🏠 Ocultar Techo' : '🏠 Mostrar Techo'}
          </button>
        </div>
      </div>
    </div>
  );
};
