import express from 'express'
import phrasesRouter from './routes/phrasesRouter'

const app = express()
app.use(express.json())

const PORT = 3000

app.get('/', (req, res) => {
  res.send('OK')
})

app.use('/api/phrases/', phrasesRouter)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
