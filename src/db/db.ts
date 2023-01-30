import { Collection, MongoClient, ServerApiVersion } from 'mongodb'

const uri = `mongodb+srv://chuls:${
  process.env.MONGO_PASSWORD as string
}@phrases.lilheaj.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 })

export default async function connect(): Promise<Collection<Document>> {
  await client.connect()
  console.log('connected')
  const db = client.db('Phrases')
  return db.collection('phrases')
}
