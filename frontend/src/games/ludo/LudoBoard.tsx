import React from 'react';
import { LudoGameState, LudoPiece, LudoTile, PLAYER_COLORS } from './types';
import LudoTileComponent from './LudoTile';

interface LudoBoardProps {
  gameState: LudoGameState;
  onPieceClick: (piece: LudoPiece) => void;
  selectedPiece: LudoPiece | null;
}

const LudoBoard: React.FC<LudoBoardProps> = ({ gameState, onPieceClick, selectedPiece }) => {
  // Generate board tiles with questions
  const generateTiles = (): LudoTile[] => {
    const tiles: LudoTile[] = [];
    // const boardSize = 15; // commented out as unused
    const tileSize = 40;
    
    // Create a simplified Ludo board layout
    // This is a basic implementation - in a real game, you'd have the exact Ludo board pattern
    
    for (let i = 0; i < 52; i++) {
      const row = Math.floor(i / 13);
      const col = i % 13;
      
      // Determine tile color based on position
      let color: 'red' | 'blue' | 'green' | 'yellow' | 'neutral' = 'neutral';
      if (i >= 0 && i < 13) color = 'red';
      else if (i >= 13 && i < 26) color = 'blue';
      else if (i >= 26 && i < 39) color = 'green';
      else if (i >= 39 && i < 52) color = 'yellow';
      
      tiles.push({
        id: i,
        position: i,
        question: gameState.questions[i % gameState.questions.length],
        isSpecial: i % 13 === 0, // Start tiles
        color,
        x: col * tileSize + 50,
        y: row * tileSize + 50
      });
    }
    
    return tiles;
  };

  const tiles = generateTiles();
  const pieces = gameState.players[0].pieces;

  return (
    <div className="relative bg-gray-100 rounded-xl p-4 overflow-hidden">
      {/* Board Grid */}
      <div className="relative" style={{ width: '600px', height: '600px', margin: '0 auto' }}>
        {/* Tiles */}
        {tiles.map((tile) => (
          <LudoTileComponent
            key={tile.id}
            tile={tile}
            isSelected={selectedPiece?.position === tile.position}
            onClick={() => {
              const piece = pieces.find(p => p.position === tile.position);
              if (piece) onPieceClick(piece);
            }}
          />
        ))}
        
        {/* Player Pieces */}
        {pieces.map((piece) => {
          if (piece.position < 0) return null; // Piece in home
          
          const tile = tiles.find(t => t.position === piece.position);
          if (!tile) return null;
          
          return (
            <div
              key={piece.id}
              className="absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
              style={{
                left: tile.x,
                top: tile.y,
                backgroundColor: PLAYER_COLORS[piece.playerId as keyof typeof PLAYER_COLORS] || '#6b7280'
              }}
              onClick={() => onPieceClick(piece)}
            />
          );
        })}
        
        {/* Home Areas */}
        <div className="absolute top-2 left-2 w-16 h-16 bg-red-100 rounded-lg border-2 border-red-300 flex items-center justify-center">
          <span className="text-red-600 font-bold text-xs">HOME</span>
        </div>
        
        <div className="absolute top-2 right-2 w-16 h-16 bg-blue-100 rounded-lg border-2 border-blue-300 flex items-center justify-center">
          <span className="text-blue-600 font-bold text-xs">HOME</span>
        </div>
        
        <div className="absolute bottom-2 left-2 w-16 h-16 bg-green-100 rounded-lg border-2 border-green-300 flex items-center justify-center">
          <span className="text-green-600 font-bold text-xs">HOME</span>
        </div>
        
        <div className="absolute bottom-2 right-2 w-16 h-16 bg-yellow-100 rounded-lg border-2 border-yellow-300 flex items-center justify-center">
          <span className="text-yellow-600 font-bold text-xs">HOME</span>
        </div>
      </div>
      
      {/* Game Info */}
      <div className="mt-4 text-center">
        <div className="text-lg font-semibold text-gray-700 mb-2">
          Current Player: {gameState.players[0].name}
        </div>
        <div className="text-sm text-gray-500">
          Answer questions correctly to reroll the dice!
        </div>
      </div>
    </div>
  );
};

export default LudoBoard;


