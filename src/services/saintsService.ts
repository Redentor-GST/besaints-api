import { getDatabase } from '../db/db'
import { Saint } from '../types'

export default class SaintsService {
  getSaintByName = (name: string): Saint | undefined => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM saints WHERE name = ?')
    return stmt.get(name) as Saint | undefined
  }

  getSaintByDate = (date: string): Saint | undefined => {
    const db = getDatabase()
    const stmt = db.prepare(
      'SELECT * FROM saints WHERE date = ? LIMIT 1'
    )
    return stmt.get(date) as Saint | undefined
  }
}
