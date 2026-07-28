import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { TableItem } from '../../types';
import { Table3D } from './Table3D';

interface RestaurantFloor3DProps {
  tables: TableItem[];
  onSelectTable: (table: TableItem) => void;
}

export const RestaurantFloor3D: React.FC<RestaurantFloor3DProps> = ({ tables, onSelectTable }) => {
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950">
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 14, 16]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={6}
          maxDistance={30}
        />

        <ambientLight intensity={0.7} />
        <directionalLight
          position={[10, 18, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 8, -10]} intensity={0.8} color="#38bdf8" />
        <pointLight position={[10, 8, 10]} intensity={0.8} color="#fbbf24" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#0b1329" roughness={0.1} metalness={0.2} />
        </mesh>

        <Grid
          position={[0, 0, 0]}
          args={[30, 30]}
          cellSize={1}
          cellThickness={1}
          cellColor="#1e293b"
          sectionSize={3}
          sectionThickness={1.5}
          sectionColor="#334155"
          fadeDistance={30}
          fadeStrength={1.5}
        />

        <mesh position={[0, 1.5, -15]}>
          <boxGeometry args={[30, 3, 0.4]} />
          <meshStandardMaterial color="#1e1e2e" />
        </mesh>
        <mesh position={[-15, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[30, 3, 0.4]} />
          <meshStandardMaterial color="#1e1e2e" />
        </mesh>

        {tables.map((table) => (
          <Table3D key={table.id} table={table} onSelectTable={onSelectTable} />
        ))}
      </Canvas>

      <div className="absolute bottom-4 left-4 glass-panel px-4 py-2 rounded-xl text-xs text-slate-300 pointer-events-none flex items-center gap-4">
        <div>🖱️ <b>Arrastrar:</b> Rotar Vista 3D</div>
        <div>📜 <b>Rueda:</b> Zoom In/Out</div>
        <div>👆 <b>Clic en Mesa:</b> Abrir Comanda / Cobro</div>
      </div>
    </div>
  );
};
