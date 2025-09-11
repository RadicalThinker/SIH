import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: {
    id: string
    role: 'student' | 'teacher' | 'admin'
    email?: string
    pin?: string
  }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return next(createError('Access denied. No token provided.', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.user = decoded
    next()
  } catch (error) {
    next(createError('Invalid token.', 401))
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('Access denied. User not authenticated.', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(createError('Access denied. Insufficient permissions.', 403))
    }

    next()
  }
}
