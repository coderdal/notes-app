import rateLimit from 'express-rate-limit';

// Global rate limiter - 50 requests per minute
export const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50,
    message: 'Too many requests from this IP, please try again after a minute',
    standardHeaders: true,
    legacyHeaders: false
});

// Auth rate limiter - 5 requests per minute
export const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: 'Too many authentication attempts, please try again after a minute',
    standardHeaders: true,
    legacyHeaders: false,
}); 