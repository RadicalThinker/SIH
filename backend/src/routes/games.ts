import { Router } from 'express'
import { authenticate } from '../middleware/auth'
import { gameLimiter } from '../middleware/rateLimiter'

const router = Router()

// Get available games
router.get('/', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Games list endpoint - implementation pending'
  })
})

// Submit game score
router.post('/score', authenticate, gameLimiter, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Game score submission endpoint - implementation pending'
  })
})

export default router
