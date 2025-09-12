import React, { useState, useEffect, useCallback } from 'react'
// import MathPuzzleGame from './MathPuzzleGame' // commented out as unused
import { Game } from '../../types/index'

interface MathPuzzleProps {
  game: Game
  onComplete: (score: number, metadata?: any) => void
  onExit: () => void
  isOffline?: boolean
}

interface PuzzleQuestion {
  id: string
  question: string
  answer: number
  options: number[]
  difficulty: 'easy' | 'medium' | 'hard'
}

const MathPuzzle: React.FC<MathPuzzleProps> = ({
  game,
  onComplete,
  onExit,
  isOffline = false
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)

  // Sample questions - in real app, these would come from the game data
  const [questions] = useState<PuzzleQuestion[]>([
    {
      id: '1',
      question: 'What is 15 + 27?',
      answer: 42,
      options: [40, 42, 44, 46],
      difficulty: 'easy'
    },
    {
      id: '2',
      question: 'What is 8 × 7?',
      answer: 56,
      options: [54, 56, 58, 60],
      difficulty: 'easy'
    },
    {
      id: '3',
      question: 'What is 144 ÷ 12?',
      answer: 12,
      options: [10, 11, 12, 13],
      difficulty: 'medium'
    },
    {
      id: '4',
      question: 'What is 25²?',
      answer: 625,
      options: [525, 625, 725, 825],
      difficulty: 'medium'
    },
    {
      id: '5',
      question: 'What is √81?',
      answer: 9,
      options: [7, 8, 9, 10],
      difficulty: 'hard'
    }
  ])

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameEnded && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      endGame()
    }
  }, [gameStarted, gameEnded, timeLeft])

  const startGame = () => {
    setGameStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setCorrectAnswers(0)
    setHintsUsed(0)
  }

  const selectAnswer = (answer: number) => {
    setSelectedAnswer(answer)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === questions[currentQuestion].answer
    setShowResult(true)

    if (isCorrect) {
      const points = getPointsForQuestion(questions[currentQuestion].difficulty)
      setScore(score + points)
      setCorrectAnswers(correctAnswers + 1)
    }

    setTimeout(() => {
      setShowResult(false)
      setSelectedAnswer(null)
      setShowHint(false)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        endGame()
      }
    }, 2000)
  }

  const getPointsForQuestion = (difficulty: string): number => {
    switch (difficulty) {
      case 'easy': return 10
      case 'medium': return 20
      case 'hard': return 30
      default: return 10
    }
  }

  const useHint = () => {
    setShowHint(true)
    setHintsUsed(hintsUsed + 1)
  }

  const getHint = (question: PuzzleQuestion): string => {
    switch (question.id) {
      case '1': return 'Try breaking it down: 15 + 20 + 7'
      case '2': return 'Think of it as 8 groups of 7'
      case '3': return 'How many 12s fit into 144?'
      case '4': return '25 × 25 = ?'
      case '5': return 'What number multiplied by itself gives 81?'
      default: return 'Think step by step!'
    }
  }

  const endGame = useCallback(() => {
    setGameEnded(true)
    const finalScore = Math.round((score / (questions.length * 30)) * 100) // Max possible score
    
    const metadata = {
      correctAnswers,
      totalQuestions: questions.length,
      hintsUsed,
      timeRemaining: timeLeft,
      difficulty: game.difficulty
    }

    onComplete(finalScore, metadata)
  }, [score, correctAnswers, hintsUsed, timeLeft, questions.length, game.difficulty, onComplete])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">{game.title}</h1>
          <p className="text-lg mb-6 opacity-90">{game.description}</p>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Game Rules:</h3>
            <ul className="text-sm space-y-1 text-left">
              <li>• Answer {questions.length} math questions</li>
              <li>• You have {formatTime(300)} to complete</li>
              <li>• Easy questions: 10 points</li>
              <li>• Medium questions: 20 points</li>
              <li>• Hard questions: 30 points</li>
              <li>• Hints available (reduces final score)</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
          >
            Start Game
          </button>
        </div>
      </div>
    )
  }

  if (gameEnded) {
    const finalScore = Math.round((score / (questions.length * 30)) * 100)
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-600 to-blue-700 text-white p-8">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">Game Complete!</h1>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
            <div className="text-6xl font-bold mb-4">{finalScore}%</div>
            <div className="space-y-2 text-lg">
              <p>Correct Answers: {correctAnswers}/{questions.length}</p>
              <p>Points Earned: {score}</p>
              <p>Hints Used: {hintsUsed}</p>
              <p>Time Remaining: {formatTime(timeLeft)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all w-full"
            >
              Play Again
            </button>
            <button
              onClick={onExit}
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-all w-full"
            >
              Exit Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-20">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold">
            Question {currentQuestion + 1}/{questions.length}
          </span>
          <span className="text-lg">Score: {score}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`text-lg font-mono ${timeLeft < 60 ? 'text-red-300' : ''}`}>
            {formatTime(timeLeft)}
          </span>
          {isOffline && (
            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm">
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-black bg-opacity-20 h-2">
        <div 
          className="bg-white h-2 transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="bg-white bg-opacity-10 rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center">{currentQ.question}</h2>
            
            {showHint && (
              <div className="bg-yellow-500 bg-opacity-20 border border-yellow-400 rounded-lg p-4 mb-6">
                <p className="text-yellow-100">💡 Hint: {getHint(currentQ)}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(option)}
                  disabled={showResult}
                  className={`p-4 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 ${
                    selectedAnswer === option
                      ? showResult
                        ? option === currentQ.answer
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-white text-indigo-600'
                      : showResult && option === currentQ.answer
                        ? 'bg-green-500 text-white'
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {showResult && (
              <div className={`text-center text-xl font-semibold ${
                selectedAnswer === currentQ.answer ? 'text-green-300' : 'text-red-300'
              }`}>
                {selectedAnswer === currentQ.answer ? '✅ Correct!' : '❌ Incorrect!'}
                {selectedAnswer !== currentQ.answer && (
                  <p className="text-lg mt-2">The correct answer was {currentQ.answer}</p>
                )}
              </div>
            )}

            {!showResult && (
              <div className="flex justify-center space-x-4">
                <button
                  onClick={useHint}
                  disabled={showHint || hintsUsed >= 3}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💡 Hint ({3 - hintsUsed} left)
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-white text-indigo-600 px-8 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MathPuzzle
