import { getDatabase } from '../db/db'
import { Saint } from '../types'

export default class SaintsService {
  getSaintByDate = (date: string): Saint[] => {
    const db = getDatabase()
    const stmt = db.prepare(
      'SELECT * FROM saints WHERE date = ?'
    )
    return stmt.all(date) as Saint[]
  }
}
