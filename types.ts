
export interface TileType {
  id: string;
  icon: string;
  name: string;
  color: string;
}

export interface TileInstance extends TileType {
  instanceId: string;
  layer: number;
  row: number;
  col: number;
  x: number;
  y: number;
  isClickable: boolean;
  status: 'board' | 'dock' | 'removed' | 'moving';
  pileType?: 'main' | 'left-side' | 'right-side';
  pileIndex?: number;
}

export enum GameStatus {
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST',
  IDLE = 'IDLE'
}
