
import React from 'react';
import { TileInstance } from '../types';
import Tile from './Tile';

interface GameBoardProps {
  tiles: TileInstance[];
  onTileClick: (id: string) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ tiles, onTileClick }) => {
  // 我们保留 'moving' 状态的瓦片以便完成移动动画
  const activeTiles = tiles.filter(t => t.status === 'board' || t.status === 'moving');

  return (
    <div className="relative w-full aspect-[4/5] max-w-[420px] bg-slate-900/30 rounded-[2.5rem] border-2 border-cyan-500/10 my-2 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] overflow-visible">
      
      {/* 底部槽位装饰标签 */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-20 pointer-events-none">
         <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.4em]">区域 A [就绪]</span>
         <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.4em]">区域 B [就绪]</span>
      </div>

      <div className="relative w-full h-full">
        {activeTiles.map((tile) => (
          <Tile 
            key={tile.instanceId} 
            tile={tile} 
            onClick={() => onTileClick(tile.instanceId)} 
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
