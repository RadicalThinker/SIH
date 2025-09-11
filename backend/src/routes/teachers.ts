import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Get teacher dashboard
router.get('/dashboard', authenticate, authorize('teacher'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Teacher dashboard endpoint - implementation pending'
  })
})

// Get class roster
router.get('/classes', authenticate, authorize('teacher'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Teacher classes endpoint - implementation pending'
  })
})

export default router
