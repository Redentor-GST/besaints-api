import { getDatabase } from '../db/db'
import { phrases } from '../db/phrases'

const db = getDatabase()

// Insert phrases into the database
const insertPhrase = db.prepare(`
  INSERT INTO phrases (text, author, date)
  VALUES (?, ?, ?)
`)

const insertManyPhrases = db.transaction((phrases: any[]) => {
  for (const phrase of phrases) {
    insertPhrase.run(phrase.text, phrase.author, phrase.date)
  }
})

console.log('Populating phrases table...')
insertManyPhrases(phrases)
console.log(`Inserted ${phrases.length} phrases into the database.`)

db.close()
