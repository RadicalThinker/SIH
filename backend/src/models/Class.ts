import mongoose, { Schema, Document } from 'mongoose'

export interface IClass extends Document {
  _id: string
  name: string
  grade: number
  subject: string
  teacherId: mongoose.Types.ObjectId
  students: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const classSchema = new Schema<IClass>({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [100, 'Class name cannot exceed 100 characters']
  },
  grade: {
    type: Number,
    required: [true, 'Grade is required'],
    min: [6, 'Grade must be between 6 and 12'],
    max: [12, 'Grade must be between 6 and 12']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['math', 'science', 'english', 'physics', 'chemistry', 'biology', 'General']
  },
  teacherId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher ID is required']
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

// Indexes for better performance
classSchema.index({ grade: 1 })
classSchema.index({ teacherId: 1 })
classSchema.index({ subject: 1 })
classSchema.index({ name: 1 })

// Virtual for student count
classSchema.virtual('studentCount').get(function() {
  return this.students.length
})

// Ensure virtual fields are serialized
classSchema.set('toJSON', {
  virtuals: true
})

const Class = mongoose.model<IClass>('Class', classSchema)

export { Class }