import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Admin dashboard
router.get('/dashboard', authenticate, authorize('admin'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Admin dashboard endpoint - implementation pending'
  })
})

// System stats
router.get('/stats', authenticate, authorize('admin'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'System stats endpoint - implementation pending'
  })
})

export default router
