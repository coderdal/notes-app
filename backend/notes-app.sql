CREATE DATABASE notesapp;

CREATE TABLE users (
  id SERIAL PRIMARY KEY UNIQUE NOT NULL, 
  username VARCHAR(50) UNIQUE NOT NULL, 
  email VARCHAR(255) UNIQUE NOT NULL, 
  password_hash CHAR(64) NOT NULL, 
  password_salt CHAR(32) NOT NULL, 
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TYPE noteStatus AS ENUM ('active', 'archived', 'deleted');
CREATE TYPE shareType AS ENUM ('public', 'private');

CREATE TABLE notes (
  id SERIAL PRIMARY KEY UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  status noteStatus DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE notes_attachments (
  id SERIAL PRIMARY KEY UNIQUE NOT NULL,
  note_id INTEGER NOT NULL,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_mime_type VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE note_share_sessions (
  id SERIAL PRIMARY KEY UNIQUE NOT NULL,
  note_id INTEGER NOT NULL,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
  public_id UUID UNIQUE NOT NULL,
  share_type shareType DEFAULT 'public' NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT unique_active_share_session UNIQUE (note_id),
  CONSTRAINT share_active_notes_only CHECK (
    EXISTS (
      SELECT 1 FROM notes 
      WHERE notes.id = note_id 
      AND notes.status = 'active'
    )
  )
);

CREATE TABLE note_share_session_assignments (
  id SERIAL PRIMARY KEY UNIQUE NOT NULL,
  share_session_id INTEGER NOT NULL,
  FOREIGN KEY (share_session_id) REFERENCES note_share_sessions(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT unique_share_assignment UNIQUE (share_session_id, user_id)
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  device VARCHAR(255) DEFAULT 'unknown' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_notes_status ON notes(status);
CREATE INDEX idx_note_share_sessions_public_id ON note_share_sessions(public_id);
CREATE INDEX idx_note_share_sessions_note_id ON note_share_sessions(note_id);
CREATE INDEX idx_note_share_session_assignments_user_id ON note_share_session_assignments(user_id);
