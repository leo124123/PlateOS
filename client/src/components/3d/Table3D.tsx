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

  // Visual Colors matching POS Reference Image (Coral Red table tops, Blue status badges, Green available)
  const getTableColor = () => {
    switch (table.status) {
      case 'ORDER_PENDING':
        return '#f97316'; // Orange
      case 'EATING':
      case 'OCCUPIED':
        return '#ef4444'; // Bright POS Coral Red
      case 'BILL_REQUESTED':
        return '#eab308'; // Yellow
      case 'CLEANING':
        return '#a855f7'; // Purple
      case 'AVAILABLE':
      default:
        return '#10b981'; // Green
    }
  };

  const mainColor = getTableColor();

  useFrame(({ clock }) => {
    if (hovered && tableGroupRef.current) {
      tableGroupRef.current.position.y = Math.sin(clock.getElapsedTime() * 6) * 0.04 + 0.08;
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
        <ringGeometry args={[1.15, 1.4, 32]} />
        <meshBasicMaterial
          color={isCallingWaiter ? '#f43f5e' : mainColor}
          side={THREE.DoubleSide}
          transparent
          opacity={hovered || isCallingWaiter ? 0.95 : 0.65}
        />
      </mesh>

      {/* Table Wooden Leg */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.09, 0.13, 0.8, 16]} />
        <meshStandardMaterial color="#582f0e" roughness={0.3} />
      </mesh>

      {/* Table Base Foot */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.42, 0.48, 0.08, 16]} />
        <meshStandardMaterial color="#331800" roughness={0.4} />
      </mesh>

      {/* Table Top Surface (Red / Coral tablecloth inspired by POS reference image) */}
      <mesh position={[0, 0.82, 0]}>
        {table.shape === 'SQUARE' ? (
          <boxGeometry args={[1.6, 0.08, 1.6]} />
        ) : table.shape === 'RECTANGLE' ? (
          <boxGeometry args={[2.4, 0.08, 1.3]} />
        ) : (
          <cylinderGeometry args={[0.95, 0.95, 0.08, 32]} />
        )}
        <meshStandardMaterial color={hovered ? '#fca5a5' : mainColor} roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Wooden Table Border Edge */}
      <mesh position={[0, 0.82, 0]}>
        {table.shape === 'SQUARE' ? (
          <boxGeometry args={[1.66, 0.06, 1.66]} />
        ) : table.shape === 'RECTANGLE' ? (
          <boxGeometry args={[2.46, 0.06, 1.36]} />
        ) : (
          <cylinderGeometry args={[0.98, 0.98, 0.06, 32]} />
        )}
        <meshStandardMaterial color="#78350f" roughness={0.4} />
      </mesh>

      {/* Chairs with Blue Seat Covers (Matching POS image chairs) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.35, 0.95]}>
            <boxGeometry args={[0.42, 0.7, 0.42]} />
            <meshStandardMaterial color="#2563eb" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Seated Customer Avatar */}
      {table.status !== 'AVAILABLE' && (
        <CustomerAvatar3D status={table.status} tableNumber={table.number} />
      )}

      {/* Blue POS Table Badge Overlay (Matching exact BeatlePOS table badges in reference image) */}
      <Html position={[0, 1.5, 0]} center distanceFactor={13}>
        <div className="flex flex-col items-center gap-1 pointer-events-auto">
          {/* Blue POS Square Badge */}
          <div
            className={`px-2.5 py-1 rounded-md shadow-2xl flex items-center gap-2 border border-blue-400 font-extrabold text-xs transition-all duration-200 ${
              hovered ? 'scale-110 shadow-2xl' : ''
            }`}
            style={{
              backgroundColor: '#1e40af', // POS Blue
              color: '#ffffff',
            }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: mainColor }} />
            <span className="font-black text-sm tracking-tight text-white">
              {table.number}
            </span>
            <span className="text-[10px] px-1 py-0.5 rounded bg-blue-900 text-blue-100 uppercase font-black">
              {table.capacity}p
            </span>
          </div>

          {/* Table Call Button */}
          {table.status !== 'AVAILABLE' && (
            <button
              onClick={handleCallWaiter}
              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all shadow-md ${
                isCallingWaiter
                  ? 'bg-rose-600 text-white animate-bounce shadow-rose-600/50'
                  : 'bg-slate-900 text-amber-300 hover:bg-amber-400 hover:text-slate-950 border border-slate-700'
              }`}
            >
              {isCallingWaiter ? '🔔 ¡Llamando!' : '🛎️ Llamar'}
            </button>
          )}
        </div>
      </Html>
    </group>
  );
};
