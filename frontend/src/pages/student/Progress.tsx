import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ProgressData {
  totalPoints: number;
  level: number;
  streak: number;
  gamesCompleted: number;
  totalTimeSpent: number;
  accuracy: number;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earned: boolean;
    earnedDate?: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    points: number;
    timestamp: string;
    game: string;
  }>;
  weeklyProgress: Array<{
    day: string;
    points: number;
    games: number;
  }>;
}

const Progress: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'activity'>('overview');

  // Hardcoded progress data
  const progressData: ProgressData = {
    totalPoints: 1250,
    level: 8,
    streak: 12,
    gamesCompleted: 15,
    totalTimeSpent: 180, // minutes
    accuracy: 87,
    badges: [
      {
        id: 'first-game',
        name: 'First Steps',
        description: 'Complete your first game',
        icon: '🎯',
        earned: true,
        earnedDate: '2025-09-01'
      },
      {
        id: 'streak-master',
        name: 'Streak Master',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        earned: true,
        earnedDate: '2025-09-05'
      },
      {
        id: 'math-wizard',
        name: 'Math Wizard',
        description: 'Score 100+ in math games',
        icon: '🧙‍♂️',
        earned: true,
        earnedDate: '2025-09-08'
      },
      {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Complete 5 games in one day',
        icon: '⚡',
        earned: false
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 100% accuracy',
        icon: '💎',
        earned: false
      },
      {
        id: 'explorer',
        name: 'Explorer',
        description: 'Try all game categories',
        icon: '🗺️',
        earned: false
      }
    ],
    recentActivity: [
      {
        id: '1',
        action: 'Completed Math Puzzle',
        points: 50,
        timestamp: '2 hours ago',
        game: 'Number Ninja'
      },
      {
        id: '2',
        action: 'Earned Badge',
        points: 25,
        timestamp: '1 day ago',
        game: 'Math Wizard'
      },
      {
        id: '3',
        action: 'Level Up!',
        points: 100,
        timestamp: '2 days ago',
        game: 'Level 8'
      },
      {
        id: '4',
        action: 'Completed Word Game',
        points: 75,
        timestamp: '3 days ago',
        game: 'Word Master'
      }
    ],
    weeklyProgress: [
      { day: 'Mon', points: 120, games: 2 },
      { day: 'Tue', points: 80, games: 1 },
      { day: 'Wed', points: 150, games: 3 },
      { day: 'Thu', points: 200, games: 4 },
      { day: 'Fri', points: 180, games: 3 },
      { day: 'Sat', points: 220, games: 5 },
      { day: 'Sun', points: 100, games: 2 }
    ]
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'badges', name: 'Badges', icon: '🏆' },
    { id: 'activity', name: 'Activity', icon: '📈' }
  ];

  const earnedBadges = progressData.badges.filter(badge => badge.earned);
  const maxPoints = Math.max(...progressData.weeklyProgress.map(day => day.points));

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Points</p>
              <p className="text-3xl font-bold">{progressData.totalPoints.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Current Level</p>
              <p className="text-3xl font-bold">{progressData.level}</p>
            </div>
            <div className="h-12 w-12 bg-green-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Current Streak</p>
              <p className="text-3xl font-bold">{progressData.streak} days</p>
            </div>
            <div className="h-12 w-12 bg-orange-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Accuracy</p>
              <p className="text-3xl font-bold">{progressData.accuracy}%</p>
            </div>
            <div className="h-12 w-12 bg-purple-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Weekly Progress Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
            <div className="space-y-4">
              {progressData.weeklyProgress.map((day, index) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>{day.points} points</span>
                      <span>{day.games} games</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(day.points / maxPoints) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Learning Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Games Completed</span>
                  <span className="font-semibold">{progressData.gamesCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Time</span>
                  <span className="font-semibold">{progressData.totalTimeSpent} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-semibold">{Math.round(progressData.totalPoints / progressData.gamesCompleted)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Badges Earned</span>
                  <span className="font-semibold">{earnedBadges.length}/{progressData.badges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Streak</span>
                  <span className="font-semibold">{progressData.streak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Accuracy</span>
                  <span className="font-semibold">{progressData.accuracy}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progressData.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    badge.earned
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 shadow-lg'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-3xl ${badge.earned ? '' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {badge.name}
                      </h4>
                      <p className={`text-sm ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                        {badge.description}
                      </p>
                      {badge.earned && badge.earnedDate && (
                        <p className="text-xs text-yellow-600 mt-1">
                          Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {progressData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">+{activity.points}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.game} • {activity.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{activity.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;