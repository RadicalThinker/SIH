import React, { useState, useEffect } from 'react';
import { LudoGameState, LudoQuestion, LudoPiece } from './types';
import LudoBoard from './LudoBoard';
import LudoDice from './LudoDice';
import LudoQuestionModal from './LudoQuestionModal';
import ludoQuestions from '../ludo_questions.json';

const LudoGame: React.FC = () => {
  const [gameState, setGameState] = useState<LudoGameState>({
    players: [
      {
        id: 'player1',
        name: 'Player 1',
        color: 'red',
        pieces: Array.from({ length: 4 }, (_, i) => ({
          id: `piece-1-${i}`,
          playerId: 'player1',
          position: -1,
          isInPlay: false,
          isInFinish: false
        })),
        score: 0,
        isActive: true
      }
    ],
    currentPlayer: 'player1',
    diceValue: 0,
    diceRolled: false,
    gameStatus: 'playing',
    winner: null,
    questions: ludoQuestions as LudoQuestion[],
    canReroll: false,
    movesRemaining: 0
  });

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentTileQuestion, setCurrentTileQuestion] = useState<LudoQuestion | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<LudoPiece | null>(null);

  // Initialize game
  useEffect(() => {
    // Shuffle questions for variety
    const shuffledQuestions = [...gameState.questions].sort(() => Math.random() - 0.5);
    setGameState(prev => ({
      ...prev,
      questions: shuffledQuestions
    }));
  }, []);

  const rollDice = () => {
    if (gameState.diceRolled || gameState.gameStatus !== 'playing') return;
    
    const newValue = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({
      ...prev,
      diceValue: newValue,
      diceRolled: true,
      movesRemaining: newValue
    }));
  };

  const handlePieceClick = (piece: LudoPiece) => {
    if (!gameState.diceRolled || gameState.movesRemaining === 0) return;
    if (piece.playerId !== gameState.currentPlayer) return;

    setSelectedPiece(piece);
    
    // Check if piece lands on a question tile
    const targetPosition = piece.position + gameState.diceValue;
    if (targetPosition < 52) {
      const question = gameState.questions[targetPosition % gameState.questions.length];
      setCurrentTileQuestion(question);
      setShowQuestionModal(true);
    } else {
      // Move piece without question
      movePiece(piece, gameState.diceValue);
    }
  };

  const movePiece = (piece: LudoPiece, steps: number) => {
    setGameState(prev => {
      const newPieces = prev.players[0].pieces.map(p => 
        p.id === piece.id 
          ? { ...p, position: Math.min(p.position + steps, 100) }
          : p
      );

      const newMovesRemaining = prev.movesRemaining - steps;
      const canReroll = newMovesRemaining <= 0;

      return {
        ...prev,
        players: prev.players.map(player => 
          player.id === prev.currentPlayer
            ? { ...player, pieces: newPieces }
            : player
        ),
        movesRemaining: Math.max(0, newMovesRemaining),
        canReroll: canReroll,
        diceRolled: !canReroll
      };
    });

    setSelectedPiece(null);
  };

  const handleQuestionAnswer = (isCorrect: boolean) => {
    setShowQuestionModal(false);
    
    if (isCorrect && selectedPiece) {
      // Correct answer - allow reroll
      setGameState(prev => ({
        ...prev,
        canReroll: true,
        diceRolled: false,
        movesRemaining: 0
      }));
      
      // Move piece
      movePiece(selectedPiece, gameState.diceValue);
    } else if (selectedPiece) {
      // Wrong answer - move piece but no reroll
      movePiece(selectedPiece, gameState.diceValue);
    }
  };

  const handleReroll = () => {
    if (!gameState.canReroll) return;
    
    setGameState(prev => ({
      ...prev,
      canReroll: false,
      diceRolled: false,
      movesRemaining: 0
    }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => ({
        ...player,
        pieces: Array.from({ length: 4 }, (_, i) => ({
          id: `piece-${player.id}-${i}`,
          playerId: player.id,
          position: -1,
          isInPlay: false,
          isInFinish: false
        })),
        score: 0
      })),
      currentPlayer: 'player1',
      diceValue: 0,
      diceRolled: false,
      gameStatus: 'playing',
      winner: null,
      canReroll: false,
      movesRemaining: 0
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Educational Ludo</h1>
              <p className="text-gray-600">Answer questions correctly to reroll the dice!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gameState.players[0].score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <button
                onClick={resetGame}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Reset Game
              </button>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <LudoBoard
            gameState={gameState}
            onPieceClick={handlePieceClick}
            selectedPiece={selectedPiece}
          />
        </div>

        {/* Game Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
          <div className="flex items-center justify-center space-x-8">
            <LudoDice
              value={gameState.diceValue}
              isRolling={false}
              canRoll={!gameState.diceRolled && gameState.gameStatus === 'playing'}
              onRoll={rollDice}
            />
            
            {gameState.canReroll && (
              <button
                onClick={handleReroll}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Reroll Dice
              </button>
            )}
            
            {gameState.movesRemaining > 0 && (
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-700">
                  Moves Remaining: {gameState.movesRemaining}
                </div>
                <div className="text-sm text-gray-500">
                  Click on a piece to move
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Question Modal */}
        {showQuestionModal && currentTileQuestion && (
          <LudoQuestionModal
            question={currentTileQuestion}
            onAnswer={handleQuestionAnswer}
            onClose={() => setShowQuestionModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default LudoGame;


