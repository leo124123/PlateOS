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

  const getStatusColor = () => {
    switch (table.status) {
      case 'ORDER_PENDING':
        return '#f59e0b';
      case 'EATING':
        return '#3b82f6';
      case 'BILL_REQUESTED':
        return '#eab308';
      case 'CLEANING':
        return '#a855f7';
      case 'AVAILABLE':
      default:
        return '#10b981';
    }
  };

  const statusColor = getStatusColor();

  useFrame(({ clock }) => {
    if (hovered && tableGroupRef.current) {
      tableGroupRef.current.position.y = Math.sin(clock.getElapsedTime() * 6) * 0.05 + 0.1;
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
      {/* Halo Base Ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.35, 32]} />
        <meshBasicMaterial
          color={isCallingWaiter ? '#f43f5e' : statusColor}
          side={THREE.DoubleSide}
          transparent
          opacity={hovered || isCallingWaiter ? 0.95 : 0.6}
        />
      </mesh>

      {/* Table Leg */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Table Foot Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 0.08, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Table Top Surface */}
      <mesh position={[0, 0.82, 0]}>
        {table.shape === 'SQUARE' ? (
          <boxGeometry args={[1.5, 0.08, 1.5]} />
        ) : table.shape === 'RECTANGLE' ? (
          <boxGeometry args={[2.2, 0.08, 1.2]} />
        ) : (
          <cylinderGeometry args={[0.9, 0.9, 0.08, 32]} />
        )}
        <meshStandardMaterial color={hovered ? '#475569' : '#1e293b'} roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Table Center Emblem */}
      <mesh position={[0, 0.87, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 16]} />
        <meshStandardMaterial color={isCallingWaiter ? '#f43f5e' : statusColor} roughness={0.1} metalness={0.5} />
      </mesh>

      {/* Chairs around Table */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.35, 0.9]}>
            <boxGeometry args={[0.4, 0.7, 0.4]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Seated Customer Avatar */}
      {table.status !== 'AVAILABLE' && (
        <CustomerAvatar3D status={table.status} tableNumber={table.number} />
      )}

      {/* 3D Floating HTML Label & Customer Call Button */}
      <Html position={[0, 1.5, 0]} center distanceFactor={14}>
        <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
          <div
            className={`px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 border transition-all duration-300 ${
              hovered ? 'scale-110 shadow-2xl' : ''
            }`}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              borderColor: isCallingWaiter ? '#f43f5e' : statusColor,
            }}
          >
            <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: isCallingWaiter ? '#f43f5e' : statusColor }} />
            <span className="font-extrabold text-sm text-white tracking-wide">
              Mesa {table.number}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold uppercase">
              {table.status}
            </span>
          </div>

          {table.status !== 'AVAILABLE' && (
            <button
              onClick={handleCallWaiter}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all shadow-md ${
                isCallingWaiter
                  ? 'bg-rose-500 text-white animate-bounce shadow-rose-500/50'
                  : 'bg-slate-900/90 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-slate-700'
              }`}
            >
              {isCallingWaiter ? '🔔 ¡Llamando!' : '🛎️ Llamar Mesero'}
            </button>
          )}
        </div>
      </Html>
    </group>
  );
};
