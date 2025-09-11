import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

// Base User Interface
export interface IUser extends Document {
  _id: string
  name: string
  role: 'student' | 'teacher' | 'admin'
  avatar?: string
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Student Interface
export interface IStudent extends IUser {
  role: 'student'
  pin: string
  grade: number
  classId: mongoose.Types.ObjectId
  stats: {
    totalPoints: number
    level: number
    streak: number
    badgesEarned: number
    lessonsCompleted: number
    gamesPlayed: number
    totalTimeSpent: number
    lastActiveDate: Date
  }
  preferences: {
    language: 'en' | 'hi' | 'or'
    theme: 'light' | 'dark' | 'auto'
    soundEnabled: boolean
    notificationsEnabled: boolean
  }
  comparePin(candidatePin: string): Promise<boolean>
}

// Teacher Interface
export interface ITeacher extends IUser {
  role: 'teacher'
  email: string
  password: string
  classes: mongoose.Types.ObjectId[]
  subjects: string[]
  comparePassword(candidatePassword: string): Promise<boolean>
}

// Base User Schema
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    required: [true, 'Role is required']
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  discriminatorKey: 'role'
})

// Student Schema
const studentSchema = new Schema<IStudent>({
  pin: {
    type: String,
    required: [true, 'PIN is required'],
    length: [4, 'PIN must be exactly 4 digits'],
    match: [/^\d{4}$/, 'PIN must contain only digits']
  },
  grade: {
    type: Number,
    required: [true, 'Grade is required'],
    min: [6, 'Grade must be between 6 and 12'],
    max: [12, 'Grade must be between 6 and 12']
  },
  classId: {
    type: Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Class ID is required']
  },
  stats: {
    totalPoints: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative']
    },
    level: {
      type: Number,
      default: 1,
      min: [1, 'Level must be at least 1']
    },
    streak: {
      type: Number,
      default: 0,
      min: [0, 'Streak cannot be negative']
    },
    badgesEarned: {
      type: Number,
      default: 0,
      min: [0, 'Badges earned cannot be negative']
    },
    lessonsCompleted: {
      type: Number,
      default: 0,
      min: [0, 'Lessons completed cannot be negative']
    },
    gamesPlayed: {
      type: Number,
      default: 0,
      min: [0, 'Games played cannot be negative']
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
      min: [0, 'Time spent cannot be negative']
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    }
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'hi', 'or'],
      default: 'en'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    soundEnabled: {
      type: Boolean,
      default: true
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    }
  }
})

// Teacher Schema
const teacherSchema = new Schema<ITeacher>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  classes: [{
    type: Schema.Types.ObjectId,
    ref: 'Class'
  }],
  subjects: [{
    type: String,
    enum: ['math', 'science', 'english', 'physics', 'chemistry', 'biology']
  }]
})

// Indexes for better performance
userSchema.index({ role: 1 })
userSchema.index({ isActive: 1 })
userSchema.index({ createdAt: -1 })

studentSchema.index({ classId: 1 })
studentSchema.index({ grade: 1 })
studentSchema.index({ 'stats.totalPoints': -1 })
studentSchema.index({ 'stats.level': -1 })
studentSchema.index({ 'preferences.language': 1 })

teacherSchema.index({ email: 1 })
teacherSchema.index({ classes: 1 })
teacherSchema.index({ subjects: 1 })

// Pre-save middleware for password hashing
teacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12')
    this.password = await bcrypt.hash(this.password, saltRounds)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Pre-save middleware for PIN hashing
studentSchema.pre('save', async function(next) {
  if (!this.isModified('pin')) return next()
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12')
    this.pin = await bcrypt.hash(this.pin, saltRounds)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Instance methods
teacherSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

studentSchema.methods.comparePin = async function(candidatePin: string): Promise<boolean> {
  return bcrypt.compare(candidatePin, this.pin)
}

// Virtual for calculating level from points
studentSchema.virtual('calculatedLevel').get(function() {
  // Level calculation: Level = floor(sqrt(totalPoints / 100)) + 1
  return Math.floor(Math.sqrt(this.stats.totalPoints / 100)) + 1
})

// Update level when points change
studentSchema.pre('save', function(next) {
  if (this.isModified('stats.totalPoints')) {
    this.stats.level = Math.floor(Math.sqrt(this.stats.totalPoints / 100)) + 1
  }
  next()
})

// Create models
const User = mongoose.model<IUser>('User', userSchema)
const Student = User.discriminator<IStudent>('student', studentSchema)
const Teacher = User.discriminator<ITeacher>('teacher', teacherSchema)

export { User, Student, Teacher }
