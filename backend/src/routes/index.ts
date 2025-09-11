import { Router } from 'express'

const router = Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Rural Education Platform API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    name: 'Rural Education Platform API',
    version: '1.0.0',
    description: 'MERN Gamified Learning Platform for Rural Education',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      students: '/api/students',
      teachers: '/api/teachers',
      content: '/api/content',
      games: '/api/games',
      progress: '/api/progress'
    }
  })
})

export default router
