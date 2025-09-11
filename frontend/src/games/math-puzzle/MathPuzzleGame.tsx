import React, { useState, useEffect } from 'react';

interface GameState {
  score: number;
  level: number;
  lives: number;
  timeLeft: number;
  currentQuestion: {
    question: string;
    answer: number;
    options: number[];
  } | null;
  gameStatus: 'playing' | 'paused' | 'gameOver' | 'levelComplete';
  streak: number;
  totalQuestions: number;
  correctAnswers: number;
  currentQuestionIndex: number;
  questionsCompleted: number;
}

// Hardcoded 20 questions
const HARDCODED_QUESTIONS = [
  { question: "5 + 3", answer: 8, options: [8, 6, 7, 9] },
  { question: "12 - 4", answer: 8, options: [8, 6, 7, 9] },
  { question: "3 × 4", answer: 12, options: [12, 10, 11, 13] },
  { question: "15 + 7", answer: 22, options: [22, 20, 21, 23] },
  { question: "20 - 8", answer: 12, options: [12, 10, 11, 13] },
  { question: "6 × 3", answer: 18, options: [18, 16, 17, 19] },
  { question: "9 + 6", answer: 15, options: [15, 13, 14, 16] },
  { question: "25 - 9", answer: 16, options: [16, 14, 15, 17] },
  { question: "4 × 5", answer: 20, options: [20, 18, 19, 21] },
  { question: "18 + 4", answer: 22, options: [22, 20, 21, 23] },
  { question: "30 - 12", answer: 18, options: [18, 16, 17, 19] },
  { question: "7 × 2", answer: 14, options: [14, 12, 13, 15] },
  { question: "11 + 9", answer: 20, options: [20, 18, 19, 21] },
  { question: "35 - 8", answer: 27, options: [27, 25, 26, 28] },
  { question: "8 × 3", answer: 24, options: [24, 22, 23, 25] },
  { question: "14 + 7", answer: 21, options: [21, 19, 20, 22] },
  { question: "40 - 15", answer: 25, options: [25, 23, 24, 26] },
  { question: "5 × 6", answer: 30, options: [30, 28, 29, 31] },
  { question: "16 + 8", answer: 24, options: [24, 22, 23, 25] },
  { question: "50 - 18", answer: 32, options: [32, 30, 31, 33] }
];

const MathPuzzleGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    lives: 3,
    timeLeft: 30,
    currentQuestion: null,
    gameStatus: 'playing',
    streak: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    currentQuestionIndex: 0,
    questionsCompleted: 0
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Get next question from hardcoded list
  const getNextQuestion = () => {
    if (gameState.currentQuestionIndex < HARDCODED_QUESTIONS.length) {
      return HARDCODED_QUESTIONS[gameState.currentQuestionIndex];
    }
    return null;
  };

  // Initialize game
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.currentQuestion === null) {
      const question = getNextQuestion();
      setGameState(prev => ({
        ...prev,
        currentQuestion: question,
        timeLeft: 30
      }));
    }
  }, [gameState.gameStatus, gameState.currentQuestion]);

  // Timer countdown
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0) {
      // Time's up - wrong answer
      handleAnswer(-1);
    }
  }, [gameState.timeLeft, gameState.gameStatus]);

  const handleAnswer = (selectedOption: number) => {
    if (gameState.currentQuestion && selectedOption !== null) {
      const isCorrect = selectedOption === gameState.currentQuestion.answer;
      
      setSelectedAnswer(selectedOption);
      
      setTimeout(() => {
        if (isCorrect) {
          const points = 10 + gameState.streak * 2;
          setGameState(prev => ({
            ...prev,
            score: prev.score + points,
            streak: prev.streak + 1,
            correctAnswers: prev.correctAnswers + 1,
            totalQuestions: prev.totalQuestions + 1,
            questionsCompleted: prev.questionsCompleted + 1,
            currentQuestionIndex: prev.currentQuestionIndex + 1
          }));
          
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2000);
          
          // Check if all 10 questions are completed
          if (gameState.questionsCompleted + 1 >= 10) {
            setGameState(prev => ({
              ...prev,
              gameStatus: 'levelComplete'
            }));
          } else {
            // Load next question
            const nextQuestion = HARDCODED_QUESTIONS[gameState.currentQuestionIndex + 1];
            setGameState(prev => ({
              ...prev,
              currentQuestion: nextQuestion,
              timeLeft: 30
            }));
          }
        } else {
          setGameState(prev => {
            const newLives = prev.lives - 1;
            const newQuestionsCompleted = prev.questionsCompleted + 1;
            const newQuestionIndex = prev.currentQuestionIndex + 1;
            
            if (newLives <= 0) {
              return {
                ...prev,
                lives: newLives,
                streak: 0,
                totalQuestions: prev.totalQuestions + 1,
                questionsCompleted: newQuestionsCompleted,
                currentQuestionIndex: newQuestionIndex,
                gameStatus: 'gameOver' as const
              };
            } else if (newQuestionsCompleted >= 10) {
              return {
                ...prev,
                lives: newLives,
                streak: 0,
                totalQuestions: prev.totalQuestions + 1,
                questionsCompleted: newQuestionsCompleted,
                currentQuestionIndex: newQuestionIndex,
                gameStatus: 'levelComplete' as const
              };
            } else {
              // Load next question
              const nextQuestion = HARDCODED_QUESTIONS[newQuestionIndex];
              return {
                ...prev,
                lives: newLives,
                streak: 0,
                totalQuestions: prev.totalQuestions + 1,
                questionsCompleted: newQuestionsCompleted,
                currentQuestionIndex: newQuestionIndex,
                currentQuestion: nextQuestion,
                timeLeft: 30
              };
            }
          });
        }
        
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      lives: 3,
      timeLeft: 30,
      currentQuestion: null,
      gameStatus: 'playing',
      streak: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      currentQuestionIndex: 0,
      questionsCompleted: 0
    });
  };

  const pauseGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStatus: prev.gameStatus === 'playing' ? 'paused' : 'playing'
    }));
  };

  if (gameState.gameStatus === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Over!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-lg text-gray-600">Final Score: <span className="font-bold text-blue-600">{gameState.score}</span></p>
            <p className="text-lg text-gray-600">Questions Completed: <span className="font-bold text-green-600">{gameState.questionsCompleted}/10</span></p>
            <p className="text-lg text-gray-600">Accuracy: <span className="font-bold text-purple-600">
              {gameState.totalQuestions > 0 ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0}%
            </span></p>
          </div>
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (gameState.gameStatus === 'levelComplete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Complete!</h2>
          <p className="text-lg text-gray-600 mb-6">You completed all 10 questions!</p>
          <div className="space-y-2 mb-6">
            <p className="text-lg text-gray-600">Final Score: <span className="font-bold text-blue-600">{gameState.score}</span></p>
            <p className="text-lg text-gray-600">Accuracy: <span className="font-bold text-purple-600">
              {gameState.totalQuestions > 0 ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0}%
            </span></p>
          </div>
          <button
            onClick={resetGame}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Game Header */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{gameState.questionsCompleted}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(gameState.questionsCompleted / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{gameState.lives}</div>
                <div className="text-sm text-gray-600">Lives</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{gameState.streak}</div>
                <div className="text-sm text-gray-600">Streak</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{gameState.timeLeft}s</div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
              <button
                onClick={pauseGame}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {gameState.gameStatus === 'paused' ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {gameState.gameStatus === 'paused' ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Game Paused</h3>
              <p className="text-gray-600 mb-6">Click Resume to continue playing</p>
              <button
                onClick={pauseGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Resume Game
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Solve the Math Problem!</h2>
              
              {gameState.currentQuestion && (
                <div className="space-y-8">
                  <div className="text-6xl font-bold text-blue-600 bg-blue-50 rounded-2xl p-8 inline-block">
                    {gameState.currentQuestion.question} = ?
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    {gameState.currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={`p-6 text-2xl font-bold rounded-xl transition-all duration-200 ${
                          selectedAnswer === null
                            ? 'bg-gray-100 hover:bg-blue-100 hover:scale-105 text-gray-800'
                            : selectedAnswer === option
                            ? option === gameState.currentQuestion!.answer
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : option === gameState.currentQuestion!.answer
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MathPuzzleGame;
