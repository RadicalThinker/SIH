import { Router } from 'express'
import { authenticate } from '../middleware/auth'

const router = Router()

// Get user progress
router.get('/', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Progress endpoint - implementation pending'
  })
})

// Update progress
router.post('/', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Progress update endpoint - implementation pending'
  })
})

export default router
