import express from 'express';
import { randomUUID } from 'node:crypto';
import pool from '../config/db.js';
import { verifyToken, isNoteOwner } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { createShareSchema, idParamSchema, publicIdParamSchema } from '../utils/validation.js';

const router = express.Router();

// Get share settings for a note
router.get('/notes/:id/share',
  verifyToken,
  validate(idParamSchema, 'params'),
  isNoteOwner,
  async (req, res, next) => {
    try {
      // Get current share session and shared users
      const { rows: [shareSession] } = await pool.query(`
        SELECT nss.*, 
          CASE 
            WHEN nss.share_type = 'private' THEN (
              SELECT json_agg(json_build_object(
                'id', u.id,
                'email', u.email,
                'username', u.username
              ))
              FROM note_share_session_assignments nssa
              JOIN users u ON u.id = nssa.user_id
              WHERE nssa.share_session_id = nss.id
            )
            ELSE NULL
          END as shared_users
        FROM note_share_sessions nss
        WHERE nss.note_id = $1
      `, [req.params.id]);

      res.json(shareSession || { share_type: null, shared_users: [] });
    } catch (error) {
      next(error);
    }
});

// Create or update share settings
router.post('/notes/:id/share', 
  verifyToken,
  validate(idParamSchema, 'params'),
  validate(createShareSchema),
  isNoteOwner,
  async (req, res, next) => {
    const { shareType, expiresAt, userEmails } = req.body;
    
    try {
      await pool.query('BEGIN');

      // Verify note is active
      const { rows: [note] } = await pool.query(
        'SELECT status FROM notes WHERE id = $1',
        [req.params.id]
      );

      if (!note || note.status !== 'active') {
        await pool.query('ROLLBACK');
        return res.status(400).json({ message: 'Only active notes can be shared' });
      }

      // Check if share session exists
      const { rows: [existingSession] } = await pool.query(
        'SELECT * FROM note_share_sessions WHERE note_id = $1',
        [req.params.id]
      );

      let shareSession;
      
      if (existingSession) {
        // Update existing session
        const { rows: [updated] } = await pool.query(
          'UPDATE note_share_sessions SET share_type = $1, expires_at = $2 WHERE id = $3 RETURNING *',
          [shareType, expiresAt, existingSession.id]
        );
        shareSession = updated;
      } else {
        // Create new share session
        const { rows: [created] } = await pool.query(
          'INSERT INTO note_share_sessions (note_id, public_id, share_type, expires_at) VALUES ($1, $2, $3, $4) RETURNING *',
          [req.params.id, randomUUID(), shareType, expiresAt]
        );
        shareSession = created;
      }

      let sharedUsers = [];
      // Handle private sharing user assignments
      if (shareType === 'private' && userEmails?.length > 0) {
        // Find users by email
        const { rows: users } = await pool.query(
          'SELECT id, email, username FROM users WHERE email = ANY($1)',
          [userEmails]
        );

        // Remove all existing assignments for this session
        await pool.query(
          'DELETE FROM note_share_session_assignments WHERE share_session_id = $1',
          [shareSession.id]
        );

        // Create new assignments for each found user
        for (const user of users) {
          await pool.query(
            'INSERT INTO note_share_session_assignments (share_session_id, user_id) VALUES ($1, $2)',
            [shareSession.id, user.id]
          );
        }
        sharedUsers = users;

        // Log any emails that weren't found
        const notFoundEmails = userEmails.filter(email => 
          !users.find(u => u.email === email)
        );
        if (notFoundEmails.length > 0) {
          console.log(`Skipped non-existent users: ${notFoundEmails.join(', ')}`);
        }
      } else if (shareType === 'private') {
        // If private but no emails, remove all assignments
        await pool.query(
          'DELETE FROM note_share_session_assignments WHERE share_session_id = $1',
          [shareSession.id]
        );
      }

      await pool.query('COMMIT');
      res.status(201).json({
        ...shareSession,
        shared_users: shareType === 'private' ? sharedUsers : null,
        share_url: `/share/${shareSession.public_id}`,
        skipped_emails: userEmails?.filter(email => !sharedUsers.find(u => u.email === email)) || []
      });
    } catch (error) {
      await pool.query('ROLLBACK');
      next(error);
    }
});

// Access shared note by public ID
router.get('/share/:publicId', 
  validate(publicIdParamSchema, 'params'),
  async (req, res, next) => {
    try {
      const query = `
        SELECT 
          n.*,
          u.username as owner_username,
          nss.share_type,
          nss.expires_at,
          CASE 
            WHEN nss.share_type = 'public' THEN true
            WHEN nss.share_type = 'private' AND $2::integer IS NOT NULL THEN EXISTS(
              SELECT 1 FROM note_share_session_assignments nssa 
              WHERE nssa.share_session_id = nss.id 
              AND nssa.user_id = $2
            )
            ELSE false
          END as has_access
        FROM notes n
        JOIN users u ON u.id = n.user_id
        JOIN note_share_sessions nss ON nss.note_id = n.id
        WHERE nss.public_id = $1
        AND n.status = 'active'
        AND (nss.expires_at IS NULL OR nss.expires_at > CURRENT_TIMESTAMP)
      `;

      const { rows: [note] } = await pool.query(query, [
        req.params.publicId, 
        req.user?.id || null
      ]);

      if (!note || !note.has_access) {
        return res.status(404).json({ message: 'Shared note not found or access denied' });
      }

      delete note.has_access;
      res.json(note);
    } catch (error) {
      next(error);
    }
});

// Remove user from share session
router.delete('/notes/:id/share/users/:userId',
  verifyToken,
  validate(idParamSchema, 'params'),
  isNoteOwner,
  async (req, res, next) => {
    try {
      await pool.query('BEGIN');

      // Verify the share session exists and is private
      const { rows: [session] } = await pool.query(`
        SELECT id, share_type 
        FROM note_share_sessions 
        WHERE note_id = $1
      `, [req.params.id]);

      if (!session) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ message: 'Share session not found' });
      }

      if (session.share_type !== 'private') {
        await pool.query('ROLLBACK');
        return res.status(400).json({ message: 'Cannot remove users from public share' });
      }

      // Remove the user assignment
      const { rowCount } = await pool.query(
        'DELETE FROM note_share_session_assignments WHERE share_session_id = $1 AND user_id = $2',
        [session.id, req.params.userId]
      );

      if (rowCount === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ message: 'User not found in share session' });
      }

      await pool.query('COMMIT');
      res.status(204).send();
    } catch (error) {
      await pool.query('ROLLBACK');
      next(error);
    }
});

// Remove share
router.delete('/notes/:id/share', 
  verifyToken,
  validate(idParamSchema, 'params'),
  isNoteOwner,
  async (req, res, next) => {
    try {
      await pool.query(
        'DELETE FROM note_share_sessions WHERE note_id = $1',
        [req.params.id]
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
});

export default router; 