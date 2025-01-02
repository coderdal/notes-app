import { AppError } from '../utils/errors.js';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import pg from 'pg';

const isDevelopment = process.env.NODE_ENV === 'development';

const handleJoiError = (error) => ({
  status: 'fail',
  errorCode: 'VALIDATION_ERROR',
  message: 'Validation failed',
  details: error.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message
  }))
});

const handleJWTError = (error) => ({
  status: 'fail',
  errorCode: error instanceof jwt.TokenExpiredError ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID',
  message: error instanceof jwt.TokenExpiredError ? 'Token has expired' : 'Invalid token',
  details: isDevelopment ? error.message : undefined
});

const handleDatabaseError = (error) => {
  // Common Postgres error codes
  const errorMessages = {
    '23505': 'Duplicate key violation', // unique_violation
    '23503': 'Foreign key violation',   // foreign_key_violation
    '23502': 'Not null violation',      // not_null_violation
    '42P01': 'Table not found',         // undefined_table
    '42703': 'Column not found'         // undefined_column
  };

  return {
    status: 'error',
    errorCode: 'DATABASE_ERROR',
    message: errorMessages[error.code] || 'Database operation failed',
    details: isDevelopment ? {
      code: error.code,
      detail: error.detail,
      table: error.table,
      constraint: error.constraint
    } : undefined
  };
};

const handleSyntaxError = (error) => ({
  status: 'fail',
  errorCode: 'SYNTAX_ERROR',
  message: 'Invalid syntax',
  details: isDevelopment ? error.message : undefined
});

const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: isDevelopment ? err.stack : undefined
  });

  // Handle different types of errors
  let errorResponse;

  if (err instanceof Joi.ValidationError) {
    errorResponse = handleJoiError(err);
  } else if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
    errorResponse = handleJWTError(err);
  } else if (err instanceof pg.DatabaseError) {
    errorResponse = handleDatabaseError(err);
  } else if (err instanceof SyntaxError) {
    errorResponse = handleSyntaxError(err);
  } else if (err instanceof AppError) {
    // Handle our custom application errors
    errorResponse = {
      status: err.status,
      errorCode: err.errorCode,
      message: err.message,
      details: err.details
    };
  } else {
    // Handle unknown errors
    errorResponse = {
      status: 'error',
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: isDevelopment ? err.message : 'Something went wrong',
      details: isDevelopment ? err.stack : undefined
    };
  }

  // Send error response
  const statusCode = err instanceof AppError ? err.statusCode : 
                    err instanceof Joi.ValidationError ? 400 :
                    err instanceof jwt.JsonWebTokenError ? 401 :
                    err instanceof pg.DatabaseError ? 500 : 500;

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;