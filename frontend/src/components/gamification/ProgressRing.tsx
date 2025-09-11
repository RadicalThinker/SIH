import React from 'react'
import { motion } from 'framer-motion'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showPercentage?: boolean
  children?: React.ReactNode
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showPercentage = true,
  children
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {Math.round(progress)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressRing
