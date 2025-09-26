import { Router } from 'express'
import PhraseService from '../services/phrasesService'
import { formatDate } from '../utils/utils'

const router = Router()
const phraseService = new PhraseService()

export default router

router.get('/', (req, res) => {
  res.send('Welcome to phrases router')
})

router.get('/random', (req, res) => {
  try {
    const randomPhrase = phraseService.getRandomPhrase()
    return res.json(randomPhrase)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch random phrase' })
  }
})

router.get('/date/:date', (req, res) => {
  try {
    const date = req.params.date
    const phrase = phraseService.getPhraseByDate(date)
    if (phrase == null) {
      return res.status(404).json({ error: 'No phrase found for date' })
    }
    return res.json(phrase)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch phrases by date' })
  }
})

router.get('/daily', (req, res) => {
  try {
    const dailyPhrase = phraseService.getPhraseByDate(formatDate(new Date()))
    if (dailyPhrase == null) {
      return res.status(404).json({ error: 'No phrase found for today' })
    }
    return res.json(dailyPhrase)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to fetch daily phrase' })
  }
})
