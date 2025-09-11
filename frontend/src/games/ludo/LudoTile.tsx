import React from 'react';
import { LudoTile } from './types';

interface LudoTileProps {
  tile: LudoTile;
  isSelected: boolean;
  onClick: () => void;
}

const LudoTileComponent: React.FC<LudoTileProps> = ({ tile, isSelected, onClick }) => {
  const getTileColor = () => {
    switch (tile.color) {
      case 'red':
        return 'bg-red-200 border-red-400';
      case 'blue':
        return 'bg-blue-200 border-blue-400';
      case 'green':
        return 'bg-green-200 border-green-400';
      case 'yellow':
        return 'bg-yellow-200 border-yellow-400';
      default:
        return 'bg-gray-200 border-gray-400';
    }
  };

  const getQuestionIcon = () => {
    if (!tile.question) return null;
    
    switch (tile.question.subject) {
      case 'Mathematics':
        return '🧮';
      case 'Science':
        return '🔬';
      case 'Social Science':
        return '🌍';
      case 'English':
        return '📚';
      case 'General Knowledge':
        return '💡';
      default:
        return '❓';
    }
  };

  return (
    <div
      className={`
        absolute w-10 h-10 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${getTileColor()}
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 scale-110' : ''}
        hover:scale-105 hover:shadow-md
        flex items-center justify-center
      `}
      style={{
        left: tile.x - 20,
        top: tile.y - 20
      }}
      onClick={onClick}
      title={tile.question ? `${tile.question.subject}: ${tile.question.question}` : 'Empty tile'}
    >
      {tile.question && (
        <div className="text-lg">
          {getQuestionIcon()}
        </div>
      )}
      
      {tile.isSpecial && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600"></div>
      )}
    </div>
  );
};

export default LudoTileComponent;


