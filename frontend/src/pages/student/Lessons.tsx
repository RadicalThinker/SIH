import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next'; // commented out as unused

interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  progress: number; // 0-100
  thumbnail: string;
  topics: string[];
  points: number;
}

const Lessons: React.FC = () => {
  // const { t } = useTranslation(); // commented out as unused
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Hardcoded lessons data
  const lessons: Lesson[] = [
    {
      id: 'math-basics-1',
      title: 'Introduction to Algebra',
      description: 'Learn the fundamentals of algebraic expressions and equations',
      subject: 'Mathematics',
      duration: 30,
      difficulty: 'Beginner',
      completed: true,
      progress: 100,
      thumbnail: '📐',
      topics: ['Variables', 'Expressions', 'Basic Equations'],
      points: 50
    },
    {
      id: 'math-basics-2',
      title: 'Quadratic Equations',
      description: 'Master solving quadratic equations using different methods',
      subject: 'Mathematics',
      duration: 45,
      difficulty: 'Intermediate',
      completed: false,
      progress: 60,
      thumbnail: '📊',
      topics: ['Factoring', 'Quadratic Formula', 'Graphing'],
      points: 75
    },
    {
      id: 'science-physics-1',
      title: 'Newton\'s Laws of Motion',
      description: 'Understand the three fundamental laws that govern motion',
      subject: 'Physics',
      duration: 40,
      difficulty: 'Beginner',
      completed: true,
      progress: 100,
      thumbnail: '⚡',
      topics: ['First Law', 'Second Law', 'Third Law'],
      points: 60
    },
    {
      id: 'science-chemistry-1',
      title: 'Atomic Structure',
      description: 'Explore the building blocks of matter and their properties',
      subject: 'Chemistry',
      duration: 35,
      difficulty: 'Intermediate',
      completed: false,
      progress: 30,
      thumbnail: '🧪',
      topics: ['Protons', 'Neutrons', 'Electrons', 'Periodic Table'],
      points: 80
    },
    {
      id: 'english-grammar-1',
      title: 'Parts of Speech',
      description: 'Master nouns, verbs, adjectives, and other essential grammar',
      subject: 'English',
      duration: 25,
      difficulty: 'Beginner',
      completed: true,
      progress: 100,
      thumbnail: '📚',
      topics: ['Nouns', 'Verbs', 'Adjectives', 'Adverbs'],
      points: 40
    },
    {
      id: 'english-literature-1',
      title: 'Poetry Analysis',
      description: 'Learn to analyze and appreciate different forms of poetry',
      subject: 'English',
      duration: 50,
      difficulty: 'Advanced',
      completed: false,
      progress: 0,
      thumbnail: '📖',
      topics: ['Rhyme Scheme', 'Meter', 'Imagery', 'Symbolism'],
      points: 100
    },
    {
      id: 'biology-cells-1',
      title: 'Cell Biology Basics',
      description: 'Discover the structure and function of living cells',
      subject: 'Biology',
      duration: 40,
      difficulty: 'Beginner',
      completed: false,
      progress: 15,
      thumbnail: '🔬',
      topics: ['Cell Membrane', 'Nucleus', 'Mitochondria', 'Organelles'],
      points: 70
    },
    {
      id: 'math-geometry-1',
      title: 'Geometric Shapes and Angles',
      description: 'Explore triangles, circles, and angle relationships',
      subject: 'Mathematics',
      duration: 35,
      difficulty: 'Intermediate',
      completed: false,
      progress: 0,
      thumbnail: '🔺',
      topics: ['Triangles', 'Circles', 'Angles', 'Area & Perimeter'],
      points: 65
    }
  ];

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredLessons = lessons.filter(lesson => {
    const subjectMatch = selectedSubject === 'all' || lesson.subject === selectedSubject;
    const difficultyMatch = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
    return subjectMatch && difficultyMatch;
  });

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const totalPoints = lessons.reduce((sum, lesson) => sum + (lesson.completed ? lesson.points : 0), 0);
  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Lessons Completed</p>
              <p className="text-3xl font-bold">{completedLessons}/{lessons.length}</p>
            </div>
            <div className="h-12 w-12 bg-green-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

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

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Study Time</p>
              <p className="text-3xl font-bold">{totalDuration}m</p>
            </div>
            <div className="h-12 w-12 bg-purple-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by Subject</h3>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedSubject === subject
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by Difficulty</h3>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedDifficulty === difficulty
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
          >
            {/* Lesson Thumbnail */}
            <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 flex items-center justify-center">
              <span className="text-6xl">{lesson.thumbnail}</span>
            </div>

            {/* Lesson Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{lesson.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{lesson.description}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {lesson.difficulty}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {!lesson.completed && lesson.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span>Progress</span>
                    <span>{lesson.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${lesson.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Lesson Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <span className="mr-2">📚</span>
                  <span>{lesson.subject}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <span className="mr-2">⏱️</span>
                  <span>{lesson.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <span className="mr-2">⭐</span>
                  <span>{lesson.points} points</span>
                </div>
              </div>

              {/* Topics */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Topics covered:</p>
                <div className="flex flex-wrap gap-1">
                  {lesson.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs rounded-md"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                  lesson.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                    : lesson.progress > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                {lesson.completed ? 'Review Lesson' : lesson.progress > 0 ? 'Continue Learning' : 'Start Lesson'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Study Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Tips</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Take breaks every 25-30 minutes to maintain focus</li>
              <li>• Review completed lessons regularly to reinforce learning</li>
              <li>• Try to maintain a consistent study schedule</li>
              <li>• Don't hesitate to revisit difficult topics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;