import express from 'express';
import multer from 'multer';
import pool from '../config/db.js';
import { verifyToken, isNoteOwner, hasNoteAccess } from '../middlewares/auth.js';
import { uploadToStorage, deleteFromStorage } from '../utils/storage.js';
import validate from '../middlewares/validate.js';
import { uploadAttachmentSchema, idParamSchema } from '../utils/validation.js';

const router = express.Router();

// Configure multer for file upload
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Add attachment to note
router.post('/notes/:id/attachments', 
  verifyToken,
  validate(idParamSchema, 'params'),
  isNoteOwner,
  upload.single('file'),
  validate(uploadAttachmentSchema),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      // Upload file to storage
      const fileUrl = await uploadToStorage(req.file);
      
      // Save attachment record
      const { rows: [attachment] } = await pool.query(
        'INSERT INTO notes_attachments (note_id, file_url, file_mime_type) VALUES ($1, $2, $3) RETURNING *',
        [req.params.id, fileUrl, req.file.mimetype]
      );

      res.status(201).json(attachment);
    } catch (error) {
      next(error);
    }
});

// Remove attachment
router.delete('/notes/:noteId/attachments/:attachmentId', 
  verifyToken,
  validate(idParamSchema, 'params'),
  isNoteOwner,
  async (req, res, next) => {
    try {
      // Get attachment details
      const { rows: [attachment] } = await pool.query(
        'SELECT * FROM notes_attachments WHERE id = $1 AND note_id = $2',
        [req.params.attachmentId, req.params.noteId]
      );

      if (!attachment) {
        return res.status(404).json({ message: 'Attachment not found' });
      }

      // Delete from storage
      await deleteFromStorage(attachment.file_url);

      // Delete record
      await pool.query(
        'DELETE FROM notes_attachments WHERE id = $1',
        [req.params.attachmentId]
      );

      res.status(204).send();
    } catch (error) {
      next(error);
    }
});

// Get note attachments
router.get('/notes/:id/attachments',
  verifyToken,
  validate(idParamSchema, 'params'),
  hasNoteAccess,
  async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM notes_attachments WHERE note_id = $1 ORDER BY uploaded_at DESC',
        [req.params.id]
      );
      res.json(rows);
    } catch (error) {
      next(error);
    }
});

export default router; 