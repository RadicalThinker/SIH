import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Joi from 'joi'
import { Student, Teacher } from '../models/User.js'
import { Class } from '../models/Class.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import { asyncHandler, createError } from '../middleware/errorHandler.js'
import { authenticate, AuthRequest } from '../middleware/auth.js'

const router = Router()

// Apply rate limiting to all auth routes
router.use(authLimiter)

// Validation schemas
const studentLoginSchema = Joi.object({
  pin: Joi.string().length(4).pattern(/^\d{4}$/).required(),
  className: Joi.string().required()
})

const teacherLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

// Student PIN login
router.post('/student/login', asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const { error, value } = studentLoginSchema.validate(req.body)
  if (error) {
    throw createError(error.details[0].message, 400)
  }

  const { pin, className } = value

  // First, find the class by name
  const classDoc = await Class.findOne({ name: className })
  if (!classDoc) {
    throw createError('Invalid class name', 401)
  }

  // Find student by classId (ObjectId)
  const student = await Student.findOne({ classId: classDoc._id })
  if (!student) {
    throw createError('No student found in this class', 401)
  }

  const isPinValid = await student.comparePin(pin)
  if (!isPinValid) {
    throw createError('Invalid PIN', 401)
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: student._id, 
      role: 'student', 
      classId: student.classId,
      className: className
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  // Update last login
  student.lastLoginAt = new Date()
  await student.save()

  res.status(200).json({
    success: true,
    token,
    user: {
      id: student._id,
      name: student.name,
      role: 'student',
      grade: student.grade,
      classId: student.classId,
      className: className,
      stats: student.stats,
      preferences: student.preferences
    }
  })
}))

// Teacher login
router.post('/teacher/login', asyncHandler(async (req: Request, res: Response) => {
  // Validate input
  const { error, value } = teacherLoginSchema.validate(req.body)
  if (error) {
    throw createError(error.details[0].message, 400)
  }

  const { email, password } = value

  // Find teacher by email
  const teacher = await Teacher.findOne({ email })
  if (!teacher) {
    throw createError('Invalid email or password', 401)
  }

  const isPasswordValid = await teacher.comparePassword(password)
  if (!isPasswordValid) {
    throw createError('Invalid email or password', 401)
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: teacher._id, 
      role: 'teacher', 
      email: teacher.email 
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  // Update last login
  teacher.lastLoginAt = new Date()
  await teacher.save()

  res.status(200).json({
    success: true,
    token,
    user: {
      id: teacher._id,
      name: teacher.name,
      role: 'teacher',
      email: teacher.email,
      classes: teacher.classes,
      subjects: teacher.subjects
    }
  })
}))

// Verify token
router.get('/verify', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    user: req.user
  })
}))

// Logout (client-side token removal)
router.post('/logout', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  })
})

export default router
