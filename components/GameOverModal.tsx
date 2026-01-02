
import React from 'react';
import { GameStatus } from '../types';
import { Anchor, Waves, RotateCcw, LayoutGrid } from 'lucide-react';

interface GameOverModalProps {
  status: GameStatus;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ status, onRestart, onMenu }) => {
  if (status !== GameStatus.WON && status !== GameStatus.LOST) return null;

  const isWin = status === GameStatus.WON;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in duration-300">
      <div className="bg-slate-900 w-full max-w-xs p-8 rounded-[2rem] shadow-[0_0_50px_rgba(34,211,238,0.2)] border-2 border-cyan-500/30 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
        <div className={`p-6 rounded-full ${isWin ? 'bg-cyan-500/20' : 'bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]'}`}>
          {isWin ? (
            <Waves className="w-16 h-16 text-cyan-400" />
          ) : (
            <Anchor className="w-16 h-16 text-red-400" />
          )}
        </div>

        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-2 ${isWin ? 'text-cyan-300' : 'text-red-400'}`}>
            {isWin ? "回收成功！" : "下潜失败！"}
          </h2>
          <p className="text-slate-400 font-medium text-sm">
            {isWin 
              ? "你已成功找回所有失落的遗迹，成为深海之王！" 
              : "样本储存仓已满，由于氧气不足，你被迫撤离了该区域。"
            }
          </p>
        </div>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-4 bg-cyan-600 text-white rounded-2xl font-bold text-lg hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-900/40"
          >
            <RotateCcw className="w-5 h-5" />
            重新下潜
          </button>
          
          <button
            onClick={onMenu}
            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold text-lg hover:bg-slate-700 transition-colors"
          >
            <LayoutGrid className="w-5 h-5" />
            返回基地
          </button>
        </div>

        <div className="mt-2">
          {isWin ? (
            <span className="text-xs text-cyan-500 uppercase tracking-widest font-black">成就：海神回响</span>
          ) : (
            <span className="text-xs text-slate-500 font-medium">深度 11,034m 下潜任务未达成</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
