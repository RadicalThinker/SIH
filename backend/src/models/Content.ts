import mongoose, { Schema, Document } from 'mongoose'

// Subject Model
export interface ISubject extends Document {
  _id: string
  name: string
  description: string
  icon: string
  color: string
  grades: number[]
  totalLessons: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const subjectSchema = new Schema<ISubject>({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Subject name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Subject description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    required: [true, 'Subject icon is required']
  },
  color: {
    type: String,
    required: [true, 'Subject color is required'],
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  grades: [{
    type: Number,
    min: [6, 'Grade must be between 6 and 12'],
    max: [12, 'Grade must be between 6 and 12']
  }],
  totalLessons: {
    type: Number,
    default: 0,
    min: [0, 'Total lessons cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Lesson Model
export interface ILesson extends Document {
  _id: string
  title: string
  description: string
  subjectId: mongoose.Types.ObjectId
  grade: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  content: {
    text: string
    images: Array<{
      url: string
      alt?: string
      caption?: string
      size: number
    }>
    videos: Array<{
      url: string
      title?: string
      duration?: number
      size: number
    }>
    interactive: Array<{
      type: 'simulation' | 'diagram' | 'calculator' | 'quiz'
      data: any
    }>
    downloadSize: number
  }
  games: mongoose.Types.ObjectId[]
  quiz: mongoose.Types.ObjectId
  prerequisites: mongoose.Types.ObjectId[]
  learningObjectives: string[]
  tags: string[]
  isOfflineAvailable: boolean
  translations: Map<string, {
    title: string
    description: string
    content: any
  }>
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const lessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Lesson description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject ID is required']
  },
  grade: {
    type: Number,
    required: [true, 'Grade is required'],
    min: [6, 'Grade must be between 6 and 12'],
    max: [12, 'Grade must be between 6 and 12']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedTime: {
    type: Number,
    required: [true, 'Estimated time is required'],
    min: [1, 'Estimated time must be at least 1 minute'],
    max: [180, 'Estimated time cannot exceed 180 minutes']
  },
  content: {
    text: {
      type: String,
      required: [true, 'Lesson content text is required']
    },
    images: [{
      url: { type: String, required: true },
      alt: String,
      caption: String,
      size: { type: Number, required: true }
    }],
    videos: [{
      url: { type: String, required: true },
      title: String,
      duration: Number,
      size: { type: Number, required: true }
    }],
    interactive: [{
      type: {
        type: String,
        enum: ['simulation', 'diagram', 'calculator', 'quiz'],
        required: true
      },
      data: Schema.Types.Mixed
    }],
    downloadSize: {
      type: Number,
      default: 0,
      min: [0, 'Download size cannot be negative']
    }
  },
  games: [{
    type: Schema.Types.ObjectId,
    ref: 'Game'
  }],
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  prerequisites: [{
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  learningObjectives: [{
    type: String,
    maxlength: [200, 'Learning objective cannot exceed 200 characters']
  }],
  tags: [{
    type: String,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  isOfflineAvailable: {
    type: Boolean,
    default: false
  },
  translations: {
    type: Map,
    of: {
      title: String,
      description: String,
      content: Schema.Types.Mixed
    }
  },
  order: {
    type: Number,
    default: 0,
    min: [0, 'Order cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Quiz Model
export interface IQuiz extends Document {
  _id: string
  lessonId: mongoose.Types.ObjectId
  questions: Array<{
    id: string
    type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop'
    question: string
    options?: string[]
    correctAnswer: string | string[]
    explanation: string
    points: number
    difficulty: 'easy' | 'medium' | 'hard'
  }>
  timeLimit?: number
  passingScore: number
  translations: Map<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const quizSchema = new Schema<IQuiz>({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson ID is required']
  },
  questions: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'fill-blank', 'drag-drop'],
      required: true
    },
    question: {
      type: String,
      required: true,
      maxlength: [500, 'Question cannot exceed 500 characters']
    },
    options: [{
      type: String,
      maxlength: [200, 'Option cannot exceed 200 characters']
    }],
    correctAnswer: Schema.Types.Mixed,
    explanation: {
      type: String,
      required: true,
      maxlength: [1000, 'Explanation cannot exceed 1000 characters']
    },
    points: {
      type: Number,
      required: true,
      min: [1, 'Points must be at least 1'],
      max: [100, 'Points cannot exceed 100']
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  }],
  timeLimit: {
    type: Number,
    min: [60, 'Time limit must be at least 60 seconds'],
    max: [3600, 'Time limit cannot exceed 3600 seconds']
  },
  passingScore: {
    type: Number,
    required: [true, 'Passing score is required'],
    min: [0, 'Passing score cannot be negative'],
    max: [100, 'Passing score cannot exceed 100']
  },
  translations: {
    type: Map,
    of: Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes
subjectSchema.index({ name: 1 })
subjectSchema.index({ grades: 1 })
subjectSchema.index({ isActive: 1 })

lessonSchema.index({ subjectId: 1, grade: 1 })
lessonSchema.index({ difficulty: 1 })
lessonSchema.index({ tags: 1 })
lessonSchema.index({ order: 1 })
lessonSchema.index({ isActive: 1 })
lessonSchema.index({ isOfflineAvailable: 1 })

quizSchema.index({ lessonId: 1 })
quizSchema.index({ isActive: 1 })

export const Subject = mongoose.model<ISubject>('Subject', subjectSchema)
export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema)
export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema)
