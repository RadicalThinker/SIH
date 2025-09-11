import { Router } from 'express'
import { authenticate } from '../middleware/auth'

const router = Router()

// Sync offline data
router.post('/upload', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Offline sync upload endpoint - implementation pending'
  })
})

// Download content for offline use
router.get('/download', authenticate, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Offline content download endpoint - implementation pending'
  })
})

export default router
