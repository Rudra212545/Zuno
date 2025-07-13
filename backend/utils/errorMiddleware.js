// utils/errorMiddleware.js (or middlewares/errorMiddleware.js)

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({
      success: false,
      message,
      errors: err.errors || [], // your validation errors or other details
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  };
  