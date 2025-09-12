import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface StreakCounterProps {
  currentStreak: number
  longestStreak: number
  size?: 'sm' | 'md' | 'lg'
  showLongest?: boolean
}

const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  size = 'md',
  showLongest = true
}) => {
  const { t } = useTranslation()

  const sizeConfig = {
    sm: { 
      container: 'p-3', 
      icon: 'text-2xl', 
      number: 'text-lg', 
      text: 'text-xs',
      flame: 'w-8 h-8'
    },
    md: { 
      container: 'p-4', 
      icon: 'text-3xl', 
      number: 'text-2xl', 
      text: 'text-sm',
      flame: 'w-10 h-10'
    },
    lg: { 
      container: 'p-6', 
      icon: 'text-4xl', 
      number: 'text-3xl', 
      text: 'text-base',
      flame: 'w-12 h-12'
    }
  }

  const config = sizeConfig[size]

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-purple-500 to-pink-500'
    if (streak >= 14) return 'from-orange-500 to-red-500'
    if (streak >= 7) return 'from-yellow-500 to-orange-500'
    if (streak >= 3) return 'from-green-500 to-yellow-500'
    return 'from-blue-500 to-green-500'
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🏆'
    if (streak >= 14) return '🔥'
    if (streak >= 7) return '⚡'
    if (streak >= 3) return '✨'
    return '💫'
  }

  return (
    <div className={`bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl shadow-soft border border-gray-200 dark:border-gray-800 ${config.container}`}>
      <div className="text-center">
        {/* Streak Icon */}
        <motion.div
          className={`inline-flex items-center justify-center ${config.flame} rounded-full bg-gradient-to-r ${getStreakColor(currentStreak)} mb-3`}
          animate={{ 
            scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
            rotate: currentStreak > 0 ? [0, 5, -5, 0] : 0
          }}
          transition={{ 
            duration: 2, 
            repeat: currentStreak > 0 ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          <span className="text-white text-xl">
            {currentStreak > 0 ? getStreakEmoji(currentStreak) : '💤'}
          </span>
        </motion.div>

        {/* Current Streak */}
        <div className="mb-2">
          <motion.div 
            className={`font-bold text-gray-800 dark:text-gray-100 ${config.number}`}
            key={currentStreak}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentStreak}
          </motion.div>
          <div className={`text-gray-600 dark:text-gray-300 ${config.text}`}>
            {t('progress.currentStreak')}
          </div>
        </div>

        {/* Longest Streak */}
        {showLongest && longestStreak > currentStreak && (
          <div className={`text-gray-500 dark:text-gray-400 ${config.text}`}>
            {t('progress.longestStreak')}: {longestStreak}
          </div>
        )}

        {/* Streak Messages */}
        <div className={`mt-3 ${config.text}`}>
          {currentStreak === 0 && (
            <div className="text-gray-500 dark:text-gray-400">
              {t('Start your learning streak!')}
            </div>
          )}
          {currentStreak >= 1 && currentStreak < 3 && (
            <div className="text-blue-600 dark:text-blue-400">
              {t('Great start! Keep going!')}
            </div>
          )}
          {currentStreak >= 3 && currentStreak < 7 && (
            <div className="text-green-600 dark:text-green-400">
              {t('You\'re on fire! 🔥')}
            </div>
          )}
          {currentStreak >= 7 && currentStreak < 14 && (
            <div className="text-yellow-600 dark:text-yellow-400">
              {t('Amazing streak! ⚡')}
            </div>
          )}
          {currentStreak >= 14 && currentStreak < 30 && (
            <div className="text-orange-600 dark:text-orange-400">
              {t('Incredible dedication! 🏅')}
            </div>
          )}
          {currentStreak >= 30 && (
            <div className="text-purple-600 dark:text-purple-400">
              {t('Legendary learner! 🏆')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StreakCounter
