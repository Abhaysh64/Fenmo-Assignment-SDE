const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath =
  process.env.NODE_ENV === 'test'
    ? ':memory:'
    : path.join(process.cwd(), 'expenses.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      idempotency_key TEXT UNIQUE
    )
  `);
});

module.exports = db;