
import React from 'react';
import { TileInstance } from '../types';
import { DOCK_SIZE } from '../constants';

interface DockProps {
  dock: TileInstance[];
  matchingIds?: string[];
}

const Dock: React.FC<DockProps> = ({ dock, matchingIds = [] }) => {
  const placeholders = Array.from({ length: DOCK_SIZE });

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-3xl p-4 sm:p-5 rounded-[2.5rem] shadow-[0_-25px_60px_rgba(0,0,0,0.9)] border-t-2 border-cyan-500/20 flex gap-2 justify-center items-center relative z-10 mx-4">
      {/* Scanner line decoration */}
      <div className="absolute top-2 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"></div>
      
      {placeholders.map((_, i) => {
        const item = dock[i];
        const isMatching = item && matchingIds.includes(item.instanceId);

        return (
          <div 
            key={i}
            className="w-[42px] h-[52px] sm:w-[50px] sm:h-[60px] bg-slate-900/40 rounded-xl flex items-center justify-center relative overflow-hidden border-2 border-cyan-500/10 shadow-inner group"
          >
            {item ? (
              <div className={`
                w-full h-full flex items-center justify-center ${item.color} rounded-lg border-b-[3px] border-r border-slate-300 
                transition-all duration-300 animate-in zoom-in-90
                ${isMatching ? 'match-flash' : ''}
              `}>
                <span className="text-xl sm:text-2xl">{item.icon}</span>
                <div className="absolute top-0.5 left-1 w-2 h-0.5 bg-white/40 rounded-full"></div>
              </div>
            ) : (
              <div className="w-2 h-2 rounded-full bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors animate-pulse"></div>
            )}
          </div>
        );
      })}
      
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-cyan-400/20 blur-md"></div>
    </div>
  );
};

export default Dock;
