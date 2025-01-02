export class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', message = null) {
    super(message || `${resource} not found`, 404, 'NOT_FOUND_ERROR');
    this.resource = resource;
  }
}

export class ConflictError extends AppError {
  constructor(message, details = null) {
    super(message, 409, 'CONFLICT_ERROR');
    this.details = details;
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', details = null) {
    super(message, 500, 'DATABASE_ERROR');
    this.details = details;
  }
}

// Error codes for specific scenarios
export const ErrorCodes = {
  VALIDATION: {
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_FIELD: 'MISSING_FIELD',
    INVALID_FORMAT: 'INVALID_FORMAT'
  },
  AUTH: {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    TOKEN_MISSING: 'TOKEN_MISSING'
  },
  RESOURCE: {
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    ACCESS_DENIED: 'ACCESS_DENIED'
  },
  DATABASE: {
    QUERY_FAILED: 'QUERY_FAILED',
    CONNECTION_ERROR: 'CONNECTION_ERROR',
    CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION'
  }
}; 