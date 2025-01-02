import Joi from 'joi';

// Authentication schemas
export const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      'string.empty': 'Username is required',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 50 characters',
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores'
    }),
  email: Joi.string().trim().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format'
    }),
  password: Joi.string().min(8).max(100).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 100 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required'
    })
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
    .messages({
      'string.empty': 'Refresh token is required'
    })
});

// Note schemas
export const createNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(150).required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 150 characters'
    }),
  content: Joi.string().required()
    .messages({
      'string.empty': 'Content is required'
    })
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().trim().min(1).max(150)
    .messages({
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 150 characters'
    }),
  content: Joi.string()
});

export const updateNoteStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'archived', 'deleted').required()
    .messages({
      'any.only': 'Status must be one of: active, archived, deleted'
    })
});

// Share schemas
export const createShareSchema = Joi.object({
  shareType: Joi.string().valid('public', 'private').default('public')
    .messages({
      'any.only': 'Share type must be either public or private'
    }),
  expiresAt: Joi.date().iso().min('now').allow(null).default(null)
    .messages({
      'date.min': 'Expiration date must be in the future',
      'date.format': 'Invalid date format. Use ISO 8601 format'
    }),
  userEmails: Joi.when('shareType', {
    is: 'private',
    then: Joi.array().items(Joi.string().email()).min(1).required()
      .messages({
        'array.min': 'At least one email address is required for private sharing',
        'array.base': 'User emails must be an array',
        'string.email': 'Invalid email format'
      }),
    otherwise: Joi.array().items(Joi.string().email()).default([])
  })
});

// Attachment schemas
export const uploadAttachmentSchema = Joi.object({
  file: Joi.object({
    originalname: Joi.string().required(),
    mimetype: Joi.string().pattern(/^(image|application|text|video|audio)\/[\w.-]+$/).required()
      .messages({
        'string.pattern.base': 'Invalid file type'
      }),
    size: Joi.number().max(5 * 1024 * 1024).required() // 5MB limit
      .messages({
        'number.max': 'File size cannot exceed 5MB'
      })
  }).required()
    .messages({
      'any.required': 'File is required'
    })
});

// Common parameter schemas
export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID must be a number',
      'number.positive': 'ID must be positive'
    })
});

export const publicIdParamSchema = Joi.object({
  publicId: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Invalid share ID format'
    })
});

// Query parameter schemas
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be greater than 0'
    }),
  limit: Joi.number().integer().min(1).max(100).default(20)
    .messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be greater than 0',
      'number.max': 'Limit cannot exceed 100'
    })
});

export const searchSchema = Joi.object({
  q: Joi.string().trim().min(1).max(100)
    .messages({
      'string.min': 'Search query must be at least 1 character long',
      'string.max': 'Search query cannot exceed 100 characters'
    }),
  status: Joi.string().valid('active', 'archived', 'deleted', 'all')
    .messages({
      'any.only': 'Status must be one of: active, archived, deleted, all'
    }),
  sortBy: Joi.string().valid('created_at', 'updated_at', 'title').default('updated_at')
    .messages({
      'any.only': 'Sort by must be one of: created_at, updated_at, title'
    }),
  order: Joi.string().valid('asc', 'desc').default('desc')
    .messages({
      'any.only': 'Order must be either asc or desc'
    })
});

// Combined schema for notes listing
export const notesListSchema = searchSchema.concat(paginationSchema); 