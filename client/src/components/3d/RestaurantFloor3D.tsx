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
      <mesh position={[15, 1.52, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30.2, 0.08, 0.44]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>

      <mesh position={[0, 0.75, 15]}>
        <boxGeometry args={[30.2, 1.5, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.52, 15]}>
        <boxGeometry args={[30.2, 0.08, 0.44]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>

      {/* Red Interior Zone Boundary Lines (Líneas rojas divisoras del plano POS) */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[30, 0.06, 0.3]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.04, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 0.06, 0.3]} />
        <meshStandardMaterial color="#ef4444" roughness={0.1} />
      </mesh>

      {/* Service Counter (Barra 3D con tope azul) */}
      <group position={[-9, 0, 8]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[6.5, 1.2, 1.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[6.9, 0.1, 2.0]} />
          <meshStandardMaterial color="#2563eb" roughness={0.1} metalness={0.7} />
        </mesh>
      </group>

      {/* Plants / Decorative Pots in Corners */}
      {[
        [-13.5, -13.5],
        [13.5, -13.5],
        [-13.5, 13.5],
        [13.5, 13.5],
      ].map(([px, pz], idx) => (
        <group key={idx} position={[px, 0, pz]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.38, 0.28, 0.9, 16]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>

          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.65, 16, 16]} />
            <meshStandardMaterial color="#16a34a" roughness={0.5} />
          </mesh>
        </group>
      ))}

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
      case 'SALA 1':
        controlsRef.current.target.set(-7.5, 0, -7.5);
        break;
      case 'TERRAZA':
        controlsRef.current.target.set(7.5, 0, -7.5);
        break;
      case 'BAR':
        controlsRef.current.target.set(-7.5, 0, 7.5);
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
      {/* Top Room Zone Switcher Tabs */}
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

      {/* 3D Canvas Viewport with Perfectly Oriented Top-Down 2.5D/3D Perspective */}
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 24, 18]} fov={42} />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2.3}
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

        {/* High-Contrast Light Tile Floor Plane */}
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

      {/* Bottom Controls Overlay */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 text-slate-200 px-4 py-1.5 rounded-xl text-xs pointer-events-none flex items-center gap-4 border border-slate-700 shadow-xl">
        <div>🖱️ <b>Arrastrar:</b> Mover Vista</div>
        <div>📜 <b>Rueda:</b> Zoom In/Out</div>
        <div>👆 <b>Tocar Mesa:</b> Abrir Comanda / Cobro</div>
      </div>
    </div>
  );
};
