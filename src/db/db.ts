import Database from 'better-sqlite3'
import path from 'path'

let db: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'database.sqlite')
    db = new Database(dbPath)
    initializeTables()
  }
  return db
}

function initializeTables(): void {
  if (!db) return

  // Create saints table
  db.exec(`
    CREATE TABLE IF NOT EXISTS saints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT,
      description TEXT
    )
  `)

  // Create phrases table
  db.exec(`
    CREATE TABLE IF NOT EXISTS phrases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      author TEXT NOT NULL,
      date TEXT
    )
  `)
}

export default function connect(): Database.Database {
  return getDatabase()
}
