import express from 'express';
import pool from '../config/db.js';
import { verifyToken, isNoteOwner, hasNoteAccess } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { 
  createNoteSchema, 
  updateNoteSchema, 
  updateNoteStatusSchema,
  idParamSchema,
  notesListSchema
} from '../utils/validation.js';

const router = express.Router();

// Get notes shared with logged-in user
router.get('/notes/shared',
  verifyToken,
  async (req, res, next) => {
    try {
      const query = `
        SELECT 
          n.*,
          u.username as owner_username,
          nss.share_type,
          nss.expires_at,
          nss.public_id
        FROM notes n
        JOIN users u ON u.id = n.user_id
        JOIN note_share_sessions nss ON nss.note_id = n.id
        LEFT JOIN note_share_session_assignments nssa ON nssa.share_session_id = nss.id
        WHERE n.status = 'active'
        AND (nss.expires_at IS NULL OR nss.expires_at > CURRENT_TIMESTAMP)
        AND (
          (nss.share_type = 'private' AND nssa.user_id = $1)
        )
        AND n.user_id != $1
        ORDER BY n.updated_at DESC
      `;

      const { rows: sharedNotes } = await pool.query(query, [req.user.id]);
      res.json(sharedNotes);
    } catch (error) {
      next(error);
    }
});

// List user's notes with pagination and search
router.get('/notes',
  verifyToken,
  validate(notesListSchema, 'query'),
  async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { q, status = 'active', sortBy = 'created_at', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    try {
      let query = `
        SELECT n.*, COUNT(*) OVER() as total_count
        FROM notes n
        WHERE n.user_id = $1
      `;
      const queryParams = [req.user.id];
      let paramCount = 1;

      // Add search condition
      if (q) {
        paramCount++;
        query += ` AND (n.title ILIKE $${paramCount} OR n.content ILIKE $${paramCount})`;
        queryParams.push(`%${q}%`);
      }

      // Add status condition if not 'all'
      if (status && status !== 'all') {
        paramCount++;
        query += ` AND n.status = $${paramCount}`;
        queryParams.push(status);
      }

      // Validate and sanitize sortBy to prevent SQL injection
      const allowedSortFields = ['created_at', 'updated_at', 'title'];
      const sanitizedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
      
      // Validate order
      const sanitizedOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      // Add sorting
      query += ` ORDER BY n.${sanitizedSortBy} ${sanitizedOrder}`;

      // Add pagination
      query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
      queryParams.push(limit, offset);

      const { rows } = await pool.query(query, queryParams);
      
      const totalCount = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        notes: rows.map(row => {
          const { total_count, ...note } = row;
          return note;
        }),
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages
        }
      });
    } catch (error) {
      next(error);
    }
});

// Create new note
router.post('/notes', 
  verifyToken,
  validate(createNoteSchema),
  async (req, res, next) => {
    const { title, content } = req.body;
    
    try {
      const { rows } = await pool.query(
        'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, title, content]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      next(error);
    }
});

// Get specific note
router.get('/notes/:id', 
  verifyToken,
  validate(idParamSchema, 'params'),
  hasNoteAccess,
  async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM notes WHERE id = $1',
        [req.params.id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      next(error);
    }
});

// Update note
router.put('/notes/:id', 
  verifyToken,
  validate(idParamSchema, 'params'),
  validate(updateNoteSchema),
  isNoteOwner,
  async (req, res, next) => {
    const { title, content } = req.body;
    
    try {
      const { rows } = await pool.query(
        'UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [title, content, req.params.id]
      );
      res.json(rows[0]);
    } catch (error) {
      next(error);
    }
});

// Delete note (soft delete)
router.delete('/notes/:id', 
  verifyToken,
  validate(idParamSchema, 'params'),
  isNoteOwner,
  async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        "UPDATE notes SET status = 'deleted', deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
        [req.params.id]
      );
      res.json(rows[0]);
    } catch (error) {
      next(error);
    }
});

// Update note status
router.patch('/notes/:id/status', 
  verifyToken,
  validate(idParamSchema, 'params'),
  validate(updateNoteStatusSchema),
  isNoteOwner,
  async (req, res, next) => {
    const { status } = req.body;

    try {
      const { rows } = await pool.query(
        'UPDATE notes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [status, req.params.id]
      );
      res.json(rows[0]);
    } catch (error) {
      next(error);
    }
});

// Permanently delete note
router.delete('/notes/:id/permanent', 
  verifyToken,
  validate(idParamSchema, 'params'),
  isNoteOwner,
  async (req, res, next) => {
    try {
      // check if the note exists
      const { rows: noteRows } = await pool.query(
        'SELECT * FROM notes WHERE id = $1',
        [req.params.id]
      );

      if (noteRows.length === 0) {
        return res.status(404).json({ message: 'Note not found' });
      }

      // Permanently delete the note
      const { rows } = await pool.query(
        'DELETE FROM notes WHERE id = $1 RETURNING *',
        [req.params.id]
      );

      res.json({ message: 'Note permanently deleted', note: rows[0] });
    } catch (error) {
      next(error);
    }
});

export default router; 