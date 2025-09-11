import React, { useState, useEffect } from 'react';

interface LudoDiceProps {
  value: number;
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
}

const LudoDice: React.FC<LudoDiceProps> = ({ value, isRolling, canRoll, onRoll }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRoll = () => {
    if (!canRoll || isRolling) return;
    
    setIsAnimating(true);
    onRoll();
    
    // Stop animation after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const getDiceDots = (num: number) => {
    const dots = [];
    const positions = [
      [], // 0 (not used)
      [[0.5, 0.5]], // 1
      [[0.25, 0.25], [0.75, 0.75]], // 2
      [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]], // 3
      [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]], // 4
      [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]], // 5
      [[0.25, 0.25], [0.75, 0.25], [0.25, 0.5], [0.75, 0.5], [0.25, 0.75], [0.75, 0.75]] // 6
    ];
    
    const dotPositions = positions[num] || [];
    
    return dotPositions.map(([x, y], index) => (
      <div
        key={index}
        className="absolute w-3 h-3 bg-gray-800 rounded-full"
        style={{
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />
    ));
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`
          relative w-16 h-16 bg-white border-4 border-gray-300 rounded-lg shadow-lg
          flex items-center justify-center cursor-pointer transition-all duration-200
          ${canRoll ? 'hover:scale-105 hover:shadow-xl' : 'opacity-50 cursor-not-allowed'}
          ${isAnimating ? 'animate-spin' : ''}
        `}
        onClick={handleRoll}
      >
        {value > 0 && getDiceDots(value)}
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold text-gray-700">
          {value > 0 ? value : '?'}
        </div>
        <div className="text-sm text-gray-500">
          {canRoll ? 'Click to roll' : 'Roll dice first'}
        </div>
      </div>
      
      {!canRoll && (
        <div className="text-xs text-gray-400 text-center max-w-20">
          Move your piece first
        </div>
      )}
    </div>
  );
};

export default LudoDice;


