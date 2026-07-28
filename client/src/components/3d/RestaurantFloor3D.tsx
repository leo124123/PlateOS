import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { TableItem } from '../../types';
import { Table3D } from './Table3D';

interface RestaurantFloor3DProps {
  tables: TableItem[];
  onSelectTable: (table: TableItem) => void;
}

const RoomZoneWalls: React.FC<{ activeZone: string }> = () => {
  return (
    <group>
      {/* Red Wall Outlines (Matching the red boundary lines in BeatlePOS floor map) */}
      <mesh position={[0, 0.4, -15]}>
        <boxGeometry args={[30.2, 0.8, 0.3]} />
        <meshStandardMaterial color="#dc2626" roughness={0.2} />
      </mesh>
      <mesh position={[-15, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30.2, 0.8, 0.3]} />
        <meshStandardMaterial color="#dc2626" roughness={0.2} />
      </mesh>
      <mesh position={[15, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30.2, 0.8, 0.3]} />
        <meshStandardMaterial color="#dc2626" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.4, 15]}>
        <boxGeometry args={[30.2, 0.8, 0.3]} />
        <meshStandardMaterial color="#dc2626" roughness={0.2} />
      </mesh>

      {/* Red Floor Divider Lines (Inspiradas en las líneas rojas divisoras de áreas del plano ICG) */}
      <mesh position={[0, 0.05, -2]}>
        <boxGeometry args={[14, 0.08, 0.25]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>
      <mesh position={[-2, 0.05, 6]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[12, 0.08, 0.25]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>

      {/* Service Counter Structure (Barra de servicio) */}
      <group position={[9, 0, -8]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[6.5, 1.0, 1.6]} />
          <meshStandardMaterial color="#475569" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[6.8, 0.1, 1.8]} />
          <meshStandardMaterial color="#2563eb" roughness={0.2} />
        </mesh>
      </group>

      {/* Decorative Plants in Corners */}
      {[
        [-13.5, -13.5],
        [13.5, -13.5],
        [-13.5, 13.5],
        [13.5, 13.5],
      ].map(([px, pz], idx) => (
        <group key={idx} position={[px, 0, pz]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.35, 0.25, 0.8, 16]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 3D Zone Labels on Floor */}
      <Text position={[-7, 0.02, -8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.3} color="#475569">
        SALA 1 (PRINCIPAL)
      </Text>
      <Text position={[7, 0.02, -1]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.3} color="#475569">
        BAR & LOUNGE
      </Text>
      <Text position={[-7, 0.02, 8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.3} color="#475569">
        TERRAZA
      </Text>
      <Text position={[7, 0.02, 8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.3} color="#475569">
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
      case 'SALA 1':
        controlsRef.current.target.set(-7, 0, -8);
        break;
      case 'BAR':
        controlsRef.current.target.set(7, 0, -1);
        break;
      case 'TERRAZA':
        controlsRef.current.target.set(-7, 0, 8);
        break;
      case 'VIP':
        controlsRef.current.target.set(7, 0, 8);
        break;
      default:
        controlsRef.current.target.set(0, 0, 0);
    }
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-300 bg-slate-200 flex flex-col">
      {/* Top Room Zone Switcher Tabs (Estilo POS ICG BeatlePOS) */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 text-white shadow-xl border border-slate-700">
          {['TODAS', 'SALA 1', 'TERRAZA', 'BAR', 'VIP'].map((zone) => (
            <button
              key={zone}
              onClick={() => handleZoneChange(zone)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                activeZone === zone
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {zone === 'TODAS' ? '🌐 SALA COMPLETA' : zone}
            </button>
          ))}
        </div>

        {/* Legend Badges */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-xl bg-slate-900/90 text-white shadow-xl border border-slate-700 text-xs font-bold">
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
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="text-yellow-300">Pre-cuenta</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas Viewport (High-Contrast Light Grid Tile Floor matching BeatlePOS image) */}
      <Canvas shadows className="w-full h-full">
        {/* Isometric 2.5D Camera angle matching BeatlePOS POS view */}
        <PerspectiveCamera makeDefault position={[0, 20, 16]} fov={45} />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={6}
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
        <pointLight position={[-10, 12, -10]} intensity={0.6} color="#ffffff" />
        <pointLight position={[10, 12, 10]} intensity={0.6} color="#ffffff" />

        {/* Light Tile Floor Plane (Matching the exact checkered gray/light floor in reference image) */}
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

        <RoomZoneWalls activeZone={activeZone} />

        {tables.map((table) => (
          <Table3D key={table.id} table={table} onSelectTable={onSelectTable} />
        ))}
      </Canvas>

      {/* Bottom Controls Legend */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 text-slate-200 px-4 py-1.5 rounded-xl text-xs pointer-events-none flex items-center gap-4 border border-slate-700 shadow-xl">
        <div>🖱️ <b>Arrastrar:</b> Rotar Vista</div>
        <div>📜 <b>Rueda:</b> Zoom In/Out</div>
        <div>👆 <b>Tocar Mesa:</b> Abrir Comanda / Cobro</div>
      </div>
    </div>
  );
};
