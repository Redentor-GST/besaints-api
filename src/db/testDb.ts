import Database from 'better-sqlite3'
import { phrases } from './phrases'
import { saints as saintsData } from './saints'

let testDb: Database.Database | null = null

export function getTestDatabase (): Database.Database {
  if (testDb == null) {
    // Use test.sqlite file for tests
    testDb = new Database('test.sqlite')
    initializeTestTables()
    populateTestDatabase()
  }
  return testDb
}

export function closeTestDatabase (): void {
  if (testDb != null) {
    testDb.close()
    testDb = null
  }
}

export function resetTestDatabase (): void {
  if (testDb != null) {
    // Clear all data
    testDb.exec('DELETE FROM saints')
    testDb.exec('DELETE FROM phrases')
    // Repopulate with fresh data
    populateTestDatabase()
  }
}

function initializeTestTables (): void {
  if (testDb == null) return

  // Create saints table
  testDb.exec(`
    CREATE TABLE IF NOT EXISTS saints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT UNIQUE NOT NULL,
      description TEXT
    )
  `)

  // Create phrases table
  testDb.exec(`
    CREATE TABLE IF NOT EXISTS phrases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      author TEXT NOT NULL,
      date TEXT UNIQUE NOT NULL
    )
  `)
}

function populateTestDatabase (): void {
  if (testDb == null) return

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

  const insertSaint = testDb.prepare(`
    INSERT OR REPLACE INTO saints (name, date, description)
    VALUES (?, ?, ?)
  `)

  const insertPhrase = testDb.prepare(`
    INSERT OR REPLACE INTO phrases (text, author, date)
    VALUES (?, ?, ?)
  `)

  const populateTransaction = testDb.transaction(() => {
    // Populate saints
    for (const saint of saints) {
      insertSaint.run(saint.name, saint.date, saint.description)
    }

    // Populate phrases
    for (const phrase of phrases) {
      insertPhrase.run(phrase.text, phrase.author, phrase.date)
    }
  })

  populateTransaction()
}

export default function connectTest (): Database.Database {
  return getTestDatabase()
}
