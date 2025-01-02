import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const isNoteOwner = async (req, res, next) => {
  const { id: noteId } = req.params;
  const { id: userId } = req.user;

  try {
    const { rows } = await pool.query(
      'SELECT user_id FROM notes WHERE id = $1',
      [noteId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (rows[0].user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const hasNoteAccess = async (req, res, next) => {
  const { id: noteId } = req.params;
  const { id: userId } = req.user;

  try {
    // Check if user is owner
    const { rows: ownerRows } = await pool.query(
      'SELECT user_id FROM notes WHERE id = $1',
      [noteId]
    );

    if (ownerRows.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (ownerRows[0].user_id === userId) {
      return next();
    }

    // Check if note is shared with user
    const { rows: shareRows } = await pool.query(`
      SELECT nss.id 
      FROM note_share_sessions nss
      LEFT JOIN note_share_session_assignments nssa ON nssa.share_session_id = nss.id
      WHERE nss.note_id = $1 
      AND (nss.share_type = 'public' OR nssa.user_id = $2)
      AND (nss.expires_at IS NULL OR nss.expires_at > CURRENT_TIMESTAMP)
    `, [noteId, userId]);

    if (shareRows.length === 0) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  } catch (error) {
    next(error);
  }
}; 