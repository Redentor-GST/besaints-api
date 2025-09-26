import { getDatabase } from '../db/db'
import { Phrase } from '../types'

export default class PhraseService {
  getPhrases = (): Phrase[] => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM phrases ORDER BY id')
    return stmt.all() as Phrase[]
  }

  getRandomPhrase = (): Phrase => {
    const db = getDatabase()
    const stmt = db.prepare(
      'SELECT * FROM phrases ORDER BY RANDOM() LIMIT 1'
    )
    return stmt.get() as Phrase
  }

  getPhraseById = (id: number): Phrase | undefined => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM phrases WHERE id = ?')
    return stmt.get(id) as Phrase | undefined
  }

  getPhrasesByAuthor = (author: string): Phrase[] => {
    const db = getDatabase()
    const stmt = db.prepare(
      'SELECT * FROM phrases WHERE author = ? ORDER BY id'
    )
    return stmt.all(author) as Phrase[]
  }

  getPhraseByDate = (date: string): Phrase | undefined => {
    const db = getDatabase()
    const stmt = db.prepare(
      'SELECT * FROM phrases WHERE date = ? LIMIT 1'
    )
    return stmt.get(date) as Phrase | undefined
  }
}
