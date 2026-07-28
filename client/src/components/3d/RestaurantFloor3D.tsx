import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text } from '@react-three/drei';
import { TableItem } from '../../types';
import { Table3D } from './Table3D';
import { EntranceArea3D, WaiterPOSStation3D, OpenKitchen3D, BarLoungeArea3D } from './RestaurantProps3D';
import { StaffAvatars3D } from './CustomerAvatar3D';

interface RestaurantFloor3DProps {
  tables: TableItem[];
  onSelectTable: (table: TableItem) => void;
}

const RoomZoneWalls: React.FC = () => {
  return (
    <group>
      {/* Sleek Outer Boundary Walls (Dark Slate with Red Top Accent Trim) */}
      <mesh position={[0, 0.75, -15]}>
        <boxGeometry args={[30.2, 1.5, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.52, -15]}>
        <boxGeometry args={[30.2, 0.08, 0.44]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>

      <mesh position={[-15, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30.2, 1.5, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      <mesh position={[-15, 1.52, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30.2, 0.08, 0.44]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>

      <mesh position={[15, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30.2, 1.5, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
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

      {/* 3D Zone Labels Right-Side Up Facing the User */}
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
        controlsRef.current.target.set(0, 0, 13);
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
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-300 bg-slate-200 flex flex-col">
      {/* Top Room Zone Switcher Tabs with Camera Presets */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto overflow-x-auto">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 text-white shadow-xl border border-slate-700">
          {[
            { id: 'TODAS', label: '🌐 Ver Todo' },
            { id: 'ENTRADA', label: '🚪 Entrada' },
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

      {/* 3D Canvas Viewport with Complete Restaurant Structure & Lighting */}
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 24, 18]} fov={42} />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2.25}
          minDistance={5}
          maxDistance={35}
        />

        <ambientLight intensity={1.1} />
        <directionalLight
          position={[15, 25, 15]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 12, -10]} intensity={0.7} color="#38bdf8" />
        <pointLight position={[10, 12, 10]} intensity={0.7} color="#fbbf24" />

        {/* High-Contrast Light Parquet Tile Floor Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[32, 32]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.1} />
        </mesh>

        <Grid
          position={[0, 0, 0]}
          args={[32, 32]}
          cellSize={1}
          cellThickness={1.5}
          cellColor="#94a3b8"
          sectionSize={4}
          sectionThickness={2.5}
          sectionColor="#64748b"
          fadeDistance={40}
          fadeStrength={1}
        />

        {/* 3D Architectural Props & Areas */}
        <RoomZoneWalls />
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
        <div>📜 <b>Rueda:</b> Zoom</div>
        <div>👆 <b>Tocar Mesa:</b> Abrir Comanda / Cobro</div>
      </div>
    </div>
  );
};
