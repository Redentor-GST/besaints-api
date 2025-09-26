import { getDatabase } from '../db/db'
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

const insertManySaints = db.transaction((saints: SaintData[]) => {
  for (const saint of saints) {
    insertSaint.run(saint.name, saint.date, saint.description)
  }
})

console.log('Populating saints table...')
insertManySaints(saints)
console.log(`Inserted ${saints.length} saints into the database.`)

db.close()
