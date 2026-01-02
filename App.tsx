
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, TileInstance, TileType } from './types';
import { TILE_DEFS, DOCK_SIZE } from './constants';
import GameHeader from './components/GameHeader';
import GameBoard from './components/GameBoard';
import Dock from './components/Dock';
import GameOverModal from './components/GameOverModal';
import HelpSidebar from './components/HelpSidebar';
import TypewriterText from './components/TypewriterText';
import { getAmbientCommentary } from './services/commentaryService';
import { 
  ArrowLeft, Zap, Search, 
  Orbit, Radio, Waves, ShieldAlert
} from 'lucide-react';

const App: React.FC = () => {
  const [tiles, setTiles] = useState<TileInstance[]>([]);
  const [dock, setDock] = useState<TileInstance[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(1);
  const [showHelp, setShowHelp] = useState(false);
  const [matchingIds, setMatchingIds] = useState<string[]>([]);
  const [ambientTexts, setAmbientTexts] = useState<string[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化环境话术列表
  useEffect(() => {
    const texts: string[] = [];
    for (let i = 0; i < 50; i++) {
      texts.push(getAmbientCommentary());
    }
    setAmbientTexts(texts);
  }, []);

  /**
   * 严格的层级判定逻辑：
   * 瓦片尺寸：宽50px，高60px。
   * 判定规则：如果上方图层（layer更大）有任何瓦片与当前瓦片在空间上存在重叠（dx < 50 且 dy < 60），
   * 则当前瓦片被判定为“被压住”，不可点击。
   */
  const updateClickable = useCallback((currentTiles: TileInstance[]) => {
    return currentTiles.map(tile => {
      if (tile.status !== 'board') return tile;

      // 侧边槽位逻辑：只有最上层的索引可见且可点
      if (tile.pileType === 'left-side' || tile.pileType === 'right-side') {
        const higherInPile = currentTiles.some(other => 
          other.status === 'board' && 
          other.pileType === tile.pileType && 
          (other.pileIndex || 0) > (tile.pileIndex || 0)
        );
        return { ...tile, isClickable: !higherInPile };
      }
      
      // 主棋盘空间重叠检查
      const isBlocked = currentTiles.some(other => {
        // 只关心还在棋盘上且层级更高的瓦片
        if (other.status !== 'board' || other.layer <= tile.layer || other.instanceId === tile.instanceId) return false;
        
        // 瓦片实际尺寸是 50x60
        const dx = Math.abs(other.x - tile.x);
        const dy = Math.abs(other.y - tile.y);
        
        // 只要有任何像素重叠，就视为被压住
        return dx < 50 && dy < 60;
      });

      return { ...tile, isClickable: !isBlocked };
    });
  }, []);

  const initGame = useCallback(async (selectedLevel: number) => {
    setLoading(true);
    setStatus(GameStatus.PLAYING);
    setLevel(selectedLevel);
    setDock([]);
    setMatchingIds([]);

    const newTiles: TileInstance[] = [];
    const activeTileTypes = selectedLevel === 1 ? TILE_DEFS.slice(0, 6) : TILE_DEFS;
    
    // 第一关：教学关（约15片）。第二关：地狱关（约180片）。
    const totalTripletsCount = selectedLevel === 1 ? 5 : 60; 
    const pool: TileType[] = [];
    for (let i = 0; i < totalTripletsCount; i++) {
      const type = activeTileTypes[i % activeTileTypes.length];
      pool.push(type, type, type);
    }

    // 随机打乱
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    let poolIdx = 0;
    const centerX = 180;
    const centerY = 160;
    const jitter = (range = 4) => (Math.random() - 0.5) * range;

    if (selectedLevel === 1) {
      // 第一关：简单的3层中心堆叠
      for (let l = 0; l < 3; l++) {
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 2; c++) {
            if (poolIdx < pool.length) {
              newTiles.push({
                ...pool[poolIdx++],
                instanceId: `l1-${l}-${r}-${c}`,
                layer: l, row: r, col: c,
                x: centerX - 25 + (c * 50),
                y: centerY - 30 + (r * 60),
                isClickable: false,
                status: 'board',
                pileType: 'main'
              });
            }
          }
        }
      }
    } else {
      // 第二关：复杂的"羊了个羊"式布局，多种形状组合
      
      // 1. 中央金字塔（三角形堆叠）
      for (let layer = 0; layer < 6; layer++) {
        const size = 6 - layer; // 从6递减到1，形成金字塔
        const layerOffset = layer * 25; // 每层向中心收缩
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (poolIdx < pool.length) {
              newTiles.push({
                ...pool[poolIdx++],
                instanceId: `pyramid-${layer}-${r}-${c}`,
                layer: layer,
                row: r,
                col: c,
                x: centerX - (size * 25) + (c * 50) + layerOffset + jitter(3),
                y: centerY - (size * 30) + (r * 60) + layerOffset + jitter(3),
                isClickable: false,
                status: 'board',
                pileType: 'main'
              });
            }
          }
        }
      }

      // 2. 左上角菱形堆
      const diamondPositions = [
        [1, 0], [0, 1], [1, 1], [2, 1], [1, 2]
      ];
      for (let layer = 0; layer < 3; layer++) {
        for (const [r, c] of diamondPositions) {
          if (poolIdx < pool.length) {
            newTiles.push({
              ...pool[poolIdx++],
              instanceId: `diamond-left-${layer}-${r}-${c}`,
              layer: layer,
              row: r,
              col: c,
              x: 50 + (c * 50) + jitter(4),
              y: 60 + (r * 60) + jitter(4),
              isClickable: false,
              status: 'board',
              pileType: 'main'
            });
          }
        }
      }

      // 3. 右上角十字形堆
      const crossPositions = [
        [0, 1], [1, 0], [1, 1], [1, 2], [2, 1]
      ];
      for (let layer = 0; layer < 3; layer++) {
        for (const [r, c] of crossPositions) {
          if (poolIdx < pool.length) {
            newTiles.push({
              ...pool[poolIdx++],
              instanceId: `cross-right-${layer}-${r}-${c}`,
              layer: layer,
              row: r,
              col: c,
              x: 260 + (c * 50) + jitter(4),
              y: 60 + (r * 60) + jitter(4),
              isClickable: false,
              status: 'board',
              pileType: 'main'
            });
          }
        }
      }

      // 4. 左下角L形堆
      const lShapePositions = [
        [0, 0], [1, 0], [2, 0], [2, 1], [2, 2]
      ];
      for (let layer = 0; layer < 2; layer++) {
        for (const [r, c] of lShapePositions) {
          if (poolIdx < pool.length) {
            newTiles.push({
              ...pool[poolIdx++],
              instanceId: `lshape-left-${layer}-${r}-${c}`,
              layer: layer,
              row: r,
              col: c,
              x: 40 + (c * 50) + jitter(4),
              y: 280 + (r * 60) + jitter(4),
              isClickable: false,
              status: 'board',
              pileType: 'main'
            });
          }
        }
      }

      // 5. 右下角T形堆
      const tShapePositions = [
        [0, 0], [0, 1], [0, 2], [1, 1], [2, 1]
      ];
      for (let layer = 0; layer < 2; layer++) {
        for (const [r, c] of tShapePositions) {
          if (poolIdx < pool.length) {
            newTiles.push({
              ...pool[poolIdx++],
              instanceId: `tshape-right-${layer}-${r}-${c}`,
              layer: layer,
              row: r,
              col: c,
              x: 260 + (c * 50) + jitter(4),
              y: 280 + (r * 60) + jitter(4),
              isClickable: false,
              status: 'board',
              pileType: 'main'
            });
          }
        }
      }

      // 6. 随机散落点（增加难度）
      for (let cluster = 0; cluster < 8; cluster++) {
        const cx = 60 + Math.random() * 240;
        const cy = 60 + Math.random() * 300;
        for (let d = 0; d < 2; d++) {
          if (poolIdx < pool.length) {
            newTiles.push({
              ...pool[poolIdx++],
              instanceId: `scatter-${cluster}-${d}`,
              layer: d,
              row: 0,
              col: 0,
              x: cx + jitter(8),
              y: cy + jitter(8),
              isClickable: false,
              status: 'board',
              pileType: 'main'
            });
          }
        }
      }

      // 7. 左右两侧长条堆（羊了个羊特色）
      const sidePileSize = 18; // 增加到18个
      for (let i = 0; i < sidePileSize; i++) {
        if (poolIdx < pool.length) {
          newTiles.push({
            ...pool[poolIdx++],
            instanceId: `left-${i}`,
            layer: 0,
            row: 0,
            col: 0,
            x: 8 + (i * 2),
            y: 440,
            isClickable: false,
            status: 'board',
            pileType: 'left-side',
            pileIndex: i
          });
        }
        if (poolIdx < pool.length) {
          newTiles.push({
            ...pool[poolIdx++],
            instanceId: `right-${i}`,
            layer: 0,
            row: 0,
            col: 0,
            x: 352 - (i * 2),
            y: 440,
            isClickable: false,
            status: 'board',
            pileType: 'right-side',
            pileIndex: i
          });
        }
      }
    }

    // 处理池中剩余的零散碎片
    while (poolIdx < pool.length) {
      newTiles.push({
        ...pool[poolIdx++],
        instanceId: `extra-${poolIdx}`,
        layer: 0, row: 0, col: 0,
        x: 40 + Math.random() * 280,
        y: 40 + Math.random() * 320,
        isClickable: false,
        status: 'board',
        pileType: 'main'
      });
    }

    setTiles(updateClickable(newTiles));
    setLoading(false);
  }, [updateClickable]);

  const handleTileClick = (instanceId: string) => {
    const clickedTile = tiles.find(t => t.instanceId === instanceId);
    if (!clickedTile || !clickedTile.isClickable) return;

    const movingCount = tiles.filter(t => t.status === 'moving').length;
    const totalOccupiedSlots = dock.length + movingCount;

    if (status !== GameStatus.PLAYING || totalOccupiedSlots >= DOCK_SIZE || matchingIds.length > 0) return;

    const targetX = 14 + (totalOccupiedSlots * 52); 
    const targetY = 560;

    // 标记为正在移动
    setTiles(prev => prev.map(t => 
      t.instanceId === instanceId 
        ? { ...t, status: 'moving', x: targetX, y: targetY, layer: 10000, isClickable: false } 
        : t
    ));

    setTimeout(() => {
      setDock(prevDock => {
        const newDockItem = { ...clickedTile, status: 'dock' as const };
        const nextDock = [...prevDock, newDockItem].sort((a, b) => a.id.localeCompare(b.id));
        
        const counts: Record<string, number> = {};
        nextDock.forEach(t => counts[t.id] = (counts[t.id] || 0) + 1);
        const matchId = Object.keys(counts).find(id => counts[id] >= 3);

        if (matchId) {
          const matchInstances = nextDock.filter(t => t.id === matchId).map(t => t.instanceId);
          setMatchingIds(matchInstances);
          
          setTimeout(() => {
            setDock(currentDock => {
              const finalDock = currentDock.filter(t => t.id !== matchId);
              setTiles(currentTiles => {
                if (currentTiles.filter(t => t.status === 'board').length === 0 && finalDock.length === 0) {
                  setStatus(GameStatus.WON);
                }
                return currentTiles;
              });
              return finalDock;
            });
            setMatchingIds([]);
          }, 400);
        } else {
          if (nextDock.length >= DOCK_SIZE) {
            setStatus(GameStatus.LOST);
          }
        }
        return nextDock;
      });

      setTiles(prev => {
        const updated = prev.map(t => 
          t.instanceId === instanceId ? { ...t, status: 'removed' as const } : t
        );
        return updateClickable(updated);
      });
    }, 400); 
  };

  const handleShuffle = () => {
    if (status !== GameStatus.PLAYING) return;
    const boardTiles = tiles.filter(t => t.status === 'board' && t.pileType === 'main');
    const fixedTiles = tiles.filter(t => t.status !== 'board' || t.pileType !== 'main');
    
    const shuffledCoords = boardTiles.map(t => ({ x: t.x, y: t.y, layer: t.layer }));
    for (let i = shuffledCoords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCoords[i], shuffledCoords[j]] = [shuffledCoords[j], shuffledCoords[i]];
    }

    const newTiles = boardTiles.map((tile, idx) => ({ ...tile, ...shuffledCoords[idx] }));
    setTiles(updateClickable([...newTiles, ...fixedTiles]));
  };

  const resetGame = useCallback(() => {
    initGame(level);
  }, [initGame, level]);

  const returnToMenu = () => {
    setTiles([]);
    setDock([]);
    setMatchingIds([]);
    setStatus(GameStatus.IDLE);
    setShowHelp(false);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col items-center justify-between min-h-screen px-4 pb-4 pt-2 select-none deep-sea-gradient overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-scanline"></div>
      </div>
      
      <GameHeader />

      {status === GameStatus.PLAYING && (
        <div className="fixed top-20 right-4 w-48 sm:w-64 z-[90] pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md border-2 border-cyan-500/40 rounded-2xl p-4 shadow-2xl pointer-events-auto">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">深蓝助手 v2.5</span>
             </div>
             <div className="text-cyan-100 text-sm leading-relaxed font-medium min-h-[60px]">
                {ambientTexts.length > 0 && (
                  <TypewriterText 
                    texts={ambientTexts}
                    typingSpeed={50}
                    deletingSpeed={30}
                    pauseDuration={30000}
                    className="block"
                  />
                )}
             </div>
          </div>
        </div>
      )}

      {status === GameStatus.PLAYING && (
        <div className="fixed top-4 left-4 z-[100]">
          <button 
            onClick={returnToMenu}
            className="p-3 bg-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/40 rounded-2xl text-cyan-400 hover:bg-cyan-900 shadow-xl active:scale-90 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">终止任务</span>
          </button>
        </div>
      )}

      {status === GameStatus.PLAYING && (
        <HelpSidebar isOpen={showHelp} onToggle={() => setShowHelp(!showHelp)} />
      )}

      <main className="relative flex-1 w-full max-w-md flex items-center justify-center z-10">
        {status === GameStatus.IDLE ? (
          <div className="flex flex-col gap-8 w-full px-8 animate-in fade-in zoom-in duration-700">
            <div className="relative text-center mb-10">
              <h2 className="text-cyan-400 text-6xl font-black italic tracking-tighter drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] leading-none mb-4 uppercase">
                深海遗迹<br/><span className="text-4xl text-indigo-400 tracking-normal font-normal">回响 ECHO</span>
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4 opacity-70">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <p className="text-cyan-100 font-black text-xs tracking-[0.4em] uppercase">声呐：激活中</p>
              </div>
            </div>
            
            <button 
              onClick={() => initGame(1)} 
              className="relative overflow-hidden w-full p-1 bg-gradient-to-br from-cyan-400 to-cyan-900 rounded-[2.5rem] group hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              <div className="bg-slate-950/90 w-full h-full rounded-[2.4rem] px-8 py-7 flex items-center justify-between border border-cyan-500/30">
                <div className="flex items-center gap-5">
                  <Waves className="w-9 h-9 text-cyan-400" />
                  <div className="text-left">
                    <div className="text-cyan-50 font-black text-2xl tracking-tight">浅滩回收</div>
                    <div className="text-cyan-500/50 text-[10px] font-bold uppercase tracking-widest">安全区域</div>
                  </div>
                </div>
                <div className="text-xs bg-cyan-500/20 px-3 py-1 rounded-full text-cyan-400 font-black">第一关</div>
              </div>
            </button>
            
            <button 
              onClick={() => initGame(2)} 
              className="relative overflow-hidden w-full p-1 bg-gradient-to-br from-indigo-500 to-purple-950 rounded-[2.5rem] group hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              <div className="bg-slate-950/90 w-full h-full rounded-[2.4rem] px-8 py-7 flex items-center justify-between border border-indigo-500/30">
                <div className="flex items-center gap-5">
                  <ShieldAlert className="w-9 h-9 text-indigo-400" />
                  <div className="text-left">
                    <div className="text-indigo-50 font-black text-2xl tracking-tight">深渊禁地</div>
                    <div className="text-indigo-500/50 text-[10px] font-bold uppercase tracking-widest">极高风险</div>
                  </div>
                </div>
                <div className="text-xs bg-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 font-black animate-pulse">挑战关</div>
              </div>
            </button>
          </div>
        ) : (
          <GameBoard tiles={tiles} onTileClick={handleTileClick} />
        )}
      </main>

      {status !== GameStatus.IDLE && (
        <div className="w-full max-w-md flex flex-col gap-4 z-20 pb-4">
          <Dock dock={dock} matchingIds={matchingIds} />

          <div className="flex justify-center gap-6 px-4">
            <button onClick={resetGame} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 bg-slate-900/80 rounded-3xl border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-all flex items-center justify-center relative active:scale-90 shadow-xl">
                <Zap className="w-7 h-7 text-cyan-400 fill-cyan-400/10" />
              </div>
              <span className="text-[10px] font-black text-cyan-600 tracking-tighter uppercase">重置</span>
            </button>

            <button onClick={handleShuffle} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 bg-slate-900/80 rounded-3xl border-2 border-indigo-500/30 group-hover:border-indigo-400 transition-all flex items-center justify-center relative active:scale-90 shadow-xl">
                <Orbit className="w-7 h-7 text-indigo-400" />
              </div>
              <span className="text-[10px] font-black text-indigo-600 tracking-tighter uppercase">重排</span>
            </button>

            <button onClick={() => {}} className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 bg-slate-900/80 rounded-3xl border-2 border-teal-500/30 group-hover:border-teal-400 transition-all flex items-center justify-center relative active:scale-90 shadow-xl">
                <Search className="w-7 h-7 text-teal-400" />
              </div>
              <span className="text-[10px] font-black text-teal-600 tracking-tighter uppercase">探测</span>
            </button>
          </div>
        </div>
      )}


      <GameOverModal status={status} onRestart={resetGame} onMenu={returnToMenu} />

      {loading && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center z-[1000]">
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-28 h-28">
               <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full"></div>
               <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
            </div>
            <p className="font-black text-cyan-400 text-sm tracking-[0.5em] uppercase animate-pulse">锁定深度坐标中...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
