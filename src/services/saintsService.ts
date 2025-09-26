import { getDatabase } from '../db/db'
import { Saint } from '../types'

export default class SaintsService {
  private readonly db = getDatabase()

  getSaints = (): Saint[] => {
    const stmt = this.db.prepare('SELECT * FROM saints ORDER BY name')
    return stmt.all() as Saint[]
  }

  getSaintById = (id: number): Saint | undefined => {
    const stmt = this.db.prepare('SELECT * FROM saints WHERE id = ?')
    return stmt.get(id) as Saint | undefined
  }

  getSaintByName = (name: string): Saint | undefined => {
    const stmt = this.db.prepare('SELECT * FROM saints WHERE name = ?')
    return stmt.get(name) as Saint | undefined
  }

  getSaintsByDate = (date: string): Saint[] => {
    const stmt = this.db.prepare(
      'SELECT * FROM saints WHERE date = ? ORDER BY name'
    )
    return stmt.all(date) as Saint[]
  }

  searchSaints = (query: string): Saint[] => {
    const stmt = this.db.prepare(`
      SELECT * FROM saints 
      WHERE name LIKE ? OR description LIKE ? 
      ORDER BY name
    `)
    const searchTerm = `%${query}%`
    return stmt.all(searchTerm, searchTerm) as Saint[]
  }
}
