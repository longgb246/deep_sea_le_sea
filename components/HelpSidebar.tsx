import React from 'react';
import { X, Zap, Orbit, Search, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

interface HelpSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const HelpSidebar: React.FC<HelpSidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      {/* 切换按钮 */}
      <button
        onClick={onToggle}
        className={`fixed top-1/2 -translate-y-1/2 z-[100] transition-all duration-300 ${
          isOpen ? 'right-[280px] sm:right-[320px]' : 'right-4'
        }`}
      >
        <div className="p-3 bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/40 rounded-2xl text-cyan-400 hover:bg-cyan-900 shadow-xl active:scale-90 flex items-center gap-2 group">
          {isOpen ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <HelpCircle className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">说明</span>
            </>
          )}
        </div>
      </button>

      {/* 侧边栏 */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] sm:w-[320px] bg-slate-950/95 backdrop-blur-xl border-l-2 border-cyan-500/30 shadow-2xl z-[90] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto p-6 flex flex-col gap-6">
          {/* 标题 */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <h3 className="text-cyan-300 font-black text-lg tracking-tighter uppercase">操作指南</h3>
            </div>
          </div>

          {/* 游戏说明 */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-cyan-500/10">
              <p className="text-slate-300 text-xs leading-relaxed font-medium">
                收集三个相同的遗迹组件即可回收。被上方组件遮挡的遗迹由于深度过大，声呐无法锁定，必须先清理上层。
              </p>
            </div>

            <div className="p-4 bg-slate-950/50 rounded-2xl border border-cyan-500/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-[10px] font-black text-cyan-500 uppercase">层级判定</span>
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                只要有任何部分被上层遮挡，瓦片都会变暗并锁定。请优先清理高层堆叠。
              </p>
            </div>
          </div>

          {/* 功能说明 */}
          <div className="space-y-3">
            <h4 className="text-cyan-400 font-black text-sm tracking-wider uppercase flex items-center gap-2">
              <div className="w-1 h-4 bg-cyan-400 rounded-full"></div>
              功能说明
            </h4>

            {/* 重置 */}
            <div className="p-4 bg-gradient-to-br from-cyan-950/30 to-slate-900/50 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-slate-900/80 rounded-xl border border-cyan-500/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/10" />
                </div>
                <div>
                  <h5 className="text-cyan-300 font-black text-sm uppercase">重置</h5>
                  <span className="text-cyan-600 text-[9px] font-bold uppercase">Reset</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                重新生成当前关卡的遗迹布局，所有进度将被清空。适用于陷入死局或想重新挑战的情况。
              </p>
            </div>

            {/* 重排 */}
            <div className="p-4 bg-gradient-to-br from-indigo-950/30 to-slate-900/50 rounded-xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-slate-900/80 rounded-xl border border-indigo-500/30 flex items-center justify-center">
                  <Orbit className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h5 className="text-indigo-300 font-black text-sm uppercase">重排</h5>
                  <span className="text-indigo-600 text-[9px] font-bold uppercase">Shuffle</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                随机重新排列主棋盘上的遗迹位置（不影响侧边槽位），保持当前进度。可用于寻找新的消除路径。
              </p>
            </div>

            {/* 探测 */}
            <div className="p-4 bg-gradient-to-br from-teal-950/30 to-slate-900/50 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-slate-900/80 rounded-xl border border-teal-500/30 flex items-center justify-center">
                  <Search className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h5 className="text-teal-300 font-black text-sm uppercase">探测</h5>
                  <span className="text-teal-600 text-[9px] font-bold uppercase">Scan</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                启动深海 AI 助手，获取当前局面的策略建议和鼓励。助手会分析遗迹分布并提供有用的提示。
              </p>
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <div className="flex items-center justify-center gap-2 opacity-50">
              <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">深蓝系统 v2.5</span>
            </div>
          </div>
        </div>
      </div>

      {/* 遮罩层（可选，点击关闭侧边栏） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[80]"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default HelpSidebar;
