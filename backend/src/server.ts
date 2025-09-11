import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import logger from './utils/logger.js'

// Routes
import authRoutes from './routes/auth.js'
import studentRoutes from './routes/students.js'
import teacherRoutes from './routes/teachers.js'
import contentRoutes from './routes/content.js'
import gameRoutes from './routes/games.js'
import progressRoutes from './routes/progress.js'
import gamificationRoutes from './routes/gamification.js'
import syncRoutes from './routes/sync.js'
import adminRoutes from './routes/admin.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}))

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Compression and parsing middleware
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  }))
}

// Rate limiting
app.use('/api', apiLimiter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/games', gameRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/gamification', gamificationRoutes)
app.use('/api/sync', syncRoutes)
app.use('/api/admin', adminRoutes)

// Serve static files (uploads, game assets)
app.use('/uploads', express.static('uploads'))
app.use('/games', express.static('games'))

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.originalUrl} not found`
    }
  })
})

// Global error handler
app.use(errorHandler)

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...')
  process.exit(0)
})

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`)
    logger.info(`📚 Environment: ${process.env.NODE_ENV}`)
    logger.info(`🗄️  Database: ${process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***@')}`)
  })
}

export default app
