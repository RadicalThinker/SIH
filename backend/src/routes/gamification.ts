import { Router } from 'express'
import { authenticate } from '../middleware/auth'

const router = Router()

// Get achievements
router.get('/achievements', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Achievements endpoint - implementation pending'
  })
})

// Get leaderboard
router.get('/leaderboard', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Leaderboard endpoint - implementation pending'
  })
})

// Get badges
router.get('/badges', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Badges endpoint - implementation pending'
  })
})

export default router
