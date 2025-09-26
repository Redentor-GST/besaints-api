import { getDatabase } from '../db/db'
import { Phrase } from '../types'

export default class PhraseService {
  private readonly db = getDatabase()

  getPhrases = (): Phrase[] => {
    const stmt = this.db.prepare('SELECT * FROM phrases ORDER BY id')
    return stmt.all() as Phrase[]
  }

  getRandomPhrase = (): Phrase => {
    const stmt = this.db.prepare(
      'SELECT * FROM phrases ORDER BY RANDOM() LIMIT 1'
    )
    return stmt.get() as Phrase
  }

  getPhraseById = (id: number): Phrase | undefined => {
    const stmt = this.db.prepare('SELECT * FROM phrases WHERE id = ?')
    return stmt.get(id) as Phrase | undefined
  }

  getPhrasesByAuthor = (author: string): Phrase[] => {
    const stmt = this.db.prepare(
      'SELECT * FROM phrases WHERE author = ? ORDER BY id'
    )
    return stmt.all(author) as Phrase[]
  }

  getPhrasesByDate = (date: string): Phrase[] => {
    const stmt = this.db.prepare(
      'SELECT * FROM phrases WHERE date = ? ORDER BY id'
    )
    return stmt.all(date) as Phrase[]
  }
}
