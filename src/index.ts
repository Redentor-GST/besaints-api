import express from 'express'
import phrasesRouter from './routes/phrasesRouter'
import connect from './db/db'
import serverless from 'serverless-http'


const app = express()
app.use(express.json())
app.set('json spaces', 2)
module.exports.handler = serverless(app)

const PORT = 3000

app.get('/', (req, res) => {
  res.send('OK')
})

connect().then(db => {
  app.locals.db = db
  app.use('/.netlify/functions/phrases', phrasesRouter)
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
