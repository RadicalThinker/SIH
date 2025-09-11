import mongoose, { Schema, Document } from 'mongoose'

export interface IProgress extends Document {
  _id: string
  studentId: mongoose.Types.ObjectId
  lessonId?: mongoose.Types.ObjectId
  gameId?: mongoose.Types.ObjectId
  type: 'lesson' | 'game' | 'quiz'
  status: 'not-started' | 'in-progress' | 'completed'
  score?: number
  timeSpent: number
  startedAt: Date
  completedAt?: Date
  attempts: number
  bestScore?: number
  synced: boolean
  offline: boolean
  metadata: {
    hintsUsed?: number
    pauseCount?: number
    deviceType?: string
    [key: string]: any
  }
  createdAt: Date
  updatedAt: Date
}

const progressSchema = new Schema<IProgress>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  type: {
    type: String,
    enum: ['lesson', 'game', 'quiz'],
    required: [true, 'Progress type is required']
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  score: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: [0, 'Time spent cannot be negative']
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  attempts: {
    type: Number,
    default: 1,
    min: [1, 'Attempts must be at least 1']
  },
  bestScore: {
    type: Number,
    min: [0, 'Best score cannot be negative'],
    max: [100, 'Best score cannot exceed 100']
  },
  synced: {
    type: Boolean,
    default: false
  },
  offline: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Achievement Model
export interface IAchievement extends Document {
  _id: string
  name: string
  description: string
  icon: string
  criteria: {
    type: 'score' | 'streak' | 'completion' | 'time' | 'games'
    threshold: number
    subject?: string
    timeframe?: 'daily' | 'weekly' | 'monthly'
  }
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isActive: boolean
  translations: Map<string, {
    name: string
    description: string
  }>
  createdAt: Date
  updatedAt: Date
}

const achievementSchema = new Schema<IAchievement>({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  icon: {
    type: String,
    required: [true, 'Achievement icon is required']
  },
  criteria: {
    type: {
      type: String,
      enum: ['score', 'streak', 'completion', 'time', 'games'],
      required: true
    },
    threshold: {
      type: Number,
      required: true,
      min: [1, 'Threshold must be at least 1']
    },
    subject: {
      type: String,
      enum: ['math', 'science', 'english', 'physics', 'chemistry', 'biology']
    },
    timeframe: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    }
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
    min: [1, 'Points must be at least 1'],
    max: [1000, 'Points cannot exceed 1000']
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  translations: {
    type: Map,
    of: {
      name: String,
      description: String
    }
  }
}, {
  timestamps: true
})

// Badge Model (Earned Achievements)
export interface IBadge extends Document {
  _id: string
  studentId: mongoose.Types.ObjectId
  achievementId: mongoose.Types.ObjectId
  earnedAt: Date
  synced: boolean
}

const badgeSchema = new Schema<IBadge>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  achievementId: {
    type: Schema.Types.ObjectId,
    ref: 'Achievement',
    required: [true, 'Achievement ID is required']
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  synced: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Indexes
progressSchema.index({ studentId: 1, type: 1 })
progressSchema.index({ studentId: 1, lessonId: 1 })
progressSchema.index({ studentId: 1, gameId: 1 })
progressSchema.index({ status: 1 })
progressSchema.index({ synced: 1 })
progressSchema.index({ completedAt: -1 })

achievementSchema.index({ name: 1 })
achievementSchema.index({ 'criteria.type': 1 })
achievementSchema.index({ rarity: 1 })
achievementSchema.index({ isActive: 1 })

badgeSchema.index({ studentId: 1 })
badgeSchema.index({ achievementId: 1 })
badgeSchema.index({ earnedAt: -1 })
badgeSchema.index({ synced: 1 })

// Compound index to prevent duplicate badges
badgeSchema.index({ studentId: 1, achievementId: 1 }, { unique: true })

// Validation: Either lessonId or gameId must be present
progressSchema.pre('validate', function(next) {
  if (!this.lessonId && !this.gameId) {
    next(new Error('Either lessonId or gameId must be provided'))
  } else if (this.lessonId && this.gameId) {
    next(new Error('Cannot have both lessonId and gameId'))
  } else {
    next()
  }
})

// Update best score when score changes
progressSchema.pre('save', function(next) {
  if (this.isModified('score') && this.score !== undefined) {
    if (!this.bestScore || this.score > this.bestScore) {
      this.bestScore = this.score
    }
  }
  next()
})

export const Progress = mongoose.model<IProgress>('Progress', progressSchema)
export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema)
export const Badge = mongoose.model<IBadge>('Badge', badgeSchema)
