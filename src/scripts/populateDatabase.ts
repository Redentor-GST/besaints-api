import { getDatabase } from '../db/db'
import { phrases } from '../db/phrases'
import { saints as saintsData } from '../db/saints'

interface SaintData {
  name: string
  date: string
  description: string
}

interface SaintInfo {
  saint: string
  info: string
}

const db = getDatabase()

// Transform saints data from object to array
const saints: SaintData[] = []
for (const [date, saintsForDate] of Object.entries(saintsData)) {
  for (const saint of saintsForDate as SaintInfo[]) {
    saints.push({
      name: saint.saint,
      date,
      description: saint.info
    })
  }
}

// Insert saints into the database
const insertSaint = db.prepare(`
  INSERT INTO saints (name, date, description)
  VALUES (?, ?, ?)
`)

const insertPhrase = db.prepare(`
  INSERT INTO phrases (text, author, date)
  VALUES (?, ?, ?)
`)

const populateDatabase = db.transaction(() => {
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

console.log('Starting database population...')
populateDatabase()
console.log('Database population completed successfully!')

db.close()
