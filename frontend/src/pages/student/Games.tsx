import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Game {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  completed: boolean;
  icon: string;
  color: string;
  bgColor: string;
  available: boolean;
}

const Games: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Available games (first section)
  const availableGames: Game[] = [
    {
      id: 'math-puzzle-2',
      title: 'Geometry Quest',
      description: 'Explore shapes and angles in an adventure',
      subject: 'Mathematics',
      difficulty: 'Medium',
      points: 100,
      completed: false,
      icon: '📐',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      available: true
    },
    {
      id: 'word-master',
      title: 'Word Master',
      description: 'Build vocabulary with interactive challenges',
      subject: 'English',
      difficulty: 'Easy',
      points: 75,
      completed: true,
      icon: '📚',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      available: true
    }
  ];

  // Coming soon games
  const comingSoonGames: Game[] = [
    {
      id: 'science-lab',
      title: 'Chemistry Lab',
      description: 'Mix elements and discover reactions',
      subject: 'Science',
      difficulty: 'Hard',
      points: 150,
      completed: false,
      icon: '🧪',
      color: 'text-purple-600',
      bgColor: 'bg-gray-50',
      available: false
    },
    {
      id: 'physics-playground',
      title: 'Physics Playground',
      description: 'Learn forces and motion through experiments',
      subject: 'Physics',
      difficulty: 'Hard',
      points: 200,
      completed: false,
      icon: '⚡',
      color: 'text-red-600',
      bgColor: 'bg-gray-50',
      available: false
    },
    {
      id: 'biology-safari',
      title: 'Biology Safari',
      description: 'Discover animals and their habitats',
      subject: 'Biology',
      difficulty: 'Medium',
      points: 125,
      completed: false,
      icon: '🦁',
      color: 'text-yellow-600',
      bgColor: 'bg-gray-50',
      available: false
    },
    {
      id: 'history-adventure',
      title: 'History Adventure',
      description: 'Travel through time and discover civilizations',
      subject: 'History',
      difficulty: 'Medium',
      points: 120,
      completed: false,
      icon: '🏛️',
      color: 'text-indigo-600',
      bgColor: 'bg-gray-50',
      available: false
    },
    {
      id: 'coding-challenge',
      title: 'Coding Challenge',
      description: 'Learn programming through fun puzzles',
      subject: 'Computer Science',
      difficulty: 'Hard',
      points: 250,
      completed: false,
      icon: '💻',
      color: 'text-blue-600',
      bgColor: 'bg-gray-50',
      available: false
    },
    {
      id: 'art-studio',
      title: 'Art Studio',
      description: 'Express creativity through digital art',
      subject: 'Art',
      difficulty: 'Easy',
      points: 80,
      completed: false,
      icon: '🎨',
      color: 'text-pink-600',
      bgColor: 'bg-gray-50',
      available: false
    }
  ];

  // Combine all games for stats calculation
  const allGames = [...availableGames, ...comingSoonGames];

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];
  
  // Filter available games only for the filter functionality
  const filteredAvailableGames = selectedDifficulty === 'all' 
    ? availableGames 
    : availableGames.filter(game => game.difficulty === selectedDifficulty);

  // Filter coming soon games for display
  const filteredComingSoonGames = selectedDifficulty === 'all' 
    ? comingSoonGames 
    : comingSoonGames.filter(game => game.difficulty === selectedDifficulty);

  const totalPoints = availableGames.reduce((sum, game) => sum + (game.completed ? game.points : 0), 0);
  const completedGames = availableGames.filter(game => game.completed).length;
  const totalAvailableGames = availableGames.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Points</p>
              <p className="text-3xl font-bold">{totalPoints}</p>
            </div>
            <div className="h-12 w-12 bg-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Games Completed</p>
              <p className="text-3xl font-bold">{completedGames}/{totalAvailableGames}</p>
            </div>
            <div className="h-12 w-12 bg-green-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Current Level</p>
              <p className="text-3xl font-bold">{Math.floor(totalPoints / 100) + 1}</p>
            </div>
            <div className="h-12 w-12 bg-purple-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Filter by Difficulty</h3>
        <div className="flex flex-wrap gap-3">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedDifficulty === difficulty
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {difficulty === 'all' ? 'All Games' : difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Available Games Section */}
      {filteredAvailableGames.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">🎮</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Available Games</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredAvailableGames.map((game) => (
              <div
                key={game.id}
                className={`${game.bgColor} dark:bg-white/5 rounded-xl p-6 border-2 border-transparent dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 cursor-pointer group backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-16 w-16 bg-white dark:bg-gray-800 dark:text-white rounded-xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {game.icon}
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      game.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {game.difficulty}
                    </div>
                    {game.completed && (
                      <div className="mt-1">
                        <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Completed</span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className={`text-xl font-bold ${game.color} dark:text-white mb-2`}>
                  {game.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {game.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{game.subject}</span>
                    </div>
                    <div className="flex items-center text-yellow-600 dark:text-yellow-300">
                      <span className="text-sm font-medium">{game.points} pts</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/student/games/${game.id}`)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      game.completed
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {game.completed ? 'Play Again' : 'Start Game'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Games Section */}
      {filteredComingSoonGames.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <div className="h-8 w-8 bg-gray-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-lg">⏳</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Coming Soon</h2>
            <span className="ml-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm rounded-full">
              More games in development
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComingSoonGames.map((game) => (
              <div
                key={game.id}
                className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 transition-all duration-300 opacity-75 hover:opacity-90"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-3xl opacity-60">
                    {game.icon}
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      {game.difficulty}
                    </div>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
                        🚧 Coming Soon
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {game.title}
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  {game.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                      <span className="font-medium">{game.subject}</span>
                    </div>
                    <div className="flex items-center text-gray-400 dark:text-gray-500">
                      <span className="text-sm font-medium">{game.points} pts</span>
                    </div>
                  </div>
                  
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-xl">🏅</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Achievements</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Keep up the great work!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedGames > 0 ? (
            <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-green-200 dark:border-green-900/30">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Game Master</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Completed {completedGames} game{completedGames > 1 ? 's' : ''}!</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-blue-200 dark:border-blue-900/30">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🚀</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Ready to Start</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Begin your learning journey!</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-purple-200 dark:border-purple-900/30">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⭐</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Points Collector</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Earned {totalPoints} points total!</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coming Soon Notice */}
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900/30">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🎮</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">More Games Coming Soon!</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We're working hard to bring you more exciting educational games. Stay tuned for Chemistry Lab, Physics Playground, and many more!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;