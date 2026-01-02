
import React from 'react';

const GameHeader: React.FC = () => {
  return (
    <header className="w-full max-w-md flex items-center justify-center pt-2 pb-1 z-20">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-cyan-950/50 backdrop-blur rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.3)] text-2xl border border-cyan-500/50">
          🛰️
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-cyan-300 drop-shadow-sm tracking-widest uppercase">深海遗迹探索</h1>
          <span className="text-[8px] font-black text-cyan-500/70 tracking-[0.4em] -mt-1">来自海底的回响</span>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
