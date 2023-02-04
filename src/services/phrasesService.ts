import { collections } from '../db/db'
import { Collection } from 'mongodb'


export default class PhraseService {
  db: Collection<Document> = collections.phrases as Collection<Document>

  getPhrases = async () => {
    return await this.db.find().toArray()
  }

  getRandomPhrase = async () => {
    const random = Math.floor(Math.random() * (await this.db.countDocuments()))
    return this.db.find().limit(-1).skip(random).next()
  }
}
