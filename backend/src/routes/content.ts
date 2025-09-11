import { Router } from 'express'
import { authenticate } from '../middleware/auth'

const router = Router()

// Get subjects
router.get('/subjects', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Subjects endpoint - implementation pending'
  })
})

// Get lessons
router.get('/lessons', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Lessons endpoint - implementation pending'
  })
})

export default router
