// 404 handler for routes that do not exist on this API

export function notFound(req, res, next) {
  const error = new Error(`Not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

// Global error handler — catches errors passed to next(error)

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
