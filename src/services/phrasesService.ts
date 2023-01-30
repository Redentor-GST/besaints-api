import { Phrase } from '../types'
import connect from '../db/db'

export default class PhraseService {
  getPhrases = async () => {
    const db = await connect()
    return await db.find().toArray()
  }

  getRandomPhrase = async () => {
    const db = await connect()
    const random = Math.floor(Math.random() * (await db.countDocuments()))
    return db.find().limit(-1).skip(random).next()
  }
}
