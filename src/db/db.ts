import Database from 'better-sqlite3'
import path from 'path'
import { phrases } from './phrases'
import { saints as saintsData } from './saints'

let db: Database.Database | null = null

export function getDatabase (name?: string): Database.Database {
  if (db == null) {
    // Use environment variable to determine database name
    const dbName = name ?? (process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'database.sqlite')
    const dbPath = path.join(process.cwd(), dbName)
    db = new Database(dbPath)
    initializeTables()
    ensureDatabasePopulated()
  }
  return db
}

function initializeTables (): void {
  if (db == null) return

  // Create saints table
  db.exec(`
    CREATE TABLE IF NOT EXISTS saints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT
    )
  `)

  // Create phrases table
  db.exec(`
    CREATE TABLE IF NOT EXISTS phrases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      author TEXT NOT NULL,
      date TEXT UNIQUE NOT NULL
    )
  `)
}

function ensureDatabasePopulated (): void {
  if (db == null) return

  // Check if database is populated
  const saintsCount = db
    .prepare('SELECT COUNT(*) as count FROM saints')
    .get() as { count: number }
  const phrasesCount = db
    .prepare('SELECT COUNT(*) as count FROM phrases')
    .get() as { count: number }

  if (saintsCount.count === 0 || phrasesCount.count === 0) {
    console.log('Database is not populated. Populating now...')
    populateDatabase()
  } else {
    console.log('Database is already populated.')
  }
}

function populateDatabase (): void {
  if (db == null) return

  // Transform saints data from object to array
  const saints: Array<{ name: string, date: string, description: string }> = []
  for (const [date, saintsForDate] of Object.entries(saintsData)) {
    for (const saint of saintsForDate as Array<{
      saint: string
      info: string
    }>) {
      saints.push({
        name: saint.saint,
        date,
        description: saint.info
      })
    }
  }

  const insertSaint = db.prepare(`
    INSERT OR REPLACE INTO saints (name, date, description)
    VALUES (?, ?, ?)
  `)

  const insertPhrase = db.prepare(`
    INSERT OR REPLACE INTO phrases (text, author, date)
    VALUES (?, ?, ?)
  `)

  const populateTransaction = db.transaction(() => {
    console.log('Populating saints table...')
    for (const saint of saints) {
      insertSaint.run(saint.name, saint.date, saint.description)
    }
    console.log(`Inserted ${saints.length} saints into the database.`)

    console.log('Populating phrases table...')
    for (const phrase of phrases) {
      insertPhrase.run(phrase.text, phrase.author, phrase.date)
    }
    console.log(`Inserted ${phrases.length} phrases into the database.`)
  })

  populateTransaction()
  console.log('Database population completed successfully!')
}

export function closeDatabase (): void {
  if (db != null) {
    db.close()
    db = null
  }
}

export function resetDatabase (): void {
  closeDatabase()
  // The next call to getDatabase() will create a new connection
}

export default function connect (): Database.Database {
  return getDatabase()
}
