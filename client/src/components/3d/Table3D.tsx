import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { TableItem } from '../../types';
import { CustomerAvatar3D } from './CustomerAvatar3D';
import { useSocket } from '../../context/SocketContext';

interface Table3DProps {
  table: TableItem;
  onSelectTable: (table: TableItem) => void;
}

export const Table3D: React.FC<Table3DProps> = ({ table, onSelectTable }) => {
  const tableGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);
  const { socket } = useSocket();

  // Status colors & text mapping
  const getStatusInfo = () => {
    switch (table.status) {
      case 'ORDER_PENDING':
        return { color: '#f97316', label: 'Comanda', badgeBg: 'bg-amber-600' };
      case 'EATING':
      case 'OCCUPIED':
        return { color: '#ef4444', label: 'Ocupada', badgeBg: 'bg-red-600' };
      case 'BILL_REQUESTED':
        return { color: '#eab308', label: 'Cuenta', badgeBg: 'bg-yellow-500' };
      case 'CLEANING':
        return { color: '#a855f7', label: 'Limpieza', badgeBg: 'bg-purple-600' };
      case 'AVAILABLE':
      default:
        return { color: '#10b981', label: 'Libre', badgeBg: 'bg-emerald-600' };
    }
  };

  const statusInfo = getStatusInfo();

  useFrame(({ clock }) => {
    if (hovered && tableGroupRef.current) {
      tableGroupRef.current.position.y = Math.sin(clock.getElapsedTime() * 6) * 0.05 + 0.08;
    } else if (tableGroupRef.current) {
      tableGroupRef.current.position.y = 0;
    }
  });

  const handleCallWaiter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCallingWaiter(true);
    if (socket) {
      socket.emit('customer:call_waiter', { tableNumber: table.number, tableId: table.id });
    }
    setTimeout(() => setIsCallingWaiter(false), 4000);
  };

  return (
    <group
      ref={tableGroupRef}
      position={[table.positionX, table.positionY, table.positionZ]}
      rotation={[0, table.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectTable(table);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* Halo Base Ring with Status Color */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.45, 32]} />
        <meshBasicMaterial
          color={isCallingWaiter ? '#f43f5e' : statusInfo.color}
          side={THREE.DoubleSide}
          transparent
          opacity={hovered || isCallingWaiter ? 0.95 : 0.65}
        />
      </mesh>

      {/* Table Heavy Metallic Base Stand */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.42, 0.48, 0.08, 20]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Metallic Center Pillar Leg */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.75, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[0.9, 0.04, 0.9]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>

      {/* Realistic Table Top Surface (Dark Mahogany Wood Top with Beveled Edges) */}
      <mesh position={[0, 0.82, 0]}>
        {table.shape === 'SQUARE' ? (
          <boxGeometry args={[1.65, 0.07, 1.65]} />
        ) : table.shape === 'RECTANGLE' ? (
          <boxGeometry args={[2.45, 0.07, 1.35]} />
        ) : (
          <cylinderGeometry args={[0.98, 0.98, 0.07, 32]} />
        )}
        <meshStandardMaterial color="#4a2411" roughness={0.25} metalness={0.05} />
      </mesh>

      {/* Table Tablecloth / Center Mat Overlay */}
      <mesh position={[0, 0.86, 0]}>
        {table.shape === 'SQUARE' ? (
          <boxGeometry args={[1.4, 0.01, 1.4]} />
        ) : table.shape === 'RECTANGLE' ? (
          <boxGeometry args={[2.2, 0.01, 1.1]} />
        ) : (
          <cylinderGeometry args={[0.82, 0.82, 0.01, 32]} />
        )}
        <meshStandardMaterial color={statusInfo.color} roughness={0.4} />
      </mesh>

      {/* Center Table Details (Salt/Pepper, Candle, Table Number Stand) */}
      <group position={[0, 0.87, 0]}>
        {/* Table Number Brass Stand */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.18, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.18, 0.12, 0.02]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* Salt & Pepper Shakers */}
        <mesh position={[0.2, 0.05, 0.1]}>
          <cylinderGeometry args={[0.025, 0.03, 0.09, 8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.1} />
        </mesh>
        <mesh position={[0.2, 0.05, -0.1]}>
          <cylinderGeometry args={[0.025, 0.03, 0.09, 8]} />
          <meshStandardMaterial color="#334155" roughness={0.3} />
        </mesh>
      </group>

      {/* Place Settings (Plates, Cutlery, Glasses at Seats) */}
      {[-0.55, 0.55].map((x, i) => (
        <group key={`place-${i}`} position={[x, 0.87, 0]}>
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.015, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.1} />
          </mesh>
          <mesh position={[0.25, 0.08, 0]}>
            <cylinderGeometry args={[0.04, 0.03, 0.14, 10]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.4} />
          </mesh>
        </group>
      ))}

      {/* Realistic Upholstered Chairs Around Table */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]}>
          <group position={[0, 0, 0.95]}>
            {/* Chair Legs */}
            <mesh position={[-0.18, 0.22, -0.18]}>
              <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0.18, 0.22, -0.18]}>
              <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[-0.18, 0.22, 0.18]}>
              <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh position={[0.18, 0.22, 0.18]}>
              <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>

            {/* Leather Cushion Seat */}
            <mesh position={[0, 0.44, 0]}>
              <boxGeometry args={[0.44, 0.08, 0.44]} />
              <meshStandardMaterial color="#1e293b" roughness={0.3} />
            </mesh>

            {/* Wooden Backrest */}
            <mesh position={[0, 0.72, 0.18]}>
              <boxGeometry args={[0.44, 0.48, 0.06]} />
              <meshStandardMaterial color="#582f0e" roughness={0.3} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Seated Customer Avatar */}
      {table.status !== 'AVAILABLE' && (
        <CustomerAvatar3D status={table.status} tableNumber={table.number} />
      )}

      {/* POS Style Floating Badge Overlay */}
      <Html position={[0, 1.6, 0]} center distanceFactor={12} zIndexRange={[10, 1]}>
        <div className="flex flex-col items-center gap-1 pointer-events-auto select-none">
          <div
            className={`px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 font-extrabold text-xs transition-all duration-300 backdrop-blur-xl ${
              hovered ? 'scale-110 shadow-blue-500/50' : ''
            }`}
            style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full shadow-sm animate-pulse" style={{ backgroundColor: statusInfo.color }} />
            <span className="font-black text-sm tracking-tight text-white">
              Mesa {table.number}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${statusInfo.badgeBg} text-white uppercase font-black tracking-wide`}>
              {statusInfo.label}
            </span>
          </div>

          {/* Table Call Waiter Button */}
          {table.status !== 'AVAILABLE' && (
            <button
              onClick={handleCallWaiter}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all shadow-lg ${
                isCallingWaiter
                  ? 'bg-rose-600 text-white animate-bounce shadow-rose-600/50'
                  : 'bg-slate-900/90 text-amber-300 hover:bg-amber-400 hover:text-slate-950 border border-amber-400/40'
              }`}
            >
              {isCallingWaiter ? '🔔 ¡Llamando!' : '🛎️ Llamar Mozo'}
            </button>
          )}
        </div>
      </Html>
    </group>
  );
};
