const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'global_scientific.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Open SQLite database with WAL mode for high performance
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
function initDatabase() {
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    db.exec(schemaSql);
}

initDatabase();

module.exports = db;
