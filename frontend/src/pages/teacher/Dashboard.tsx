import React from 'react';
import { useTranslation } from 'react-i18next';

const TeacherDashboard: React.FC = () => {
  const { t } = useTranslation();

  // Hardcoded teacher data for MVP
  const teacherData = {
    name: 'Mrs. Priya Sharma',
    classes: [
      { id: '1', name: 'Grade 6A', students: 25, subject: 'Mathematics' },
      { id: '2', name: 'Grade 7A', students: 23, subject: 'Science' }
    ],
    stats: {
      totalStudents: 48,
      activeStudents: 42,
      averageScore: 78,
      lessonsCompleted: 156
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('Welcome back, {{name}}!', { name: teacherData.name })}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('Here\'s your class overview and student progress')}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">{t('Teacher')}</div>
            <div className="text-2xl font-bold text-blue-600">
              {teacherData.stats.totalStudents} {t('Students')}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('Total Students')}</p>
              <p className="text-2xl font-bold text-gray-900">{teacherData.stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('Active Students')}</p>
              <p className="text-2xl font-bold text-gray-900">{teacherData.stats.activeStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('Average Score')}</p>
              <p className="text-2xl font-bold text-gray-900">{teacherData.stats.averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('Lessons Completed')}</p>
              <p className="text-2xl font-bold text-gray-900">{teacherData.stats.lessonsCompleted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('My Classes')}</h3>
          <div className="space-y-4">
            {teacherData.classes.map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold">{classItem.name.charAt(classItem.name.length - 1)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{classItem.name}</p>
                    <p className="text-sm text-gray-600">{classItem.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{classItem.students} {t('students')}</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    {t('View Details')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Quick Actions')}</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('Create New Lesson')}
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('View Analytics')}
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {t('Manage Students')}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Recent Activity')}</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{t('Arjun Singh completed Math Puzzle')}</p>
              <p className="text-sm text-gray-600">{t('2 hours ago')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">+50 pts</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">📚</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{t('Priya Patel started Algebra lesson')}</p>
              <p className="text-sm text-gray-600">{t('4 hours ago')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-600">{t('In Progress')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-sm">🏆</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{t('Rahul Verma earned Math Wizard badge')}</p>
              <p className="text-sm text-gray-600">{t('1 day ago')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-yellow-600">+25 pts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;