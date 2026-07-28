import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TableItem } from '../../types';
import { Table3D } from './Table3D';
import { OutdoorStreetArea3D, EntranceArea3D, WaiterPOSStation3D, OpenKitchen3D, BarLoungeArea3D } from './RestaurantProps3D';
import { StaffAvatars3D } from './CustomerAvatar3D';

interface RestaurantFloor3DProps {
  tables: TableItem[];
  onSelectTable: (table: TableItem) => void;
}

const EnclosedRestaurantWalls: React.FC = () => {
  return (
    <group>
      {/* Left Side Exterior Brick Wall with Windows */}
      <group position={[-15, 0, 0]}>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[0.4, 3.2, 30.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Decorative Wall Windows */}
        {[-10, 0, 10].map((z, idx) => (
          <mesh key={idx} position={[0.2, 1.8, z]}>
            <boxGeometry args={[0.08, 1.4, 3.5]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Right Side Exterior Brick Wall with Windows */}
      <group position={[15, 0, 0]}>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[0.4, 3.2, 30.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        {/* Decorative Wall Windows */}
        {[-10, 0, 10].map((z, idx) => (
          <mesh key={idx} position={[-0.2, 1.8, z]}>
            <boxGeometry args={[0.08, 1.4, 3.5]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Red Accent Trim Line along top of side walls */}
      <mesh position={[-15, 3.22, 0]}>
        <boxGeometry args={[0.44, 0.08, 30.2]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>
      <mesh position={[15, 3.22, 0]}>
        <boxGeometry args={[0.44, 0.08, 30.2]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>

      {/* Red Interior Zone Boundary Lines */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[30, 0.06, 0.3]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 0.06, 0.3]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>

      {/* Ceiling Pendant Warm Lighting Fixtures over Tables */}
      {[-7.5, 7.5].map((x, idx) =>
        [-7.5, 7.5].map((z, zidx) => (
          <group key={`${idx}-${zidx}`} position={[x, 3.0, z]}>
            {/* Lamp Cord */}
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
              <meshStandardMaterial color="#020617" />
            </mesh>
            {/* Lamp Shade */}
            <mesh position={[0, 0, 0]}>
              <coneGeometry args={[0.4, 0.3, 16]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.2} />
            </mesh>
            {/* Warm Ambient Spotlight */}
            <pointLight position={[0, -0.2, 0]} intensity={1.5} color="#fbbf24" distance={10} />
          </group>
        ))
      )}

      {/* 3D Zone Labels Right-Side Up Facing User */}
      <Text position={[-7.5, 0.02, -11]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.3} color="#475569" fontWeight="bold">
        SALA 1 (PRINCIPAL)
      </Text>
      <Text position={[7.5, 0.02, -11]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.3} color="#475569" fontWeight="bold">
        TERRAZA
      </Text>
      <Text position={[-7.5, 0.02, 3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.3} color="#475569" fontWeight="bold">
        BAR & LOUNGE
      </Text>
      <Text position={[7.5, 0.02, 3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.3} color="#475569" fontWeight="bold">
        ZONA VIP
      </Text>
    </group>
  );
};

export const RestaurantFloor3D: React.FC<RestaurantFloor3DProps> = ({ tables, onSelectTable }) => {
  const [activeZone, setActiveZone] = useState('TODAS');
  const controlsRef = useRef<any>(null);

  const handleZoneChange = (zone: string) => {
    setActiveZone(zone);
    if (!controlsRef.current) return;

    switch (zone) {
      case 'ENTRADA':
        controlsRef.current.target.set(0, 0, 16);
        break;
      case 'POS':
        controlsRef.current.target.set(-12, 0, 0);
        break;
      case 'COCINA':
        controlsRef.current.target.set(0, 0, -13);
        break;
      case 'BAR':
        controlsRef.current.target.set(-11, 0, 7);
        break;
      case 'SALA 1':
        controlsRef.current.target.set(-7.5, 0, -7.5);
        break;
      case 'TERRAZA':
        controlsRef.current.target.set(7.5, 0, -7.5);
        break;
      case 'VIP':
        controlsRef.current.target.set(7.5, 0, 7.5);
        break;
      default:
        controlsRef.current.target.set(0, 0, 0);
    }
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col">
      {/* Top Room Zone Switcher Tabs */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto overflow-x-auto">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 text-white shadow-xl border border-slate-700">
          {[
            { id: 'TODAS', label: '🌐 Ver Todo' },
            { id: 'ENTRADA', label: '🚪 Entrada & Calle' },
            { id: 'POS', label: '💻 POS Mesero' },
            { id: 'COCINA', label: '👨‍🍳 Cocina Abierta' },
            { id: 'BAR', label: '🍸 Bar' },
            { id: 'SALA 1', label: '🍷 Sala 1' },
            { id: 'TERRAZA', label: '🌿 Terraza' },
            { id: 'VIP', label: '👑 VIP' },
          ].map((z) => (
            <button
              key={z.id}
              onClick={() => handleZoneChange(z.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-200 shrink-0 ${
                activeZone === z.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* Legend Badges */}
        <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 rounded-xl bg-slate-900/90 text-white shadow-xl border border-slate-700 text-xs font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-emerald-400">Libre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-red-400">Ocupada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-orange-400">Comanda</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas Viewport with Complete Restaurant Structure, Enclosed Walls & Outdoor Street */}
      <Canvas shadows className="w-full h-full" onCreated={({ scene }) => { scene.background = new THREE.Color("#030712"); }}>
        <PerspectiveCamera makeDefault position={[0, 26, 20]} fov={44} />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2.25}
          minDistance={5}
          maxDistance={42}
        />

        <ambientLight intensity={0.9} />
        <directionalLight
          position={[15, 28, 18]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 14, -10]} intensity={0.8} color="#38bdf8" />
        <pointLight position={[10, 14, 10]} intensity={0.8} color="#fbbf24" />

        {/* Interior Restaurant Hardwood Floor Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.1} />
        </mesh>

        <Grid
          position={[0, 0, 0]}
          args={[30, 30]}
          cellSize={1}
          cellThickness={1.5}
          cellColor="#94a3b8"
          sectionSize={4}
          sectionThickness={2.5}
          sectionColor="#64748b"
          fadeDistance={40}
          fadeStrength={1}
        />

        {/* Outdoor Street, Sidewalk & Street Lamps */}
        <OutdoorStreetArea3D />

        {/* Enclosed Restaurant Walls & Architectural Props */}
        <EnclosedRestaurantWalls />
        <EntranceArea3D />
        <WaiterPOSStation3D />
        <OpenKitchen3D />
        <BarLoungeArea3D />
        <StaffAvatars3D />

        {tables.map((table) => (
          <Table3D key={table.id} table={table} onSelectTable={onSelectTable} />
        ))}
      </Canvas>

      {/* Bottom Controls Legend */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 text-slate-200 px-4 py-1.5 rounded-xl text-xs pointer-events-none flex items-center gap-4 border border-slate-700 shadow-xl z-10">
        <div>🖱️ <b>Arrastrar:</b> Mover Cámara</div>
        <div>📜 <b>Rueda:</b> Zoom In/Out</div>
        <div>👆 <b>Tocar Mesa:</b> Abrir Comanda / Cobro</div>
      </div>
    </div>
  );
};
