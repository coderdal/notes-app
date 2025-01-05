import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import validate from '../middlewares/validate.js';
import { registerSchema, loginSchema, changePasswordSchema, changeUsernameSchema } from '../utils/validation.js';
import { verifyToken } from '../middlewares/auth.js';
import { encryptPassword, generateSalt, encryptToken } from '../utils/helper.js';
import { AuthenticationError, ConflictError, DatabaseError } from '../utils/errors.js';

const router = express.Router();

// Secure cookie configuration
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,                                    // Prevents client-side access
  secure: process.env.NODE_ENV === 'production',     // HTTPS only in production
  sameSite: 'strict',                               // CSRF protection
  path: '/auth/refresh-token',                      // Only sent to refresh endpoint
  maxAge: 7 * 24 * 60 * 60 * 1000,                 // 7 days
  domain: process.env.COOKIE_DOMAIN || undefined     // Domain scope
};

// Register
router.post('/auth/register', 
  validate(registerSchema),
  async (req, res, next) => {
    const { username, email, password } = req.body;
    const deviceInfo = req.deviceInfo || 'unknown';

    try {
      // Check if email or username already exists
      const { rows: existingUser } = await pool.query(
        'SELECT id FROM users WHERE email = $1 OR username = $2',
        [email, username]
      ).catch(err => {
        throw new DatabaseError('Failed to check existing user', err);
      });

      if (existingUser.length > 0) {
        throw new ConflictError('Email or username already exists');
      }

      // Generate salt and encrypt password
      const salt = generateSalt();
      const { password: passwordHash } = encryptPassword(password, salt);

      // Create user
      const { rows: [user] } = await pool.query(
        'INSERT INTO users (username, email, password_hash, password_salt) VALUES ($1, $2, $3, $4) RETURNING id, username, email',
        [username, email, passwordHash, salt]
      ).catch(err => {
        throw new DatabaseError('Failed to create user', err);
      });

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      // Encrypt refresh token for storage
      const encryptedRefreshToken = encryptToken(refreshToken);

      // Store refresh token
      await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, device) VALUES ($1, $2, $3)',
        [user.id, encryptedRefreshToken, deviceInfo]
      ).catch(err => {
        throw new DatabaseError('Failed to store refresh token', err);
      });

      // Set refresh token in cookie
      res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

      // Send response with tokens and user data
      res.status(201).json({
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
});

// Login
router.post('/auth/login', 
  validate(loginSchema),
  async (req, res, next) => {
    const { email, password } = req.body;
    const deviceInfo = req.deviceInfo || 'unknown';

    try {
      // Get user
      const { rows: [user] } = await pool.query(
        'SELECT id, username, email, password_hash, password_salt FROM users WHERE email = $1',
        [email]
      ).catch(err => {
        throw new DatabaseError('Failed to fetch user', err);
      });

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Verify password
      const { password: hashedPassword } = encryptPassword(password, user.password_salt);
      if (hashedPassword !== user.password_hash) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      // Encrypt refresh token for storage
      const encryptedRefreshToken = encryptToken(refreshToken);

      // Store encrypted refresh token
      await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, device) VALUES ($1, $2, $3)',
        [user.id, encryptedRefreshToken, deviceInfo]
      ).catch(err => {
        throw new DatabaseError('Failed to store refresh token', err);
      });

      // Set refresh token in cookie
      res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

      // Send response with user data
      res.json({
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
});

// Refresh token
router.post('/auth/refresh-token',
  async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return next(new AuthenticationError('Refresh token is required'));
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

      // Encrypt token for database comparison
      const encryptedRefreshToken = encryptToken(refreshToken);

      // Check if token exists in database
      const { rows: [token] } = await pool.query(
        'SELECT id FROM refresh_tokens WHERE user_id = $1 AND token = $2',
        [decoded.id, encryptedRefreshToken]
      ).catch(err => {
        throw new DatabaseError('Failed to verify refresh token', err);
      });

      if (!token) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Get user with more details
      const { rows: [user] } = await pool.query(
        'SELECT id, username, email FROM users WHERE id = $1',
        [decoded.id]
      ).catch(err => {
        throw new DatabaseError('Failed to fetch user', err);
      });

      // Generate new access token
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      res.json({
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
});

// Logout
router.post('/auth/logout', 
  verifyToken,
  async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    try {
      if (refreshToken) {
        // Encrypt token for database comparison
        const encryptedRefreshToken = encryptToken(refreshToken);
        
        // Remove refresh token from database
        await pool.query(
          'DELETE FROM refresh_tokens WHERE user_id = $1 AND token = $2',
          [req.user.id, encryptedRefreshToken]
        ).catch(err => {
          throw new DatabaseError('Failed to remove refresh token', err);
        });
      }

      // Clear refresh token cookie with same options (except maxAge)
      res.clearCookie('refreshToken', {
        ...REFRESH_TOKEN_COOKIE_OPTIONS,
        maxAge: undefined
      });
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
});

// Change Password
router.post('/auth/change-password',
  verifyToken,
  validate(changePasswordSchema),
  async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
      // Get user's current password info
      const { rows: [user] } = await pool.query(
        'SELECT password_hash, password_salt FROM users WHERE id = $1',
        [userId]
      ).catch(err => {
        throw new DatabaseError('Failed to fetch user', err);
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const { password: currentHashedPassword } = encryptPassword(currentPassword, user.password_salt);
      if (currentHashedPassword !== user.password_hash) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Generate new salt and hash for the new password
      const newSalt = generateSalt();
      const { password: newPasswordHash } = encryptPassword(newPassword, newSalt);

      // Update password in database
      await pool.query(
        'UPDATE users SET password_hash = $1, password_salt = $2 WHERE id = $3',
        [newPasswordHash, newSalt, userId]
      ).catch(err => {
        throw new DatabaseError('Failed to update password', err);
      });

      // Invalidate all refresh tokens for security
      await pool.query(
        'DELETE FROM refresh_tokens WHERE user_id = $1',
        [userId]
      ).catch(err => {
        throw new DatabaseError('Failed to invalidate refresh tokens', err);
      });

      // Clear refresh token cookie
      res.clearCookie('refreshToken', {
        ...REFRESH_TOKEN_COOKIE_OPTIONS,
        maxAge: undefined
      });

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
});

// Change Username
router.post('/auth/change-username',
  verifyToken,
  validate(changeUsernameSchema),
  async (req, res, next) => {
    const { newUsername, password } = req.body;
    const userId = req.user.id;

    try {
      // Get user's current password info
      const { rows: [user] } = await pool.query(
        'SELECT password_hash, password_salt FROM users WHERE id = $1',
        [userId]
      ).catch(err => {
        throw new DatabaseError('Failed to fetch user', err);
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify password
      const { password: hashedPassword } = encryptPassword(password, user.password_salt);
      if (hashedPassword !== user.password_hash) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      // Check if new username is already taken
      const { rows: existingUser } = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [newUsername, userId]
      ).catch(err => {
        throw new DatabaseError('Failed to check username availability', err);
      });

      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'Username is already taken' });
      }

      // Update username
      await pool.query(
        'UPDATE users SET username = $1 WHERE id = $2',
        [newUsername, userId]
      ).catch(err => {
        throw new DatabaseError('Failed to update username', err);
      });

      res.status(200).json({ 
        message: 'Username changed successfully',
        username: newUsername
      });
    } catch (error) {
      next(error);
    }
});

export default router;