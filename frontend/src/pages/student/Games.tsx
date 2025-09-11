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
}

const Games: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Hardcoded games data
  const games: Game[] = [
    {
      id: 'ludo-game',
      title: 'Educational Ludo',
      description: 'Answer questions on tiles to reroll dice and win!',
      subject: 'All Subjects',
      difficulty: 'Easy',
      points: 200,
      completed: false,
      icon: '🎲',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
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
      bgColor: 'bg-green-50'
    },
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
      bgColor: 'bg-purple-50'
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
      bgColor: 'bg-orange-50'
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
      bgColor: 'bg-red-50'
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
      bgColor: 'bg-yellow-50'
    }
  ];

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];
  const filteredGames = selectedDifficulty === 'all' 
    ? games 
    : games.filter(game => game.difficulty === selectedDifficulty);

  const totalPoints = games.reduce((sum, game) => sum + (game.completed ? game.points : 0), 0);
  const completedGames = games.filter(game => game.completed).length;

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
              <p className="text-3xl font-bold">{completedGames}/{games.length}</p>
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Difficulty</h3>
        <div className="flex flex-wrap gap-3">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedDifficulty === difficulty
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {difficulty === 'all' ? 'All Games' : difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className={`${game.bgColor} rounded-xl p-6 border-2 border-transparent hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 cursor-pointer group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                {game.icon}
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {game.difficulty}
                </div>
                {game.completed && (
                  <div className="mt-1">
                    <span className="text-green-600 text-sm font-medium">✓ Completed</span>
                  </div>
                )}
              </div>
            </div>

            <h3 className={`text-xl font-bold ${game.color} mb-2`}>
              {game.title}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {game.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{game.subject}</span>
                </div>
                <div className="flex items-center text-yellow-600">
                  <span className="text-sm font-medium">{game.points} pts</span>
                </div>
              </div>
              
              <button
                onClick={() => navigate(`/student/games/${game.id}`)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  game.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {game.completed ? 'Play Again' : 'Start Game'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-xl">🏅</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
            <p className="text-sm text-gray-600">Keep up the great work!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <p className="font-medium text-gray-900">First Game Complete</p>
                <p className="text-sm text-gray-600">You completed your first game!</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚡</span>
              <div>
                <p className="font-medium text-gray-900">Speed Learner</p>
                <p className="text-sm text-gray-600">Completed 2 games in one day!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;