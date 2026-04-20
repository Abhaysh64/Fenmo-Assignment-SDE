const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'expenses.db');

const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    idempotency_key TEXT UNIQUE
  )
`).run();

module.exports = db;