import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import ProgressRing from './ProgressRing'

interface LevelProgressProps {
  currentLevel: number
  totalPoints: number
  pointsToNextLevel: number
  showRing?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  currentLevel,
  totalPoints,
  pointsToNextLevel,
  showRing = true,
  size = 'md'
}) => {
  const { t } = useTranslation()

  // Calculate progress to next level
  const currentLevelPoints = totalPoints - pointsToNextLevel
  const nextLevelThreshold = totalPoints + pointsToNextLevel
  const progressPercentage = pointsToNextLevel > 0 
    ? (currentLevelPoints / (currentLevelPoints + pointsToNextLevel)) * 100 
    : 100

  const sizeConfig = {
    sm: { ring: 80, text: 'text-sm', badge: 'text-xs px-2 py-1' },
    md: { ring: 120, text: 'text-base', badge: 'text-sm px-3 py-1' },
    lg: { ring: 160, text: 'text-lg', badge: 'text-base px-4 py-2' }
  }

  const config = sizeConfig[size]

  if (showRing) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <ProgressRing
          progress={progressPercentage}
          size={config.ring}
          color="#3B82F6"
          showPercentage={false}
        >
          <div className="text-center">
            <div className={`font-bold text-primary-600 ${config.text}`}>
              {t('dashboard.level', { level: currentLevel })}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {totalPoints} {t('dashboard.points')}
            </div>
          </div>
        </ProgressRing>
        
        {pointsToNextLevel > 0 && (
          <div className={`text-center ${config.text}`}>
            <div className="text-gray-600">
              {t('dashboard.nextLevel', { points: pointsToNextLevel })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className={`font-bold text-primary-600 ${config.text}`}>
          {t('dashboard.level', { level: currentLevel })}
        </div>
        <div className={`bg-primary-100 text-primary-800 rounded-full font-medium ${config.badge}`}>
          {totalPoints} {t('dashboard.points')}
        </div>
      </div>
      
      {pointsToNextLevel > 0 ? (
        <>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <motion.div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="text-sm text-gray-600 text-center">
            {t('dashboard.nextLevel', { points: pointsToNextLevel })}
          </div>
        </>
      ) : (
        <div className="text-center text-sm text-green-600 font-medium">
          🎉 {t('achievements.congratulations')}! Max level reached!
        </div>
      )}
    </div>
  )
}

export default LevelProgress
