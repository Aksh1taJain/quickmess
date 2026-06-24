import { ZodError } from 'zod';

export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: error.flatten().fieldErrors,
      },
    });
  }

  const status = error.status || 500;
  return res.status(status).json({
    error: {
      message: status === 500 ? 'Internal server error' : error.message,
      details: error.details,
    },
  });
}
