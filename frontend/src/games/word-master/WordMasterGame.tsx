import React, { useState, useEffect } from 'react';

interface Word {
  word: string;
  definition: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface GameState {
  score: number;
  level: number;
  lives: number;
  timeLeft: number;
  currentWord: Word | null;
  gameStatus: 'playing' | 'paused' | 'gameOver' | 'levelComplete';
  streak: number;
  totalQuestions: number;
  correctAnswers: number;
  currentLetters: string[];
  selectedLetters: string[];
  targetWord: string;
  hintsUsed: number;
  currentQuestionIndex: number;
  questionsCompleted: number;
}

// Hardcoded 20 words for the game
const HARDCODED_WORDS: Word[] = [
  { word: 'CAT', definition: 'A small domesticated carnivorous mammal', difficulty: 'easy', category: 'Animals' },
  { word: 'DOG', definition: 'A domesticated carnivorous mammal', difficulty: 'easy', category: 'Animals' },
  { word: 'SUN', definition: 'The star around which the earth orbits', difficulty: 'easy', category: 'Nature' },
  { word: 'MOON', definition: 'The natural satellite of the earth', difficulty: 'easy', category: 'Nature' },
  { word: 'TREE', definition: 'A woody perennial plant', difficulty: 'easy', category: 'Nature' },
  { word: 'WATER', definition: 'A colorless, transparent, odorless liquid', difficulty: 'easy', category: 'Nature' },
  { word: 'HOUSE', definition: 'A building for human habitation', difficulty: 'easy', category: 'Places' },
  { word: 'SCHOOL', definition: 'An institution for educating children', difficulty: 'medium', category: 'Places' },
  { word: 'ELEPHANT', definition: 'A very large herbivorous mammal', difficulty: 'medium', category: 'Animals' },
  { word: 'COMPUTER', definition: 'An electronic device for processing data', difficulty: 'medium', category: 'Technology' },
  { word: 'BUTTERFLY', definition: 'A nectar-feeding insect with large wings', difficulty: 'medium', category: 'Animals' },
  { word: 'MOUNTAIN', definition: 'A large natural elevation of the earth', difficulty: 'medium', category: 'Nature' },
  { word: 'PHOTOGRAPH', definition: 'A picture made using a camera', difficulty: 'hard', category: 'Technology' },
  { word: 'ASTRONAUT', definition: 'A person trained to travel in space', difficulty: 'hard', category: 'Space' },
  { word: 'MAGNIFICENT', definition: 'Extremely beautiful and impressive', difficulty: 'hard', category: 'Adjectives' },
  { word: 'EXTRAORDINARY', definition: 'Very unusual or remarkable', difficulty: 'hard', category: 'Adjectives' },
  { word: 'BEAUTIFUL', definition: 'Pleasing the senses or mind aesthetically', difficulty: 'easy', category: 'Adjectives' },
  { word: 'FRIEND', definition: 'A person with whom one has a bond of mutual affection', difficulty: 'easy', category: 'People' },
  { word: 'KNOWLEDGE', definition: 'Facts, information, and skills acquired through experience', difficulty: 'medium', category: 'Education' },
  { word: 'ADVENTURE', definition: 'An unusual and exciting experience', difficulty: 'medium', category: 'Activities' }
];

const WordMasterGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    lives: 3,
    timeLeft: 60,
    currentWord: null,
    gameStatus: 'playing',
    streak: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    currentLetters: [],
    selectedLetters: [],
    targetWord: '',
    hintsUsed: 0,
    currentQuestionIndex: 0,
    questionsCompleted: 0
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Generate scrambled letters
  const generateScrambledLetters = (word: string) => {
    const letters = word.split('');
    const extraLetters = ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'T', 'L', 'N'];
    const scrambled = [...letters];
    
    // Add some extra letters to make it more challenging
    for (let i = 0; i < Math.min(3, extraLetters.length); i++) {
      scrambled.push(extraLetters[Math.floor(Math.random() * extraLetters.length)]);
    }
    
    // Shuffle the array
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    
    return scrambled;
  };

  // Get next word from hardcoded list
  const getNextWord = () => {
    if (gameState.currentQuestionIndex < HARDCODED_WORDS.length) {
      return HARDCODED_WORDS[gameState.currentQuestionIndex];
    }
    return null;
  };

  // Initialize game
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.currentWord === null) {
      const word = getNextWord();
      if (word) {
        const scrambledLetters = generateScrambledLetters(word.word);
        
        setGameState(prev => ({
          ...prev,
          currentWord: word,
          currentLetters: scrambledLetters,
          selectedLetters: [],
          targetWord: word.word,
          timeLeft: 60,
          hintsUsed: 0
        }));
      }
    }
  }, [gameState.gameStatus, gameState.currentWord]);

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
      handleSubmit();
    }
  }, [gameState.timeLeft, gameState.gameStatus]);

  const selectLetter = (letter: string, index: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    setGameState(prev => ({
      ...prev,
      selectedLetters: [...prev.selectedLetters, letter],
      currentLetters: prev.currentLetters.filter((_, i) => i !== index)
    }));
  };

  const removeLetter = (index: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    const letter = gameState.selectedLetters[index];
    setGameState(prev => ({
      ...prev,
      selectedLetters: prev.selectedLetters.filter((_, i) => i !== index),
      currentLetters: [...prev.currentLetters, letter]
    }));
  };

  const handleSubmit = () => {
    if (gameState.gameStatus !== 'playing') return;
    
    const userWord = gameState.selectedLetters.join('');
    const isCorrect = userWord === gameState.targetWord;
    
    setTimeout(() => {
      if (isCorrect) {
        const points = 20 + gameState.streak * 5;
        
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
          // Load next word
          const nextWord = HARDCODED_WORDS[gameState.currentQuestionIndex + 1];
          if (nextWord) {
            const scrambledLetters = generateScrambledLetters(nextWord.word);
            setGameState(prev => ({
              ...prev,
              currentWord: nextWord,
              currentLetters: scrambledLetters,
              selectedLetters: [],
              targetWord: nextWord.word,
              timeLeft: 60,
              hintsUsed: 0
            }));
          }
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
            // Load next word
            const nextWord = HARDCODED_WORDS[newQuestionIndex];
            if (nextWord) {
              const scrambledLetters = generateScrambledLetters(nextWord.word);
              return {
                ...prev,
                lives: newLives,
                streak: 0,
                totalQuestions: prev.totalQuestions + 1,
                questionsCompleted: newQuestionsCompleted,
                currentQuestionIndex: newQuestionIndex,
                currentWord: nextWord,
                currentLetters: scrambledLetters,
                selectedLetters: [],
                targetWord: nextWord.word,
                timeLeft: 60,
                hintsUsed: 0
              };
            }
            return prev;
          }
        });
      }
    }, 1000);
  };

  const useHint = () => {
    if (gameState.hintsUsed < 2) {
      setShowHint(true);
      setGameState(prev => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        score: Math.max(0, prev.score - 10)
      }));
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  const resetGame = () => {
    setGameState({
      score: 0,
      level: 1,
      lives: 3,
      timeLeft: 60,
      currentWord: null,
      gameStatus: 'playing',
      streak: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      currentLetters: [],
      selectedLetters: [],
      targetWord: '',
      hintsUsed: 0,
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Over!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-lg text-gray-600">Final Score: <span className="font-bold text-blue-600">{gameState.score}</span></p>
            <p className="text-lg text-gray-600">Words Completed: <span className="font-bold text-green-600">{gameState.questionsCompleted}/10</span></p>
            <p className="text-lg text-gray-600">Best Streak: <span className="font-bold text-purple-600">{gameState.streak}</span></p>
            <p className="text-lg text-gray-600">Accuracy: <span className="font-bold text-orange-600">
              {gameState.totalQuestions > 0 ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) : 0}%
            </span></p>
          </div>
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Try Again
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
          <p className="text-lg text-gray-600 mb-6">You completed all 10 words!</p>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
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

      {/* Hint Display */}
      {showHint && gameState.currentWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hint!</h3>
            <p className="text-gray-600">{gameState.currentWord.definition}</p>
            <p className="text-sm text-gray-500 mt-2">Category: {gameState.currentWord.category}</p>
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
              <p className="text-gray-600 mb-6">Click Resume to continue your word mastery</p>
              <button
                onClick={pauseGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Resume Learning
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Word Master Challenge!</h2>
              
              {gameState.currentWord && (
                <div className="space-y-8">
                  {/* Word Definition */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Definition:</h3>
                    <p className="text-xl text-gray-800">{gameState.currentWord.definition}</p>
                    <p className="text-sm text-gray-600 mt-2">Category: {gameState.currentWord.category}</p>
                  </div>

                  {/* Selected Letters */}
                  <div className="bg-gray-100 rounded-xl p-6 min-h-[80px] flex items-center justify-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {gameState.selectedLetters.map((letter, index) => (
                        <button
                          key={index}
                          onClick={() => removeLetter(index)}
                          className="bg-blue-600 text-white text-2xl font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          {letter}
                        </button>
                      ))}
                      {gameState.selectedLetters.length === 0 && (
                        <span className="text-gray-500 text-lg">Select letters to form the word</span>
                      )}
                    </div>
                  </div>

                  {/* Available Letters */}
                  <div className="grid grid-cols-6 gap-3 max-w-lg mx-auto">
                    {gameState.currentLetters.map((letter, index) => (
                      <button
                        key={index}
                        onClick={() => selectLetter(letter, index)}
                        className="bg-gray-200 hover:bg-blue-200 text-gray-800 text-2xl font-bold px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        {letter}
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleSubmit}
                      disabled={gameState.selectedLetters.length === 0}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                    >
                      Submit Word
                    </button>
                    <button
                      onClick={useHint}
                      disabled={gameState.hintsUsed >= 2}
                      className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Hint ({2 - gameState.hintsUsed} left)
                    </button>
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

export default WordMasterGame;
