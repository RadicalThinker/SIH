import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export interface AppError extends Error {
  statusCode?: number
  status?: string
  isOperational?: boolean
}

export const createError = (message: string, statusCode: number): AppError => {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  error.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'
  error.isOperational = true
  return error
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    statusCode: err.statusCode
  })

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  }

  // Production error response
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }

  // Programming or unknown error
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  })
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = createError(`Route ${req.originalUrl} not found`, 404)
  next(err)
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
