// Ludo Game Types

export interface LudoQuestion {
  id: number;
  subject: string;
  question: string;
  answer: string;
}

export interface LudoTile {
  id: number;
  position: number;
  question: LudoQuestion | null;
  isSpecial: boolean; // Home tiles, start tiles, etc.
  color: 'red' | 'blue' | 'green' | 'yellow' | 'neutral';
  x: number;
  y: number;
}

export interface LudoPlayer {
  id: string;
  name: string;
  color: 'red' | 'blue' | 'green' | 'yellow';
  pieces: LudoPiece[];
  score: number;
  isActive: boolean;
}

export interface LudoPiece {
  id: string;
  playerId: string;
  position: number; // -1 means in home, 0-51 means on board, 100+ means in finish area
  isInPlay: boolean;
  isInFinish: boolean;
}

export interface LudoGameState {
  players: LudoPlayer[];
  currentPlayer: string;
  diceValue: number;
  diceRolled: boolean;
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner: string | null;
  questions: LudoQuestion[];
  canReroll: boolean;
  movesRemaining: number;
}

export interface LudoDiceState {
  value: number;
  isRolling: boolean;
  canRoll: boolean;
}

export interface LudoBoardPosition {
  x: number;
  y: number;
  tileId: number;
}

// Board layout constants
export const BOARD_SIZE = 15; // 15x15 grid
export const TILE_SIZE = 40; // pixels
export const TOTAL_TILES = 52; // 13 tiles per side
export const PIECES_PER_PLAYER = 4;

// Color mapping
export const PLAYER_COLORS = {
  red: '#ef4444',
  blue: '#3b82f6', 
  green: '#10b981',
  yellow: '#f59e0b'
} as const;

// Board positions for each tile (simplified Ludo board)
export const BOARD_POSITIONS: LudoBoardPosition[] = [
  // This will be generated based on the actual Ludo board layout
  // For now, we'll create a simplified version
];


