/**
 * @desc    Handles 404 Not Found errors
 * This triggers if a request is made to a route that doesn't exist
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * @desc    Global Error Handler
 * This catches any error thrown in your controllers and sends a clean JSON response
 */
const errorHandler = (err, req, res, next) => {
  // If the status code is 200 but we are in the error handler, make it 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Specific check for Mongoose "CastError" (e.g., passing a bad ID to a route)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found (Invalid ID)';
  }

  res.status(statusCode).json({
    message: message,
    // Only show the stack trace if we are NOT in production mode
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export { notFound, errorHandler };