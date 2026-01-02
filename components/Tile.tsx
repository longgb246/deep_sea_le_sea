
import React from 'react';
import { TileInstance } from '../types';

interface TileProps {
  tile: TileInstance;
  onClick: () => void;
  style?: React.CSSProperties;
}

const Tile: React.FC<TileProps> = ({ tile, onClick, style }) => {
  const { icon, x, y, layer, isClickable, color, status } = tile;

  if (status === 'removed') return null;

  const isMoving = status === 'moving';

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`
        absolute w-[50px] h-[60px] 
        flex items-center justify-center
        rounded-2xl border-b-[5px] border-r-[2px]
        ${isMoving ? 'tile-transition z-[99999] scale-100 brightness-150 shadow-[0_0_30px_rgba(34,211,238,0.8)]' : 'transition-none'}
        cursor-pointer
        ${color} 
        ${isClickable 
          ? 'opacity-100 border-white/60 shadow-[0_4px_10px_rgba(0,0,0,0.6)]' 
          : 'brightness-[0.2] grayscale shadow-none pointer-events-none'
        }
      `}
      style={{
        left: x,
        top: y,
        zIndex: isMoving ? 999999 : (layer * 10 + (tile.pileIndex || 0)),
        ...style
      }}
    >
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-2xl">
        {/* Clickable Glow Effect */}
        {isClickable && !isMoving && (
          <div className="absolute inset-0 border-2 border-cyan-400/40 rounded-2xl animate-pulse"></div>
        )}
        
        <span className={`text-2xl select-none leading-none -translate-y-0.5 ${isMoving ? 'animate-pulse' : ''}`}>
          {icon}
        </span>
      </div>
      
      {/* Glossy Reflection Overlay */}
      <div className="absolute top-1 left-2 w-4 h-2 bg-white/30 rounded-full rotate-[-15deg] pointer-events-none"></div>
      
      {/* Blocking Overlay Shadow */}
      {!isClickable && status === 'board' && (
        <div className="absolute inset-0 bg-black/60 rounded-2xl pointer-events-none"></div>
      )}
    </div>
  );
};

export default Tile;
