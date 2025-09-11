import React, { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lazy load games for better performance
const MathPuzzleGame = lazy(() => import('../../games/math-puzzle/MathPuzzleGame'));
const WordMasterGame = lazy(() => import('../../games/word-master/WordMasterGame'));
const LudoGame = lazy(() => import('../../games/ludo/LudoGame'));

const GameLoaderPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();

  const renderGame = () => {
    switch (gameId) {
      case 'math-puzzle-1':
        return <MathPuzzleGame />;
      case 'math-puzzle-2':
        return <MathPuzzleGame />;
      case 'word-master':
        return <WordMasterGame />;
      case 'ludo-game':
        return <LudoGame />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Not Found</h2>
              <p className="text-lg text-gray-600 mb-6">
                The game "{gameId}" is not available yet.
              </p>
              <button
                onClick={() => window.history.back()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-lg text-gray-600">Loading game...</p>
        </div>
      </div>
    }>
      {renderGame()}
    </Suspense>
  );
};

export default GameLoaderPage;
