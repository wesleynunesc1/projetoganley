// Banco de dados SQLite para progresso e favoritos
// Os PDFs são arquivos binários — este DB só armazena metadados de progresso

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'ganley.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  
  // Garantir que a pasta data existe
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  
  initSchema(db);
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      training_id TEXT NOT NULL,
      current_page INTEGER DEFAULT 1,
      total_pages INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      favorited INTEGER DEFAULT 0,
      last_accessed_at TEXT NOT NULL,
      UNIQUE(session_id, training_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_progress_session ON user_progress(session_id);
    CREATE INDEX IF NOT EXISTS idx_progress_training ON user_progress(training_id);
    
    CREATE TABLE IF NOT EXISTS trainings_meta (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      level TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      weekly_frequency INTEGER,
      tags TEXT,
      cover_filename TEXT,
      pdf_files TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0
    );
  `);
}

// --- Progress API ---

export interface ProgressRow {
  session_id: string;
  training_id: string;
  current_page: number;
  total_pages: number;
  completed: boolean;
  favorited: boolean;
  last_accessed_at: string;
}

export function upsertProgress(data: {
  sessionId: string;
  trainingId: string;
  currentPage?: number;
  totalPages?: number;
  completed?: boolean;
  favorited?: boolean;
}): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO user_progress (session_id, training_id, current_page, total_pages, completed, favorited, last_accessed_at)
    VALUES (@sessionId, @trainingId, @currentPage, @totalPages, @completed, @favorited, @lastAccessed)
    ON CONFLICT(session_id, training_id) DO UPDATE SET
      current_page = COALESCE(@currentPage, current_page),
      total_pages = COALESCE(@totalPages, total_pages),
      completed = COALESCE(@completed, completed),
      favorited = COALESCE(@favorited, favorited),
      last_accessed_at = @lastAccessed
  `).run({
    sessionId: data.sessionId,
    trainingId: data.trainingId,
    currentPage: data.currentPage ?? null,
    totalPages: data.totalPages ?? null,
    completed: data.completed !== undefined ? (data.completed ? 1 : 0) : null,
    favorited: data.favorited !== undefined ? (data.favorited ? 1 : 0) : null,
    lastAccessed: new Date().toISOString(),
  });
}

export function getProgress(sessionId: string, trainingId: string): ProgressRow | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT * FROM user_progress WHERE session_id = ? AND training_id = ?
  `).get(sessionId, trainingId) as any;
  
  if (!row) return null;
  return {
    ...row,
    completed: Boolean(row.completed),
    favorited: Boolean(row.favorited),
  };
}

export function getAllProgress(sessionId: string): ProgressRow[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM user_progress WHERE session_id = ? ORDER BY last_accessed_at DESC
  `).all(sessionId) as any[];
  
  return rows.map(row => ({
    ...row,
    completed: Boolean(row.completed),
    favorited: Boolean(row.favorited),
  }));
}

export function getFavorites(sessionId: string): ProgressRow[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT * FROM user_progress WHERE session_id = ? AND favorited = 1 ORDER BY last_accessed_at DESC
  `).all(sessionId) as any[];
  
  return rows.map(row => ({
    ...row,
    completed: Boolean(row.completed),
    favorited: Boolean(row.favorited),
  }));
}

export function getLastAccessed(sessionId: string): ProgressRow | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT * FROM user_progress WHERE session_id = ? ORDER BY last_accessed_at DESC LIMIT 1
  `).get(sessionId) as any;
  
  if (!row) return null;
  return { ...row, completed: Boolean(row.completed), favorited: Boolean(row.favorited) };
}

