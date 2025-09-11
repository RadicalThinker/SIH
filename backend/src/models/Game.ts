import mongoose, { Schema, Document } from 'mongoose'

export interface IGame extends Document {
  _id: string
  title: string
  description: string
  type: 'puzzle' | 'simulation' | 'quiz' | 'adventure' | 'strategy'
  subject: string
  grade: number[]
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
  assets: {
    bundle: string
    images: string[]
    sounds: string[]
    data: string[]
    totalSize: number
  }
  leaderboard: boolean
  multiplayer: boolean
  isOfflineAvailable: boolean
  downloadSize: number
  version: string
  minAppVersion: string
  tags: string[]
  learningObjectives: string[]
  instructions: string
  controls: Array<{
    action: string
    key: string
    description: string
  }>
  translations: Map<string, {
    title: string
    description: string
    instructions: string
  }>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const gameSchema = new Schema<IGame>({
  title: {
    type: String,
    required: [true, 'Game title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Game description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['puzzle', 'simulation', 'quiz', 'adventure', 'strategy'],
    required: [true, 'Game type is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['math', 'science', 'english', 'physics', 'chemistry', 'biology']
  },
  grade: [{
    type: Number,
    min: [6, 'Grade must be between 6 and 12'],
    max: [12, 'Grade must be between 6 and 12']
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  estimatedTime: {
    type: Number,
    required: [true, 'Estimated time is required'],
    min: [1, 'Estimated time must be at least 1 minute'],
    max: [60, 'Estimated time cannot exceed 60 minutes']
  },
  assets: {
    bundle: {
      type: String,
      required: [true, 'Game bundle path is required']
    },
    images: [{
      type: String
    }],
    sounds: [{
      type: String
    }],
    data: [{
      type: String
    }],
    totalSize: {
      type: Number,
      default: 0,
      min: [0, 'Total size cannot be negative']
    }
  },
  leaderboard: {
    type: Boolean,
    default: true
  },
  multiplayer: {
    type: Boolean,
    default: false
  },
  isOfflineAvailable: {
    type: Boolean,
    default: true
  },
  downloadSize: {
    type: Number,
    required: [true, 'Download size is required'],
    min: [0, 'Download size cannot be negative']
  },
  version: {
    type: String,
    required: [true, 'Game version is required'],
    match: [/^\d+\.\d+\.\d+$/, 'Version must be in semver format (x.y.z)']
  },
  minAppVersion: {
    type: String,
    required: [true, 'Minimum app version is required'],
    match: [/^\d+\.\d+\.\d+$/, 'Version must be in semver format (x.y.z)']
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  learningObjectives: [{
    type: String,
    maxlength: [200, 'Learning objective cannot exceed 200 characters']
  }],
  instructions: {
    type: String,
    required: [true, 'Game instructions are required'],
    maxlength: [2000, 'Instructions cannot exceed 2000 characters']
  },
  controls: [{
    action: {
      type: String,
      required: true,
      maxlength: [50, 'Action cannot exceed 50 characters']
    },
    key: {
      type: String,
      required: true,
      maxlength: [20, 'Key cannot exceed 20 characters']
    },
    description: {
      type: String,
      required: true,
      maxlength: [100, 'Description cannot exceed 100 characters']
    }
  }],
  translations: {
    type: Map,
    of: {
      title: String,
      description: String,
      instructions: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Game Score Model
export interface IGameScore extends Document {
  _id: string
  studentId: mongoose.Types.ObjectId
  gameId: mongoose.Types.ObjectId
  score: number
  timeSpent: number
  level: number
  metadata: {
    correctAnswers?: number
    totalQuestions?: number
    hintsUsed?: number
    attemptsCount?: number
    [key: string]: any
  }
  timestamp: Date
  synced: boolean
}

const gameScoreSchema = new Schema<IGameScore>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: [true, 'Game ID is required']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative']
  },
  timeSpent: {
    type: Number,
    required: [true, 'Time spent is required'],
    min: [0, 'Time spent cannot be negative']
  },
  level: {
    type: Number,
    default: 1,
    min: [1, 'Level must be at least 1']
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
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
gameSchema.index({ subject: 1, grade: 1 })
gameSchema.index({ type: 1 })
gameSchema.index({ difficulty: 1 })
gameSchema.index({ isActive: 1 })
gameSchema.index({ isOfflineAvailable: 1 })
gameSchema.index({ tags: 1 })

gameScoreSchema.index({ studentId: 1, gameId: 1 })
gameScoreSchema.index({ gameId: 1, score: -1 })
gameScoreSchema.index({ timestamp: -1 })
gameScoreSchema.index({ synced: 1 })

// Compound index for leaderboards
gameScoreSchema.index({ gameId: 1, score: -1, timestamp: -1 })

export const Game = mongoose.model<IGame>('Game', gameSchema)
export const GameScore = mongoose.model<IGameScore>('GameScore', gameScoreSchema)
