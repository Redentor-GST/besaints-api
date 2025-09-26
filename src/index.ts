import express from 'express'
import phrasesRouter from './routes/phrasesRouter'
import saintsRouter from './routes/saintsRouter'
import connect from './db/db'

const app = express()
app.use(express.json())
app.set('json spaces', 2)

const PORT = 3000

app.get('/', (req, res) => {
  res.send('OK')
})

// Initialize database connection
const db = connect()
app.locals.db = db

// Add routes
app.use('/api/phrases/', phrasesRouter)
app.use('/api/saints/', saintsRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Database: SQLite')
})
