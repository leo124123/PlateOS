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

const RoomZoneWalls: React.FC<{ activeZone: string }> = ({ activeZone }) => {
  return (
    <group>
      {/* Outer Boundary Walls */}
      <mesh position={[0, 1.2, -15]}>
        <boxGeometry args={[30, 2.4, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      <mesh position={[-15, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 2.4, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      <mesh position={[15, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[30, 2.4, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.2, 15]}>
        <boxGeometry args={[30, 2.4, 0.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </mesh>

      {/* Interior Divider Walls (Game / SIM Layout style) */}
      <mesh position={[0, 1, -2]}>
        <boxGeometry args={[14, 2, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      <mesh position={[-2, 1, 6]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[12, 2, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* Bar Counter Structure 3D */}
      <group position={[9, 0, -8]}>
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[7, 1.2, 1.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[7.4, 0.1, 2.2]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Bar Stools */}
        {[-2.2, -0.7, 0.7, 2.2].map((x, idx) => (
          <mesh key={idx} position={[x, 0.4, 1.5]}>
            <cylinderGeometry args={[0.25, 0.25, 0.8, 16]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))}
      </group>

      {/* Plants / Decorative Pots in Corners */}
      {[
        [-13.5, -13.5],
        [13.5, -13.5],
        [-13.5, 13.5],
        [13.5, 13.5],
      ].map(([px, pz], idx) => (
        <group key={idx} position={[px, 0, pz]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.4, 0.3, 1, 16]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshStandardMaterial color="#10b981" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* 3D Zone Labels on Floor */}
      <Text position={[-7, 0.02, -8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.4} color="#64748b">
        SALA 1 (PRINCIPAL)
      </Text>
      <Text position={[7, 0.02, -1]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.4} color="#64748b">
        BAR & LOUNGE
      </Text>
      <Text position={[-7, 0.02, 8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.4} color="#64748b">
        TERRAZA
      </Text>
      <Text position={[7, 0.02, 8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={1.4} color="#64748b">
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
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex flex-col">
      {/* Top Room Zone Switcher Tabs (Estilo POS / Juego Táctil) */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 p-1.5 rounded-xl glass-panel bg-slate-900/90 border border-slate-700/60 shadow-xl">
          {['TODAS', 'SALA 1', 'TERRAZA', 'BAR', 'VIP'].map((zone) => (
            <button
              key={zone}
              onClick={() => handleZoneChange(zone)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                activeZone === zone
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {zone === 'TODAS' ? '🌐 Ver Todo' : zone}
            </button>
          ))}
        </div>

        {/* Dynamic Legend Badges */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl glass-panel bg-slate-900/90 border border-slate-700/60 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-emerald-300">Libre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
            <span className="text-blue-300">Ocupada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-amber-300">Comanda</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50" />
            <span className="text-yellow-200">Pre-cuenta</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 16, 18]} fov={48} />
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.15}
          minDistance={5}
          maxDistance={35}
        />

        <ambientLight intensity={0.8} />
        <directionalLight
          position={[12, 22, 12]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-12, 10, -12]} intensity={0.9} color="#38bdf8" />
        <pointLight position={[12, 10, 12]} intensity={0.9} color="#fbbf24" />

        {/* Floor Grid Surface (Textura estilo plano táctil POS) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[32, 32]} />
          <meshStandardMaterial color="#0b1329" roughness={0.15} metalness={0.3} />
        </mesh>

        <Grid
          position={[0, 0, 0]}
          args={[32, 32]}
          cellSize={1}
          cellThickness={1.2}
          cellColor="#1e293b"
          sectionSize={4}
          sectionThickness={2}
          sectionColor="#334155"
          fadeDistance={35}
          fadeStrength={1.2}
        />

        <RoomZoneWalls activeZone={activeZone} />

        {tables.map((table) => (
          <Table3D key={table.id} table={table} onSelectTable={onSelectTable} />
        ))}
      </Canvas>

      {/* Bottom POS Controls Overlay */}
      <div className="absolute bottom-4 left-4 glass-panel px-4 py-2 rounded-xl text-xs text-slate-300 pointer-events-none flex items-center gap-4 border border-slate-700/60 shadow-lg">
        <div>🖱️ <b>Arrastrar:</b> Mover Cámara 3D</div>
        <div>📜 <b>Rueda:</b> Zoom</div>
        <div>👆 <b>Tocar Mesa:</b> Abrir Pedido / Cobro</div>
      </div>
    </div>
  );
};
