import { Collection, MongoClient, ServerApiVersion } from 'mongodb'
import * as dotenv from "dotenv"


dotenv.config()
const uri = `mongodb+srv://chuls:${
  process.env.MONGO_PASSWORD as string
}@phrases.lilheaj.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 })
export const collections: { phrases?: Collection<Document> } = {}

export default async function connect(): Promise<Collection<Document>> {
  await client.connect()
  const db = client.db('Phrases')
  const phrasesCollection: Collection<Document> = db.collection('phrases')
  collections.phrases = phrasesCollection
  return phrasesCollection
}
