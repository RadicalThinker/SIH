import React from 'react'
import { useTranslation } from 'react-i18next'
import { Achievement } from '../../types/index'
import { useGamification } from '@hooks/useGamification'
import { motion } from 'framer-motion'

interface AchievementCardProps {
  achievement: Achievement
  isEarned?: boolean
  progress?: number
  showProgress?: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isEarned = false,
  progress = 0,
  showProgress = true,
  size = 'md',
  onClick
}) => {
  const { t } = useTranslation()
  const { getRarityColor, getRarityBg } = useGamification()

  const sizeClasses = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-32 h-32 text-base'
  }

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  }

  return (
    <motion.div
      className={`
        relative rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${isEarned 
          ? `${getRarityBg(achievement.rarity)} border-current ${getRarityColor(achievement.rarity)} shadow-md` 
          : 'bg-gray-100 border-gray-300 opacity-60'
        }
        ${sizeClasses[size]}
        hover:scale-105 hover:shadow-lg
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Achievement Icon */}
      <div className="flex flex-col items-center justify-center h-full p-2">
        <div className={`${iconSizes[size]} mb-1`}>
          {isEarned ? achievement.icon : '🔒'}
        </div>
        
        {size !== 'sm' && (
          <div className="text-center">
            <div className={`font-semibold ${sizeClasses[size]} leading-tight`}>
              {achievement.name}
            </div>
            {size === 'lg' && (
              <div className="text-xs opacity-75 mt-1">
                {achievement.description}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rarity Badge */}
      <div className={`
        absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold
        ${getRarityBg(achievement.rarity)} ${getRarityColor(achievement.rarity)}
        border border-current
      `}>
        {t(`achievements.rarity.${achievement.rarity}`)}
      </div>

      {/* Points Badge */}
      <div className="absolute -bottom-1 -left-1 bg-primary-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
        {achievement.points}
      </div>

      {/* Progress Bar (for unearned achievements) */}
      {!isEarned && showProgress && progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 rounded-b-xl overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}

      {/* Earned Indicator */}
      {isEarned && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </motion.div>
  )
}

export default AchievementCard
